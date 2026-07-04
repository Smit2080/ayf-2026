export default function VolunteerSection() {
  return (
    <section className="volunteer reveal">
      <div className="halftone-bg" />
      <div className="wrap">
        <div className="vol-wrap">
          <div className="vol-text">
            <span className="sticker sticker-purple" style={{ marginBottom: 14, color: 'var(--white)' }}>Join the Team</span>
            <h2>Be Part of <u>the Team</u></h2>
            <p>Join 100+ volunteers who make AYF happen. From tech to hospitality, marketing to stage management - every role matters.</p>
            <div style={{ fontSize: 13, color: 'rgba(13,13,15,0.6)', lineHeight: 1.7, marginBottom: 22, padding: '14px 16px', background: 'rgba(255,106,0,0.06)', borderRadius: 8 }}>
              <strong>Note:</strong> Volunteering at AYF is a purely voluntary commitment - no monetary compensation is provided. Volunteers are expected to attend all assigned sessions, maintain professionalism, and adhere to the code of conduct.
            </div>
            <a className="btn btn-solid" href="/register?type=volunteer">Apply as Volunteer</a>
          </div>
          <div className="vol-steps">
            <div className="vol-step"><div><h4>Application</h4><p>Fill out the volunteer form</p></div></div>
            <div className="vol-step"><div><h4>Interview</h4><p>Quick chat with the team</p></div></div>
            <div className="vol-step"><div><h4>Department</h4><p>Assigned to your preferred team</p></div></div>
            <div className="vol-step"><div><h4>Training</h4><p>Learn the ropes and meet your crew</p></div></div>
            <div className="vol-step"><div><h4>Festival</h4><p>Make it happen on the ground</p></div></div>
            <div className="vol-step"><div><h4>Certificate</h4><p>Get recognized for your contribution</p></div></div>
          </div>
        </div>
      </div>
    </section>
  );
}
