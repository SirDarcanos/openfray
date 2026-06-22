# Deployment (Cloudflare Pages)

Per the plan (`docs/PROJECT-PLAN.md` §3a), the frontend is a static bundle on
**Cloudflare Pages**, deployed on git push. Domains `openfray.app` (canonical) +
`openfray.com` (redirect) live in the same Cloudflare account.

## Current phase: coming-soon holding page

A self-contained static page at [`coming-soon/index.html`](../coming-soon/index.html)
(no build step) stands in until the app ships.

**Cloudflare Pages → Create project → Connect to Git** (`SirDarcanos/openfray`), then:

| Setting | Value |
|---|---|
| Production branch | `main` |
| Framework preset | None |
| Build command | *(empty)* |
| Build output directory | `coming-soon` |
| Root directory | `/` |

Pages publishes only the `coming-soon/` folder; the app code is ignored because no
build runs. Every push to `main` redeploys.

### Custom domains
- After the first deploy (a `*.pages.dev` URL appears), go to the project's
  **Custom domains** → add `openfray.app`. Both zones are already in this Cloudflare
  account, so the DNS record is created automatically. (Optionally add
  `www.openfray.app` too.)
- **`openfray.com` → `openfray.app` (301):** on the `openfray.com` zone, add a
  proxied placeholder record (`A  @  192.0.2.1`, orange cloud) so traffic flows
  through Cloudflare, then **Rules → Redirect Rules → Single Redirect**: when
  *Hostname* contains `openfray.com`, 301 to
  `concat("https://openfray.app", http.request.uri.path)`.

## Later: swapping in the real app

When the app is ready, change the same Pages project's build settings:

| Setting | Value |
|---|---|
| Build command | `npm run build` |
| Build output directory | `dist` |
| Root directory | `/` |

Then also:
- Add a Pages **SPA fallback** so client-side routes resolve — a `public/_redirects`
  file containing `/*  /index.html  200`.
- Set the production **environment variables** in Pages settings:
  `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` (the anon key is public; RLS is the
  boundary). Without them the app still runs fully anonymous.
- Free-tier chores from the plan: a GitHub Actions **keep-alive ping** (free Supabase
  projects pause after 7 days) and **daily backups**.
