"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [niveaux, setNiveaux] = useState<any[]>([]);
  const [themes, setThemes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    if (!token || !userData) {
      router.push("/login");
      return;
    }
    setUser(JSON.parse(userData));
    fetchData(token);
  }, [router]);

  const fetchData = async (token: string) => {
    try {
      const [niveauxRes, themesRes] = await Promise.all([
        fetch("http://127.0.0.1:8000/api/niveaux", { headers: { "Accept": "application/json" } }),
        fetch("http://127.0.0.1:8000/api/themes", { headers: { "Accept": "application/json" } }),
      ]);
      const niveauxData = await niveauxRes.json();
      const themesData = await themesRes.json();
      setNiveaux(niveauxData.niveaux || []);
      setThemes(themesData.themes || []);
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

  const niveauColors = [
    { bg: "#2D3561", text: "#FFFFFF", sub: "#E8A898" },
    { bg: "#E8A898", text: "#2D3561", sub: "#2D3561" },
    { bg: "#F9E8E4", text: "#2D3561", sub: "#E8A898" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#F9E8E4" }}>
        <div className="text-center">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" className="mx-auto mb-4 animate-spin">
            <circle cx="12" cy="12" r="10" stroke="#E8A898" strokeWidth="2"/>
            <path d="M12 2a10 10 0 0 1 10 10" stroke="#2D3561" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <p style={{ color: "#2D3561" }}>Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24" style={{ backgroundColor: "#F9E8E4" }}>

      {/* Header */}
      <div className="px-6 pt-10 pb-6">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm font-medium" style={{ color: "#E8A898" }}>Bonjour</p>
            <h1 className="text-2xl font-bold" style={{ color: "#2D3561" }}>{user?.name}</h1>
            <p className="text-xs mt-1" style={{ color: "#E8A898" }}>Apprenant · Yaatal Jokko</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-lg font-bold"
              style={{ backgroundColor: "#2D3561" }}>
              {user?.name?.charAt(0)}
            </div>
            <button onClick={handleLogout}
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "#E8A898" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Card progression */}
      <div className="px-6 mb-6">
        <div className="rounded-3xl p-5 text-white relative overflow-hidden"
          style={{ backgroundColor: "#2D3561" }}>
          <div className="absolute right-5 top-5 opacity-10">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="white">
              <path d="M18 11V6l-5-4-1 1 4 3H4v2h12l-4 3 1 1 5-4z"/>
            </svg>
          </div>
          <p className="text-xs opacity-70 mb-1">Ta progression globale</p>
          <p className="text-4xl font-bold mb-3">0%</p>
          <div className="bg-white/20 rounded-full h-2 mb-3">
            <div className="rounded-full h-2" style={{ width: "0%", backgroundColor: "#E8A898" }}></div>
          </div>
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "#E8A898" }}></div>
              <p className="text-xs opacity-70">{themes.length} thèmes</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-white"></div>
              <p className="text-xs opacity-70">{niveaux.length} niveaux</p>
            </div>
          </div>
        </div>
      </div>

      {/* Niveaux */}
      <div className="px-6 mb-6">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-base font-bold" style={{ color: "#2D3561" }}>Niveaux</h2>
          <p className="text-xs font-medium" style={{ color: "#E8A898" }}>Voir tout</p>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {niveaux.length === 0 ? (
            <p className="text-sm text-gray-400">Aucun niveau disponible</p>
          ) : (
            niveaux.map((niveau, index) => {
              const colors = niveauColors[index % niveauColors.length];
              const themeCount = themes.filter(t => t.niveau_id === niveau.id).length;
              return (
                <div key={niveau.id}
                  className="rounded-2xl p-4 min-w-40 flex-shrink-0 shadow-sm cursor-pointer"
                  style={{ backgroundColor: colors.bg }}>
                  {/* Icône niveau */}
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                    style={{ backgroundColor: "rgba(255,255,255,0.15)" }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                      stroke={colors.text} strokeWidth="2">
                      <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                      <path d="M2 17l10 5 10-5"/>
                      <path d="M2 12l10 5 10-5"/>
                    </svg>
                  </div>
                  <p className="text-sm font-bold mb-1" style={{ color: colors.text }}>
                    {niveau.nom}
                  </p>
                  <p className="text-xs" style={{ color: colors.sub }}>
                    {themeCount} thème{themeCount > 1 ? "s" : ""}
                  </p>
                  {/* Barre progression */}
                  <div className="mt-3 bg-white/20 rounded-full h-1">
                    <div className="rounded-full h-1 w-0" style={{ backgroundColor: colors.sub }}></div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Thèmes */}
      <div className="px-6 mb-6">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-base font-bold" style={{ color: "#2D3561" }}>Thèmes disponibles</h2>
        </div>
        <div className="space-y-3">
          {themes.length === 0 ? (
            <p className="text-sm text-gray-400">Aucun thème disponible</p>
          ) : (
            themes.map((theme, index) => (
              <div key={theme.id}
                className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-4">
                {/* Icône thème */}
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: "#F9E8E4" }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                    stroke="#2D3561" strokeWidth="2">
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="font-bold text-sm" style={{ color: "#2D3561" }}>
                    {theme.nom}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">{theme.description}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#E8A898" }}></div>
                    <p className="text-xs" style={{ color: "#E8A898" }}>{theme.niveau?.nom}</p>
                  </div>
                </div>
                <button 
  onClick={() => router.push(`/themes/${theme.id}`)}
  className="text-xs px-4 py-2 rounded-xl text-white flex-shrink-0 font-medium"
  style={{ backgroundColor: "#2D3561" }}>
  Commencer
</button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Barre navigation */}
      
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t px-6 py-3"
        style={{ borderColor: "#F9E8E4" }}>
        <div className="flex justify-around items-center">
          {[
            { label: "Accueil", active: true, path: "/dashboard",
              icon: <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>,
              icon2: <polyline points="9 22 9 12 15 12 15 22"/> },
            { label: "Lecons", active: false, path: "/lecons",
              icon: <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>,
              icon2: <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/> },
            { label: "Quiz", active: false, path: "/quiz",
              icon: <circle cx="12" cy="12" r="10"/>,
              icon2: <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/> },
            { label: "Profil", active: false, path: "/profil",
              icon: <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>,
              icon2: <circle cx="12" cy="7" r="4"/> },
          ].map((item) => (
            <button key={item.label}
              onClick={() => router.push(item.path)}
              className="flex flex-col items-center gap-1">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                stroke={item.active ? "#2D3561" : "#9CA3AF"} strokeWidth="2">
                {item.icon}
                {item.icon2}
              </svg>
              <span className="text-xs font-medium"
                style={{ color: item.active ? "#2D3561" : "#9CA3AF" }}>
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}
