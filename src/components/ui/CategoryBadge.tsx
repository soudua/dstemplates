import React from 'react';

interface BadgeProps {
  category: string;
  className?: string;
}

const badgeStyles: Record<string, React.CSSProperties> = {
  weddings: {
    backgroundColor: 'color-mix(in srgb, #be185d 12%, var(--color-bg))',
    color: '#be185d',
    borderColor: 'color-mix(in srgb, #be185d 30%, transparent)',
  },
  restaurant: {
    backgroundColor: 'color-mix(in srgb, #b45309 12%, var(--color-bg))',
    color: '#b45309',
    borderColor: 'color-mix(in srgb, #b45309 30%, transparent)',
  },
};

export const CategoryBadge: React.FC<BadgeProps> = ({ category, className = '' }) => {
  const style = badgeStyles[category] ?? {
    backgroundColor: 'color-mix(in srgb, var(--color-muted) 12%, var(--color-bg))',
    color: 'var(--color-muted)',
    borderColor: 'var(--color-border)',
  };
  const label = category.charAt(0).toUpperCase() + category.slice(1);

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-widest border theme-transition ${className}`}
      style={style}
    >
      {label}
    </span>
  );
};
