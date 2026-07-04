import FeatureCard from './FeatureCard';

const features = ['Express', 'Connect', 'Learn', 'Lead', 'Inspire'];

const partners = [
  { category: 'Platinum', name: 'NOVA', sub: 'Innovation Partner' },
  { category: 'Gold', name: 'PULSE FM', sub: 'Media Partner' },
  { category: 'Silver', name: 'URBAN EDGE', sub: 'Lifestyle Partner' },
  { category: 'Bronze', name: 'BREW CO.', sub: 'Hospitality Partner' },
];

export default function WhyAYF() {
  return (
    <section className="why reveal" id="about">
      <div className="wrap">
        <div className="about-top">
          <div className="about-text">
            <span className="sticker sticker-orange" style={{ marginBottom: 16 }}>Why AYF</span>
            <h2>Why <u>AYF</u> exists</h2>
            <p className="about-desc">AYF is more than an event. It&apos;s a platform for young minds to express, compete, collaborate and create real impact. Organized by <strong>Navrashtra Youth Foundation</strong> &mdash; a city-wide movement built by youth, for youth.</p>
          </div>
          <div className="feature-grid">
            {features.map((f) => (
              <FeatureCard key={f} title={f} />
            ))}
          </div>
        </div>

        <div className="about-middle">
          <div className="about-middle-inner">
            <h2>Partners &amp; Sponsors</h2>
            <p>Supported by organizations that believe in youth power.</p>
          </div>
        </div>

        <div className="partner-grid">
          {partners.map((p) => (
            <div className="partner-card" key={p.name}>
              <span className="partner-cat">{p.category}</span>
              <span className="partner-name">{p.name}</span>
              <span className="partner-sub">{p.sub}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
