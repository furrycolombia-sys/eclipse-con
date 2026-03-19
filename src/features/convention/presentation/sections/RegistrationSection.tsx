import type { TFunction } from "i18next";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { Check, Hotel, Ticket } from "lucide-react";

import {
  PACKAGE_FEATURE_KEYS,
  PRICE_TIERS,
  TICKET_FEATURE_KEYS,
} from "@/features/convention/application/data/registration";
import { Button } from "@/shared/presentation/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/presentation/ui/card";
import {
  SECTION_IDS,
  RESERVATION_URL,
} from "@/features/convention/domain/constants";
import { tid } from "@/shared/application/utils/tid";
import { SectionHeader } from "../components/SectionHeader";
import { SectionWrapper } from "../components/SectionWrapper";

/** Renders the Registration section with a two-step flow: hotel reservation and event ticket. */
export function RegistrationSection() {
  const { t } = useTranslation();

  return (
    <SectionWrapper id={SECTION_IDS.REGISTRATION} surfaceTone="elevated">
      <SectionHeader
        title={t("convention.registration.title")}
        subtitle={t("convention.registration.subtitle")}
        align="left"
        accent="gold"
      />
      <div className="mt-12 grid gap-8 lg:grid-cols-2">
        <HotelCard t={t} />
        <TicketCard t={t} />
      </div>
      <RegistrationCta t={t} />
    </SectionWrapper>
  );
}

/** Step 1 card: hotel reservation with room pricing. */
function HotelCard({ t }: Readonly<{ t: TFunction }>) {
  return (
    <Card
      className="flex flex-col border-accent/50 bg-surface-elevated shadow-lg shadow-accent/10"
      {...tid("registration-card-hotel")}
    >
      <CardHeader className="gap-2">
        <StepBadge label={t("convention.registration.step1.label")} />
        <CardTitle className="flex items-center gap-2 font-display text-xl font-bold text-foreground">
          <Hotel size={20} className="shrink-0 text-accent" />
          {t("convention.registration.step1.title")}
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {t("convention.registration.step1.description")}
        </p>
      </CardHeader>
      <CardContent className="flex-1 space-y-6">
        <ul className="space-y-3">
          {PACKAGE_FEATURE_KEYS.map((key) => (
            <li
              key={key}
              className="flex items-center gap-2 text-sm text-muted-foreground"
            >
              <Check size={16} className="shrink-0 text-accent" />
              <span>{t(key)}</span>
            </li>
          ))}
        </ul>
        <div className="rounded-xl border border-accent/30 bg-accent/5 p-4 shadow-[inset_0_1px_0_0_rgba(224,117,58,0.1)]">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            {t("convention.registration.popular")}
          </p>
          <div className="space-y-3">
            {PRICE_TIERS.map(({ nameKey, priceKey }) => (
              <div
                key={nameKey}
                className="flex items-center justify-between gap-4"
              >
                <span className="text-sm text-foreground/90">{t(nameKey)}</span>
                <span className="font-display text-base font-bold text-accent drop-shadow-[0_0_6px_rgba(224,117,58,0.3)]">
                  {t(priceKey)}
                </span>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-accent/75">
            {t("convention.registration.priceNote")}
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          asChild
          className="w-full bg-accent text-accent-foreground hover:bg-accent-glow"
        >
          <a
            href={RESERVATION_URL}
            target="_blank"
            rel="noreferrer"
            data-funnel-step="click_reserve"
            data-cta-id="registration_reserve"
            data-cta-variant="step1_hotel"
            data-content-section="registration"
            data-content-id="registration_reserve"
            data-content-interaction="open"
          >
            {t("convention.registration.cta")}
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
}

/** Step 2 card: event ticket with included features. */
function TicketCard({ t }: Readonly<{ t: TFunction }>) {
  return (
    <Card
      className="flex flex-col border-accent/50 bg-surface-elevated shadow-lg shadow-accent/10"
      {...tid("registration-card-ticket")}
    >
      <CardHeader className="gap-2">
        <StepBadge label={t("convention.registration.step2.label")} />
        <CardTitle className="flex items-center gap-2 font-display text-xl font-bold text-foreground">
          <Ticket size={20} className="shrink-0 text-accent" />
          {t("convention.registration.step2.title")}
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {t("convention.registration.step2.description")}
        </p>
      </CardHeader>
      <CardContent className="flex-1 space-y-6">
        <div className="rounded-xl border border-accent/30 bg-accent/5 p-4 text-center">
          <p className="font-display text-2xl font-bold text-accent drop-shadow-[0_0_6px_rgba(224,117,58,0.3)]">
            {t("convention.registration.step2.price")}
          </p>
          <p className="mt-1 text-xs text-accent/75">
            {t("convention.registration.step2.priceNote")}
          </p>
        </div>
        <ul className="space-y-3">
          {TICKET_FEATURE_KEYS.map((key) => (
            <li
              key={key}
              className="flex items-center gap-2 text-sm text-muted-foreground"
            >
              <Check size={16} className="shrink-0 text-accent" />
              <span>{t(key)}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button
          disabled
          className="w-full bg-accent/50 text-accent-foreground"
          {...tid("registration-ticket-cta")}
        >
          {t("convention.registration.ticketCta")}
        </Button>
      </CardFooter>
    </Card>
  );
}

/** Small badge indicating a step number. */
function StepBadge({ label }: Readonly<{ label: string }>) {
  return (
    <span className="w-fit rounded-full bg-accent/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent">
      {label}
    </span>
  );
}

/** Bottom CTA area with tutorial link, notes, and contact info. */
function RegistrationCta({ t }: Readonly<{ t: TFunction }>) {
  return (
    <div className="mt-10 flex flex-col items-center gap-4 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
        {t("convention.registration.highlight")}
      </p>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <Link
          to="/registration-tutorial"
          className="inline-flex h-9 items-center justify-center rounded-md border border-accent/60 bg-accent/15 px-4 py-2 text-sm font-medium text-foreground shadow-[0_0_0_1px_rgba(255,255,255,0.06)] transition-colors hover:bg-accent/25"
          data-funnel-step="registration_tutorial"
          data-cta-id="registration_tutorial_interest"
          data-cta-variant="primary"
          data-content-section="registration"
          data-content-id="registration_tutorial_link"
          data-content-interaction="open"
          {...tid("registration-tutorial-link")}
        >
          {t("convention.registration.tutorialLink")}
        </Link>
      </div>
      <p className="text-sm text-muted-foreground">
        {t("convention.registration.noteServices")}
      </p>
      <p className="text-sm text-muted-foreground">
        {t("convention.registration.note")}
      </p>
    </div>
  );
}
