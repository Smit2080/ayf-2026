'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { FormEvent, Suspense, useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';

type Tab = 'competition' | 'volunteer';
type Submitted = 'comp' | 'vol' | null;

function RegisterContent() {
  const supabase = createClient();
  const searchParams = useSearchParams();
  const initialTab: Tab = searchParams.get('type') === 'volunteer' ? 'volunteer' : 'competition';
  const [tab, setTab] = useState<Tab>(initialTab);
  const [success, setSuccess] = useState<Submitted>(null);
  const [submitting, setSubmitting] = useState(false);

  // Auth State
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Profile data fetched from DB if exists
  const [hasProfile, setHasProfile] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [age, setAge] = useState('');
  const [college, setCollege] = useState('');
  const [stream, setStream] = useState('');

  // Competition specific fields
  const [selectedCompetitions, setSelectedCompetitions] = useState<string[]>([]);
  const [performanceDetails, setPerformanceDetails] = useState('');

  const COMPETITIONS = [
    'Science Exhibition',
    'Youth Parliament',
    'Startup Competition',
    "Amravati's Got Talent",
    'Reel Competition',
  ];

  function toggleCompetition(name: string) {
    setSelectedCompetitions((prev) =>
      prev.includes(name) ? prev.filter((c) => c !== name) : [...prev, name]
    );
  }

  // Volunteer specific fields
  const [gender, setGender] = useState('');
  const [city, setCity] = useState('');
  const [languages, setLanguages] = useState('');
  const [experience, setExperience] = useState('');
  const [whyVolunteer, setWhyVolunteer] = useState('');
  const [instagramId, setInstagramId] = useState('');
  const [hasAppliedVolunteer, setHasAppliedVolunteer] = useState(false);
  const [registeredCompetitions, setRegisteredCompetitions] = useState<string[]>([]);

  // Check initial session
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        setFullName(session.user.user_metadata?.full_name || session.user.user_metadata?.name || '');
        fetchProfileAndStatus(session.user.id);
      } else {
        setAuthLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        setFullName(session.user.user_metadata?.full_name || session.user.user_metadata?.name || '');
        fetchProfileAndStatus(session.user.id);
      } else {
        setAuthLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function fetchProfileAndStatus(userId: string) {
    setProfileLoading(true);
    try {
      // Fetch profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profile && !profileError) {
        setHasProfile(true);
        setFullName(profile.full_name);
        setWhatsapp(profile.whatsapp_number);
        setAge(profile.age.toString());
        setCollege(profile.college);
        setStream(profile.stream);
      }

      // Check if already applied as volunteer
      const { data: volApp, error: volError } = await supabase
        .from('volunteers')
        .select('id')
        .eq('user_id', userId)
        .maybeSingle();

      if (volApp && !volError) {
        setHasAppliedVolunteer(true);
      }

      // Fetch all competitions user has already registered for
      const { data: compData } = await supabase
        .from('competitions')
        .select('competition_name')
        .eq('user_id', userId);

      if (compData) {
        setRegisteredCompetitions(compData.map((c) => c.competition_name));
      }
    } catch (e) {
      console.error('Error fetching profile:', e);
    } finally {
      setProfileLoading(false);
      setAuthLoading(false);
    }
  }

  function selectTab(nextTab: Tab) {
    setTab(nextTab);
    setSuccess(null);
  }

  async function handleGoogleSignIn() {
    try {
      const nextUrl = encodeURIComponent(`/register?type=${tab}`);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=${nextUrl}`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });
      if (error) throw error;
    } catch (error: any) {
      alert('Sign-in failed: ' + error.message);
    }
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    setUser(null);
    setHasProfile(false);
    setFullName('');
    setWhatsapp('');
    setAge('');
    setCollege('');
    setStream('');
    setHasAppliedVolunteer(false);
    setRegisteredCompetitions([]);
  }

  async function handleFormSubmit(event: FormEvent<HTMLFormElement>, type: 'comp' | 'vol') {
    event.preventDefault();
    if (!user) return;

    // Check terms and conditions checkbox
    const termsId = type === 'comp' ? 'compTerms' : 'volTerms';
    const terms = document.getElementById(termsId) as HTMLInputElement | null;
    if (!terms?.checked) {
      alert('Please agree to the Terms & Conditions.');
      return;
    }

    setSubmitting(true);

    try {
      // 1. Upsert Profile
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          full_name: fullName,
          email: user.email!,
          whatsapp_number: whatsapp,
          age: parseInt(age),
          college: college,
          stream: stream,
        });

      if (profileError) throw profileError;

      // 2. Insert form-specific registration
      if (type === 'comp') {
        const newComps = selectedCompetitions.filter(
          (c) => !registeredCompetitions.includes(c)
        );

        if (newComps.length === 0) {
          alert('You are already registered for all selected competitions.');
          setSubmitting(false);
          return;
        }

        const rows = newComps.map((name) => ({
          user_id: user.id,
          competition_name: name,
          performance_details: performanceDetails,
        }));

        const { error: compError } = await supabase
          .from('competitions')
          .insert(rows);

        if (compError) throw compError;
        setRegisteredCompetitions((prev) => [...prev, ...newComps]);
        setSuccess('comp');
      } else {
        const { error: volError } = await supabase
          .from('volunteers')
          .insert({
            user_id: user.id,
            gender: gender,
            city: city,
            languages: languages,
            experience: experience,
            why_volunteer: whyVolunteer,
            instagram_id: instagramId || null,
          });

        if (volError) throw volError;
        setHasAppliedVolunteer(true);
        setSuccess('vol');
      }
      
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error: any) {
      console.error(error);
      alert('Registration failed: ' + (error.message || 'Unknown error occurred.'));
    } finally {
      setSubmitting(false);
    }
  }

  // Auth loading screen
  if (authLoading) {
    return (
      <div className="register-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="register-checkmark" style={{ animation: 'spin 1.5s linear infinite', border: '3px solid var(--orange)', borderTopColor: 'transparent', borderRadius: '50%', width: 50, height: 50, margin: '0 auto 20px' }} />
          <h2 style={{ fontFamily: 'Anton', fontSize: 24, letterSpacing: '0.05em' }}>Loading Session...</h2>
        </div>
        <style jsx global>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // Not logged in: Show Google sign-in wall
  if (!user) {
    const errorParam = searchParams.get('error');
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

        <section className="register-section" style={{ display: 'flex', alignItems: 'center', padding: '80px 0' }}>
          <div className="register-wrap" style={{ width: '100%' }}>
            <div className="register-card comp" style={{ textAlign: 'center', maxWidth: 500, margin: '0 auto', padding: '50px 30px' }}>
              <div style={{ display: 'inline-block', marginBottom: 20 }}>
                <img src="/AYF_logo_clean.png" alt="AYF" style={{ height: 60, width: 'auto' }} />
              </div>
              <h1 style={{ fontFamily: 'Anton', fontSize: '32px', marginBottom: '16px', letterSpacing: '0.02em', textTransform: 'uppercase' }}>
                Join AYF <span>2026</span>
              </h1>
              <p style={{ fontSize: '14px', color: 'rgba(247, 247, 247, 0.6)', lineHeight: '1.6', marginBottom: '32px' }}>
                To register for competitions or apply as a volunteer, please verify your email by signing in with your Google account.
              </p>

              {errorParam && (
                <div style={{
                  background: 'rgba(255, 46, 138, 0.1)',
                  border: '1px solid var(--pink)',
                  borderRadius: '6px',
                  padding: '12px 16px',
                  marginBottom: '24px',
                  fontSize: '13px',
                  color: 'var(--pink)',
                  textAlign: 'left',
                  lineHeight: '1.5'
                }}>
                  <strong>Authentication Failed:</strong> The authentication callback could not establish a session. Please check that:
                  <ul style={{ paddingLeft: '20px', marginTop: '6px', listStyleType: 'disc', fontSize: '12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <li>Your <code>.env.local</code> contains the correct Supabase URL and Anon Key.</li>
                    <li>Google Auth is enabled in your Supabase dashboard.</li>
                    <li>Your Google OAuth credentials Client ID and Client Secret match.</li>
                  </ul>
                </div>
              )}

              <button
                onClick={handleGoogleSignIn}
                className="btn btn-solid"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '12px',
                  fontSize: '15px',
                  padding: '16px 32px',
                  width: '100%',
                  justifyContent: 'center',
                  background: '#ffffff',
                  color: '#0d0d0f',
                  borderColor: '#ffffff',
                  boxShadow: '0 4px 20px rgba(255, 255, 255, 0.1)',
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.56-2.77c-.98.66-2.23 1.06-3.72 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                </svg>
                Sign in with Google
              </button>
            </div>
          </div>
        </section>
      </main>
    );
  }

  // Success screen
  if (success === 'comp') {
    return (
      <SuccessPanel
        tone="comp"
        title="Registration"
        highlight="Submitted!"
        body={
          <>
            Thank you for registering for AYF 2026. We have received your application. Your details are securely saved.<br /><br />
            <strong>Registration Fee:</strong> Rs.500 payable at the audition venue (Reel Competition is free)<br />
            <strong>What's Next:</strong> We will contact you via WhatsApp with your audition slot details. You can view your real-time status in your dashboard.<br /><br />
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
            <strong>What's Next:</strong> We will contact you via WhatsApp if your application is shortlisted. You can track your application status in your dashboard.<br /><br />
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
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button className="btn btn-ghost register-back" onClick={handleSignOut}>Sign Out</button>
          </div>
        </div>
      </header>

      <section className="register-section" id="formSection">
        <div className="register-wrap">
          {/* User badge */}
          <div style={{
            background: 'rgba(247,247,247,0.05)',
            border: '1px solid var(--line)',
            borderRadius: '8px',
            padding: '12px 16px',
            marginBottom: '28px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '13px'
          }}>
            <div>
              <span style={{ color: 'rgba(247,247,247,0.5)' }}>Signed in as: </span>
              <strong>{user.email}</strong>
            </div>
            <button
              onClick={handleSignOut}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--pink)',
                cursor: 'pointer',
                fontFamily: 'Space Mono, monospace',
                fontSize: '11px',
                textTransform: 'uppercase',
                letterSpacing: '0.08em'
              }}
            >
              Change Account
            </button>
          </div>

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

          {profileLoading ? (
            <div style={{ padding: '60px 0', textAlign: 'center' }}>
              <div className="register-checkmark" style={{ animation: 'spin 1.5s linear infinite', border: '3px solid var(--purple)', borderTopColor: 'transparent', borderRadius: '50%', width: 40, height: 40, margin: '0 auto 16px' }} />
              <p style={{ fontFamily: 'Space Mono', fontSize: '12px', color: 'rgba(247,247,247,0.5)' }}>Loading Profile...</p>
            </div>
          ) : (
            <div className={tab === 'competition' ? 'register-card comp' : 'register-card vol'}>
              {tab === 'competition' ? (
                <form onSubmit={(e) => handleFormSubmit(e, 'comp')}>
                  <div className="register-grid">
                    <Field className="full" label="Competitions" required>
                      <div className="register-comp-grid">
                        {COMPETITIONS.map((name) => {
                          const fee = name === 'Reel Competition' ? 'Free' : 'Rs.500';
                          const alreadyIn = registeredCompetitions.includes(name);
                          const selected = selectedCompetitions.includes(name);
                          return (
                            <label
                              key={name}
                              className={`register-comp-card ${selected ? 'selected' : ''} ${alreadyIn ? 'disabled' : ''}`}
                            >
                              <input
                                type="checkbox"
                                checked={selected || alreadyIn}
                                disabled={alreadyIn}
                                onChange={() => toggleCompetition(name)}
                              />
                              <span className="register-comp-name">{name}</span>
                              <span className="register-comp-fee">{fee}</span>
                              {alreadyIn && <span className="register-comp-already">Already registered</span>}
                            </label>
                          );
                        })}
                      </div>
                      {selectedCompetitions.length === 0 && (
                        <p style={{ color: 'rgba(247,247,247,0.5)', fontSize: '12px', marginTop: '6px' }}>
                          Select at least one competition
                        </p>
                      )}
                    </Field>
                    <Field label="Full Name" required>
                      <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Your full name" required />
                    </Field>
                    <Field label="Age" required>
                      <input type="number" value={age} onChange={(e) => setAge(e.target.value)} placeholder="16 - 35" min="16" max="35" required />
                    </Field>
                    <Field label="WhatsApp Number" required>
                      <input type="tel" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder="Enter your WhatsApp number" required />
                    </Field>
                    <Field label="Email" required>
                      <input type="email" value={user.email} disabled style={{ opacity: 0.6, cursor: 'not-allowed' }} />
                    </Field>
                    <Field label="College / Institution" required>
                      <input type="text" value={college} onChange={(e) => setCollege(e.target.value)} placeholder="Current or past college" required />
                    </Field>
                    <Field label="Field / Stream of Study" required>
                      <input type="text" value={stream} onChange={(e) => setStream(e.target.value)} placeholder="Science, Arts, Commerce, etc." required />
                    </Field>
                    <Field className="full" label="Performance Details" required>
                      <textarea value={performanceDetails} onChange={(e) => setPerformanceDetails(e.target.value)} placeholder="Describe your act / entry in detail. If entering multiple competitions, specify details for each." required />
                    </Field>
                  </div>
                  <Terms type="comp" />
                  <div className="register-submit">
                    <button
                      type="submit"
                      className="btn btn-solid register-submit-btn"
                      disabled={submitting || selectedCompetitions.length === 0}
                    >
                      {submitting ? 'Submitting...' : 'Register Now'}
                    </button>
                    <p className="register-submit-note">Rs.500 fee payable at venue. Reel Competition is free.</p>
                  </div>
                </form>
              ) : (
                hasAppliedVolunteer ? (
                  <div style={{ textAlign: 'center', padding: '20px 0' }}>
                    <h3 style={{ fontFamily: 'Anton', fontSize: '20px', marginBottom: '12px' }}>Already Applied!</h3>
                    <p style={{ fontSize: '14px', color: 'rgba(247,247,247,0.6)', marginBottom: '24px', lineHeight: '1.6' }}>
                      You have already submitted a volunteer application. You can view your application status or register for competitions in your dashboard.
                    </p>
                    <Link href="/" className="btn btn-solid" style={{ background: 'var(--purple)', borderColor: 'var(--purple)' }}>Back to Home</Link>
                  </div>
                ) : (
                  <form onSubmit={(e) => handleFormSubmit(e, 'vol')}>
                    <div className="register-grid">
                      <Field label="Full Name" required>
                        <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Your full name" required />
                      </Field>
                      <Field label="WhatsApp Number" required>
                        <input type="tel" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder="Enter your WhatsApp number" required />
                      </Field>
                      <Field label="Email" required>
                        <input type="email" value={user.email} disabled style={{ opacity: 0.6, cursor: 'not-allowed' }} />
                      </Field>
                      <Field label="Age" required>
                        <input type="number" value={age} onChange={(e) => setAge(e.target.value)} placeholder="16 - 35" min="16" max="35" required />
                      </Field>
                      <Field className="full" label="Gender" required>
                        <div className="register-radio">
                          <label><input type="radio" name="gender" value="MALE" checked={gender === 'MALE'} onChange={() => setGender('MALE')} required /> MALE</label>
                          <label><input type="radio" name="gender" value="FEMALE" checked={gender === 'FEMALE'} onChange={() => setGender('FEMALE')} /> FEMALE</label>
                          <label><input type="radio" name="gender" value="OTHER" checked={gender === 'OTHER'} onChange={() => setGender('OTHER')} /> OTHER</label>
                        </div>
                      </Field>
                      <Field label="College / Institution" required>
                        <input type="text" value={college} onChange={(e) => setCollege(e.target.value)} placeholder="Enter your college name" required />
                      </Field>
                      <Field label="Field / Stream of Study" required>
                        <input type="text" value={stream} onChange={(e) => setStream(e.target.value)} placeholder="Science, Arts, Commerce, etc." required />
                      </Field>
                      <Field label="Which city do you currently live in?" required>
                        <input type="text" value={city} onChange={(e) => setCity(e.target.value)} placeholder="Your city" required />
                      </Field>
                      <Field label="Languages Known" required>
                        <input type="text" value={languages} onChange={(e) => setLanguages(e.target.value)} placeholder="Marathi, Hindi, English, etc." required />
                      </Field>
                      <Field className="full" label="Previous Event Experience" required>
                        <textarea value={experience} onChange={(e) => setExperience(e.target.value)} placeholder="College Fest, Community Work, Event, etc." required />
                      </Field>
                      <Field className="full" label="Why do you want to volunteer at AYF 2026?" required>
                        <textarea value={whyVolunteer} onChange={(e) => setWhyVolunteer(e.target.value)} placeholder="Your selection is based on this answer. Tell us why you want to be part of the team." required />
                      </Field>
                      <Field label="Instagram Account">
                        <input type="text" value={instagramId} onChange={(e) => setInstagramId(e.target.value)} placeholder="Mention your Instagram ID" />
                      </Field>
                    </div>
                    <Terms type="vol" />
                    <div className="register-submit">
                      <button type="submit" className="btn btn-solid register-submit-btn vol" disabled={submitting}>
                        {submitting ? 'Submitting...' : 'Apply as Volunteer'}
                      </button>
                      <p className="register-submit-note">No monetary compensation. Volunteering is purely voluntary.</p>
                    </div>
                  </form>
                )
              )}
            </div>
          )}
        </div>
      </section>
    </main>
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
      <section className={`register-success ${tone}`} style={{ display: 'flex', alignItems: 'center', minHeight: '100vh', padding: '40px 24px' }}>
        <div className="register-wrap" style={{ width: '100%' }}>
          <div className="register-checkmark" style={{ width: 72, height: 72, background: tone === 'comp' ? 'var(--lime)' : 'var(--purple)', color: tone === 'comp' ? 'var(--ink)' : 'var(--white)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, fontWeight: 'bold', margin: '0 auto 24px' }}>✓</div>
          <h2 style={{ fontFamily: 'Anton', fontSize: '32px', marginBottom: '16px', letterSpacing: '0.02em', textTransform: 'uppercase' }}>
            {title} <span style={{ color: tone === 'comp' ? 'var(--orange)' : 'var(--purple)' }}>{highlight}</span>
          </h2>
          <p style={{ fontSize: '15px', color: 'rgba(247, 247, 247, 0.65)', lineHeight: '1.7', marginBottom: '32px', maxWidth: '600px', margin: '0 auto 32px' }}>
            {body}
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link className="btn btn-solid" href="/" style={{ background: tone === 'comp' ? 'var(--orange)' : 'var(--purple)', borderColor: tone === 'comp' ? 'var(--orange)' : 'var(--purple)' }}>
              Back to Home
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export default function RegisterPage() {
  return <Suspense><RegisterContent /></Suspense>;
}