import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => (
  <footer
    className="mt-24 theme-transition"
    style={{ borderTop: '1px solid var(--color-border)' }}
  >
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-center md:text-left">
          <span className="font-display text-xl font-medium">
            <span className="t-text theme-transition">ds</span>
            <span className="t-gold theme-transition">template</span>
          </span>
          <p className="text-xs t-muted mt-1 theme-transition">Premium digital templates, crafted with care.</p>
        </div>

        <div className="flex items-center gap-6 text-xs t-muted theme-transition">
          <Link to="/" className="hover:opacity-80 transition-opacity">Templates</Link>
          <Link to="/about" className="hover:opacity-80 transition-opacity">About</Link>
          <a href="mailto:soudua@hotmail.com" className="hover:opacity-80 transition-opacity">Contact</a>
        </div>

        <p className="text-xs t-muted theme-transition" style={{ opacity: 0.6 }}>
          © {new Date().getFullYear()} dstemplate. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
);
