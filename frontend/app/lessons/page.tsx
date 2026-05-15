'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Sidebar from '../../components/Sidebar';
import { api, auth, Lesson } from '../../lib/api';
import { useRouter } from 'next/navigation';

export default function LessonsPage() {
  const router = useRouter();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth.isLoggedIn()) { router.push('/login'); return; }
    api.get<Lesson[]>('/lessons')
      .then(data => setLessons(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, [router]);

  const filtered = filter === 'all' ? lessons : lessons.filter(l => l.level === filter);

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
        <div className="dash-header animate-up">
          <h1 style={{ fontSize: 32 }}>📚 Leçons</h1>
          <p style={{ color: 'var(--gray)', marginTop: 4 }}>
            {lessons.length} leçon{lessons.length > 1 ? 's' : ''} disponible{lessons.length > 1 ? 's' : ''}
          </p>
        </div>

        {/* Filters */}
        <div className="filter-bar animate-up delay-1">
          {[
            { key: 'all', label: 'Toutes' },
            { key: 'beginner', label: '🌱 Débutant' },
            { key: 'intermediate', label: '⚡ Intermédiaire' },
            { key: 'advanced', label: '🔥 Avancé' },
          ].map(f => (
            <button key={f.key} className={`filter-btn ${filter === f.key ? 'active' : ''}`} onClick={() => setFilter(f.key)}>
              {f.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 80, fontSize: 40 }}>📚</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', color: 'var(--gray)', background: 'var(--white)', borderRadius: 'var(--radius-lg)' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
            <p>Aucune leçon trouvée pour ce niveau.</p>
          </div>
        ) : (
          <div className="lessons-grid animate-up delay-2">
            {filtered.map((lesson, i) => (
              <Link key={lesson.id} href={`/lessons/${lesson.id}`} className="card lesson-card" style={{ padding: 28, display: 'block', animationDelay: `${i * 0.04}s` }}>
                {/* Level badge */}
                <div style={{ marginBottom: 14 }}>
                  <span className={`badge ${levelColor(lesson.level)}`}>{levelLabel(lesson.level)}</span>
                </div>

                <h3 style={{ fontSize: 20, marginBottom: 10 }}>{lesson.title}</h3>
                <p style={{ fontSize: 14, color: 'var(--gray)', lineHeight: 1.6, marginBottom: 20 }}>
                  {lesson.description || 'Cliquez pour voir le contenu de cette leçon.'}
                </p>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', gap: 12, fontSize: 13, color: 'var(--gray)' }}>
                    {lesson.signs && <span>🤟 {lesson.signs.length} signes</span>}
                    {lesson.exercises && <span>🧩 {lesson.exercises.length} exercices</span>}
                  </div>
                  <span style={{ color: 'var(--ocre)', fontWeight: 600, fontSize: 13 }}>Voir →</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
