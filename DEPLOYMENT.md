# Backend Setup & Deployment Guide

This walks through getting the backend fully working locally, then taking
the whole project live.

---

## Part 1 — Local backend setup

### 1. Create a Stripe account (test mode)

1. Sign up at https://dashboard.stripe.com/register
2. Stay in **Test mode** (toggle top-right) for everything below
3. Go to **Developers → API keys** and copy:
   - **Publishable key** (`pk_test_...`)
   - **Secret key** (`sk_test_...`)

### 2. Configure environment variables

```bash
cp .env.example .env
```

Fill in:

```bash
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=         # filled in step 4
CLIENT_URL=http://localhost:5173
NODE_ENV=development
PORT=3001
```

### 3. Install dependencies (if not already)

```bash
npm install
```

This includes both frontend deps (React, Vite, etc.) and backend deps
(`express`, `stripe`, `cors`, `dotenv`).

### 4. Forward Stripe webhooks to your local server

Install the Stripe CLI: https://docs.stripe.com/stripe-cli

```bash
stripe login
stripe listen --forward-to localhost:3001/api/webhook
```

This prints a webhook signing secret like `whsec_...` — copy it into
`.env` as `STRIPE_WEBHOOK_SECRET`. Keep this terminal running while you
test purchases.

### 5. Add your template source files

Drop the real `.zip` files into `downloads/` (see `downloads/README.md`
for naming convention). Without these, `/api/download` returns a
"file not yet available" message instead of a 500 — useful for testing
the flow before content is ready.

### 6. Run everything

```bash
npm run dev:all
```

This starts:
- Frontend at `http://localhost:5173` (Vite)
- Backend at `http://localhost:3001` (Express)
- Vite proxies `/api/*` to the backend automatically

### 7. Test the full purchase flow

1. Open `http://localhost:5173`, click a template, click **Buy Template**
2. You'll land on Stripe's hosted checkout — use a test card:
   - Card number: `4242 4242 4242 4242`
   - Any future expiry, any CVC, any postal code
3. On success, Stripe redirects to `/success?token=<session_id>&template=...`
4. The success page calls `/api/verify-session`, which:
   - Checks if the webhook already created a download token
   - If not (webhook lag), polls every 1.5s for up to ~8s
   - Falls back to checking the session directly with Stripe if needed
5. Once verified, click **Download Source Code** — this hits
   `/api/download?token=...` and streams the zip

If your `stripe listen` terminal shows `checkout.session.completed`
being forwarded with a `200`, the webhook is working correctly.

---

## Part 2 — Going live

### Step 1: Switch Stripe to live mode

1. In the Stripe Dashboard, toggle **Live mode**
2. Get your **live** API keys (`pk_live_...`, `sk_live_...`)
3. Complete Stripe's account activation (business details, bank account)
   — required before live charges work

### Step 2: Choose a deployment shape

**Option A — Single service (simplest)**
Express serves both the API and the built frontend from one deployment.
Good for getting started quickly.

**Option B — Split (recommended for scale)**
Frontend on a CDN-backed static host (Vercel/Netlify), backend on a
Node host (Render/Railway/Fly.io). Better performance and independent
scaling.

This guide covers both — pick one.

---

### Option A: Single service on Render (or Railway/Fly)

1. Push your code to GitHub
2. On Render: **New → Web Service** → connect your repo
3. Build command:
   ```
   npm install && npm run build
   ```
4. Start command:
   ```
   npm run server
   ```
5. Environment variables (Render dashboard → Environment):
   ```
   STRIPE_SECRET_KEY=sk_live_...
   STRIPE_WEBHOOK_SECRET=whsec_...   (step 4 below)
   CLIENT_URL=https://yourdomain.com
   NODE_ENV=production
   PORT=10000        (Render sets this automatically — usually fine to omit)
   VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...
   ```
6. Deploy. Express will serve `dist/` for all non-`/api` routes since
   `NODE_ENV=production`.

> Note: `VITE_*` variables must be present **at build time** since Vite
> inlines them into the JS bundle. Make sure they're set before the
> build step runs.

---

### Option B: Split deployment

#### Backend → Render / Railway

1. New Web Service, root directory = repo root
2. Build command: `npm install`
3. Start command: `node server/index.js`
4. Environment variables:
   ```
   STRIPE_SECRET_KEY=sk_live_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   CLIENT_URL=https://yourdomain.com
   NODE_ENV=production
   ```
5. Note the resulting URL, e.g. `https://mmine-api.onrender.com`

#### Frontend → Vercel / Netlify

1. Import your repo
2. Build command: `npm run build`
3. Output directory: `dist`
4. Environment variables (set before build):
   ```
   VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...
   VITE_API_URL=https://mmine-api.onrender.com
   ```
5. Deploy. The frontend will now call the backend cross-origin —
   `cors({ origin: allowedOrigins })` in `server/index.js` already
   allows `CLIENT_URL`, so make sure that's set to your **frontend's**
   final URL.

---

### Step 3: Register your production webhook

1. Stripe Dashboard → **Developers → Webhooks → Add endpoint**
2. Endpoint URL:
   - Option A: `https://yourdomain.com/api/webhook`
   - Option B: `https://mmine-api.onrender.com/api/webhook`
3. Select event: `checkout.session.completed`
4. Copy the **Signing secret** (`whsec_...`) into your backend's
   `STRIPE_WEBHOOK_SECRET` environment variable, then redeploy/restart
   the backend so it picks up the new value.

### Step 4: Persistent storage for download tokens

The included `server/tokenStore.js` writes to a local JSON file
(`server/data/tokens.json`). This works for a single always-on instance,
but:

- **Render free tier / serverless**: the filesystem may not persist
  across deploys or restarts. Replace `tokenStore.js` with a real
  database (Postgres via Supabase/Neon, or Redis via Upstash) — the
  function signatures (`get`, `set`, `findBySessionId`,
  `incrementDownloads`) are the only contract to preserve.
- **Multi-instance**: a shared store (Postgres/Redis) is required so
  any instance can serve any download request.

### Step 5: Move template files off local disk

For real traffic, don't serve zips from the server's local filesystem:

1. Upload your template archives to S3 / Cloudflare R2 / Backblaze B2
2. In `/api/download`, instead of `res.download(filePath, ...)`,
   generate a short-lived **signed URL** from your storage provider and
   `res.redirect(signedUrl)` — this offloads bandwidth from your server
   and scales better.

### Step 6: Custom domain & SSL

- Point your domain's DNS to your hosting provider (most platforms give
  you a CNAME or A record to add)
- SSL certificates are issued automatically by Vercel/Netlify/Render
- Update `CLIENT_URL` and the Stripe webhook endpoint URL once your
  custom domain is live

### Step 7: Final pre-launch checklist

- [ ] Live Stripe keys in place (`pk_live_`, `sk_live_`)
- [ ] Production webhook registered and `STRIPE_WEBHOOK_SECRET` set
- [ ] `CLIENT_URL` matches your real frontend domain (for CORS + redirects)
- [ ] All 6 template zips uploaded and reachable by `/api/download`
- [ ] Token store backed by a real database (not local JSON)
- [ ] Test a real $1 purchase with a real card, then refund it
- [ ] Stripe Dashboard → confirm webhook delivery shows `200 OK`
- [ ] `/api/health` returns `{ ok: true }` on production URL
