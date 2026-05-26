"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProfilPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      router.push("/login");
      return;
    }
    setUser(JSON.parse(userData));
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
            <span className="text-xs text-white bg-white/20 px-2 py-1 rounded-full mt-1 inline-block">
              {user?.role}
            </span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="px-6 py-4 bg-white mx-4 rounded-2xl shadow-sm -mt-4">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold" style={{ color: "#2D3561" }}>0%</p>
            <p className="text-xs text-gray-400">Progression</p>
          </div>
          <div>
            <p className="text-2xl font-bold" style={{ color: "#2D3561" }}>0</p>
            <p className="text-xs text-gray-400">Leçons</p>
          </div>
          <div>
            <p className="text-2xl font-bold" style={{ color: "#2D3561" }}>0</p>
            <p className="text-xs text-gray-400">Quiz réussis</p>
          </div>
        </div>
      </div>

      {/* Infos */}
      <div className="px-6 mt-6">
        <h2 className="text-base font-bold mb-4" style={{ color: "#2D3561" }}>
          Informations personnelles
        </h2>
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {[
            { label: "Nom", value: user?.name },
            { label: "Email", value: user?.email },
            { label: "Rôle", value: user?.role },
          ].map((item, i) => (
            <div key={i} className="px-4 py-3 border-b last:border-0"
              style={{ borderColor: "#F9E8E4" }}>
              <p className="text-xs font-medium mb-1" style={{ color: "#E8A898" }}>
                {item.label}
              </p>
              <p className="text-sm font-medium" style={{ color: "#2D3561" }}>
                {item.value}
              </p>
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
