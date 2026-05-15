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
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  // ── États des champs ──────────────────────────────────
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  // ── États UI ──────────────────────────────────────────
  const [errors, setErrors]       = useState<Record<string, string>>({});
  const [loading, setLoading]     = useState(false);
  const [showPass, setShowPass]   = useState(false);
  const [showPass2, setShowPass2] = useState(false);
  const [success, setSuccess]     = useState(false);

  // ── Vérifier si déjà connecté ────────────────────────
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.push("/dashboard");
    }
  }, [router]);

  // ── Gestion des champs ────────────────────────────────
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  // ── Validation frontend ───────────────────────────────
  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!form.name.trim())
      newErrors.name = "Le prénom est obligatoire.";

    if (!form.email.trim())
      newErrors.email = "L'email est obligatoire.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      newErrors.email = "Format d'email invalide.";

    if (!form.password)
      newErrors.password = "Le mot de passe est obligatoire.";
    else if (form.password.length < 8)
      newErrors.password = "Minimum 8 caractères.";

    if (!form.password_confirmation)
      newErrors.password_confirmation = "Veuillez confirmer le mot de passe.";
    else if (form.password !== form.password_confirmation)
      newErrors.password_confirmation = "Les mots de passe ne correspondent pas.";

    return newErrors;
  };

  // ── Soumission du formulaire ──────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.errors) {
          const backendErrors: Record<string, string> = {};
          for (const key in data.errors) {
            backendErrors[key] = data.errors[key][0];
          }
          setErrors(backendErrors);
        } else {
          setErrors({ general: data.message || "Une erreur est survenue." });
        }
        return;
      }

      // ── Succès ────────────────────────────────────────
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setSuccess(true);

      setTimeout(() => router.push("/dashboard"), 2000);

    } catch {
      setErrors({ general: "Impossible de contacter le serveur." });
    } finally {
      setLoading(false);
    }
  };

<<<<<<< HEAD
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
=======
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-8">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🤟</div>
          <h1 className="text-2xl font-bold text-gray-800">Yaatal Jokko</h1>
          <p className="text-gray-500 mt-1">Créer votre compte apprenant</p>
        </div>

        {/* Message succès */}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl p-4 mb-6 text-center">
            ✅ Compte créé avec succès ! Redirection en cours...
          </div>
        )}

        {/* Erreur générale */}
        {errors.general && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-6">
            ⚠️ {errors.general}
          </div>
        )}

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Prénom */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              👤 Prénom
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Votre prénom"
              className={`w-full border rounded-xl px-4 py-3 text-sm outline-none transition
                ${errors.name
                  ? "border-red-400 bg-red-50"
                  : "border-gray-300 focus:border-indigo-500"}`}
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">⚠️ {errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              📧 Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="votre@email.com"
              className={`w-full border rounded-xl px-4 py-3 text-sm outline-none transition
                ${errors.email
                  ? "border-red-400 bg-red-50"
                  : "border-gray-300 focus:border-indigo-500"}`}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">⚠️ {errors.email}</p>
            )}
          </div>

          {/* Mot de passe */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              🔒 Mot de passe
            </label>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Minimum 8 caractères"
                className={`w-full border rounded-xl px-4 py-3 text-sm outline-none transition pr-12
                  ${errors.password
                    ? "border-red-400 bg-red-50"
                    : "border-gray-300 focus:border-indigo-500"}`}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                {showPass ? "🙈" : "👁️"}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">⚠️ {errors.password}</p>
            )}
          </div>

          {/* Confirmation mot de passe */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              🔒 Confirmer le mot de passe
            </label>
            <div className="relative">
              <input
                type={showPass2 ? "text" : "password"}
                name="password_confirmation"
                value={form.password_confirmation}
                onChange={handleChange}
                placeholder="Répétez le mot de passe"
                className={`w-full border rounded-xl px-4 py-3 text-sm outline-none transition pr-12
                  ${errors.password_confirmation
                    ? "border-red-400 bg-red-50"
                    : "border-gray-300 focus:border-indigo-500"}`}
              />
              <button
                type="button"
                onClick={() => setShowPass2(!showPass2)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                {showPass2 ? "🙈" : "👁️"}
              </button>
            </div>
            {errors.password_confirmation && (
              <p className="text-red-500 text-xs mt-1">⚠️ {errors.password_confirmation}</p>
            )}
          </div>

          {/* Bouton submit */}
          <button
            type="submit"
            disabled={loading || success}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300
              text-white font-semibold rounded-xl py-3 transition text-sm"
          >
            {loading ? "⏳ Inscription en cours..." : "🤟 S'inscrire sur Yaatal Jokko"}
          </button>

        </form>

        {/* Lien login */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Déjà un compte ?{" "}
          <a href="/login" className="text-indigo-600 hover:underline font-medium">
            Se connecter
          </a>
        </p>

>>>>>>> origin/main
      </div>
    </div>
  );
}
