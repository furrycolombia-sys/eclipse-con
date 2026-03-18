import { expect, test, type Page } from "@playwright/test";

const CONSENT_KEY = "tracking_consent_v1";

async function dismissConsentGate(page: Page) {
  const rejectButton = page.locator('[data-cta-id="consent_reject"]');
  if (await rejectButton.isVisible().catch(() => false)) {
    await rejectButton.click();
  }
}

async function expectSectionNearTop(page: Page, headingPattern: RegExp) {
  const heading = page.getByRole("heading", { name: headingPattern }).first();
  await expect(heading).toBeVisible();
  await expect
    .poll(
      async () =>
        (await heading.boundingBox())?.y ?? Number.POSITIVE_INFINITY
    )
    .toBeLessThan(180);
}

test.describe("browser routing", () => {
  test.describe.configure({ mode: "serial" });

  test.beforeEach(async ({ page }) => {
    await page.addInitScript((key) => {
      window.localStorage.setItem(
        key,
        JSON.stringify({
          version: 1,
          updatedAt: new Date().toISOString(),
          source: "reject_optional",
          categories: {
            necessary: true,
            analytics: false,
            personalization: false,
            advertising: false,
          },
        })
      );
    }, CONSENT_KEY);
  });

  test("browser back from the registration tutorial CTA returns to registration", async ({
    page,
  }) => {
    await page.goto("/?section=registration", { waitUntil: "networkidle" });
    await dismissConsentGate(page);
    await expect(page).toHaveURL(/\/\?section=registration$/);
    await expectSectionNearTop(page, /Reservations|Reservas/i);

    await page.locator('[data-cta-id="registration_tutorial_interest"]').click();
    await expect(page).toHaveURL(/\/registration-tutorial\?step=1$/);
    await expect(
      page.getByRole("heading", { name: /How registration works/i })
    ).toBeVisible();

    await page.goBack({ waitUntil: "networkidle" });
    await expect(page).toHaveURL(/\/\?section=registration$/);
    await expectSectionNearTop(page, /Reservations|Reservas/i);
  });

  test("browser back from the FAQ tutorial CTA returns to FAQ", async ({
    page,
  }) => {
    await page.goto("/?section=faq", { waitUntil: "networkidle" });
    await dismissConsentGate(page);
    await expect(page).toHaveURL(/\/\?section=faq$/);
    await expectSectionNearTop(
      page,
      /Frequently asked questions|Preguntas frecuentes/i
    );

    await page.locator('[data-cta-id="faq_registration_tutorial_interest"]').click();
    await expect(page).toHaveURL(/\/registration-tutorial\?step=1$/);
    await expect(
      page.getByRole("heading", { name: /How registration works/i })
    ).toBeVisible();

    await page.goBack({ waitUntil: "networkidle" });
    await expect(page).toHaveURL(/\/\?section=faq$/);
    await expectSectionNearTop(
      page,
      /Frequently asked questions|Preguntas frecuentes/i
    );
  });

  test("tutorial back button always goes to registration", async ({ page }) => {
    await page.goto("/?section=faq", { waitUntil: "networkidle" });
    await dismissConsentGate(page);

    await page.locator('[data-cta-id="faq_registration_tutorial_interest"]').click();
    await expect(page).toHaveURL(/\/registration-tutorial\?step=1$/);

    await page.locator('[data-content-id="back_to_registration"]').click();
    await expect(page).toHaveURL(/\/\?section=registration$/);
    await expectSectionNearTop(page, /Reservations|Reservas/i);
  });
});
