'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';

interface Profile {
  full_name: string;
  email: string;
  whatsapp_number: string;
  age: number;
  college: string;
  stream: string;
}

interface Competition {
  id: string;
  competition_name: string;
  performance_details: string;
  status: string;
  audition_slot: string | null;
  created_at: string;
}

interface Volunteer {
  id: string;
  gender: string;
  city: string;
  languages: string;
  experience: string;
  why_volunteer: string;
  instagram_id: string | null;
  status: string;
  created_at: string;
}

export default function DashboardPage() {
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [profile, setProfile] = useState<Profile | null>(null);
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [volunteer, setVolunteer] = useState<Volunteer | null>(null);

  useEffect(() => {
    // Check session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        fetchUserData(session.user.id);
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
        fetchUserData(session.user.id);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function fetchUserData(userId: string) {
    try {
      // 1. Fetch Profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (profileData) {
        setProfile(profileData);
      }

      // 2. Fetch Competitions
      const { data: compData } = await supabase
        .from('competitions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (compData) {
        setCompetitions(compData);
      }

      // 3. Fetch Volunteer App
      const { data: volData } = await supabase
        .from('volunteers')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (volData) {
        setVolunteer(volData);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    window.location.href = '/register';
  }

  // Get status CSS classes
  function getStatusClass(status: string) {
    const s = status.toLowerCase();
    if (s.includes('pending')) return 'status-pending';
    if (s.includes('slot') || s.includes('shortlisted')) return 'status-slot';
    if (s.includes('confirm') || s.includes('accept')) return 'status-confirmed';
    if (s.includes('disqual') || s.includes('reject')) return 'status-failed';
    return 'status-pending';
  }

  if (loading) {
    return (
      <div className="register-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="register-checkmark" style={{ animation: 'spin 1.5s linear infinite', border: '3px solid var(--purple)', borderTopColor: 'transparent', borderRadius: '50%', width: 50, height: 50, margin: '0 auto 20px' }} />
          <h2 style={{ fontFamily: 'Anton', fontSize: 24, letterSpacing: '0.05em' }}>Loading Dashboard...</h2>
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

  if (!user) {
    return (
      <div className="register-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'Anton', fontSize: 24, marginBottom: 20 }}>Access Denied</h2>
          <p style={{ color: 'rgba(247,247,247,0.5)', marginBottom: 20 }}>Please sign in to view your dashboard.</p>
          <Link href="/register" className="btn btn-solid">Sign In</Link>
        </div>
      </div>
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
            <Link className="btn btn-ghost register-back" href="/">Home</Link>
            <button className="btn btn-ghost register-back" onClick={handleSignOut}>Sign Out</button>
          </div>
        </div>
      </header>

      {/* Decorative glows */}
      <div style={{ position: 'fixed', top: '-10%', right: '-10%', width: '50vw', height: '50vw', background: 'radial-gradient(circle, rgba(255,184,0,0.05) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'fixed', bottom: '-10%', left: '-10%', width: '50vw', height: '50vw', background: 'radial-gradient(circle, rgba(123,44,255,0.05) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

      <section className="register-section" style={{ position: 'relative', zIndex: 1 }}>
        <div className="register-wrap" style={{ maxWidth: 900 }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 20, marginBottom: 40 }}>
            <div>
              <span className="mono" style={{ fontSize: 10, color: 'var(--orange)', letterSpacing: '0.15em' }}>Participant Portal</span>
              <h1 style={{ fontFamily: 'Anton', fontSize: 'clamp(36px, 5vw, 56px)', lineHeight: 1, marginTop: 8 }}>
                Hey, <span style={{ color: 'var(--orange)' }}>{profile?.full_name || user.user_metadata?.name || 'Fest User'}</span>
              </h1>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <Link href="/register?type=competition" className="btn btn-solid" style={{ fontSize: 12, padding: '12px 20px' }}>Register Competition</Link>
              {!volunteer && (
                <Link href="/register?type=volunteer" className="btn btn-outline" style={{ fontSize: 12, padding: '12px 20px', borderColor: 'var(--purple)', color: 'var(--purple)' }}>Apply Volunteer</Link>
              )}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 30, alignItems: 'start' }}>
            
            {/* Left Column: Profile Summary */}
            <div className="register-card comp" style={{ marginTop: 0, padding: '24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
              <h3 className="bebas" style={{ fontSize: 20, borderBottom: '1px solid var(--line)', paddingBottom: 10, color: 'var(--orange)' }}>Your Profile</h3>
              
              {profile ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: 13 }}>
                  <div>
                    <div style={{ color: 'rgba(247,247,247,0.4)', fontSize: 10, fontFamily: 'Space Mono, monospace', textTransform: 'uppercase' }}>Full Name</div>
                    <div style={{ fontWeight: 600, marginTop: 2 }}>{profile.full_name}</div>
                  </div>
                  <div>
                    <div style={{ color: 'rgba(247,247,247,0.4)', fontSize: 10, fontFamily: 'Space Mono, monospace', textTransform: 'uppercase' }}>WhatsApp Number</div>
                    <div style={{ fontWeight: 600, marginTop: 2 }}>{profile.whatsapp_number}</div>
                  </div>
                  <div>
                    <div style={{ color: 'rgba(247,247,247,0.4)', fontSize: 10, fontFamily: 'Space Mono, monospace', textTransform: 'uppercase' }}>Email Address</div>
                    <div style={{ fontWeight: 600, marginTop: 2, wordBreak: 'break-all' }}>{profile.email}</div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <div>
                      <div style={{ color: 'rgba(247,247,247,0.4)', fontSize: 10, fontFamily: 'Space Mono, monospace', textTransform: 'uppercase' }}>Age</div>
                      <div style={{ fontWeight: 600, marginTop: 2 }}>{profile.age} Yrs</div>
                    </div>
                    <div>
                      <div style={{ color: 'rgba(247,247,247,0.4)', fontSize: 10, fontFamily: 'Space Mono, monospace', textTransform: 'uppercase' }}>Stream</div>
                      <div style={{ fontWeight: 600, marginTop: 2 }}>{profile.stream}</div>
                    </div>
                  </div>
                  <div>
                    <div style={{ color: 'rgba(247,247,247,0.4)', fontSize: 10, fontFamily: 'Space Mono, monospace', textTransform: 'uppercase' }}>College / Institution</div>
                    <div style={{ fontWeight: 600, marginTop: 2 }}>{profile.college}</div>
                  </div>
                  
                  <Link href="/register" className="btn btn-ghost" style={{ fontSize: 10, padding: '10px', textAlign: 'center', marginTop: 10 }}>Update Info</Link>
                </div>
              ) : (
                <div style={{ fontSize: 13, color: 'rgba(247,247,247,0.5)', textAlign: 'center', padding: '20px 0' }}>
                  <p>No profile details found yet.</p>
                  <Link href="/register" className="btn btn-solid" style={{ fontSize: 11, padding: '10px 18px', marginTop: 14 }}>Complete Registration</Link>
                </div>
              )}
            </div>

            {/* Right Column: Applications list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 30 }}>
              
              {/* Competition registrations */}
              <div className="register-card comp" style={{ marginTop: 0, padding: '28px' }}>
                <h3 className="bebas" style={{ fontSize: 22, color: 'var(--orange)', marginBottom: 20, display: 'flex', justifyItems: 'center', justifyContent: 'space-between' }}>
                  <span>Registered Competitions</span>
                  <span className="mono" style={{ fontSize: 11, color: 'rgba(247,247,247,0.4)' }}>({competitions.length})</span>
                </h3>

                {competitions.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {competitions.map((comp) => (
                      <div key={comp.id} style={{
                        background: 'rgba(13,13,15,0.4)',
                        border: '1px solid var(--line)',
                        borderRadius: 8,
                        padding: 18,
                        position: 'relative'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10 }}>
                          <div>
                            <h4 style={{ fontFamily: 'Anton', fontSize: 18, letterSpacing: '0.02em', textTransform: 'uppercase' }}>{comp.competition_name}</h4>
                            <span style={{ fontSize: 11, color: 'rgba(247,247,247,0.4)', display: 'block', marginTop: 4 }}>
                              Registered on {new Date(comp.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          
                          <span className={`status-badge ${getStatusClass(comp.status)}`}>
                            {comp.status}
                          </span>
                        </div>

                        {comp.audition_slot && (
                          <div style={{
                            marginTop: 14,
                            background: 'rgba(198,255,0,0.06)',
                            border: '1px solid rgba(198,255,0,0.2)',
                            borderRadius: 6,
                            padding: '10px 14px',
                            fontSize: 12,
                            color: 'rgba(247,247,247,0.85)'
                          }}>
                            <strong>Audition Slot Assigned:</strong> {comp.audition_slot}
                          </div>
                        )}

                        <div style={{ marginTop: 12, fontSize: 13, color: 'rgba(247,247,247,0.6)' }}>
                          <strong>Performance Details:</strong>
                          <p style={{ marginTop: 4, fontStyle: 'italic', lineHeight: 1.5, fontSize: 12 }}>{comp.performance_details}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '30px 20px', background: 'rgba(13,13,15,0.3)', border: '1px dashed var(--line)', borderRadius: 8 }}>
                    <p style={{ fontSize: 14, color: 'rgba(247,247,247,0.4)', marginBottom: 18 }}>You haven't registered for any competitions yet.</p>
                    <Link href="/register?type=competition" className="btn btn-solid" style={{ fontSize: 12, padding: '12px 24px' }}>Register For Competition</Link>
                  </div>
                )}
              </div>

              {/* Volunteer application */}
              <div className="register-card vol" style={{ marginTop: 0, padding: '28px' }}>
                <h3 className="bebas" style={{ fontSize: 22, color: 'var(--purple)', marginBottom: 20 }}>Volunteer Application</h3>

                {volunteer ? (
                  <div style={{
                    background: 'rgba(13,13,15,0.4)',
                    border: '1px solid var(--line)',
                    borderRadius: 8,
                    padding: 18
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10, marginBottom: 14 }}>
                      <div>
                        <h4 style={{ fontFamily: 'Anton', fontSize: 18, letterSpacing: '0.02em', textTransform: 'uppercase' }}>Volunteer Candidate</h4>
                        <span style={{ fontSize: 11, color: 'rgba(247,247,247,0.4)', display: 'block', marginTop: 4 }}>
                          Submitted on {new Date(volunteer.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      
                      <span className={`status-badge ${getStatusClass(volunteer.status)}`}>
                        {volunteer.status}
                      </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, fontSize: 12, borderTop: '1px solid var(--line)', paddingTop: 12, color: 'rgba(247,247,247,0.7)' }}>
                      <div><strong>Gender:</strong> {volunteer.gender}</div>
                      <div><strong>City:</strong> {volunteer.city}</div>
                      <div><strong>Languages:</strong> {volunteer.languages}</div>
                      <div><strong>Instagram:</strong> {volunteer.instagram_id || 'Not provided'}</div>
                    </div>

                    <div style={{ marginTop: 12, fontSize: 13, color: 'rgba(247,247,247,0.6)' }}>
                      <strong>Why Volunteer:</strong>
                      <p style={{ marginTop: 4, fontStyle: 'italic', lineHeight: 1.5, fontSize: 12 }}>{volunteer.why_volunteer}</p>
                    </div>
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '30px 20px', background: 'rgba(13,13,15,0.3)', border: '1px dashed var(--line)', borderRadius: 8 }}>
                    <p style={{ fontSize: 14, color: 'rgba(247,247,247,0.4)', marginBottom: 18 }}>Be part of the heartbeat of AYF 2026. Join as a volunteer!</p>
                    <Link href="/register?type=volunteer" className="btn btn-solid" style={{ fontSize: 12, padding: '12px 24px', background: 'var(--purple)', borderColor: 'var(--purple)' }}>Apply as Volunteer</Link>
                  </div>
                )}
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* Embedded CSS for dashboard badges */}
      <style jsx global>{`
        .status-badge {
          display: inline-block;
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          padding: 6px 12px;
          border-radius: 4px;
          border: 1px solid transparent;
        }
        .status-pending {
          background: rgba(255, 184, 0, 0.1);
          color: var(--orange);
          border-color: rgba(255, 184, 0, 0.2);
        }
        .status-slot {
          background: rgba(198, 255, 0, 0.1);
          color: var(--lime);
          border-color: rgba(198, 255, 0, 0.25);
        }
        .status-confirmed {
          background: rgba(0, 224, 209, 0.1);
          color: var(--teal);
          border-color: rgba(0, 224, 209, 0.25);
        }
        .status-failed {
          background: rgba(255, 46, 138, 0.1);
          color: var(--pink);
          border-color: rgba(255, 46, 138, 0.25);
        }
      `}</style>
    </main>
  );
}
