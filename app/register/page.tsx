'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { FormEvent, Suspense, useState } from 'react';

type Tab = 'competition' | 'volunteer';
type Submitted = 'comp' | 'vol' | null;

function RegisterContent() {
  const searchParams = useSearchParams();
  const initialTab: Tab = searchParams.get('type') === 'volunteer' ? 'volunteer' : 'competition';
  const [tab, setTab] = useState<Tab>(initialTab);
  const [pendingSubmit, setPendingSubmit] = useState<Submitted>(null);
  const [success, setSuccess] = useState<Submitted>(null);

  function selectTab(nextTab: Tab) {
    setTab(nextTab);
    setSuccess(null);
    setPendingSubmit(null);
  }

  function submitForm(event: FormEvent<HTMLFormElement>, type: Exclude<Submitted, null>) {
    const terms = document.getElementById(type === 'comp' ? 'compTerms' : 'volTerms') as HTMLInputElement | null;
    if (!terms?.checked) {
      event.preventDefault();
      alert('Please agree to the Terms & Conditions.');
      return;
    }
    setPendingSubmit(type);
  }

  function iframeLoaded() {
    if (!pendingSubmit) return;
    setSuccess(pendingSubmit);
    setPendingSubmit(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  if (success === 'comp') {
    return (
      <SuccessPanel
        tone="comp"
        title="Registration"
        highlight="Submitted!"
        body={
          <>
            Thank you for registering for AYF 2026. We have received your application. Please save the audition details below.<br /><br />
            <strong>Registration Fee:</strong> Rs.500 payable at the audition venue<br />
            <strong>What's Next:</strong> We will contact you via WhatsApp with your audition slot details.<br /><br />
            Follow <a href="https://www.instagram.com/amravatiyouthfest/" target="_blank" rel="noopener">@amravatiyouthfest</a> for updates.
          </>
        }
      />
    );
  }

  if (success === 'vol') {
    return (
      <SuccessPanel
        tone="vol"
        title="Application"
        highlight="Submitted!"
        body={
          <>
            Thank you for applying to volunteer at AYF 2026. We have received your application and will review it shortly.<br /><br />
            <strong>What's Next:</strong> We will contact you via WhatsApp if your application is shortlisted.<br /><br />
            Follow <a href="https://www.instagram.com/amravatiyouthfest/" target="_blank" rel="noopener">@amravatiyouthfest</a> for updates.
          </>
        }
      />
    );
  }

  return (
    <main className="register-page">
      <header className="register-header">
        <div className="register-wrap register-nav">
          <Link className="register-logo" href="/" aria-label="AYF Home">
            <img src="/AYF_logo_clean.png" alt="AYF" />
          </Link>
          <Link className="btn btn-ghost register-back" href="/">Back</Link>
        </div>
      </header>

      <section className="register-section" id="formSection">
        <div className="register-wrap">
          <div className="register-tabs" role="tablist">
            <button className={tab === 'competition' ? 'register-tab active' : 'register-tab'} onClick={() => selectTab('competition')} type="button" role="tab" aria-selected={tab === 'competition'}>Competition Registration</button>
            <button className={tab === 'volunteer' ? 'register-tab active' : 'register-tab'} onClick={() => selectTab('volunteer')} type="button" role="tab" aria-selected={tab === 'volunteer'}>Apply as Volunteer</button>
          </div>

          <h1 className="register-title">
            {tab === 'competition' ? <>Join AYF <span>2026</span></> : <>Join the <span className="purple">Team</span></>}
          </h1>
          <p className="register-lede">
            {tab === 'competition'
              ? "Register yourself for the competition audition of Amravati Youth Festival 2026. Fill out the form below and we'll see you at the venue."
              : 'Be part of the team that makes AYF 2026 happen. We are looking for 100+ passionate volunteers across tech, media, hospitality, management, marketing, design, and registration.'}
          </p>

          {tab === 'competition' ? (
            <div className="register-note comp">
              <span><strong>Registration Fee:</strong> Rs.500 payable at the audition venue</span>
              <span><strong>Final Performance:</strong> No fee</span>
              <span><strong>Reel Competition:</strong> Free entry</span>
            </div>
          ) : (
            <div className="register-note vol">
              <span><strong>Commitment:</strong> Attend all assigned sessions</span>
              <span><strong>Compensation:</strong> Purely voluntary - no monetary compensation</span>
              <span><strong>Perks:</strong> Experience, connections, certificate & free pass</span>
            </div>
          )}

          <div className={tab === 'competition' ? 'register-card comp' : 'register-card vol'}>
            {tab === 'competition' ? <CompetitionForm onSubmit={submitForm} /> : <VolunteerForm onSubmit={submitForm} />}
            <iframe name="hidden_iframe" id="hidden_iframe" className="register-hidden-frame" title="form-submit" onLoad={iframeLoaded} />
          </div>
        </div>
      </section>
    </main>
  );
}

function CompetitionForm({ onSubmit }: { onSubmit: (event: FormEvent<HTMLFormElement>, type: 'comp') => void }) {
  return (
    <form action="https://docs.google.com/forms/d/e/1FAIpQLSdyg6KnndJiLOVIyWCJ_PRqZiMFjeiGR1frYCheyYPNsTf5cQ/formResponse" method="POST" target="hidden_iframe" onSubmit={(event) => onSubmit(event, 'comp')}>
      <div className="register-grid">
        <Field className="full" label="Competition" required>
          <select name="entry.2092238618" required defaultValue="">
            <option value="" disabled>Select competition</option>
            <option value="Science Exhibition">Science Exhibition</option>
            <option value="Youth Parliament">Youth Parliament</option>
            <option value="Startup Competition">Startup Competition</option>
            <option value="Amravati's Got Talent">Amravati&apos;s Got Talent</option>
            <option value="Reel Competition ( No Fees for Reel Competion )">Reel Competition (Free Entry)</option>
          </select>
        </Field>
        <Field label="Full Name" required><input type="text" name="entry.1556369182" placeholder="Your full name" required /></Field>
        <Field label="Age" required><input type="number" name="entry.394387559" placeholder="16 - 35" min="16" max="35" required /></Field>
        <Field label="WhatsApp Number" required><input type="tel" name="entry.1333852073" placeholder="Enter your WhatsApp number" required /></Field>
        <Field label="Email" required><input type="email" name="entry.1844094378" placeholder="xyz@gmail.com" required /></Field>
        <Field label="College / Institution" required><input type="text" name="entry.1249710242" placeholder="Current or past college" required /></Field>
        <Field label="Field / Stream of Study" required><input type="text" name="entry.666468421" placeholder="Science, Arts, Commerce, etc." required /></Field>
        <Field className="full" label="Performance Details" required><textarea name="entry.479301265" placeholder="Tell us about your participation and which competition you're entering in detail" required /></Field>
      </div>
      <Terms type="comp" />
      <div className="register-submit">
        <button type="submit" className="btn btn-solid register-submit-btn">Register Now</button>
        <p className="register-submit-note">Rs.500 fee payable at venue. Reel Competition is free.</p>
      </div>
    </form>
  );
}

function VolunteerForm({ onSubmit }: { onSubmit: (event: FormEvent<HTMLFormElement>, type: 'vol') => void }) {
  return (
    <form action="https://docs.google.com/forms/d/e/1FAIpQLSepX7-G5b6RATmh8YtVDiPwNcaW53st2J70iG2Qr1ZESJr2LA/formResponse" method="POST" target="hidden_iframe" onSubmit={(event) => onSubmit(event, 'vol')}>
      <div className="register-grid">
        <Field label="Full Name" required><input type="text" name="entry.2092238618" placeholder="Your full name" required /></Field>
        <Field label="WhatsApp Number" required><input type="tel" name="entry.1019139433" placeholder="Enter your WhatsApp number" required /></Field>
        <Field label="Email" required><input type="email" name="entry.1556369182" placeholder="xyz@gmail.com" required /></Field>
        <Field label="Age" required><input type="number" name="entry.479301265" placeholder="16 - 35" min="16" max="35" required /></Field>
        <Field className="full" label="Gender" required>
          <div className="register-radio">
            <label><input type="radio" name="entry.1647575826" value="MALE" required /> MALE</label>
            <label><input type="radio" name="entry.1647575826" value="FEMALE" /> FEMALE</label>
            <label><input type="radio" name="entry.1647575826" value="OTHER" /> OTHER</label>
          </div>
        </Field>
        <Field label="College / Institution" required><input type="text" name="entry.1401600069" placeholder="Enter your college name" required /></Field>
        <Field label="Field / Stream of Study" required><input type="text" name="entry.1403138662" placeholder="Science, Arts, Commerce, etc." required /></Field>
        <Field label="Which city do you currently live in?" required><input type="text" name="entry.1192878501" placeholder="Your city" required /></Field>
        <Field label="Languages Known" required><input type="text" name="entry.1410848207" placeholder="Marathi, Hindi, English, etc." required /></Field>
        <Field className="full" label="Previous Event Experience" required><textarea name="entry.13296338" placeholder="College Fest, Community Work, Event, etc." required /></Field>
        <Field className="full" label="Why do you want to volunteer at AYF 2026?" required><textarea name="entry.961122328" placeholder="Your selection is based on this answer. Tell us why you want to be part of the team." required /></Field>
        <Field label="Instagram Account"><input type="text" name="entry.1183718771" placeholder="Mention your Instagram ID" /></Field>
      </div>
      <Terms type="vol" />
      <div className="register-submit">
        <button type="submit" className="btn btn-solid register-submit-btn vol">Apply as Volunteer</button>
        <p className="register-submit-note">No monetary compensation. Volunteering is purely voluntary.</p>
      </div>
    </form>
  );
}

function Field({ label, required, className = '', children }: { label: string; required?: boolean; className?: string; children: React.ReactNode }) {
  return (
    <div className={`register-field ${className}`}>
      <label>{label} {required ? <span className="req">*</span> : null}</label>
      {children}
    </div>
  );
}

function Terms({ type }: { type: 'comp' | 'vol' }) {
  if (type === 'comp') {
    return (
      <div className="register-terms-wrap">
        <label className="register-terms-label">Terms & Conditions <span className="req">*</span></label>
        <div className="register-terms">
          <strong>ELIGIBILITY:</strong> Open to all residents of Amravati / Vidarbha region aged 16-35.<br /><br />
          <strong>REGISTRATION:</strong> Registration is mandatory. Navrashtra Youth Foundation reserves the right to accept or reject any registration.<br /><br />
          <strong>PARTICIPATION:</strong> Participants must report on time. Misconduct leads to disqualification. Judges&apos; decisions are final.<br /><br />
          <strong>FEES:</strong> Rs.500 registration fee payable at audition venue. No fee for final performance. Reel Competition is free.<br /><br />
          <strong>CERTIFICATES:</strong> All participants receive a participation certificate. Winners get trophies, certificates & prizes.<br /><br />
          <strong>LIABILITY:</strong> Participants participate at their own risk. Navrashtra Youth Foundation is not liable for personal injury, loss, or damage to belongings.<br /><br />
          <strong>MEDIA:</strong> Participants consent to being photographed/filmed for promotional purposes.<br /><br />
          <strong>MINORS:</strong> Participants below 18 need written parental/guardian consent.<br /><br />
          <em>By submitting, you confirm that all information provided is true and accurate, and you agree to all terms and conditions above.</em>
        </div>
        <div className="register-check comp">
          <input type="checkbox" value="Agreed to all Terms & Conditions ." id="compTerms" required />
          <label htmlFor="compTerms">I have read, understood, and agree to all the above Terms & Conditions and Liability Disclaimer.</label>
        </div>
      </div>
    );
  }

  return (
    <div className="register-terms-wrap">
      <label className="register-terms-label">Terms & Conditions <span className="req">*</span></label>
      <div className="register-terms">
        <strong>1. Eligibility:</strong> Volunteer must be 16-35 years of age and a resident of Amravati or Vidarbha region.<br /><br />
        <strong>2. Commitment:</strong> Once registered, volunteer is expected to attend all assigned sessions without fail. Absence without prior notice will be considered a breach of commitment.<br /><br />
        <strong>3. Full Responsibility on Volunteer:</strong><br />
        The volunteer is solely responsible for their own conduct, behavior, and actions during the festival.<br />
        Any damage caused to property, equipment, or venue due to volunteer&apos;s negligence will be the volunteer&apos;s personal responsibility.<br />
        Navrashtra Youth Foundation will not be held liable for any personal loss, injury, or mishap during the event.<br /><br />
        <strong>4. Punctuality & Discipline:</strong> Volunteer must report on time as per assigned duty schedule. Misconduct, indiscipline, or disrespect toward guests, participants, or team members will result in immediate termination of volunteer duties.<br /><br />
        <strong>5. Confidentiality:</strong> Any internal information, guest details, or organizational data shared with the volunteer must be kept strictly confidential.<br /><br />
        <strong>6. No Monetary Compensation:</strong> Volunteering at AYF 2026 is purely on a voluntary basis. No payment, stipend, or monetary benefit will be provided.<br /><br />
        <strong>7. Media & Photography:</strong> The volunteer consents to being photographed or filmed during the event. Such content may be used by Navrashtra Youth Foundation for promotional purposes.<br /><br />
        <strong>8. Code of Conduct:</strong> The volunteer agrees to maintain dignity, respect, and professionalism at all times during the festival.<br /><br />
        <strong>9. Compliance:</strong> The volunteer agrees to follow all instructions given by the festival team and Navrashtra Youth Foundation at all times.<br /><br />
        <strong>10. Agreement:</strong> By registering, the volunteer confirms that all information provided is accurate and that they have read, understood, and agreed to all the above terms and conditions.<br /><br />
        <em>Navrashtra Youth Foundation reserves the right to modify these terms at any time without prior notice.</em>
      </div>
      <div className="register-check vol">
        <input type="checkbox" value="YES I Agreed to all the above terms and conditions." id="volTerms" required />
        <label htmlFor="volTerms">YES I Agreed to all the above terms and conditions.</label>
      </div>
    </div>
  );
}

function SuccessPanel({ tone, title, highlight, body }: { tone: 'comp' | 'vol'; title: string; highlight: string; body: React.ReactNode }) {
  return (
    <main className="register-page">
      <section className={`register-success ${tone}`}>
        <div className="register-wrap">
          <div className="register-checkmark">{'\u2713'}</div>
          <h2>{title} <span>{highlight}</span></h2>
          <p>{body}</p>
          <Link className="btn btn-outline" href="/">Back to Home</Link>
        </div>
      </section>
    </main>
  );
}

export default function RegisterPage() {
  return <Suspense><RegisterContent /></Suspense>;
}