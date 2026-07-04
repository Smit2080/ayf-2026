'use client';

import { useState, useEffect } from 'react';

const greetings = [
  { name: 'NOVA', message: 'Greetings to AYF 2026', logo: 'N' },
  { name: 'PULSE FM', message: 'Wishing you all the best', logo: 'P' },
  { name: 'URBAN EDGE', message: 'Proud to support youth', logo: 'U' },
  { name: 'BREW CO.', message: 'Cheers to the young talent', logo: 'B' },
  { name: 'SWIFTPAY', message: 'Powering the future', logo: 'S' },
  { name: 'ORBIT', message: 'Reach for the stars', logo: 'O' },
];

export default function SponsorGreetings() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIdx((p) => (p + 1) % greetings.length), 3000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="sponsor-greeting-wrap">
      <div className="sponsor-greeting-track" style={{ transform: `translateY(-${idx * 100}%)` }}>
        {greetings.map((g, i) => (
          <div className="sponsor-greeting-card" key={i}>
            <div className="sponsor-logo-circle">{g.logo}</div>
            <div>
              <div className="sponsor-name">{g.name}</div>
              <div className="sponsor-msg">{g.message}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
