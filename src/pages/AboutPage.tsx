import React from 'react';
import { motion } from 'framer-motion';
import { PageLayout } from '../components/layout/PageLayout';
import { useTheme } from '../context/ThemeContext';

export const AboutPage: React.FC = () => {
  // About page always light
  const { setMode } = useTheme();
  React.useEffect(() => { setMode('light'); }, [setMode]);

  return (
    <PageLayout>
      <div className="pt-20 pb-32 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-12"
        >
          <div>
            <p className="font-mono text-xs tracking-[0.3em] uppercase mb-4 t-gold theme-transition">
              About mmine
            </p>
            <h1 className="font-display text-5xl font-light leading-tight t-text theme-transition">
              Designed to be owned,
              <br />
              <em className="not-italic t-gold theme-transition">not rented.</em>
            </h1>
          </div>

          <p className="leading-relaxed t-muted theme-transition">
            mmine started from a frustration familiar to anyone who has ever tried to build a beautiful
            website using a template marketplace: the good ones are locked behind subscriptions, the
            affordable ones look identical to ten thousand other sites, and the ones that truly feel
            premium are priced as if you're licensing a product forever — because you are.
          </p>

          <p className="leading-relaxed t-muted theme-transition">
            We build every template from scratch, for a specific industry, with a specific aesthetic
            vision. No theme generators. No drag-and-drop shortcuts. Every component is written by
            hand, every spacing decision is deliberate, every interaction is tested on real devices.
          </p>

          <div
            className="pl-6 theme-transition"
            style={{ borderLeft: '1px solid color-mix(in srgb, var(--color-gold) 35%, transparent)' }}
          >
            <p className="font-display text-2xl font-light italic t-text theme-transition" style={{ opacity: 0.85 }}>
              "One purchase. Full source code. No strings."
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {[
              { label: 'Founded', value: '2024' },
              { label: 'Templates', value: '6+' },
              { label: 'Purchase model', value: 'One-time' },
              { label: 'Licence', value: 'Personal & commercial' },
            ].map(({ label, value }) => (
              <div
                key={label}
                className="rounded-sm p-4 theme-transition"
                style={{ border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)' }}
              >
                <p className="font-mono text-xs tracking-widest uppercase mb-1 t-muted theme-transition">{label}</p>
                <p className="font-display text-xl t-text theme-transition">{value}</p>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <p className="font-mono text-xs tracking-widest uppercase t-muted theme-transition">Questions?</p>
            <p className="text-sm t-muted theme-transition">
              Reach us at{' '}
              <a href="mailto:hello@mmine.co" className="t-gold hover:t-gold-light transition-colors">
                hello@mmine.co
              </a>
            </p>
          </div>
        </motion.div>
      </div>
    </PageLayout>
  );
};
