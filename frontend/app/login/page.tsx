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
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  // ── États des champs ──────────────────────────────────
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  // ── États UI ──────────────────────────────────────────
  const [errors, setErrors]     = useState<Record<string, string>>({});
  const [loading, setLoading]   = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [success, setSuccess]   = useState(false);

  // ── Vérifier si déjà connecté ────────────────────────
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      if (user.role === "admin") {
        router.push("/admin/dashboard");
      } else {
        router.push("/dashboard");
      }
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

    if (!form.email.trim())
      newErrors.email = "L'email est obligatoire.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      newErrors.email = "Format d'email invalide.";

    if (!form.password)
      newErrors.password = "Le mot de passe est obligatoire.";

    return newErrors;
  };

  // ── Soumission du formulaire ──────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation frontend
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        // Erreurs venant du backend
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

      // Redirection selon le rôle
      setTimeout(() => {
        if (data.user.role === "admin") {
          router.push("/admin/dashboard");
        } else {
          router.push("/dashboard");
        }
      }, 1500);

    } catch {
      setErrors({ general: "Impossible de contacter le serveur. Vérifiez votre connexion." });
    } finally {
      setLoading(false);
    }
  };

<<<<<<< HEAD
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
=======
  // ── Interface ─────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-8">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🤟</div>
          <h1 className="text-2xl font-bold text-gray-800">Yaatal Jokko</h1>
          <p className="text-gray-500 mt-1">Connectez-vous à votre compte</p>
        </div>

        {/* Message succès */}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl p-4 mb-6 text-center">
            ✅ Connexion réussie ! Redirection en cours...
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
                placeholder="Votre mot de passe"
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

          {/* Mot de passe oublié */}
          <div className="text-right">
            <span className="text-xs text-indigo-400 cursor-not-allowed">
              Mot de passe oublié ? (bientôt disponible)
            </span>
          </div>

          {/* Bouton submit */}
          <button
            type="submit"
            disabled={loading || success}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300
              text-white font-semibold rounded-xl py-3 transition text-sm"
          >
            {loading ? "⏳ Connexion en cours..." : "🤟 Se connecter sur Yaatal Jokko"}
          </button>

        </form>

        {/* Lien register */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Pas encore de compte ?{" "}
          <a href="/register" className="text-indigo-600 hover:underline font-medium">
            S'inscrire gratuitement
          </a>
        </p>

>>>>>>> origin/main
      </div>
    </div>
  );
}
