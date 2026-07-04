export default function CTA() {
  return (
    <div className="cta-band">
      <div className="wrap">
        <div className="sticker sticker-ink" style={{ marginBottom: 16 }}>Registrations Open</div>
        <h2>Registrations are <span className="hl">open!</span></h2>
        <a className="btn btn-black" href="/register?type=competition">Register Now --</a>
      </div>
    </div>
  );
}
