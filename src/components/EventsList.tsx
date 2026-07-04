const competitions = [
  { tag: '\uD83D\uDCDA', name: 'Science Exhibition', desc: 'Showcase your science projects, models and innovations' },
  { tag: '\uD83D\uDEEF\uFE0F', name: 'Youth Parliament', desc: 'Debate, deliberate, and discuss real-world issues' },
  { tag: '\uD83D\uDE80', name: 'Startup Competition', desc: 'Pitch your business ideas to a panel of judges' },
  { tag: '\uD83C\uDFAD', name: "Amravati's Got Talent", desc: 'Sing, dance, perform - anything goes on stage' },
  { tag: '\uD83C\uDFC6', name: 'Reel Competition', desc: 'Create short-form videos - free entry, no registration fee' },
];

export default function EventsList() {
  return (
    <section className="events reveal">
      <div className="wrap">
        <span className="sticker sticker-orange" style={{ marginBottom: 14 }}>Competitions</span>
        <h2>What&apos;s On</h2>
        <p className="sub">
          <span className="sticker sticker-pink" style={{ fontSize: 8, padding: '3px 8px', marginRight: 8, verticalAlign: 'middle' }}>3 Days &bull; Dec 18-20</span>
          {' '}Five competitions. One stage. Rs.500 registration (pay at venue). Every participant gets a certificate &amp; free festival pass.
        </p>
        <div className="events-list">
          {competitions.map((c) => (
            <div className="event-row" key={c.name}>
              <span className="tag">{c.tag}</span>
              <div>
                <h3>{c.name}</h3>
                <p style={{ fontSize: 13, color: 'rgba(247,247,247,0.5)', marginTop: 4 }}>{c.desc}</p>
              </div>
              <span className="arrow">--</span>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 28, padding: '18px 20px', background: 'rgba(255,106,0,0.06)', border: '1px solid rgba(255,106,0,0.15)', borderRadius: 10, fontSize: 13, color: 'rgba(247,247,247,0.65)', lineHeight: 1.7 }}>
          <strong style={{ color: 'var(--orange)' }}>Important:</strong> Rs.500 registration fee payable at the audition venue. No fee for final performance. Reel Competition is free. Winners receive trophies, certificates &amp; prizes. All participants get a participation certificate &amp; free AYF 2026 pass.
        </div>
      </div>
    </section>
  );
}
