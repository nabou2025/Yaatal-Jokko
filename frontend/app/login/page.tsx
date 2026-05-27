'use client';

import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { Hand, CheckCircle, AlertTriangle, Eye, EyeOff } from 'lucide-react';

interface FormData {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

const SLIDES = [
  { src: '/images/sign1.jpg', caption: 'Communiquez avec vos mains' },
  { src: '/images/sign2.jpg', caption: 'Apprenez à votre rythme' },
  { src: '/images/sign3.jpg', caption: 'Rejoignez notre communauté' },
];

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const registered = searchParams?.get('registered');

  const [form, setForm] = useState<FormData>({ email: '', password: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [success, setSuccess] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slideVisible, setSlideVisible] = useState(true);

  // ── Vérifier si déjà connecté ────────────────────────
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (user.role === 'admin') {
  router.push('/admin');
} else {
  router.push('/dashboard');
}
    }
  }, [router]);

  // ── Slideshow ─────────────────────────────────────────
  useEffect(() => {
    const interval = setInterval(() => {
      setSlideVisible(false);
      setTimeout(() => {
        setCurrentSlide(prev => (prev + 1) % SLIDES.length);
        setSlideVisible(true);
      }, 600);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) setErrors(prev => ({ ...prev, [name]: undefined }));
  }

  function validate(): FormErrors {
    const errs: FormErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email.trim()) errs.email = "L'email est obligatoire.";
    else if (!emailRegex.test(form.email)) errs.email = "Format d'email invalide.";
    if (!form.password) errs.password = 'Le mot de passe est obligatoire.';
    return errs;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        if (data.errors) {
          const backendErrors: FormErrors = {};
          if (data.errors.email) backendErrors.email = data.errors.email[0];
          if (data.errors.password) backendErrors.password = data.errors.password[0];
          setErrors(backendErrors);
        } else {
          setErrors({ general: data.message || 'Identifiants incorrects.' });
        }
        return;
      }

      // Succès
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setSuccess(true);

      setTimeout(() => {
        if (data.user.role === 'admin') {
          router.push('/admin/dashboard');
        } else {
          router.push('/dashboard');
        }
      }, 1200);
    } catch {
      setErrors({ general: 'Impossible de contacter le serveur. Vérifiez votre connexion.' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ backgroundColor: '#F9E8E4', minHeight: '100vh', fontFamily: "'Nunito', sans-serif", display: 'flex' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@1,700&family=Nunito:wght@400;600;700;800&family=Dancing+Script:wght@700&display=swap');

        .field-input {
          width: 100%;
          padding: 12px 16px;
          border-radius: 12px;
          border: 2px solid rgba(232,168,152,0.3);
          background: #FFFFFF;
          font-size: 14px;
          font-family: 'Nunito', sans-serif;
          color: #2D3561;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .field-input:focus {
          border-color: #E8A898;
          box-shadow: 0 0 0 4px rgba(232,168,152,0.15);
        }
        .field-input.has-error {
          border-color: #e85555;
          background: #fff5f5;
        }
        .field-input::placeholder { color: rgba(45,53,97,0.3); }

        .btn-submit {
          width: 100%;
          padding: 14px;
          border-radius: 12px;
          border: none;
          background: #2D3561;
          color: white;
          font-size: 15px;
          font-weight: 800;
          font-family: 'Nunito', sans-serif;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 6px 20px rgba(45,53,97,0.25);
        }
        .btn-submit:hover:not(:disabled) {
          transform: translateY(-2px);
          background: #E8A898;
          box-shadow: 0 10px 28px rgba(232,168,152,0.4);
        }
        .btn-submit:disabled { opacity: 0.6; cursor: not-allowed; }

        .slide-img {
          transition: opacity 0.6s ease, transform 0.6s ease;
        }
        .slide-img.visible { opacity: 1; transform: scale(1); }
        .slide-img.hidden { opacity: 0; transform: scale(1.04); }

        .dot {
          width: 8px; height: 8px;
          border-radius: 50%;
          background: rgba(255,255,255,0.4);
          transition: all 0.3s ease;
          cursor: pointer;
          border: none;
        }
        .dot.active { background: white; width: 24px; border-radius: 4px; }

        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }

        .pass-eye {
          position: absolute; right: 12px; top: 50%;
          transform: translateY(-50%);
          background: none; border: none;
          cursor: pointer; font-size: 16px;
          color: #E8A898; padding: 4px;
        }

        @media (max-width: 768px) {
          .left-panel { display: none !important; }
          .right-panel { width: 100% !important; }
        }
      `}</style>

      {/* GAUCHE — Slideshow */}
      <div className="left-panel" style={{ width: '50%', position: 'relative', overflow: 'hidden', minHeight: '100vh' }}>
        <div className={`slide-img ${slideVisible ? 'visible' : 'hidden'}`} style={{ position: 'absolute', inset: 0 }}>
          <Image
            src={SLIDES[currentSlide].src}
            alt={SLIDES[currentSlide].caption}
            fill
            style={{ objectFit: 'cover', objectPosition: 'center top' }}
            priority
          />
        </div>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(45,53,97,0.2) 0%, rgba(45,53,97,0.6) 100%)', zIndex: 2 }} />
        <div style={{ position: 'absolute', inset: 0, zIndex: 3, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '36px' }}>
          <div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, color: 'white', fontStyle: 'italic', margin: 0 }}>Yaatal Jokko</h2>
            <p style={{ fontFamily: "'Dancing Script', cursive", color: '#F9E8E4', fontSize: 16, margin: '4px 0 0', opacity: 0.9 }}>When hands speak</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <p style={{ color: 'white', fontSize: 20, fontWeight: 700, margin: 0 }}>{SLIDES[currentSlide].caption}</p>
            <div style={{ display: 'flex', gap: 8 }}>
              {SLIDES.map((_, i) => (
                <button key={i} className={`dot ${i === currentSlide ? 'active' : ''}`} onClick={() => setCurrentSlide(i)} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* DROITE — Formulaire */}
      <div className="right-panel" style={{ width: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 24px', overflowY: 'auto' }}>
        <div style={{ width: '100%', maxWidth: 420 }}>
          <div style={{ marginBottom: 28, textAlign: 'center' }}>
            <div style={{ marginBottom: 10, display: 'flex', justifyContent: 'center' }}><Hand size={40} color="#2D3561" /></div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, color: '#2D3561', fontStyle: 'italic', margin: 0 }}>Connexion</h1>
            <p style={{ color: 'rgba(45,53,97,0.55)', fontSize: 14, marginTop: 6, fontWeight: 600 }}>Accédez à votre espace d&apos;apprentissage</p>
          </div>

          {registered && (
            <div style={{ background: '#e7f7ee', border: '1.5px solid #b6e3c6', color: '#1f7a3a', borderRadius: 12, padding: '12px 16px', fontSize: 13, marginBottom: 16, fontWeight: 600 }}>
              <CheckCircle size={14} style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: 6 }} /> Votre compte a été créé. Vous pouvez maintenant vous connecter.
            </div>
          )}

          {success && (
            <div style={{ background: '#e7f7ee', border: '1.5px solid #b6e3c6', color: '#1f7a3a', borderRadius: 12, padding: '12px 16px', fontSize: 13, marginBottom: 16, fontWeight: 600 }}>
              <CheckCircle size={14} style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: 6 }} /> Connexion réussie ! Redirection en cours...
            </div>
          )}

          {errors.general && (
            <div style={{ background: '#fff0f0', border: '1.5px solid #ffcccc', color: '#cc3333', borderRadius: 12, padding: '12px 16px', fontSize: 13, marginBottom: 20, fontWeight: 600 }}>
              <AlertTriangle size={14} style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: 6 }} /> {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#2D3561', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.8px' }}>Adresse email</label>
              <input name="email" type="email" autoComplete="email" value={form.email} onChange={handleChange} placeholder="votre@email.com" className={`field-input ${errors.email ? 'has-error' : ''}`} />
              {errors.email && <p style={{ color: '#e85555', fontSize: 12, marginTop: 4, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}><AlertTriangle size={12} />{errors.email}</p>}
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#2D3561', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.8px' }}>Mot de passe</label>
              <div style={{ position: 'relative' }}>
                <input name="password" type={showPass ? 'text' : 'password'} autoComplete="current-password" value={form.password} onChange={handleChange} placeholder="Votre mot de passe" className={`field-input ${errors.password ? 'has-error' : ''}`} style={{ paddingRight: 42 }} />
                <button type="button" className="pass-eye" onClick={() => setShowPass(!showPass)}>{showPass ? <EyeOff size={16} /> : <Eye size={16} />}</button>
              </div>
              {errors.password && <p style={{ color: '#e85555', fontSize: 12, marginTop: 4, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}><AlertTriangle size={12} />{errors.password}</p>}
            </div>

            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: 12, color: 'rgba(45,53,97,0.4)', fontWeight: 600 }}>Mot de passe oublié ? (bientôt disponible)</span>
            </div>

            <button type="submit" className="btn-submit" disabled={loading || success} style={{ marginTop: 8 }}>
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                  <svg className="spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <circle cx="12" cy="12" r="10" strokeOpacity="0.3" />
                    <path d="M12 2a10 10 0 0 1 10 10" />
                  </svg>
                  Connexion en cours...
                </span>
              ) : 'Se connecter'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: 'rgba(45,53,97,0.55)', fontWeight: 600 }}>
            Pas encore de compte ?{' '}
            <Link href="/register" style={{ color: '#E8A898', fontWeight: 800, textDecoration: 'none' }}>S&apos;inscrire</Link>
          </p>
          <p style={{ textAlign: 'center', marginTop: 8 }}>
            <Link href="/" style={{ color: 'rgba(45,53,97,0.4)', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>← Retour à l&apos;accueil</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
