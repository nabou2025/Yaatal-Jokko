'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Sidebar from '../../components/Sidebar';
import { api, auth, User, Lesson } from '../../lib/api';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth.isLoggedIn()) { router.push('/login'); return; }
    Promise.all([
      auth.me(),
      api.get<Lesson[]>('/lessons'),
    ]).then(([meRes, lessonsRes]) => {
      setUser(meRes.user);
      setLessons(Array.isArray(lessonsRes) ? lessonsRes.slice(0, 6) : []);
    }).catch(() => router.push('/login'))
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', fontSize: 40 }}>
      🤟
    </div>
  );

  const levelColor = (level: string) => ({
    beginner: 'badge-forest', intermediate: 'badge-ocre', advanced: 'badge-terra',
  }[level] || 'badge-ocre');

  const levelLabel = (level: string) => ({
    beginner: 'Débutant', intermediate: 'Intermédiaire', advanced: 'Avancé',
  }[level] || level);

  return (
    <div className="dash-layout">
      <Sidebar />
      <main className="dash-content">
        {/* Header */}
        <div className="dash-header animate-up">
          <h1 className="dash-greeting">
            Bonjour, <span>{user?.name?.split(' ')[0]} 👋</span>
          </h1>
          <p style={{ color: 'var(--gray)', marginTop: 4 }}>Prêt·e à continuer ton apprentissage ?</p>
        </div>

        {/* Stats */}
        <div className="stats-grid animate-up delay-1">
          {[
            { icon: '📚', label: 'Leçons disponibles', value: lessons.length, color: 'var(--ocre-pale)' },
            { icon: '🤟', label: 'Signes à apprendre', value: '120+', color: 'var(--forest-pale)' },
            { icon: '🧩', label: 'Exercices', value: '40+', color: '#fde8e4' },
            { icon: '⭐', label: 'Ton niveau', value: 'Débutant', color: 'var(--sand)' },
          ].map((s, i) => (
            <div key={i} className="stat-card">
              <div className="stat-icon" style={{ background: s.color }}>{s.icon}</div>
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Recent lessons */}
        <div className="animate-up delay-2">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <h2 style={{ fontSize: 22 }}>Dernières leçons</h2>
            <Link href="/lessons" className="btn btn-ghost" style={{ padding: '8px 16px', fontSize: 13 }}>
              Tout voir →
            </Link>
          </div>

          {lessons.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px', color: 'var(--gray)', background: 'var(--white)', borderRadius: 'var(--radius-lg)' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>📭</div>
              <p>Aucune leçon disponible pour l'instant.</p>
              {user?.role === 'teacher' && (
                <Link href="/admin/lessons" className="btn btn-primary" style={{ marginTop: 16 }}>
                  Créer une leçon
                </Link>
              )}
            </div>
          ) : (
            <div className="lessons-grid">
              {lessons.map((lesson, i) => (
                <Link key={lesson.id} href={`/lessons/${lesson.id}`} className="card lesson-card" style={{ padding: 24, display: 'block', animationDelay: `${i * 0.05}s` }}>
                  <div className="lesson-level">
                    <span className={`badge ${levelColor(lesson.level)}`}>{levelLabel(lesson.level)}</span>
                  </div>
                  <h3 className="lesson-title">{lesson.title}</h3>
                  <p className="lesson-desc">{lesson.description || 'Découvrez cette leçon et ses exercices.'}</p>
                  <div style={{ color: 'var(--ocre)', fontSize: 13, fontWeight: 600 }}>Commencer →</div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Quick actions */}
        <div className="animate-up delay-3" style={{ marginTop: 40 }}>
          <h2 style={{ fontSize: 22, marginBottom: 20 }}>Accès rapide</h2>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link href="/signs" className="btn btn-secondary">🤟 Bibliothèque signes</Link>
            <Link href="/lessons" className="btn btn-ghost">📚 Toutes les leçons</Link>
            {user?.role === 'teacher' && (
              <>
                <Link href="/admin/signs" className="btn btn-forest">➕ Ajouter un signe</Link>
                <Link href="/admin/lessons" className="btn btn-forest">➕ Ajouter une leçon</Link>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
