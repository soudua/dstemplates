import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import type { Template } from '../../types';
import { CategoryBadge } from './CategoryBadge';
import { formatPrice } from '../../utils';
import { Eye } from 'lucide-react';

interface TemplateCardProps {
  template: Template;
  index?: number;
}

export const TemplateCard: React.FC<TemplateCardProps> = ({ template, index = 0 }) => {
  const navigate = useNavigate();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      onClick={() => navigate(`/template/${template.id}`)}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="group relative cursor-pointer"
    >
      <div
        className="relative rounded-sm overflow-hidden theme-transition card-shadow"
        style={{
          backgroundColor: 'var(--color-card-bg)',
          border: '1px solid var(--color-card-border)',
          boxShadow: hovered
            ? '0 0 0 1px var(--color-gold), var(--shadow-card), 0 0 24px color-mix(in srgb, var(--color-gold) 18%, transparent)'
            : 'var(--shadow-card)',
          transition: 'box-shadow 0.35s ease, border-color 0.35s ease, background-color 1s cubic-bezier(0.4,0,0.2,1)',
        }}
      >
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden">
          {!imageLoaded && (
            <div
              className="absolute inset-0 animate-pulse"
              style={{ backgroundColor: 'var(--color-surface)' }}
            />
          )}

          <motion.img
            src={template.images[0]}
            alt={template.name}
            onLoad={() => setImageLoaded(true)}
            animate={{ scale: hovered ? 1.05 : 1 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="w-full h-full object-cover"
          />

          {/* Hover overlay */}
          <motion.div
            animate={{ opacity: hovered ? 1 : 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 flex items-center justify-center"
            style={{ backgroundColor: 'var(--color-overlay)' }}
          >
            <motion.div
              animate={{ scale: hovered ? 1 : 0.85, opacity: hovered ? 1 : 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-sm text-sm tracking-widest uppercase font-sans"
              style={{
                border: '1px solid var(--color-gold)',
                color: 'var(--color-gold)',
              }}
            >
              <Eye size={14} />
              View Template
            </motion.div>
          </motion.div>

          {/* Price pill */}
          <div className="absolute top-3 right-3">
            <span
              className="font-mono text-xs px-2.5 py-1 rounded-full backdrop-blur-sm theme-transition"
              style={{
                backgroundColor: 'color-mix(in srgb, var(--color-bg) 80%, transparent)',
                border: '1px solid color-mix(in srgb, var(--color-gold) 30%, transparent)',
                color: 'var(--color-gold-light)',
              }}
            >
              {formatPrice(template.price)}
            </span>
          </div>
        </div>

        {/* Card footer */}
        <div className="p-4" style={{ backgroundColor: 'var(--color-card-bg)', transition: 'background-color 1s cubic-bezier(0.4,0,0.2,1)' }}>
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3
                className="font-display text-lg font-medium leading-tight truncate theme-transition"
                style={{ color: hovered ? 'var(--color-gold-light)' : 'var(--color-text)', transition: 'color 0.3s ease' }}
              >
                {template.name}
              </h3>
              <p className="mt-1 text-xs leading-relaxed line-clamp-1 theme-transition" style={{ color: 'var(--color-muted)' }}>
                {template.description}
              </p>
            </div>
            <CategoryBadge category={template.category} className="shrink-0 mt-0.5" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};
