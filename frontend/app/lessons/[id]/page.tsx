'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Sidebar from '../../../components/Sidebar';
import { api, auth, Lesson } from '../../../lib/api';
import { BookOpen, Hand, Puzzle } from 'lucide-react';

export default function LessonDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'signs' | 'exercises'>('signs');

  useEffect(() => {
    if (!auth.isLoggedIn()) { router.push('/login'); return; }
    api.get<Lesson>(`/lessons/${id}`)
      .then(setLesson)
      .finally(() => setLoading(false));
  }, [id, router]);

  if (loading) return (
    <div className="dash-layout">
      <Sidebar />
      <main className="dash-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <BookOpen size={48} color="#9CA3AF" />
      </main>
    </div>
  );

  if (!lesson) return (
    <div className="dash-layout">
      <Sidebar />
      <main className="dash-content">
        <p>Leçon introuvable.</p>
        <Link href="/lessons" className="btn btn-primary" style={{ marginTop: 16 }}>← Retour</Link>
      </main>
    </div>
  );

  const levelLabel = { beginner: 'Débutant', intermediate: 'Intermédiaire', advanced: 'Avancé' }[lesson.level] || lesson.level;
  const levelColor = { beginner: 'badge-forest', intermediate: 'badge-ocre', advanced: 'badge-terra' }[lesson.level] || 'badge-ocre';

  return (
    <div className="dash-layout">
      <Sidebar />
      <main className="dash-content">
        {/* Breadcrumb */}
        <div style={{ marginBottom: 24, fontSize: 14, color: 'var(--gray)' }}>
          <Link href="/lessons" style={{ color: 'var(--ocre)' }}>Leçons</Link>
          {' / '}
          <span>{lesson.title}</span>
        </div>

        {/* Header */}
        <div className="animate-up" style={{
          background: 'var(--charcoal)', borderRadius: 'var(--radius-lg)',
          padding: 40, marginBottom: 32, position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', top: -60, right: -60, width: 200, height: 200,
            borderRadius: '50%', background: 'radial-gradient(circle, rgba(200,120,42,0.2) 0%, transparent 70%)',
          }} />
          <span className={`badge ${levelColor}`} style={{ marginBottom: 16 }}>{levelLabel}</span>
          <h1 style={{ fontSize: 36, color: 'var(--white)', marginBottom: 12 }}>{lesson.title}</h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 16, lineHeight: 1.7, maxWidth: 600 }}>
            {lesson.description || 'Découvrez les signes et exercices de cette leçon.'}
          </p>
          <div style={{ display: 'flex', gap: 24, marginTop: 24, fontSize: 14, color: 'rgba(255,255,255,0.5)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Hand size={14} /> {lesson.signs?.length || 0} signes</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Puzzle size={14} /> {lesson.exercises?.length || 0} exercices</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="animate-up delay-1" style={{ display: 'flex', gap: 4, marginBottom: 24, background: 'var(--white)', padding: 4, borderRadius: 12, width: 'fit-content', boxShadow: 'var(--shadow)' }}>
          {[
            { key: 'signs', label: 'Signes', Icon: Hand },
            { key: 'exercises', label: 'Exercices', Icon: Puzzle },
          ].map(t => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key as 'signs' | 'exercises')}
              style={{
                padding: '10px 20px', borderRadius: 8, border: 'none', fontSize: 14, fontWeight: 600,
                background: activeTab === t.key ? 'var(--ocre)' : 'transparent',
                color: activeTab === t.key ? 'white' : 'var(--gray)',
                transition: 'all 0.2s', cursor: 'pointer',
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><t.Icon size={14} /> {t.label}</span>
            </button>
          ))}
        </div>

        {/* Signs tab */}
        {activeTab === 'signs' && (
          <div className="animate-in">
            {!lesson.signs || lesson.signs.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 60, color: 'var(--gray)', background: 'var(--white)', borderRadius: 'var(--radius-lg)' }}>
                <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'center' }}><Hand size={48} color="#9CA3AF" /></div>
                <p>Aucun signe associé à cette leçon.</p>
              </div>
            ) : (
              <div className="signs-grid">
                {lesson.signs.map(sign => (
                  <div key={sign.id} className="card sign-card">
                    <div className="sign-media">
                      {sign.image_url ? (
                        <img src={sign.image_url} alt={sign.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : sign.video_url ? (
                        <video src={sign.video_url} controls style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <Hand size={52} color="#9CA3AF" />
                      )}
                    </div>
                    <div className="sign-info">
                      <div className="sign-title">{sign.title}</div>
                      <div className="sign-cat">
                        <span className={`badge ${sign.category === 'alphabet' ? 'badge-forest' : sign.category === 'word' ? 'badge-ocre' : 'badge-terra'}`} style={{ fontSize: 10 }}>
                          {sign.category}
                        </span>
                      </div>
                      {sign.description && <p style={{ fontSize: 13, color: 'var(--gray)', marginTop: 8, lineHeight: 1.5 }}>{sign.description}</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Exercises tab */}
        {activeTab === 'exercises' && (
          <div className="animate-in">
            {!lesson.exercises || lesson.exercises.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 60, color: 'var(--gray)', background: 'var(--white)', borderRadius: 'var(--radius-lg)' }}>
                <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'center' }}><Puzzle size={48} color="#9CA3AF" /></div>
                <p>Aucun exercice disponible pour cette leçon.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {lesson.exercises.map((ex, i) => (
                  <Link key={ex.id} href={`/exercises/${ex.id}`} className="card" style={{ padding: 24, display: 'flex', alignItems: 'center', gap: 20 }}>
                    <div style={{
                      width: 52, height: 52, borderRadius: 14, background: 'var(--ocre-pale)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 24, flexShrink: 0,
                    }}>
                      {i + 1}
                    </div>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontSize: 18, marginBottom: 4 }}>{ex.title}</h3>
                      <p style={{ fontSize: 13, color: 'var(--gray)' }}>{ex.description}</p>
                      {ex.questions && <p style={{ fontSize: 12, color: 'var(--ocre)', marginTop: 8, fontWeight: 600 }}>{ex.questions.length} question{ex.questions.length > 1 ? 's' : ''}</p>}
                    </div>
                    <span style={{ color: 'var(--ocre)', fontWeight: 600 }}>Commencer →</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
