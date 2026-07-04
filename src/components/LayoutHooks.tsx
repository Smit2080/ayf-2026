'use client';

import { useEffect } from 'react';

export default function LayoutHooks() {
  useEffect(() => {
    const cursor = document.getElementById('cursorDot');
    if (cursor && window.matchMedia('(hover:hover) and (pointer:fine)').matches) {
      const onMove = (event: MouseEvent) => {
        cursor.style.left = `${event.clientX}px`;
        cursor.style.top = `${event.clientY}px`;
      };
      document.addEventListener('mousemove', onMove);
      return () => {
        document.removeEventListener('mousemove', onMove);
      };
    }
  }, []);

  useEffect(() => {
    const toast = document.querySelector('.toast') as HTMLElement;
    if (!toast) return;

    const els = document.querySelectorAll<HTMLElement>('a[href="#"], .partner-pill, .insta-card');
    const onClick = (event: Event) => {
      event.preventDefault();
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 1800);
    };

    els.forEach((el) => el.addEventListener('click', onClick));
    return () => {
      els.forEach((el) => el.removeEventListener('click', onClick));
    };
  }, []);

  return null;
}
