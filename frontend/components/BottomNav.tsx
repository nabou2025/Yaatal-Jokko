"use client";

import { useRouter } from "next/navigation";

interface BottomNavProps {
  active?: string;
}

export default function BottomNav({ active }: BottomNavProps) {
  const router = useRouter();

  const items = [
    {
      key: "dashboard",
      label: "Accueil",
      path: "/dashboard",
      icon: (
        <>
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </>
      ),
    },
    {
      key: "lecons",
      label: "Leçons",
      path: "/lecons",
      icon: (
        <>
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
        </>
      ),
    },
    {
      key: "quiz",
      label: "Quiz",
      path: "/quiz",
      icon: (
        <>
          <circle cx="12" cy="12" r="10" />
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
        </>
      ),
    },
    {
      key: "profil",
      label: "Profil",
      path: "/profil",
      icon: (
        <>
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </>
      ),
    },
  ];

  return (
    <div
      className="fixed bottom-0 left-0 right-0 bg-white border-t px-6 py-3"
      style={{ borderColor: "#F9E8E4" }}
    >
      <div className="flex justify-around items-center">
        {items.map((item) => {
          const isActive = active === item.key;

          return (
            <button
              key={item.key}
              onClick={() => router.push(item.path)}
              className="flex flex-col items-center gap-1"
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke={isActive ? "#2D3561" : "#9CA3AF"}
                strokeWidth="2"
              >
                {item.icon}
              </svg>

              <span
                className="text-xs font-medium"
                style={{
                  color: isActive ? "#2D3561" : "#9CA3AF",
                }}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
