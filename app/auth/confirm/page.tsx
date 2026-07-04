'use client';

import { useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { Suspense } from 'react';

function AuthConfirmContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const code = searchParams.get('code');
    const next = searchParams.get('next') ?? '/register';

    async function handleExchange() {
      if (!code) {
        router.replace('/register?error=auth-callback-failed');
        return;
      }

      try {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) {
          // If already exchanged (e.g. strict mode double-invoke), check if session exists
          const { data: { session } } = await supabase.auth.getSession();
          if (session) {
            router.replace(next);
          } else {
            console.error('Client-side code exchange error:', error);
            router.replace('/register?error=auth-callback-failed');
          }
        } else {
          router.replace(next);
        }
      } catch (err) {
        console.error('Unexpected error during code exchange:', err);
        router.replace('/register?error=auth-callback-failed');
      }
    }

    handleExchange();
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'var(--ink)',
        fontFamily: 'Inter, sans-serif',
        flexDirection: 'column',
        gap: 20,
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          border: '3px solid var(--orange)',
          borderTopColor: 'transparent',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
        }}
      />
      <p
        style={{
          fontFamily: 'Anton, sans-serif',
          fontSize: 20,
          color: 'rgba(247,247,247,0.7)',
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
        }}
      >
        Verifying with Google...
      </p>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        :root { --ink: #0D0D0F; --orange: #FFB800; }
        body { margin: 0; background: #0D0D0F; }
      `}</style>
    </div>
  );
}

export default function AuthConfirmPage() {
  return (
    <Suspense>
      <AuthConfirmContent />
    </Suspense>
  );
}
