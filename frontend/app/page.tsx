'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Hand, BookOpen, Pencil, TrendingUp } from 'lucide-react';

export default function SplashPage() {
  const router = useRouter();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 100);
  }, []);

  return (
    <main style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden', fontFamily: "'Nunito', sans-serif" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&family=Nunito:wght@400;600;700;800&family=Dancing+Script:wght@700&display=swap');

        .fade-up { opacity: 0; transform: translateY(30px); transition: opacity 0.9s ease, transform 0.9s ease; }
        .fade-up.visible { opacity: 1; transform: translateY(0); }
        .d1 { transition-delay: 0.2s; }
        .d2 { transition-delay: 0.4s; }
        .d3 { transition-delay: 0.6s; }
        .d4 { transition-delay: 0.8s; }
        .d5 { transition-delay: 1s; }

        .btn-main {
          background: #2D3561;
          color: white;
          border: none;
          padding: 18px 56px;
          border-radius: 50px;
          font-size: 18px;
          font-weight: 800;
          font-family: 'Nunito', sans-serif;
          cursor: pointer;
          box-shadow: 0 8px 32px rgba(45,53,97,0.4);
          transition: all 0.3s ease;
          letter-spacing: 0.5px;
        }
        .btn-main:hover {
          transform: translateY(-4px) scale(1.04);
          box-shadow: 0 16px 48px rgba(45,53,97,0.5);
          background: #E8A898;
        }

        .btn-secondary {
          background: rgba(255,255,255,0.2);
          color: white;
          border: 2px solid rgba(255,255,255,0.5);
          padding: 14px 40px;
          border-radius: 50px;
          font-size: 15px;
          font-weight: 700;
          font-family: 'Nunito', sans-serif;
          cursor: pointer;
          backdrop-filter: blur(8px);
          transition: all 0.3s ease;
        }
        .btn-secondary:hover {
          background: rgba(255,255,255,0.35);
          transform: translateY(-2px);
        }

        .feature-pill {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(255,255,255,0.15);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.3);
          border-radius: 50px;
          padding: 10px 20px;
          color: white;
          font-size: 14px;
          font-weight: 700;
        }
      `}</style>

      {/* Image de fond couvre toute la page */}
      <Image
        src="/images/splash-bg.jpg"
        alt="Yaatal Jokko"
        fill
        style={{ objectFit: 'cover', objectPosition: 'center' }}
        priority
      />

      {/* Overlay dégradé pour lisibilité */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(135deg, rgba(45,53,97,0.75) 0%, rgba(45,53,97,0.5) 50%, rgba(232,168,152,0.3) 100%)'
      }} />

      {/* Contenu centré */}
      <div style={{
        position: 'relative', zIndex: 10,
        minHeight: '100vh',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'space-between',
        padding: '40px 24px'
      }}>

        {/* Logo top */}
        <div className={`fade-up d1 ${visible ? 'visible' : ''}`}>
          <span style={{
            fontFamily: "'Nunito', sans-serif",
            fontSize: 14, color: 'rgba(255,255,255,0.8)',
            letterSpacing: 5, textTransform: 'uppercase', fontWeight: 700
          }}>
            <Hand size={14} color="rgba(255,255,255,0.8)" style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6 }} /> Langue des Signes
          </span>
        </div>

        {/* Titre principal */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, textAlign: 'center' }}>
          <div className={`fade-up d2 ${visible ? 'visible' : ''}`}>
            <h1 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(52px, 12vw, 88px)',
              color: 'white',
              lineHeight: 1,
              fontWeight: 700,
              letterSpacing: '-2px',
              textShadow: '0 4px 20px rgba(0,0,0,0.3)',
              margin: 0
            }}>
              YAATAL<br />JOKKO
            </h1>
          </div>

          <div className={`fade-up d3 ${visible ? 'visible' : ''}`}>
            <p style={{
              fontFamily: "'Dancing Script', cursive",
              fontSize: 28, color: '#F9E8E4',
              margin: 0, textShadow: '0 2px 10px rgba(0,0,0,0.2)'
            }}>
              When hands speak
            </p>
          </div>

          <div className={`fade-up d3 ${visible ? 'visible' : ''}`}>
            <p style={{
              color: 'rgba(255,255,255,0.8)', fontSize: 16,
              maxWidth: 380, lineHeight: 1.7, fontWeight: 600, margin: 0
            }}>
              Apprenez la langue des signes de façon interactive,
              à votre rythme, avec des leçons adaptées à tous.
            </p>
          </div>

          {/* Features */}
          <div className={`fade-up d4 ${visible ? 'visible' : ''}`} style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center', marginTop: 8 }}>
            {[
              { Icon: BookOpen, label: 'Leçons structurées' },
              { Icon: Pencil, label: 'Exercices interactifs' },
              { Icon: TrendingUp, label: 'Suivi progression' },
            ].map(f => (
              <div key={f.label} className="feature-pill">
                <f.Icon size={18} color="white" />
                {f.label}
              </div>
            ))}
          </div>
        </div>

        {/* Boutons bas */}
        <div className={`fade-up d5 ${visible ? 'visible' : ''}`} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
          <button className="btn-main" onClick={() => router.push('/register')}>
            Commencer l&apos;aventure →
          </button>
          <button className="btn-secondary" onClick={() => router.push('/login')}>
            J&apos;ai déjà un compte — Se connecter
          </button>
        </div>

      </div>
    </main>
  );
}