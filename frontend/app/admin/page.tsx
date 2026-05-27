"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({
    niveaux: 0,
    themes: 0,
    lecons: 0,
    quiz: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token || !userData) {
      router.push("/login");
      return;
    }

    const user = JSON.parse(userData);
    if (user.role !== "admin") {
      router.push("/dashboard");
      return;
    }

    setUser(user);
    fetchStats(token);
  }, [router]);

  const fetchStats = async (token: string) => {
    try {
      const [niveauxRes, themesRes, leconsRes, quizRes] = await Promise.all([
        fetch("http://127.0.0.1:8000/api/niveaux", { headers: { "Accept": "application/json" } }),
        fetch("http://127.0.0.1:8000/api/themes", { headers: { "Accept": "application/json" } }),
        fetch("http://127.0.0.1:8000/api/lecons", { headers: { "Accept": "application/json" } }),
        fetch("http://127.0.0.1:8000/api/quiz", { headers: { "Accept": "application/json" } }),
      ]);

      const niveauxData = await niveauxRes.json();
      const themesData = await themesRes.json();
      const leconsData = await leconsRes.json();
      const quizData = await quizRes.json();

      setStats({
        niveaux: niveauxData.niveaux?.length || 0,
        themes: themesData.themes?.length || 0,
        lecons: leconsData.lecons?.length || 0,
        quiz: quizData.quiz?.length || 0,
      });
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "#F9E8E4" }}>
        <p style={{ color: "#2D3561" }}>Chargement...</p>
      </div>
    );
  }

  const menuItems = [
    { label: "Niveaux", count: stats.niveaux, path: "/admin/niveaux", icon: "📚", desc: "Gérer les niveaux" },
    { label: "Thèmes", count: stats.themes, path: "/admin/themes", icon: "🎯", desc: "Gérer les thèmes" },
    { label: "Leçons", count: stats.lecons, path: "/admin/lecons", icon: "📖", desc: "Gérer les leçons" },
    { label: "Quiz", count: stats.quiz, path: "/admin/quiz", icon: "🧩", desc: "Gérer les quiz" },
  ];

  return (
    <div className="min-h-screen pb-10" style={{ backgroundColor: "#F9E8E4" }}>

      {/* Header */}
      <div className="px-6 pt-10 pb-6" style={{ backgroundColor: "#2D3561" }}>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-xs" style={{ color: "#E8A898" }}>Administration</p>
            <h1 className="text-xl font-bold text-white">Yaatal Jokko</h1>
            <p className="text-xs mt-1" style={{ color: "#E8A898" }}>
              Connecté en tant que {user?.name}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/dashboard")}
              className="text-xs px-3 py-2 rounded-xl text-white border border-white/30">
              Vue apprenant
            </button>
            <button
              onClick={handleLogout}
              className="w-9 h-9 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "#E8A898" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="px-6 mt-6 mb-6">
        <h2 className="text-base font-bold mb-3" style={{ color: "#2D3561" }}>
          Vue d'ensemble
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {menuItems.map((item) => (
            <button
              key={item.label}
              onClick={() => router.push(item.path)}
              className="bg-white rounded-2xl p-4 shadow-sm text-left">
              <div className="text-2xl mb-2">{item.icon}</div>
              <p className="text-2xl font-bold" style={{ color: "#2D3561" }}>
                {item.count}
              </p>
              <p className="text-sm font-medium" style={{ color: "#2D3561" }}>
                {item.label}
              </p>
              <p className="text-xs text-gray-400 mt-1">{item.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Actions rapides */}
      <div className="px-6">
        <h2 className="text-base font-bold mb-3" style={{ color: "#2D3561" }}>
          Actions rapides
        </h2>
        <div className="space-y-3">
          {[
            { label: "Ajouter une leçon", path: "/admin/lecons/new", color: "#2D3561" },
            { label: "Ajouter un quiz", path: "/admin/quiz/new", color: "#E8A898" },
            { label: "Ajouter un thème", path: "/admin/themes/new", color: "#2D3561" },
          ].map((action) => (
            <button
              key={action.label}
              onClick={() => router.push(action.path)}
              className="w-full py-3 rounded-2xl text-white font-semibold text-sm"
              style={{ backgroundColor: action.color }}>
              + {action.label}
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}
