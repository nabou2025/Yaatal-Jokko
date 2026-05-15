'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { auth } from '../../lib/api';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '', password_confirmation: '', role: 'learner' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handle = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setLoading(true);
    if (form.password !== form.password_confirmation) {
      setError('Les mots de passe ne correspondent pas.'); setLoading(false); return;
    }
    try {
      const res = await auth.register(form.name, form.email, form.password, form.password_confirmation, form.role);
      auth.saveToken(res.token);
      router.push('/dashboard');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'inscription');
    } finally {
      setLoading(false);
    }
  };

  const roles = [
    { value: 'learner', label: '🎓 Apprenant·e', desc: 'Je veux apprendre la langue des signes' },
    { value: 'teacher', label: '📖 Enseignant·e', desc: 'Je crée et gère des contenus pédagogiques' },
    { value: 'parent', label: '👨‍👩‍👧 Parent', desc: 'Je suis le progrès de mon enfant' },
  ];

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
          <div style={{ fontSize: 80, marginBottom: 24 }}>✨</div>
          <h2 style={{ fontSize: 28, color: 'var(--white)', marginBottom: 16 }}>
            Rejoins la communauté
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 16, lineHeight: 1.7, maxWidth: 320 }}>
            Des centaines d'apprenants utilisent Yaatal Jokko pour briser les barrières de la communication.
          </p>
          <div style={{ marginTop: 48, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {['✅ Accès à toutes les leçons', '✅ Exercices interactifs', '✅ Suivi de progression', '✅ Gratuit pour commencer'].map((item, i) => (
              <div key={i} style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>{item}</div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="auth-panel-right" style={{ overflowY: 'auto', padding: '32px 48px' }}>
        <div className="auth-form animate-up">
          <h1 className="auth-title">Créer un compte</h1>
          <p className="auth-sub">C'est gratuit et rapide !</p>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={submit}>
            <div className="form-group">
              <label className="label">Nom complet</label>
              <input className="input-field" name="name" placeholder="Votre nom" value={form.name} onChange={handle} required />
            </div>
            <div className="form-group">
              <label className="label">Email</label>
              <input className="input-field" type="email" name="email" placeholder="toi@exemple.com" value={form.email} onChange={handle} required />
            </div>
            <div className="form-group">
              <label className="label">Mot de passe</label>
              <input className="input-field" type="password" name="password" placeholder="Min. 8 caractères" value={form.password} onChange={handle} required />
            </div>
            <div className="form-group">
              <label className="label">Confirmer le mot de passe</label>
              <input className="input-field" type="password" name="password_confirmation" placeholder="••••••••" value={form.password_confirmation} onChange={handle} required />
            </div>

            {/* Role selector */}
            <div className="form-group">
              <label className="label">Je suis...</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {roles.map(r => (
                  <label key={r.value} style={{
                    display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px',
                    border: `2px solid ${form.role === r.value ? 'var(--ocre)' : 'var(--gray-light)'}`,
                    borderRadius: 'var(--radius)', cursor: 'pointer',
                    background: form.role === r.value ? 'var(--ocre-pale)' : 'transparent',
                    transition: 'all 0.2s',
                  }}>
                    <input type="radio" name="role" value={r.value} checked={form.role === r.value} onChange={handle} style={{ display: 'none' }} />
                    <span style={{ fontSize: 14, fontWeight: 600 }}>{r.label}</span>
                    <span style={{ fontSize: 12, color: 'var(--gray)', marginLeft: 'auto' }}>{r.desc}</span>
                  </label>
                ))}
              </div>
            </div>

            <button
              className="btn btn-primary"
              type="submit" disabled={loading}
              style={{ width: '100%', justifyContent: 'center', fontSize: 16, padding: '14px', marginTop: 8 }}
            >
              {loading ? 'Création...' : 'Créer mon compte →'}
            </button>
          </form>

          <div className="auth-divider">— ou —</div>
          <p style={{ textAlign: 'center', fontSize: 14, color: 'var(--gray)' }}>
            Déjà un compte ?{' '}
            <Link href="/login" style={{ color: 'var(--ocre)', fontWeight: 600 }}>Se connecter</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
