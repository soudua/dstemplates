import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { PageLayout } from '../components/layout/PageLayout';

export const NotFoundPage: React.FC = () => (
  <PageLayout>
    <div className="min-h-[70vh] flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-6"
      >
        <p className="font-mono text-8xl font-medium text-gold/20">404</p>
        <h1 className="font-display text-3xl font-light text-white">Page not found</h1>
        <p className="text-muted text-sm">This page doesn't exist or has been moved.</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-gold hover:text-gold-light transition-colors"
        >
          ← Back to templates
        </Link>
      </motion.div>
    </div>
  </PageLayout>
);
