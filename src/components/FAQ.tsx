'use client';

import { useEffect } from 'react';

const faqs = [
  {
    q: 'How do I register?',
    a: (
      <>
        <p>Click the Register button and fill out the registration form with your details. Select which competition you want to participate in. The Rs.500 registration fee is payable at the audition venue.</p>
        <p style={{ marginTop: 8 }}><a href="/register?type=competition" style={{ color: 'var(--orange)', textDecoration: 'underline' }}>Open Registration Form -&gt;</a></p>
      </>
    ),
  },
  {
    q: 'What competitions are there?',
    a: (
      <p>Five competitions: <strong>Science Exhibition</strong> &mdash; showcase your projects and innovations, <strong>Youth Parliament</strong> &mdash; debate real-world issues, <strong>Startup Competition</strong> &mdash; pitch your business ideas, <strong>Amravati&apos;s Got Talent</strong> &mdash; sing, dance, or perform, and <strong>Reel Competition</strong> &mdash; create short-form videos. Reel Competition has no registration fee.</p>
    ),
  },
  {
    q: 'Who can participate?',
    a: (
      <p>Open to all residents of Amravati &amp; Vidarbha region aged 16-35. Participants below 18 need written parental/guardian consent. There is no educational qualification requirement &mdash; students, graduates, and working professionals are all welcome.</p>
    ),
  },
  {
    q: 'Will I get a certificate?',
    a: (
      <p>Yes. Every registered participant gets a <strong>participation certificate</strong> and a <strong>free pass</strong> to AYF 2026. Selected participants get to perform at the main festival stage. Winners receive trophies, certificates, and prizes.</p>
    ),
  },
  {
    q: 'Can I volunteer?',
    a: (
      <>
        <p>Absolutely. We are looking for 100+ volunteers across tech, media, hospitality, management, marketing, design, and registration departments. Fill out the volunteer application form and our team will review it. Volunteering is a purely voluntary commitment with no monetary compensation. Volunteers are expected to attend all assigned sessions, maintain professionalism, and follow the code of conduct.</p>
        <p style={{ marginTop: 8 }}><a href="/register?type=volunteer" style={{ color: 'var(--orange)', textDecoration: 'underline' }}>Apply as Volunteer -&gt;</a></p>
      </>
    ),
  },
  {
    q: 'Who organizes AYF?',
    a: (
      <p>AYF 2026 is organized by <strong>Navrashtra Youth Foundation</strong> &mdash; a youth-driven organization dedicated to creating platforms for young talent in the Amravati &amp; Vidarbha region. The foundation works year-round to identify, nurture, and showcase local youth potential through events, competitions, and leadership programs.</p>
    ),
  },
  {
    q: 'When and where is AYF 2026?',
    a: (
      <p>AYF 2026 runs <strong>December 18-20, 2026</strong> in Amravati. Three days of competitions, performances, and celebrations. The exact venue will be announced closer to the date &mdash; stay tuned on Instagram <a href="https://www.instagram.com/amravatiyouthfest/" target="_blank" rel="noopener" style={{ color: 'var(--orange)', textDecoration: 'underline' }}>@amravatiyouthfest</a> for updates.</p>
    ),
  },
];

export default function FAQSection() {
  useEffect(() => {
    const triggers = document.querySelectorAll('.faq-q .trigger');
    const cleanups: Array<() => void> = [];

    triggers.forEach((trigger) => {
      const onClick = () => {
        const answer = trigger.nextElementSibling as HTMLElement | null;
        if (!answer) return;
        const open = trigger.classList.toggle('open');
        answer.style.maxHeight = open ? `${answer.scrollHeight}px` : '0';
      };
      trigger.addEventListener('click', onClick);
      cleanups.push(() => trigger.removeEventListener('click', onClick));
    });

    return () => cleanups.forEach((fn) => fn());
  }, []);

  return (
    <section className="faq reveal" id="faq">
      <div className="wrap">
        <span className="sticker sticker-orange" style={{ marginBottom: 14 }}>Help</span>
        <h2>Got Questions?</h2>
        <div className="faq-list">
          {faqs.map((item) => (
            <div className="faq-q" key={item.q}>
              <div className="trigger">
                <span>{item.q}</span>
                <span className="arrow">+</span>
              </div>
              <div className="answer">{item.a}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
