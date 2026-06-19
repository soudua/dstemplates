import React from 'react';
import { motion } from 'framer-motion';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

interface PageLayoutProps {
  children: React.ReactNode;
  fullWidth?: boolean;
}

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

export const PageLayout: React.FC<PageLayoutProps> = ({ children, fullWidth = false }) => (
  <div className="min-h-screen flex flex-col theme-transition" style={{ backgroundColor: 'var(--color-bg)' }}>
    <Navbar />
    <motion.main
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className={`flex-1 pt-16 ${fullWidth ? '' : 'max-w-7xl mx-auto w-full px-6'}`}
    >
      {children}
    </motion.main>
    <Footer />
  </div>
);
