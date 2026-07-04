'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';

export default function AdminButton({ mobile }: { mobile?: boolean }) {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session?.user) return;
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();

      if (profile?.role === 'admin') {
        setIsAdmin(true);
      }
    });
  }, []);

  if (!isAdmin) return null;

  if (mobile) {
    return (
      <Link
        href="/admin"
        style={{
          color: 'var(--pink)',
          fontWeight: 700,
          fontSize: 12,
          display: 'block',
          padding: '4px 0',
        }}
      >
        Admin Panel
      </Link>
    );
  }

  return (
    <Link
      href="/admin"
      style={{
        fontFamily: "'Space Mono', monospace",
        fontSize: 11,
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        color: '#fff',
        textDecoration: 'none',
        marginLeft: 16,
        padding: '6px 14px',
        borderRadius: 20,
        border: '1.5px solid var(--pink)',
        background: 'rgba(255,107,157,0.08)',
        boxShadow: '0 0 12px rgba(255,107,157,0.3)',
        transition: 'opacity .2s',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.7')}
      onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
    >
      Admin
    </Link>
  );
}
