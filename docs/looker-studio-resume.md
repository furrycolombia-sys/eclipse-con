# Looker Studio Resume

## Current status

- GTM is configured and live for Moonfest.
- GA4 is configured and live for Moonfest.
- GA4 property:
  - Account: `moonfest2026`
  - Property ID: `528973849`
  - Measurement ID: `G-QBKJDK4KGP`
- GTM container:
  - Public ID: `GTM-NXGDDQT9`
- Production deploy currently serving the correct Google-enabled bundle:
  - Cloudflare version: `6600fa0d-084a-4bcc-8c3b-046d90ffdb14`
- `reserve_ticket_handoff` is now:
  - emitted on the live site
  - visible in GA4 data
  - marked as a GA4 key event

## What was being done

The next step was creating a shareable Looker Studio dashboard using the GA4 template flow at:

- `https://lookerstudio.google.com/`

The flow reached:

- template opened: `GA4 Report`
- action used: `Usar mis propios datos`
- connector requested: `Google Analytics`

## Current blocker

Looker Studio requires Google account verification before it will authorize the GA connector.

The flow stopped on:

- Google account verification for `furrycolombia@gmail.com`
- screen text: `Demuestra que eres tú`
- requested method: phone prompt on the Google account owner's device

The challenge code shown during the last attempt was `76`, but that code is ephemeral and should not be assumed valid later.

## Next step when the account owner is available

1. Reopen `https://lookerstudio.google.com/`.
2. Open the `GA4 Report` template.
3. Click `Usar mis propios datos`.
4. Authorize the `Google Analytics` connector.
5. Approve the Google account phone challenge on the account owner's device.
6. After authorization succeeds, switch the sample data source to the Moonfest GA4 property.

## What to tell Codex next

Use this prompt:

```md
Continue from `docs/looker-studio-resume.md`.
Finish the Looker Studio GA4 template authorization, connect it to Moonfest GA4 property `528973849`, and keep going with the dashboard setup.
```
