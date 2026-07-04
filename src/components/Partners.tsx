const partners = ['NOVA', 'PULSE FM', 'URBAN EDGE', 'BREW CO.', 'SWIFTPAY', 'ORBIT'];

export default function Partners() {
  return (
    <section className="partners reveal" id="sponsors">
      <div className="wrap">
        <span className="sticker sticker-amber" style={{ marginBottom: 14, color: 'var(--ink)' }}>Sponsors</span>
        <h2>Our Partners</h2>
        <p className="note">Replace with confirmed sponsor logos.</p>
        <div className="partner-row">
          {partners.map((p) => (
            <span className="partner-pill" key={p}>{p}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
