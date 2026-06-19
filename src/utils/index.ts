export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(price);
};

export const generateToken = (): string => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (b) => b.toString(16).padStart(2, '0')).join('');
};

export const categoryColor: Record<string, string> = {
  weddings: 'bg-rose-950/60 text-rose-300 border-rose-800/40',
  restaurant: 'bg-amber-950/60 text-amber-300 border-amber-800/40',
};

export const slugify = (str: string) =>
  str.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
