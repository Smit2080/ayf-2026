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

  return null;
}
