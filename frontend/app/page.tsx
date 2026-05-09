
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface FormState {
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
}

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [apiError, setApiError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const validate = (): FormErrors => {
    const newErrors: FormErrors = {};
    if (!form.name.trim()) newErrors.name = "Le nom est requis.";
    if (!form.email.trim()) {
      newErrors.email = "L'email est requis.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Format d'email invalide.";
    }
    if (!form.password) {
      newErrors.password = "Le mot de passe est requis.";
    } else if (form.password.length < 8) {
      newErrors.password = "Le mot de passe doit contenir au moins 8 caractères.";
    }
    if (!form.password_confirmation) {
      newErrors.password_confirmation = "La confirmation est requise.";
    } else if (form.password !== form.password_confirmation) {
      newErrors.password_confirmation = "Les mots de passe ne correspondent pas.";
    }
    return newErrors;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setApiError("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setLoading(true);
    setApiError("");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.errors) setErrors(data.errors);
        else setApiError(data.message || "Une erreur est survenue.");
        return;
      }
      router.push("/dashboard");
    } catch {
      setApiError("Impossible de contacter le serveur. Vérifiez votre connexion.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      className="min-h-screen flex items-center justify-center px-4 py-10"
      style={{ backgroundColor: "#f5f4f0" }}
    >
      <div className="w-full max-w-md">
        <div
          className="rounded-2xl border px-9 py-10"
          style={{
            background: "#ffffff",
            borderColor: "#e5e3de",
            boxShadow: "0 2px 24px rgba(0,0,0,0.07)",
          }}
        >
          {/* Logo */}
          <div className="mb-7 flex flex-col items-center">
            <div className="flex items-end gap-1 mb-2">
              {[20, 28, 16, 32, 22].map((h, i) => (
                <div
                  key={i}
                  style={{
                    width: 6,
                    height: h,
                    background: "#e8956d",
                    borderRadius: 3,
                  }}
                />
              ))}
            </div>
            <h1
              className="text-xl font-black tracking-widest"
              style={{ color: "#2d2d2d" }}
            >
              YAATAL JOKKO
            </h1>
            <p className="text-xs italic mt-0.5" style={{ color: "#999" }}>
              Where hands speak
            </p>
          </div>

          {/* Séparateur */}
          <div className="mb-6" style={{ height: 1, background: "#ece9e3" }} />

          {/* Titre formulaire */}
          <div className="mb-5 text-center">
            <h2 className="text-base font-bold" style={{ color: "#2d2d2d" }}>
              Créer un compte
            </h2>
            <p className="text-xs mt-0.5" style={{ color: "#aaa" }}>
              Rejoignez-nous en quelques secondes
            </p>
          </div>

          {/* Erreur API */}
          {apiError && (
            <div
              className="mb-4 rounded-lg px-4 py-3 text-xs"
              style={{
                background: "#fff2f2",
                border: "1px solid #fca5a5",
                color: "#b91c1c",
              }}
            >
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            {/* Nom */}
            <div>
              <label
                className="block text-[10px] font-bold uppercase tracking-widest mb-1.5"
                style={{ color: "#888" }}
              >
                Nom complet
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Seynabou Diallo"
                className="w-full rounded-lg border-[1.5px] px-4 py-2.5 text-sm outline-none transition"
                style={{
                  background: errors.name ? "#fff8f8" : "#faf9f7",
                  borderColor: errors.name ? "#e05252" : "#e5e3de",
                  color: "#2d2d2d",
                }}
              />
              {errors.name && (
                <p className="mt-1 text-xs" style={{ color: "#e05252" }}>
                  {errors.name}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label
                className="block text-[10px] font-bold uppercase tracking-widest mb-1.5"
                style={{ color: "#888" }}
              >
                Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="vous@exemple.com"
                className="w-full rounded-lg border-[1.5px] px-4 py-2.5 text-sm outline-none transition"
                style={{
                  background: errors.email ? "#fff8f8" : "#faf9f7",
                  borderColor: errors.email ? "#e05252" : "#e5e3de",
                  color: "#2d2d2d",
                }}
              />
              {errors.email && (
                <p className="mt-1 text-xs" style={{ color: "#e05252" }}>
                  {errors.email}
                </p>
              )}
            </div>

            {/* Mot de passe */}
            <div>
              <label
                className="block text-[10px] font-bold uppercase tracking-widest mb-1.5"
                style={{ color: "#888" }}
              >
                Mot de passe
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="8 caractères minimum"
                className="w-full rounded-lg border-[1.5px] px-4 py-2.5 text-sm outline-none transition"
                style={{
                  background: errors.password ? "#fff8f8" : "#faf9f7",
                  borderColor: errors.password ? "#e05252" : "#e5e3de",
                  color: "#2d2d2d",
                }}
              />
              {errors.password && (
                <p className="mt-1 text-xs" style={{ color: "#e05252" }}>
                  {errors.password}
                </p>
              )}
            </div>

            {/* Confirmation */}
            <div>
              <label
                className="block text-[10px] font-bold uppercase tracking-widest mb-1.5"
                style={{ color: "#888" }}
              >
                Confirmer le mot de passe
              </label>
              <input
                type="password"
                name="password_confirmation"
                value={form.password_confirmation}
                onChange={handleChange}
                placeholder="Répétez le mot de passe"
                className="w-full rounded-lg border-[1.5px] px-4 py-2.5 text-sm outline-none transition"
                style={{
                  background: errors.password_confirmation ? "#fff8f8" : "#faf9f7",
                  borderColor: errors.password_confirmation ? "#e05252" : "#e5e3de",
                  color: "#2d2d2d",
                }}
              />
              {errors.password_confirmation && (
                <p className="mt-1 text-xs" style={{ color: "#e05252" }}>
                  {errors.password_confirmation}
                </p>
              )}
            </div>

            {/* Bouton */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-1 rounded-lg py-3 text-sm font-bold text-white transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: "#e8956d" }}
            >
              {loading ? "Inscription en cours…" : "S'inscrire"}
            </button>
          </form>

          <p className="mt-6 text-center text-xs" style={{ color: "#aaa" }}>
            Déjà un compte ?{" "}
            <a href="/login" style={{ color: "#e8956d", fontWeight: 600 }}>
              Se connecter
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}