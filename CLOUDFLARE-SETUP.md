# Cloudflare Setup - Progress Log

## Step 1: Install Wrangler CLI

- Installed `wrangler@4.75.0` as a dev dependency via `pnpm add -D wrangler`

## Step 2: Authenticate

- Ran `npx wrangler login` and completed the browser OAuth flow
- Authenticated account: `furrycolombia@gmail.com`
- Account ID: `0f1ff655a120842eda10ac3a65d32a51`

## Step 3: Inspect Existing Cloudflare Resources

### Zone

| Field       | Value                                               |
| ----------- | --------------------------------------------------- |
| Domain      | `furrycolombia.com`                                 |
| Zone ID     | `04a535d85c76121383822de00f42f2d3`                  |
| Status      | Active                                              |
| Plan        | Free                                                |
| Nameservers | `maria.ns.cloudflare.com`, `nile.ns.cloudflare.com` |

### Workers

#### `eclipse-con`

| Field               | Value                                           |
| ------------------- | ----------------------------------------------- |
| Purpose             | Main site worker                                |
| Has assets          | Yes                                             |
| Has modules         | No                                              |
| Compatibility date  | `2025-09-27`                                    |
| Compatibility flags | `nodejs_compat`                                 |
| Workers URL         | `https://eclipse-con.furrycolombia.workers.dev` |
| Custom route        | `moonfest.furrycolombia.com/*`                  |
| Status              | Working                                         |

#### `moonfest2026`

| Field        | Value                                            |
| ------------ | ------------------------------------------------ |
| Purpose      | Older leftover worker                            |
| Has assets   | No                                               |
| Has modules  | Yes                                              |
| Workers URL  | `https://moonfest2026.furrycolombia.workers.dev` |
| Custom route | None                                             |
| Status       | Broken 404                                       |

### Pages Projects

- None. This release path uses Workers, not Pages.

## Step 4: Add Repo-Based Deployment Config

- Added `wrangler.toml` to the repository
- Configured static asset serving from `./dist`
- Bound the worker route to `moonfest.furrycolombia.com/*`
- Added `deploy:cloudflare` and `deploy:cloudflare:dry-run` scripts to `package.json`

Current `wrangler.toml`:

```toml
#:schema node_modules/wrangler/config-schema.json
name = "eclipse-con"
compatibility_date = "2025-09-27"
compatibility_flags = ["nodejs_compat"]

workers_dev = true
preview_urls = true

[assets]
directory = "./dist"

[[routes]]
pattern = "moonfest.furrycolombia.com/*"
zone_name = "furrycolombia.com"
```

## Step 5: Validate The Current Project State

Executed locally on 2026-03-17:

```bash
pnpm typecheck
pnpm lint
pnpm build
pnpm exec wrangler deploy --dry-run
```

Results:

- TypeScript check passed
- ESLint passed
- Production build passed
- Wrangler dry run passed
- The app already uses `createHashRouter`, so Cloudflare does not need SPA fallback rewriting for the current route model

## Step 5.1: Verify Public Endpoints

Checked on 2026-03-17:

- `https://moonfest.furrycolombia.com/` -> HTTP 200
- `https://eclipse-con.furrycolombia.workers.dev/` -> HTTP 200

Conclusion:

- The custom domain is publicly resolving
- The earlier DNS uncertainty is no longer an active blocker

## Step 6: Clean Up Release URLs

Updated production-facing URLs to the Cloudflare domain:

- `index.html` canonical URL -> `https://moonfest.furrycolombia.com/`
- `index.html` `og:url` -> `https://moonfest.furrycolombia.com/`
- `index.html` social preview image URLs -> `https://moonfest.furrycolombia.com/og-image.jpg`
- `public/robots.txt` sitemap URL -> `https://moonfest.furrycolombia.com/sitemap.xml`
- `public/sitemap.xml` canonical URL -> `https://moonfest.furrycolombia.com/`
- Footer website link -> `https://moonfest.furrycolombia.com/`
- README live site link -> `https://moonfest.furrycolombia.com/`
- Telegram archive links updated to the current production domain

Adjusted one stale flow:

- Disabled the registration tutorial ticket CTA
- Reason: the tutorial button previously pointed at an obsolete external ticket path, so it is now disabled until the new checkout is published

## Current Assessment

The repo is in good shape for Cloudflare release:

1. Build, lint, and typecheck all pass
2. Wrangler config exists in the repo and matches the current Worker deployment model
3. The main remaining operational check is whether the final ticket checkout flow exists

## Remaining Follow-Up

- [ ] Delete the broken `moonfest2026` worker if it is no longer needed
- [ ] Re-enable the registration tutorial ticket CTA only after the new ticket checkout URL exists
- [ ] Deploy from this repo with `pnpm deploy:cloudflare`

## Notes

- Canonical and social metadata now point directly at the production domain in `index.html`
