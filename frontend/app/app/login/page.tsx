'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { auth } from '../../lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handle = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const res = await auth.login(form.email, form.password);
      auth.saveToken(res.token);
      router.push('/dashboard');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Identifiants incorrects');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      {/* Left panel */}
      <div className="auth-panel-left">
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <Link href="/" style={{ display: 'inline-block', marginBottom: 48 }}>
            <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 32, fontWeight: 900, color: 'var(--white)' }}>
              Yaatal <span style={{ color: 'var(--ocre-light)' }}>Jokko</span>
            </div>
          </Link>
          <div style={{ fontSize: 80, marginBottom: 24 }}>🤟</div>
          <h2 style={{ fontSize: 28, color: 'var(--white)', marginBottom: 16 }}>
            Bienvenue de retour
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 16, lineHeight: 1.7, maxWidth: 320 }}>
            Continue ton apprentissage là où tu t'étais arrêté·e. Chaque signe appris est un pont vers une nouvelle connexion.
          </p>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 48 }}>
            {['🤲', '👋', '✌️', '🤞'].map((e, i) => (
              <div key={i} style={{
                width: 52, height: 52, borderRadius: 14,
                background: 'rgba(255,255,255,0.07)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24,
              }}>{e}</div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="auth-panel-right">
        <div className="auth-form animate-up">
          <h1 className="auth-title">Connexion</h1>
          <p className="auth-sub">Accède à ton espace d'apprentissage</p>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={submit}>
            <div className="form-group">
              <label className="label">Adresse email</label>
              <input
                className="input-field"
                type="email" name="email"
                placeholder="toi@exemple.com"
                value={form.email} onChange={handle} required
              />
            </div>
            <div className="form-group">
              <label className="label">Mot de passe</label>
              <input
                className="input-field"
                type="password" name="password"
                placeholder="••••••••"
                value={form.password} onChange={handle} required
              />
            </div>

            <button
              className="btn btn-primary"
              type="submit" disabled={loading}
              style={{ width: '100%', justifyContent: 'center', fontSize: 16, padding: '14px', marginTop: 8 }}
            >
              {loading ? 'Connexion...' : 'Se connecter →'}
            </button>
          </form>

          <div className="auth-divider">— ou —</div>

          <p style={{ textAlign: 'center', fontSize: 14, color: 'var(--gray)' }}>
            Pas encore de compte ?{' '}
            <Link href="/register" style={{ color: 'var(--ocre)', fontWeight: 600 }}>S'inscrire</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
