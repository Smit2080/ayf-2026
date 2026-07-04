export default function Journey() {
  return (
    <section className="journey reveal">
      <div className="wrap">
        <span className="sticker sticker-ink" style={{ marginBottom: 14 }}>How It Works</span>
        <h2>Your journey with AYF</h2>

        <div style={{ marginBottom: 40 }}>
          <span className="sticker sticker-lime" style={{ marginBottom: 18 }}>For Participants</span>
          <div className="journey-row" style={{ gridTemplateColumns: 'repeat(4,1fr)' }}>
            <div className="step"><div className="dot">01</div><b>Register</b><span>Fill out the competition form</span></div>
            <div className="step"><div className="dot">02</div><b>Audition</b><span>Show your skills at the venue</span></div>
            <div className="step"><div className="dot">03</div><b>Perform</b><span>Take the stage at AYF 2026</span></div>
            <div className="step"><div className="dot">04</div><b>Win</b><span>Trophies, certificates &amp; prizes</span></div>
          </div>
        </div>

        <div>
          <span className="sticker sticker-purple" style={{ marginBottom: 18, color: 'var(--white)' }}>For Volunteers</span>
          <div className="journey-row">
            <div className="step"><div className="dot">01</div><b>Apply</b><span>Fill out the volunteer form</span></div>
            <div className="step"><div className="dot">02</div><b>Shortlist</b><span>We review your application</span></div>
            <div className="step"><div className="dot">03</div><b>Interview</b><span>Quick chat with the team</span></div>
            <div className="step"><div className="dot">04</div><b>Team</b><span>Get placed in your department</span></div>
            <div className="step"><div className="dot">05</div><b>Training</b><span>Learn, connect, prepare</span></div>
            <div className="step"><div className="dot">06</div><b>Festival</b><span>Be the part, lead the wave</span></div>
            <div className="step"><div className="dot">07</div><b>Certificate</b><span>Get recognized</span></div>
          </div>
        </div>
      </div>
    </section>
  );
}
