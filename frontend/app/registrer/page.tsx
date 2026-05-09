'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { registerUser } from '@/lib/api';

interface FormData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  password_confirmation?: string;
  general?: string;
}

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  // Validation côté client (règles Kanban)
  function validate(): FormErrors {
    const errs: FormErrors = {};

    if (!form.name.trim()) {
      errs.name = 'Le nom est requis.';
    }

    // ✅ Email format valide
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email.trim()) {
      errs.email = "L'email est requis.";
    } else if (!emailRegex.test(form.email)) {
      errs.email = 'Format email invalide.';
    }

    // ✅ Password minimum 8 caractères
    if (!form.password) {
      errs.password = 'Le mot de passe est requis.';
    } else if (form.password.length < 8) {
      errs.password = 'Le mot de passe doit contenir au moins 8 caractères.';
    }

    // ✅ password_confirmation identique au password
    if (!form.password_confirmation) {
      errs.password_confirmation = 'Veuillez confirmer votre mot de passe.';
    } else if (form.password !== form.password_confirmation) {
      errs.password_confirmation = 'Les mots de passe ne correspondent pas.';
    }

    return errs;
  }

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Effacer l'erreur du champ modifié
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
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
      // ✅ Appeler API register
      await registerUser(form);
      // ✅ Gérer réponse succès → Redirection vers login
      router.push('/login?registered=1');
    } catch (err: unknown) {
      // ✅ Gérer erreurs (email existant, etc.)
      const apiError = err as { errors?: Record<string, string[]>; message?: string };
      if (apiError?.errors) {
        const apiErrs: FormErrors = {};
        if (apiError.errors.name) apiErrs.name = apiError.errors.name[0];
        if (apiError.errors.email) apiErrs.email = apiError.errors.email[0];
        if (apiError.errors.password) apiErrs.password = apiError.errors.password[0];
        setErrors(apiErrs);
      } else {
        setErrors({ general: apiError?.message || 'Une erreur est survenue. Réessayez.' });
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#f5f7fa] flex items-center justify-center px-4 py-12">
      {/* Left branding panel — visible md+ */}
      <div className="hidden md:flex flex-col justify-between w-[420px] min-h-[600px] bg-[#061a30] rounded-2xl p-10 mr-6 relative overflow-hidden">
        <div className="absolute bottom-[-80px] right-[-80px] w-[280px] h-[280px] rounded-full bg-[#0d6e56] opacity-20 blur-3xl pointer-events-none" />
        <div>
          <span className="font-serif text-2xl font-bold text-white tracking-tight">
            Yaatal <span className="text-[#1d9e75]">Jokko</span>
          </span>
          <p className="mt-3 text-white/50 text-sm leading-relaxed">
            Rejoignez notre communauté et commencez à apprendre la langue des signes dès aujourd&apos;hui.
          </p>
        </div>
        <ul className="flex flex-col gap-5">
          {[
            { icon: '🤟', text: 'Accès à toutes les leçons' },
            { icon: '✏️', text: 'Exercices interactifs inclus' },
            { icon: '📈', text: 'Suivi de votre progression' },
          ].map((item) => (
            <li key={item.text} className="flex items-center gap-3 text-white/70 text-sm">
              <span className="text-xl">{item.icon}</span>
              {item.text}
            </li>
          ))}
        </ul>
        <p className="text-white/20 text-xs">© {new Date().getFullYear()} Yaatal Jokko</p>
      </div>

      {/* Register form */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 md:p-10">
        {/* Logo mobile */}
        <div className="md:hidden mb-6 text-center">
          <span className="font-serif text-2xl font-bold text-[#061a30]">
            Yaatal <span className="text-[#1d9e75]">Jokko</span>
          </span>
        </div>

        <h1 className="text-2xl font-bold text-[#061a30] mb-1">Créer un compte</h1>
        <p className="text-gray-400 text-sm mb-7">
          Déjà inscrit ?{' '}
          <Link href="/login" className="text-[#1d9e75] hover:underline font-medium">
            Se connecter
          </Link>
        </p>

        {/* Erreur générale */}
        {errors.general && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg mb-5">
            {errors.general}
          </div>
        )}

        {/* ✅ Formulaire : name, email, password, password_confirmation */}
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
          {/* Nom */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="name" className="text-sm font-medium text-[#1a2d44]">
              Nom complet
            </label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Ex : Seynabou Diallo"
              className={`w-full px-4 py-2.5 text-sm border rounded-lg outline-none transition-colors focus:ring-2 focus:ring-[#1d9e75]/30 ${
                errors.name
                  ? 'border-red-400 bg-red-50 text-red-700 focus:border-red-400'
                  : 'border-gray-200 focus:border-[#1d9e75]'
              }`}
            />
            {/* ✅ Afficher erreurs sous chaque champ concerné */}
            {errors.name && (
              <p className="text-red-500 text-xs mt-0.5">{errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-sm font-medium text-[#1a2d44]">
              Adresse email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={handleChange}
              placeholder="votre@email.com"
              className={`w-full px-4 py-2.5 text-sm border rounded-lg outline-none transition-colors focus:ring-2 focus:ring-[#1d9e75]/30 ${
                errors.email
                  ? 'border-red-400 bg-red-50 text-red-700 focus:border-red-400'
                  : 'border-gray-200 focus:border-[#1d9e75]'
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-0.5">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-sm font-medium text-[#1a2d44]">
              Mot de passe
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              value={form.password}
              onChange={handleChange}
              placeholder="Minimum 8 caractères"
              className={`w-full px-4 py-2.5 text-sm border rounded-lg outline-none transition-colors focus:ring-2 focus:ring-[#1d9e75]/30 ${
                errors.password
                  ? 'border-red-400 bg-red-50 text-red-700 focus:border-red-400'
                  : 'border-gray-200 focus:border-[#1d9e75]'
              }`}
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-0.5">{errors.password}</p>
            )}
          </div>

          {/* Confirm password */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="password_confirmation" className="text-sm font-medium text-[#1a2d44]">
              Confirmer le mot de passe
            </label>
            <input
              id="password_confirmation"
              name="password_confirmation"
              type="password"
              autoComplete="new-password"
              value={form.password_confirmation}
              onChange={handleChange}
              placeholder="Répéter votre mot de passe"
              className={`w-full px-4 py-2.5 text-sm border rounded-lg outline-none transition-colors focus:ring-2 focus:ring-[#1d9e75]/30 ${
                errors.password_confirmation
                  ? 'border-red-400 bg-red-50 text-red-700 focus:border-red-400'
                  : 'border-gray-200 focus:border-[#1d9e75]'
              }`}
            />
            {errors.password_confirmation && (
              <p className="text-red-500 text-xs mt-0.5">{errors.password_confirmation}</p>
            )}
          </div>

          {/* ✅ Bouton S'inscrire */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#061a30] hover:bg-[#0a2540] text-white text-sm font-semibold rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed mt-2"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Inscription en cours...
              </span>
            ) : (
              "S'inscrire"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}