// ── Single source of truth for sellable templates on the server ──
// Keep `id` and `price` in sync with src/data/templates.ts on the frontend.
// price is in cents (Stripe requires integer minor units).

export const templates = {
  'ivory-promise':       { name: 'Ivory Promise',       price: 2900, file: 'ivory-promise.zip' },
  'the-green-envelope':  { name: 'The Green Envelope',  price: 2900, file: 'the-green-envelope.zip' },
  'good-food-resturant': { name: 'Good Food Resturant', price: 3900, file: 'good-food-resturant.zip' },
  'professional-cv': { name: 'Professional Cv', price: 2900, file: 'professional-cv.zip' },
};
