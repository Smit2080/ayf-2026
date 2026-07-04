export default function WhyAYF() {
  return (
    <section className="why reveal" id="about">
      <div className="wrap why-grid">
        <div className="photo-stack reveal" style={{ transitionDelay: '0.1s' }}>
          <div className="tape-el t1" />
          <div className="tape-el t2" />
          <div className="tape-el t3" />
          <div className="ph ph1"><div className="ph-overlay" /></div>
          <div className="ph ph2"><div className="ph-overlay" /></div>
          <div className="ph ph3"><div className="ph-overlay" /></div>
        </div>
        <div>
          <span className="sticker sticker-orange" style={{ marginBottom: 14 }}>Why AYF</span>
          <h2>Why <u>AYF</u> exists</h2>
          <p className="desc">AYF is more than an event. It&apos;s a platform for young minds to express, compete, collaborate and create real impact. Organized by <strong>Navrashtra Youth Foundation</strong> &mdash; a city-wide movement built by youth, for youth.</p>
          <div className="pillars">
            <div className="pillar"><div className="ic">EX</div><span>Express</span></div>
            <div className="pillar"><div className="ic">CN</div><span>Connect</span></div>
            <div className="pillar"><div className="ic">LN</div><span>Learn</span></div>
            <div className="pillar"><div className="ic">LD</div><span>Lead</span></div>
            <div className="pillar"><div className="ic">IN</div><span>Inspire</span></div>
          </div>
          <a className="btn btn-outline" style={{ borderColor: 'var(--ink)', color: 'var(--ink)' }} href="#events">View Competitions</a>
          <div className="stat-strip hide-until-event">
            <div><b>5000+</b><span>Participants</span></div>
            <div><b>150+</b><span>Events</span></div>
            <div><b>30+</b><span>Colleges</span></div>
            <div><b>100+</b><span>Volunteers</span></div>
          </div>
        </div>
      </div>
    </section>
  );
}
