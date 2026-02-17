'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Lock, Unlock, Loader2, CheckCircle } from 'lucide-react';

type FormState = 'idle' | 'loading' | 'success' | 'error';

function useAccessCode() {
  const [state, setState] = useState<FormState>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  async function submit(code: string) {
    setState('loading');
    setErrorMessage('');
    try {
      const res = await fetch('/api/access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();
      if (!res.ok) {
        setState('error');
        setErrorMessage(data.error || 'Invalid access code');
        return;
      }
      setState('success');
      // Reload after a brief moment so user sees the success state
      setTimeout(() => window.location.reload(), 1000);
    } catch {
      setState('error');
      setErrorMessage('Network error. Please try again.');
    }
  }

  return { state, errorMessage, submit };
}

export function AccessCodeForm() {
  const [code, setCode] = useState('');
  const { state, errorMessage, submit } = useAccessCode();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (code.trim()) submit(code.trim());
  }

  if (state === 'success') {
    return (
      <div className="flex items-center gap-2 text-green-400 text-sm">
        <CheckCircle className="h-5 w-5" />
        <span>Access granted! Unlocking platform...</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 w-full max-w-md relative">
      <Input
        type="text"
        placeholder="Enter access code"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        required
        className="flex-1 h-12"
        disabled={state === 'loading'}
      />
      <Button
        type="submit"
        variant="glow"
        size="lg"
        disabled={state === 'loading'}
        className="whitespace-nowrap"
      >
        {state === 'loading' ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <>
            <Unlock className="mr-2 h-4 w-4" />
            Unlock
          </>
        )}
      </Button>
      {state === 'error' && (
        <p className="text-red-400 text-sm absolute -bottom-6 left-0">{errorMessage}</p>
      )}
    </form>
  );
}

export function FooterAccessCodeForm() {
  const [code, setCode] = useState('');
  const { state, errorMessage, submit } = useAccessCode();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (code.trim()) submit(code.trim());
  }

  if (state === 'success') {
    return (
      <p className="text-green-400 text-sm flex items-center gap-1">
        <CheckCircle className="h-4 w-4" />
        Access granted!
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <Input
        type="text"
        placeholder="Access code"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        required
        className="h-9 text-sm"
        disabled={state === 'loading'}
      />
      <Button
        type="submit"
        variant="glow"
        size="sm"
        className="w-full"
        disabled={state === 'loading'}
      >
        {state === 'loading' ? (
          <Loader2 className="h-3 w-3 animate-spin" />
        ) : (
          <>
            <Lock className="mr-1.5 h-3 w-3" />
            Unlock
          </>
        )}
      </Button>
      {state === 'error' && (
        <p className="text-red-400 text-xs">{errorMessage}</p>
      )}
    </form>
  );
}
