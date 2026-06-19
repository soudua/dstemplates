import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PageLayout } from '../components/layout/PageLayout';
import { Button } from '../components/ui/Button';
import { templates } from '../data/templates';
import { apiUrl } from '../config';
import { CheckCircle, Download, Copy, Check, AlertTriangle, Loader2 } from 'lucide-react';

type VerifyState =
  | { status: 'loading' }
  | { status: 'ready'; token: string }
  | { status: 'pending' } // payment not yet confirmed (webhook lag)
  | { status: 'error'; message: string };

export const SuccessPage: React.FC = () => {
  const [params] = useSearchParams();
  // Stripe success_url passes the Checkout Session ID as `token`
  const sessionId = params.get('token') ?? '';
  const templateId = params.get('template') ?? '';
  const template = templates.find((t) => t.id === templateId);

  const [verify, setVerify] = useState<VerifyState>({ status: 'loading' });
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (!sessionId) {
      setVerify({ status: 'error', message: 'Missing session reference.' });
      return;
    }

    let attempts = 0;
    let cancelled = false;

    const check = async () => {
      try {
        const res = await fetch(apiUrl(`/api/verify-session?session_id=${sessionId}`));
        const data = await res.json();

        if (cancelled) return;

        if (data.status === 'complete' && data.token) {
          setVerify({ status: 'ready', token: data.token });
        } else if (attempts < 5) {
          attempts += 1;
          setTimeout(check, 1500); // webhook may still be processing
        } else {
          setVerify({ status: 'pending' });
        }
      } catch {
        if (!cancelled) {
          setVerify({ status: 'error', message: 'Could not verify your purchase. Please refresh.' });
        }
      }
    };

    check();
    return () => { cancelled = true; };
  }, [sessionId]);

  const copyToken = (token: string) => {
    navigator.clipboard.writeText(token);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = async (token: string) => {
    setDownloading(true);
    try {
      const res = await fetch(apiUrl(`/api/download?token=${token}`));
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Download failed');
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${templateId || 'template'}.zip`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : 'Download failed');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <PageLayout>
      <div className="min-h-[70vh] flex items-center justify-center py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-lg w-full text-center space-y-8"
        >
          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="flex justify-center"
          >
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-gold/20 blur-xl animate-pulse" />
              {verify.status === 'error' ? (
                <AlertTriangle className="relative text-rose-400" size={64} strokeWidth={1.5} />
              ) : (
                <CheckCircle className="relative text-gold" size={64} strokeWidth={1.5} />
              )}
            </div>
          </motion.div>

          {/* Heading */}
          <div>
            <h1 className="font-display text-4xl font-light text-white mb-3">
              {verify.status === 'error' ? 'Something went wrong' : 'Purchase complete'}
            </h1>
            <p className="text-muted text-sm leading-relaxed">
              {verify.status === 'error'
                ? verify.message
                : template
                  ? `Thank you for purchasing ${template.name}. Your download is ready below.`
                  : 'Your template is ready to download.'}
            </p>
          </div>

          {/* Body by state */}
          {verify.status === 'loading' && (
            <div className="rounded-sm border border-border bg-surface p-8 flex flex-col items-center gap-3">
              <Loader2 className="animate-spin text-gold" size={28} />
              <p className="text-xs text-muted font-mono">Confirming your payment…</p>
            </div>
          )}

          {verify.status === 'pending' && (
            <div className="rounded-sm border border-border bg-surface p-6 text-left space-y-3">
              <p className="text-sm text-zinc-300">
                Your payment is still being confirmed. This page will update automatically once
                it's done — usually within a few seconds.
              </p>
              <p className="text-xs text-muted">
                If this persists, check your email for a receipt and contact{' '}
                <a href="mailto:hello@mmine.co" className="text-gold hover:text-gold-light">
                  hello@mmine.co
                </a>{' '}
                with your payment confirmation.
              </p>
            </div>
          )}

          {verify.status === 'ready' && (
            <div className="rounded-sm border border-border bg-surface p-5 text-left space-y-4">
              <div>
                <p className="font-mono text-xs text-muted/70 tracking-widest uppercase mb-2">
                  Download Token
                </p>
                <div className="flex items-center gap-2 bg-background rounded-sm border border-border px-3 py-2">
                  <code className="font-mono text-xs text-gold-light flex-1 truncate">
                    {verify.token}
                  </code>
                  <button
                    onClick={() => copyToken(verify.token)}
                    className="text-muted hover:text-white transition-colors shrink-0"
                    title="Copy token"
                  >
                    {copied ? <Check size={14} className="text-gold" /> : <Copy size={14} />}
                  </button>
                </div>
                <p className="font-mono text-[10px] text-muted/50 mt-1.5">
                  Save this token — it's your proof of purchase and lets you re-download (up to 3 times).
                </p>
              </div>

              <Button
                variant="gold"
                size="lg"
                loading={downloading}
                onClick={() => handleDownload(verify.token)}
                className="w-full"
              >
                <Download size={16} className="mr-2" />
                Download Source Code
              </Button>

              <p className="text-xs text-muted text-center">
                A .zip archive containing the full React + TypeScript source.
              </p>
            </div>
          )}

          {/* License reminder */}
          <div className="rounded-sm border border-border/50 p-4 bg-surface/50 text-xs text-muted space-y-1">
            <p className="text-zinc-400 font-medium mb-2">Licence reminder</p>
            <p>✓ Personal & commercial use allowed</p>
            <p>✓ Modifications allowed</p>
            <p className="text-rose-400/80">✗ Reselling or redistributing this template is not permitted</p>
          </div>

          <Link to="/" className="block text-sm text-muted hover:text-white transition-colors">
            ← Browse more templates
          </Link>
        </motion.div>
      </div>
    </PageLayout>
  );
};
