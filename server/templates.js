// ── Single source of truth for sellable templates on the server ──
// Keep `id` and `price` in sync with src/data/templates.ts on the frontend.
// price is in cents (Stripe requires integer minor units).

export const templates = {
  'velvet-vows':   { name: 'Velvet Vows',   price: 8900, file: 'velvet-vows.zip' },
  'golden-arch':   { name: 'Golden Arch',   price: 7900, file: 'golden-arch.zip' },
  'bloom-union':   { name: 'Bloom Union',   price: 8900, file: 'bloom-union.zip' },
  'mise-en-place': { name: 'Mise en Place', price: 9900, file: 'mise-en-place.zip' },
  'timeless-knot': { name: 'Timeless Knot', price: 8900, file: 'timeless-knot.zip' },
  'ember-table':   { name: 'Ember Table',   price: 7900, file: 'ember-table.zip' },
};
