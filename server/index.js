import express from 'express';
import Stripe from 'stripe';
import crypto from 'crypto';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';

import { templates } from './templates.js';
import { tokenStore } from './tokenStore.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

// ── Config sanity checks ───────────────────────────────────────────
const required = ['STRIPE_SECRET_KEY', 'STRIPE_WEBHOOK_SECRET', 'CLIENT_URL'];
const missing = required.filter((k) => !process.env[k]);
if (missing.length) {
  console.warn(`⚠️  Missing env vars: ${missing.join(', ')} — see .env.example`);
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-06-20',
});

// ── Middleware ──────────────────────────────────────────────────────
const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173').split(',');
app.use(cors({ origin: allowedOrigins }));

// NOTE: webhook route needs the raw body, so it's registered
// BEFORE express.json() and uses its own raw parser below.

// ── Health check ────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ ok: true, env: process.env.NODE_ENV || 'development' });
});

// ── Create Stripe Checkout Session ───────────────────────────────────
app.post('/api/create-checkout-session', express.json(), async (req, res) => {
  const { templateId } = req.body || {};
  const template = templates[templateId];

  if (!template) {
    return res.status(404).json({ error: 'Template not found' });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: template.name,
              description: 'Full source code (React + TypeScript). One-time purchase.',
            },
            unit_amount: template.price,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/success?token={CHECKOUT_SESSION_ID}&template=${templateId}`,
      cancel_url: `${process.env.CLIENT_URL}/template/${templateId}`,
      metadata: { templateId },
    });

    res.json({ sessionId: session.id, url: session.url });
  } catch (err) {
    console.error('Stripe error:', err.message);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

// ── Stripe Webhook (payment confirmation) ─────────────────────────────
// Must receive the RAW body for signature verification — registered
// with express.raw() instead of express.json().
app.post('/api/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error('Webhook signature verification failed:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const templateId = session.metadata?.templateId;

      if (templateId && templates[templateId]) {
        const token = crypto.randomBytes(32).toString('hex');
        await tokenStore.set(token, {
          templateId,
          sessionId: session.id,
          createdAt: Date.now(),
          downloads: 0,
          maxDownloads: 3,
          customerEmail: session.customer_details?.email || null,
        });
        console.log(`✓ Download token issued for "${templateId}" (session ${session.id})`);
      }
    }

    res.json({ received: true });
  }
);

// ── Verify a session / look up its download token ─────────────────────
// The frontend success page receives the Stripe session ID in the URL.
// This endpoint lets it resolve that to the actual download token once
// the webhook has processed (handles the race where the redirect lands
// before the webhook fires).
app.get('/api/verify-session', express.json(), async (req, res) => {
  const { session_id } = req.query;
  if (!session_id) return res.status(400).json({ error: 'session_id required' });

  // Already processed by webhook?
  const existing = await tokenStore.findBySessionId(session_id);
  if (existing) {
    return res.json({ status: 'complete', token: existing.token, templateId: existing.record.templateId });
  }

  // Fallback: confirm directly with Stripe (useful in local dev without webhooks)
  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);
    if (session.payment_status === 'paid') {
      const templateId = session.metadata?.templateId;
      const token = crypto.randomBytes(32).toString('hex');
      await tokenStore.set(token, {
        templateId,
        sessionId: session.id,
        createdAt: Date.now(),
        downloads: 0,
        maxDownloads: 3,
      });
      return res.json({ status: 'complete', token, templateId });
    }
    return res.json({ status: session.payment_status });
  } catch (err) {
    console.error('verify-session error:', err.message);
    return res.status(404).json({ error: 'Session not found' });
  }
});

// ── Secure Download Endpoint ────────────────────────────────────────────
app.get('/api/download', async (req, res) => {
  const { token } = req.query;

  if (!token || typeof token !== 'string') {
    return res.status(400).json({ error: 'Token required' });
  }

  const record = await tokenStore.get(token);

  if (!record) {
    return res.status(404).json({ error: 'Invalid or expired token' });
  }

  if (record.downloads >= record.maxDownloads) {
    return res.status(403).json({ error: 'Download limit reached. Contact support for help.' });
  }

  const template = templates[record.templateId];
  if (!template) {
    return res.status(404).json({ error: 'Template not found' });
  }

  const filePath = path.join(__dirname, '..', 'downloads', template.file);

  if (!fs.existsSync(filePath)) {
    return res.status(503).json({
      error: 'File not yet available. Please contact support.',
      templateId: record.templateId,
    });
  }

  await tokenStore.incrementDownloads(token);
  res.download(filePath, template.file);
});

// ── Serve frontend in production (single-service deploy) ───────────────
if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(__dirname, '..', 'dist');
  app.use(express.static(distPath));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 mmine server running on http://localhost:${PORT}`);
});
