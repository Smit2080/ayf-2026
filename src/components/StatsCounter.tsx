'use client';

import { useEffect } from 'react';

const stats = [
  { target: 5000, label: 'Participants' },
  { target: 150, label: 'Events' },
  { target: 30, label: 'Colleges' },
  { target: 100, label: 'Volunteers' },
];

export default function StatsCounter() {
  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target as HTMLElement;
        const total = Number(el.dataset.target || 0);
        let current = 0;
        const step = Math.ceil(total / 60);
        const interval = window.setInterval(() => {
          current += step;
          if (current >= total) {
            current = total;
            window.clearInterval(interval);
          }
          el.textContent = current + (total >= 1000 ? '+' : '');
        }, 25);
        obs.unobserve(el);
      });
    }, { threshold: 0.5 });

    document.querySelectorAll('.stats-item .num').forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <section>
      <div className="stats-bar">
        {stats.map((s) => (
          <div className="stats-item" key={s.label}>
            <div className="num" data-target={s.target}>0</div>
            <span className="lbl">{s.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
