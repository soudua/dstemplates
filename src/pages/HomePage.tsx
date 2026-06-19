import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PageLayout } from '../components/layout/PageLayout';
import { TemplateCard } from '../components/ui/TemplateCard';
import { templates, categoryLabels } from '../data/templates';
import type { Category } from '../types';
import { useTheme } from '../context/ThemeContext';

type Filter = 'all' | Category;

export const HomePage: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<Filter>('all');
  const { setMode } = useTheme();

  // Drive theme from category selection
  useEffect(() => {
    setMode(activeFilter === 'restaurant' ? 'dark' : 'light');
  }, [activeFilter, setMode]);

  const filtered = useMemo(
    () =>
      activeFilter === 'all'
        ? templates
        : templates.filter((t) => t.category === activeFilter),
    [activeFilter]
  );

  const filters: Filter[] = ['all', 'weddings', 'restaurant'];

  return (
    <PageLayout>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative pt-24 pb-16 text-center">
        {/* Ambient radial glow — adapts via CSS var */}
        <div
          className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full blur-[80px] theme-transition"
          style={{ backgroundColor: 'color-mix(in srgb, var(--color-gold) 6%, transparent)' }}
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="font-mono text-xs tracking-[0.3em] uppercase mb-5 t-gold theme-transition">
            Premium Website Templates
          </p>
          <h1 className="font-display text-5xl md:text-7xl font-light leading-[1.1] text-balance mb-6 t-text theme-transition">
            Sites worth{' '}
            <em className="not-italic t-gold theme-transition">remembering</em>
          </h1>
          <p className="max-w-xl mx-auto text-base leading-relaxed text-balance t-muted theme-transition">
            Handcrafted templates for weddings, restaurants, and beyond. Buy once,
            own forever — full source code included.
          </p>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="flex items-center justify-center gap-10 mt-12"
        >
          {[
            { value: `${templates.length}`, label: 'Templates' },
            { value: '2', label: 'Categories' },
            { value: '∞', label: 'Modifications' },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <div className="font-display text-3xl font-light t-gold theme-transition">{value}</div>
              <div className="font-mono text-xs tracking-wider uppercase mt-1 t-muted theme-transition">{label}</div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ── Filter bar ────────────────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="flex items-center gap-2 mb-10 pb-6 border-b theme-transition t-border"
        style={{ borderColor: 'var(--color-border)' }}
      >
        {filters.map((f) => (
          <FilterButton
            key={f}
            label={categoryLabels[f]}
            active={activeFilter === f}
            onClick={() => setActiveFilter(f)}
          />
        ))}

        <span className="ml-auto font-mono text-xs t-muted theme-transition">
          {filtered.length} template{filtered.length !== 1 ? 's' : ''}
        </span>
      </motion.section>

      {/* ── Grid ─────────────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeFilter}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-24"
        >
          {filtered.map((template, i) => (
            <TemplateCard key={template.id} template={template} index={i} />
          ))}
        </motion.div>
      </AnimatePresence>
    </PageLayout>
  );
};

// ── Filter pill ───────────────────────────────────────────────────
interface FilterButtonProps {
  label: string;
  active: boolean;
  onClick: () => void;
}

const FilterButton: React.FC<FilterButtonProps> = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    className="relative px-4 py-1.5 rounded-full text-xs font-mono tracking-widest uppercase theme-transition"
    style={{
      backgroundColor: active ? 'var(--color-gold)' : 'transparent',
      color: active ? 'var(--color-bg)' : 'var(--color-muted)',
      border: `1px solid ${active ? 'var(--color-gold)' : 'var(--color-border)'}`,
    }}
  >
    {label}
    {active && (
      <motion.span
        layoutId="filter-indicator"
        className="absolute inset-0 rounded-full -z-10"
        style={{ backgroundColor: 'var(--color-gold)' }}
        transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] }}
      />
    )}
  </button>
);
