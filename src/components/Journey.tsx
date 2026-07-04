export default function Journey() {
  return (
    <section className="journey reveal">
      <div className="wrap">
        <span className="sticker sticker-ink" style={{ marginBottom: 14 }}>How It Works</span>
        <h2>Your journey with AYF</h2>

        <div>
          <span className="sticker sticker-lime" style={{ marginBottom: 18 }}>For Participants</span>
          <div className="journey-row" style={{ gridTemplateColumns: 'repeat(4,1fr)' }}>
            <div className="step"><div className="dot">01</div><b>Register</b><span>Fill out the competition form</span></div>
            <div className="step"><div className="dot">02</div><b>Audition</b><span>Show your skills at the venue</span></div>
            <div className="step"><div className="dot">03</div><b>Perform</b><span>Take the stage at AYF 2026</span></div>
            <div className="step"><div className="dot">04</div><b>Win</b><span>Trophies, certificates &amp; prizes</span></div>
          </div>
        </div>
      </div>
    </section>
  );
}
