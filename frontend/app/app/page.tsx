'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { auth } from '../lib/api';

export default function HomePage() {
  const [logged, setLogged] = useState(false);
  useEffect(() => { setLogged(auth.isLoggedIn()); }, []);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--white)' }}>
      {/* NAVBAR */}
      <nav className="navbar">
        <div className="nav-logo">Yaatal <span>Jokko</span></div>
        <div className="nav-links">
          <Link href="/signs" className="nav-link">Signes</Link>
          <Link href="/lessons" className="nav-link">Leçons</Link>
          {logged ? (
            <Link href="/dashboard" className="btn btn-primary" style={{ padding: '8px 18px', fontSize: 14 }}>Mon espace</Link>
          ) : (
            <>
              <Link href="/login" className="nav-link">Connexion</Link>
              <Link href="/register" className="btn btn-primary" style={{ padding: '8px 18px', fontSize: 14 }}>S'inscrire</Link>
            </>
          )}
        </div>
      </nav>

      {/* HERO */}
      <section style={{
        minHeight: '90vh', display: 'flex', alignItems: 'center',
        background: 'var(--charcoal)', position: 'relative', overflow: 'hidden',
        padding: '80px 24px',
      }}>
        {/* Decorative blobs */}
        <div style={{
          position: 'absolute', width: 600, height: 600,
          borderRadius: '50%', background: 'radial-gradient(circle, rgba(200,120,42,0.18) 0%, transparent 70%)',
          top: '-100px', right: '-100px',
        }} />
        <div style={{
          position: 'absolute', width: 400, height: 400,
          borderRadius: '50%', background: 'radial-gradient(circle, rgba(45,80,22,0.2) 0%, transparent 70%)',
          bottom: '-80px', left: '-80px',
        }} />

        {/* Pattern grid */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.03,
          backgroundImage: 'repeating-linear-gradient(0deg, var(--white) 0px, var(--white) 1px, transparent 1px, transparent 48px), repeating-linear-gradient(90deg, var(--white) 0px, var(--white) 1px, transparent 1px, transparent 48px)',
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>
          <div>
            <div className="badge badge-ocre animate-up" style={{ marginBottom: 24 }}>
              🌍 Plateforme éducative sénégalaise
            </div>
            <h1 className="animate-up delay-1" style={{ fontSize: 'clamp(40px, 6vw, 70px)', color: 'var(--white)', lineHeight: 1.1, marginBottom: 24 }}>
              Apprends la<br /><span style={{ color: 'var(--ocre-light)' }}>langue</span><br />des signes
            </h1>
            <p className="animate-up delay-2" style={{ fontSize: 18, color: 'rgba(255,255,255,0.65)', marginBottom: 40, maxWidth: 480, lineHeight: 1.7 }}>
              Yaatal Jokko — «&nbsp;Développer le dialogue&nbsp;» — une plateforme interactive pour apprendre la langue des signes à travers des leçons, vidéos et exercices adaptés.
            </p>
            <div className="animate-up delay-3" style={{ display: 'flex', gap: 16 }}>
              <Link href="/register" className="btn btn-primary" style={{ fontSize: 16, padding: '14px 28px' }}>
                Commencer gratuitement →
              </Link>
              <Link href="/lessons" className="btn" style={{ fontSize: 16, padding: '14px 28px', background: 'rgba(255,255,255,0.08)', color: 'var(--white)', border: '1px solid rgba(255,255,255,0.15)' }}>
                Voir les leçons
              </Link>
            </div>
          </div>

          {/* Visual card */}
          <div className="animate-up delay-4" style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(200,120,42,0.3)',
              borderRadius: 24, padding: 32, width: '100%', maxWidth: 380,
            }}>
              {[
                { emoji: '🤟', label: 'Alphabet LSS', sub: '26 signes • Débutant', color: 'var(--ocre)' },
                { emoji: '📚', label: 'Vocabulaire quotidien', sub: '120+ mots • Intermédiaire', color: 'var(--forest-light)' },
                { emoji: '💬', label: 'Phrases complètes', sub: '40 phrases • Avancé', color: 'var(--terra-light)' },
              ].map((item, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 16,
                  padding: '16px 0', borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.07)' : 'none',
                }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: 12,
                    background: 'rgba(255,255,255,0.08)', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0,
                  }}>{item.emoji}</div>
                  <div>
                    <div style={{ color: 'var(--white)', fontWeight: 600, marginBottom: 2 }}>{item.label}</div>
                    <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13 }}>{item.sub}</div>
                  </div>
                  <div style={{ marginLeft: 'auto', width: 8, height: 8, borderRadius: '50%', background: item.color }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ padding: '80px 24px', background: 'var(--surface)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div className="badge badge-forest" style={{ marginBottom: 16 }}>Pourquoi Yaatal Jokko ?</div>
            <h2 className="section-title">Une approche <span>complète</span><br />de l'apprentissage</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 24 }}>
            {[
              { icon: '🎥', title: 'Vidéos immersives', desc: 'Chaque signe est accompagné d\'une vidéo claire pour apprendre les gestes avec précision.' },
              { icon: '🧩', title: 'Exercices interactifs', desc: 'Testez vos connaissances avec des exercices adaptés à votre niveau de progression.' },
              { icon: '📈', title: 'Suivi des progrès', desc: 'Visualisez votre avancement leçon par leçon et restez motivé tout au long de votre parcours.' },
              { icon: '👨‍👩‍👧', title: 'Adapté à tous', desc: 'Pour les apprenants, parents et enseignants — chaque rôle a son espace personnalisé.' },
            ].map((f, i) => (
              <div key={i} className="card" style={{ padding: 28 }}>
                <div style={{
                  width: 52, height: 52, borderRadius: 14,
                  background: 'var(--ocre-pale)', display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  fontSize: 26, marginBottom: 20,
                }}>{f.icon}</div>
                <h3 style={{ fontSize: 18, marginBottom: 10 }}>{f.title}</h3>
                <p style={{ fontSize: 14, color: 'var(--gray)', lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section style={{
        padding: '80px 24px',
        background: 'linear-gradient(135deg, var(--forest) 0%, var(--forest-light) 100%)',
      }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 48px)', color: 'var(--white)', marginBottom: 20 }}>
            Prêt·e à commencer ?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 18, marginBottom: 36 }}>
            Rejoins des centaines d'apprenants sur Yaatal Jokko.
          </p>
          <Link href="/register" className="btn btn-primary" style={{ fontSize: 16, padding: '16px 36px' }}>
            Créer mon compte →
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: 'var(--charcoal)', padding: '32px 24px', textAlign: 'center' }}>
        <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>
          © 2025 Yaatal Jokko — Tous droits réservés
        </div>
      </footer>
    </div>
  );
}
