"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProfilPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [progression, setProgression] = useState<any>({
    lecons_terminees: 0,
    total_lecons: 8,
    quizzes_termines: 0,
    total_quizzes: 1,
    progression_globale: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      router.push("/login");
      return;
    }
    const currentUser = JSON.parse(userData);
    setUser(currentUser);

    // Récupérer la progression depuis Laravel
    const fetchProgression = async () => {
      try {
        const token = localStorage.getItem("token");
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
        
        const res = await fetch(`${API_URL}/api/progression/${currentUser.id}`, {
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (res.ok) {
          const data = await res.json();
          setProgression(data);
        }
      } catch (err) {
        console.error("Erreur récupération progression:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProgression();
  }, [router]);

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  return (
    <div className="min-h-screen pb-24" style={{ backgroundColor: "#F9E8E4" }}>

      {/* Header */}
      <div className="px-6 pt-10 pb-6" style={{ backgroundColor: "#2D3561" }}>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white"
            style={{ backgroundColor: "#E8A898" }}>
            {user?.name?.charAt(0)}
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">{user?.name}</h1>
            <p className="text-sm" style={{ color: "#E8A898" }}>{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Barre de progression globale */}
      <div className="mx-6 -mt-4 bg-white rounded-2xl p-4 shadow-sm">
        <div className="flex justify-between items-center mb-2">
          <p className="text-sm font-semibold" style={{ color: "#2D3561" }}>Progression Globale</p>
          <p className="text-sm font-bold" style={{ color: "#E8A898" }}>{progression.progression_globale}%</p>
        </div>
        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full transition-all duration-500"
            style={{ 
              backgroundColor: "#E8A898", 
              width: `${progression.progression_globale}%` 
            }}></div>
        </div>
      </div>

      {/* Statistiques Dynamiques */}
      <div className="px-6 mt-6">
        <h2 className="text-md font-bold mb-3" style={{ color: "#2D3561" }}>Mes Statistiques</h2>
        <div className="bg-white rounded-2xl p-4 shadow-sm space-y-4">
          {[
            { 
              label: "Leçons terminées", 
              value: `${progression.lecons_terminees}/${progression.total_lecons || 8}` 
            },
            { 
              label: "Quiz réussis", 
              value: `${progression.quizzes_termines}/${progression.total_quizzes || 1}` 
            },
            { 
              label: "Niveau actuel", 
              value: progression.quizzes_termines > 0 ? "Intermédiaire" : "Débutant" 
            },
          ].map((item, index) => (
            <div key={index} className="flex justify-between items-center py-2 border-b last:border-0"
              style={{ borderColor: "#F9E8E4" }}>
              <p className="text-sm text-gray-500">{item.label}</p>
              <p className="text-sm font-medium" style={{ color: "#2D3561" }}>{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Bouton déconnexion */}
      <div className="px-6 mt-6">
        <button onClick={handleLogout}
          className="w-full py-3 rounded-2xl text-white font-semibold text-sm"
          style={{ backgroundColor: "#E8A898" }}>
          Se déconnecter
        </button>
      </div>

      {/* Barre navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t px-6 py-3"
        style={{ borderColor: "#F9E8E4" }}>
        <div className="flex justify-around items-center">
          {[
            { label: "Accueil", path: "/dashboard", active: false },
            { label: "Lecons", path: "/lecons", active: false },
            { label: "Quiz", path: "/quiz", active: false },
            { label: "Profil", path: "/profil", active: true },
          ].map((item) => (
            <button key={item.label}
              onClick={() => router.push(item.path)}
              className="flex flex-col items-center gap-1">
              <span className={`text-xs font-medium ${item.active ? "font-bold" : ""}`}
                style={{ color: item.active ? "#2D3561" : "#A0AEC0" }}>
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}