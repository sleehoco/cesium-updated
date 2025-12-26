'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmailCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (email: string, name: string) => Promise<void>;
  toolName: string;
}

export default function EmailCaptureModal({
  isOpen,
  onClose,
  onSubmit,
  toolName,
}: EmailCaptureModalProps) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);

    try {
      await onSubmit(email, name);
      onClose();
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-lg border border-cesium/30 bg-cyber p-6 shadow-2xl shadow-cesium/20">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-white transition-colors"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <div className="mb-2 inline-block rounded-md bg-cesium/10 px-3 py-1 text-xs font-semibold text-cesium">
            FREE UPGRADE
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Want More Analyses?
          </h2>
          <p className="text-gray-300">
            You&apos;ve used your <span className="font-semibold text-cesium">1 free analysis</span> of {toolName}.
            Sign up to unlock:
          </p>
        </div>

        {/* Benefits */}
        <div className="mb-6 space-y-3 rounded-lg bg-cyber-dark/50 p-4 border border-cesium/10">
          <BenefitItem>
            <span className="font-semibold text-cesium">10 free analyses per day</span> across all tools
          </BenefitItem>
          <BenefitItem>
            <span className="font-semibold text-cesium">Save your analysis history</span> for future reference
          </BenefitItem>
          <BenefitItem>
            <span className="font-semibold text-cesium">Export results to PDF</span> for reports
          </BenefitItem>
          <BenefitItem>
            <span className="font-semibold text-cesium">Weekly security insights</span> newsletter
          </BenefitItem>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
              Name (optional)
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              className="w-full rounded-md border border-cesium/30 bg-cyber-dark px-4 py-2.5 text-white placeholder-gray-500 focus:border-cesium focus:outline-none focus:ring-1 focus:ring-cesium transition-colors"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
              Email address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              required
              className="w-full rounded-md border border-cesium/30 bg-cyber-dark px-4 py-2.5 text-white placeholder-gray-500 focus:border-cesium focus:outline-none focus:ring-1 focus:ring-cesium transition-colors"
            />
          </div>

          {error && (
            <div className="rounded-md bg-red-500/10 border border-red-500/30 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-cesium text-black font-semibold hover:bg-cesium/90 py-6 text-base"
          >
            {loading ? 'Creating Account...' : 'Get 10 Free Analyses Per Day →'}
          </Button>

          <p className="text-center text-xs text-gray-500">
            No credit card required. Unsubscribe anytime.
          </p>
        </form>
      </div>
    </div>
  );
}

function BenefitItem({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start">
      <svg
        className="mt-0.5 mr-3 h-5 w-5 flex-shrink-0 text-cesium"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 13l4 4L19 7"
        />
      </svg>
      <span className="text-sm text-gray-300">{children}</span>
    </div>
  );
}
