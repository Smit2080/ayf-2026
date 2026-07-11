'use client';

import { useEffect } from 'react';

export default function ScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal');

    function revealVisible() {
      els.forEach((el) => {
        if (el.classList.contains('visible')) return;
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight - 60) {
          el.classList.add('visible');
        }
      });
    }

    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.05, rootMargin: '40px' });

    els.forEach((el) => obs.observe(el));

    revealVisible();

    window.addEventListener('scroll', revealVisible, { passive: true });

    return () => {
      obs.disconnect();
      window.removeEventListener('scroll', revealVisible);
    };
  }, []);

  return null;
}
