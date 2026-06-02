"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import BottomNav from "../../components/BottomNav";

export default function ProgressionPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [progressions, setProgressions] = useState<any[]>([]);
  const [themes, setThemes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token || !userData) {
      router.push("/login");
      return;
    }

    const user = JSON.parse(userData);
    setUser(user);
    fetchData(token, user.id);
  }, [router]);

  const fetchData = async (token: string, userId: number) => {
    try {
      const [themesRes, progressionRes] = await Promise.all([
        fetch("http://127.0.0.1:8000/api/themes", {
          headers: { "Accept": "application/json" },
        }),
        fetch(`http://127.0.0.1:8000/api/progression/${userId}`, {
          headers: {
            "Accept": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        }),
      ]);

      const themesData = await themesRes.json();
      setThemes(themesData.themes || []);

      if (progressionRes.ok) {
        const progressionData = await progressionRes.json();
        setProgressions(progressionData.progressions || []);
      }
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setLoading(false);
    }
  };

  const totalQuiz = progressions.length;
  const quizReussis = progressions.filter(p => p.reussi).length;
  const moyennePourcentage = totalQuiz > 0
    ? Math.round(progressions.reduce((acc, p) => acc + p.pourcentage, 0) / totalQuiz)
    : 0;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "#F9E8E4" }}>
        <p style={{ color: "#2D3561" }}>Chargement...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24" style={{ backgroundColor: "#F9E8E4" }}>

      {/* Header */}
      <div className="px-6 pt-10 pb-6">
        <button onClick={() => router.push("/dashboard")}
          className="flex items-center gap-2 mb-4 text-sm font-medium"
          style={{ color: "#E8A898" }}>
          ← Retour
        </button>
        <h1 className="text-2xl font-bold" style={{ color: "#2D3561" }}>
          Ma Progression
        </h1>
        <p className="text-sm mt-1" style={{ color: "#E8A898" }}>
          Bonjour {user?.name} !
        </p>
      </div>

      {/* Card résumé */}
      <div className="px-6 mb-6">
        <div className="rounded-3xl p-5 text-white"
          style={{ backgroundColor: "#2D3561" }}>
          <p className="text-xs opacity-70 mb-1">Score moyen</p>
          <p className="text-4xl font-bold mb-3">{moyennePourcentage}%</p>
          <div className="bg-white/20 rounded-full h-2 mb-3">
            <div className="rounded-full h-2"
              style={{ width: `${moyennePourcentage}%`, backgroundColor: "#E8A898" }}>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "#E8A898" }}></div>
              <p className="text-xs opacity-70">{quizReussis} quiz réussis</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-white"></div>
              <p className="text-xs opacity-70">{totalQuiz} quiz tentés</p>
            </div>
          </div>
        </div>
      </div>

      {/* Liste progressions */}
      <div className="px-6">
        <h2 className="text-base font-bold mb-3" style={{ color: "#2D3561" }}>
          Détail par quiz
        </h2>

        {progressions.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none"
              stroke="#9CA3AF" strokeWidth="1.5" className="mx-auto mb-3">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 8v4l3 3"/>
            </svg>
            <p className="text-sm font-medium" style={{ color: "#2D3561" }}>
              Aucun quiz complété pour l'instant
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Faites un quiz pour voir votre progression !
            </p>
            <button
              onClick={() => router.push("/quiz")}
              className="mt-4 px-6 py-2 rounded-xl text-white text-sm font-medium"
              style={{ backgroundColor: "#2D3561" }}>
              Commencer un quiz
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {progressions.map((progression) => (
              <div key={progression.id}
                className="bg-white rounded-2xl p-4 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-bold text-sm" style={{ color: "#2D3561" }}>
                      {progression.quiz?.titre || "Quiz"}
                    </p>
                    <p className="text-xs text-gray-400">
                      {progression.quiz?.theme?.nom || ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      progression.reussi
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}>
                      {progression.reussi ? "Réussi" : "Échoué"}
                    </span>
                    <span className="text-lg font-bold"
                      style={{ color: "#2D3561" }}>
                      {progression.pourcentage}%
                    </span>
                  </div>
                </div>
                <div className="bg-gray-100 rounded-full h-2">
                  <div className="rounded-full h-2"
                    style={{
                      width: `${progression.pourcentage}%`,
                      backgroundColor: progression.reussi ? "#2E7D32" : "#E8A898",
                    }}>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <BottomNav active="profil" />
    </div>
  );
}
