import React, { useState, useRef } from 'react';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { PageLayout } from '../components/layout/PageLayout';
import { Button } from '../components/ui/Button';
import { CategoryBadge } from '../components/ui/CategoryBadge';
import { templates } from '../data/templates';
import { formatPrice } from '../utils';
import { apiUrl } from '../config';
import {
  ChevronLeft,
  ChevronRight,
  Check,
  ShieldCheck,
  Download,
  XCircle,
  Code2,
} from 'lucide-react';

export const TemplateDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const template = templates.find((t) => t.id === id);

  const [activeImage, setActiveImage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  if (!template) return <Navigate to="/" replace />;

  const handleBuy = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(apiUrl('/api/create-checkout-session'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ templateId: template.id }),
      });

      if (!res.ok) throw new Error('Failed to create checkout session');

      const { url } = await res.json();
      if (!url) throw new Error('No checkout URL returned');

      // Redirect to Stripe-hosted checkout
      window.location.href = url;
    } catch (err) {
      console.error(err);
      setError('Something went wrong starting checkout. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout fullWidth>
      <div className="max-w-7xl mx-auto px-6 pt-12 pb-24">
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-muted hover:text-white text-sm transition-colors mb-8"
        >
          <ChevronLeft size={16} />
          All Templates
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-12">
          {/* ── Left: media column ─────────────────────── */}
          <div className="space-y-4">
            {/* Video preview */}
            <div className="relative rounded-sm overflow-hidden bg-surface border border-border aspect-video">
              <video
                ref={videoRef}
                src={template.previewVideo}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3">
                <span className="font-mono text-[10px] bg-background/80 border border-gold/20 text-gold px-2 py-1 rounded-full backdrop-blur-sm">
                  ▶ Live Preview
                </span>
              </div>
            </div>

            {/* Image gallery */}
            <div className="relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeImage}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.3 }}
                  className="rounded-sm overflow-hidden border border-border aspect-video"
                >
                  <img
                    src={template.images[activeImage]}
                    alt={`${template.name} screenshot ${activeImage + 1}`}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              </AnimatePresence>

              {/* Nav arrows */}
              {template.images.length > 1 && (
                <>
                  <button
                    onClick={() => setActiveImage((i) => (i - 1 + template.images.length) % template.images.length)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 glass rounded-full p-2 text-white hover:text-gold transition-colors"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    onClick={() => setActiveImage((i) => (i + 1) % template.images.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 glass rounded-full p-2 text-white hover:text-gold transition-colors"
                  >
                    <ChevronRight size={16} />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails */}
            <div className="flex gap-2 overflow-x-auto pb-1">
              {template.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`shrink-0 w-20 h-14 rounded-sm overflow-hidden border transition-all duration-200 ${
                    i === activeImage ? 'border-gold' : 'border-border opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* ── Right: purchase column ─────────────────── */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <CategoryBadge category={template.category} className="mb-3" />
              <h1 className="font-display text-4xl font-light text-white leading-tight">
                {template.name}
              </h1>
              <p className="mt-3 text-muted leading-relaxed text-sm">{template.description}</p>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 py-4 border-y border-border">
              <span className="font-display text-5xl font-light text-gold">
                {formatPrice(template.price)}
              </span>
              <span className="font-mono text-xs text-muted">one-time</span>
            </div>

            {/* CTA */}
            <div className="space-y-3">
              <Button
                variant="gold"
                size="lg"
                loading={loading}
                onClick={handleBuy}
                className="w-full"
              >
                Buy Template — {formatPrice(template.price)}
              </Button>
              <p className="text-center font-mono text-xs text-muted">
                Secure checkout via Stripe
              </p>
              {error && (
                <p className="text-center text-xs text-rose-400">{error}</p>
              )}
            </div>

            {/* License info */}
            <div className="rounded-sm border border-border bg-surface p-4 space-y-2.5">
              <p className="font-mono text-xs text-gold/70 tracking-widest uppercase mb-3">
                What's included
              </p>
              {[
                { icon: Code2, text: 'Full source code (React + TypeScript)' },
                { icon: Download, text: 'Instant secure download after purchase' },
                { icon: ShieldCheck, text: 'Personal & commercial use licence' },
                { icon: Check, text: 'Unlimited modifications allowed' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-start gap-2.5">
                  <Icon size={14} className="text-gold shrink-0 mt-0.5" />
                  <span className="text-xs text-zinc-300">{text}</span>
                </div>
              ))}
              <div className="flex items-start gap-2.5 pt-1 border-t border-border mt-1">
                <XCircle size={14} className="text-rose-400 shrink-0 mt-0.5" />
                <span className="text-xs text-muted">
                  Reselling or redistributing this template is <strong className="text-rose-300">not permitted</strong>
                </span>
              </div>
            </div>

            {/* Features */}
            <div className="space-y-2">
              <p className="font-mono text-xs text-muted/70 tracking-widest uppercase">Features</p>
              {template.features.map((f) => (
                <div key={f} className="flex items-start gap-2">
                  <Check size={12} className="text-gold shrink-0 mt-1" />
                  <span className="text-xs text-zinc-400">{f}</span>
                </div>
              ))}
            </div>

            {/* Tech stack */}
            <div>
              <p className="font-mono text-xs text-muted/70 tracking-widest uppercase mb-2">Built with</p>
              <div className="flex flex-wrap gap-2">
                {template.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="font-mono text-[10px] px-2.5 py-1 rounded-full border border-border text-muted"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Long description */}
        <div className="mt-16 max-w-2xl">
          <h2 className="font-display text-2xl font-light text-white mb-4">About this template</h2>
          <p className="text-muted leading-relaxed">{template.longDescription}</p>
        </div>
      </div>
    </PageLayout>
  );
};
