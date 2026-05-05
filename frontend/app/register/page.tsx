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

      </div>
    </div>
  );
}
