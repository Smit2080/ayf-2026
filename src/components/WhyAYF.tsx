import SponsorGreetings from './SponsorGreetings';

export default function WhyAYF() {
  return (
    <section className="why reveal" id="about">
      <div className="wrap why-grid">
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
        </div>
        <div className="sponsor-greetings-col">
          <span className="sticker sticker-purple" style={{ marginBottom: 16 }}>Sponsors Greet</span>
          <SponsorGreetings />
        </div>
      </div>
    </section>
  );
}
