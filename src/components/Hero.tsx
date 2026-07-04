'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Hero() {
  useEffect(() => {
    const target = new Date('2026-12-18T09:00:00+05:30').getTime();
    const pad = (n: number) => String(n).padStart(2, '0');
    const tick = () => {
      let diff = target - Date.now();
      if (diff < 0) diff = 0;
      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const m = Math.floor((diff / (1000 * 60)) % 60);
      const s = Math.floor((diff / 1000) % 60);
      const ids: Record<string, string> = { 'cd-d': pad(d), 'cd-h': pad(h), 'cd-m': pad(m), 'cd-s': pad(s) };
      Object.entries(ids).forEach(([id, v]) => {
        const el = document.getElementById(id);
        if (el) el.textContent = v;
      });
    };
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="hero">
      <div className="hero-spotlight" />
      <div className="wrap hero-grid">
        <div>
          <div className="sticker sticker-lime" style={{ marginBottom: 16 }}>AYF 2026</div>
          <h1>
            Amravati<br />Youth<br />Festival
            <span className="yr bebas">2026</span>
          </h1>
          <p className="tagline">Be the part. Lead the wave.</p>
          <p className="lede">Three days of unlimited energy, creativity, leadership and unforgettable memories. This is not just a festival. This is who we are.</p>
          <div className="hero-actions">
            <Link className="btn btn-solid" href="/register?type=competition">Register Now</Link>
            <Link className="btn btn-outline" href="/register?type=volunteer">Apply for Volunteer</Link>
            <span className="deadline-label">Auditions open till Aug 12</span>
          </div>
          <span className="sticker sticker-purple" style={{ marginTop: 12 }}>Follow @amravatiyouthfest</span>
        </div>
        <div className="hero-visual">
          <img className="hero-image" src="/ChatGPT Image Jul 3, 2026, 11_38_09 AM.png" alt="" aria-hidden="true" />
          <div className="badge-float b1">BIGGEST<br />YOUTH MOVEMENT<br />OF AMRAVATI</div>
          <div className="badge-float b2">LEAD THE WAVE</div>
          <div className="gaffer-tape" style={{ width: 100, height: 26, top: 24, left: 24, transform: 'rotate(-8deg)' }} />
          <div className="countdown-box">
            <div className="stage-haze" />
            <div className="stage-spotlight s1" />
            <div className="stage-spotlight s2" />
            <div className="stage-glow" />
            <div className="stage-particles">
              <i style={{ left: '8%', top: '20%', animationDelay: '0s', width: 2, height: 2, background: 'var(--orange)' }} />
              <i style={{ left: '25%', top: '45%', animationDelay: '0.9s', width: 3, height: 3, background: 'var(--purple)' }} />
              <i style={{ left: '42%', top: '15%', animationDelay: '1.8s', width: 2, height: 2, background: 'var(--pink)' }} />
              <i style={{ left: '58%', top: '55%', animationDelay: '0.5s', width: 3, height: 3, background: 'var(--orange)' }} />
              <i style={{ left: '72%', top: '25%', animationDelay: '2.4s', width: 2, height: 2, background: 'var(--purple)' }} />
              <i style={{ left: '88%', top: '50%', animationDelay: '1.2s', width: 3, height: 3, background: 'var(--pink)' }} />
              <i style={{ left: '50%', top: '70%', animationDelay: '3s', width: 2, height: 2, background: 'var(--orange)' }} />
              <i style={{ left: '15%', top: '65%', animationDelay: '2.1s', width: 2, height: 2, background: 'var(--purple)' }} />
            </div>
            <div className="stage-flares">
              <i style={{ top: '25%', left: '5%', animationDelay: '0s' }} />
              <i style={{ top: '55%', right: '10%', animationDelay: '2s' }} />
            </div>
            <div className="lbl">AYF 2026 starts in</div>
            <div className="countdown" id="countdown">
              <div><b id="cd-d">00</b><span>Days</span></div>
              <div><b id="cd-h">00</b><span>Hrs</span></div>
              <div><b id="cd-m">00</b><span>Min</span></div>
              <div><b id="cd-s">00</b><span>Sec</span></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
