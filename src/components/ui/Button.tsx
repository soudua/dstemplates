import React from 'react';
import { motion } from 'framer-motion';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'gold' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'gold',
  size = 'md',
  loading = false,
  children,
  className = '',
  style,
  ...props
}) => {
  const base =
    'relative inline-flex items-center justify-center font-sans font-medium tracking-wide select-none disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden rounded-sm theme-transition';

  const sizes = { sm: 'px-4 py-2 text-xs', md: 'px-6 py-3 text-sm', lg: 'px-8 py-4 text-base' };

  const variantStyles: Record<string, React.CSSProperties> = {
    gold: {
      backgroundColor: 'var(--color-gold)',
      color: 'var(--color-bg)',
      border: '1px solid var(--color-gold)',
    },
    outline: {
      backgroundColor: 'transparent',
      color: 'var(--color-gold)',
      border: '1px solid color-mix(in srgb, var(--color-gold) 50%, transparent)',
    },
    ghost: {
      backgroundColor: 'transparent',
      color: 'var(--color-muted)',
      border: '1px solid transparent',
    },
  };

  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      className={`${base} ${sizes[size]} ${className}`}
      style={{ ...variantStyles[variant], ...style }}
      {...(props as any)}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Processing…
        </span>
      ) : children}
    </motion.button>
  );
};
