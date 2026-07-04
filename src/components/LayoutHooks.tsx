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
      document.querySelectorAll('a[href="#"], .partner-pill, .insta-card').forEach((el) => {
        const onClick = (event: Event) => {
          event.preventDefault();
          const toast = document.querySelector('.toast');
          if (toast) {
            toast.classList.add('show');
            setTimeout(() => toast.classList.remove('show'), 1800);
          }
        };
        el.addEventListener('click', onClick);
      });
      return () => {
        document.removeEventListener('mousemove', onMove);
      };
    }
  }, []);

  return null;
}
