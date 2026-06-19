# mmine — Premium Website Templates

A premium digital marketplace for website templates. Buy once, own forever — full source code included.

## Stack

| Layer | Tech |
|---|---|
| Frontend | React 19 + Vite + TypeScript |
| Styling | Tailwind CSS v3 |
| Animations | Framer Motion |
| Routing | React Router v7 |
| Payments | Stripe Checkout |
| Backend | Node.js + Express |

---

## Project Structure

```
mmine/
├── src/
│   ├── components/
│   │   ├── layout/         # Navbar, Footer, PageLayout
│   │   └── ui/             # Button, CategoryBadge, TemplateCard
│   ├── data/
│   │   └── templates.ts    # Template data
│   ├── pages/
│   │   ├── HomePage.tsx    # Grid + filter
│   │   ├── TemplateDetailPage.tsx
│   │   ├── SuccessPage.tsx # Post-purchase download
│   │   ├── AboutPage.tsx
│   │   └── NotFoundPage.tsx
│   ├── types/index.ts
│   └── utils/index.ts
├── server/
│   └── index.js            # Express API + Stripe
├── downloads/              # Template zip files (add yours here)
├── .env.example
└── README.md
```

---

## Local Setup

### 1. Clone and install
```bash
git clone https://github.com/yourname/mmine.git
cd mmine && npm install
```

### 2. Configure environment
```bash
cp .env.example .env
# Edit .env with your Stripe keys
```

### 3. Run frontend only
```bash
npm run dev
# Visit http://localhost:5173
```

### 4. Run backend
```bash
npm run server
# API on http://localhost:3001
```

### 5. Stripe webhooks (local)
```bash
stripe listen --forward-to localhost:3001/api/webhook
```

---

## Payment Flow

```
User clicks "Buy Template"
  -> POST /api/create-checkout-session
  -> Redirect to Stripe Checkout
  -> Stripe webhook: checkout.session.completed
  -> Server generates secure download token
  -> User lands on /success?token=TOKEN&template=ID
  -> User downloads via GET /api/download?token=TOKEN
```

## Adding New Templates

Add to `src/data/templates.ts` and `server/index.js`, place zip in `downloads/`.

## Deployment

Build frontend with `npm run build`, deploy `dist/` to Vercel/Netlify.
Deploy backend to Railway/Render with `NODE_ENV=production`.
