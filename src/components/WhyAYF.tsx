import SponsorSlider from './SponsorSlider';

export default function WhyAYF() {
  return (
    <section className="why reveal" id="about">
      <div className="wrap">
        <div className="about-text about-text--full">
          <span className="sticker sticker-orange" style={{ marginBottom: 20 }}>Why AYF</span>
          <h2 className="about-heading">Why <u>AYF</u> exists</h2>
          <p className="about-desc about-desc--full">AYF is more than an event. It&apos;s a platform for young minds to express, compete, collaborate and create real impact. Organized by <strong>Navrashtra Youth Foundation</strong> &mdash; a city-wide movement built by youth, for youth.</p>
        </div>
        <div className="about-sponsors">
          <span className="sticker sticker-purple" style={{ marginBottom: 16 }}>Our Sponsors</span>
          <SponsorSlider />
        </div>
      </div>
    </section>
  );
}
