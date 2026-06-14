'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Sidebar from '../../components/Sidebar';
import { api, auth } from '../../lib/api';
import { useRouter } from 'next/navigation';
import { BookOpen, Search } from 'lucide-react';

interface Lecon {
  id: number;
  titre: string;
  description?: string;
  theme?: { nom: string; niveau?: { nom: string } };
}

export default function LessonsPage() {
  const router = useRouter();
  const [lessons, setLessons] = useState<Lecon[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!auth.isLoggedIn()) { router.push('/login'); return; }
    const userData = localStorage.getItem('user');
    if (userData) {
      const u = JSON.parse(userData);
      setIsAdmin(u.role === 'admin');
    }
    api.get<any>('/lecons')
      .then(data => setLessons(data.lecons ?? []))
      .finally(() => setLoading(false));
  }, [router]);

  const themes = [...new Set(lessons.map(l => l.theme?.nom).filter(Boolean))] as string[];
  const filtered = filter === 'all' ? lessons : lessons.filter(l => l.theme?.nom === filter);

  const themeColors: Record<string, { bg: string; text: string }> = {
    'Alphabet':    { bg: '#dbeafe', text: '#1d4ed8' },
    'Famille':     { bg: '#fce7f3', text: '#9d174d' },
    'Nourriture':  { bg: '#d1fae5', text: '#065f46' },
  };
  const defaultColor = { bg: '#f5d4cc', text: '#2D3561' };

  return (
    <div className="dash-layout">
      <Sidebar />
      <main className="dash-content">

        {/* Header */}
        <div style={{ marginBottom: 36 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 6 }}>
            <div style={{
              width: 48, height: 48, borderRadius: 14,
              background: '#2D3561',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <BookOpen size={24} color="white" />
            </div>
            <div>
              <h1 style={{ fontSize: 30, fontWeight: 800, color: '#2D3561', margin: 0, letterSpacing: '-0.5px' }}>
                Leçons
              </h1>
              <p style={{ color: '#9CA3AF', fontSize: 14, margin: 0 }}>
                {loading ? '...' : `${lessons.length} leçon${lessons.length > 1 ? 's' : ''} disponible${lessons.length > 1 ? 's' : ''}`}
              </p>
            </div>
          </div>
        </div>

        {/* Filtres */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 32 }}>
          {['all', ...themes].map(key => (
            <button key={key} onClick={() => setFilter(key)} style={{
              padding: '8px 20px',
              borderRadius: 50,
              border: filter === key ? 'none' : '1.5px solid #e8c8c0',
              background: filter === key ? '#2D3561' : 'white',
              color: filter === key ? 'white' : '#2D3561',
              fontWeight: 600, fontSize: 13, cursor: 'pointer',
              transition: 'all 0.18s',
              boxShadow: filter === key ? '0 4px 12px rgba(45,53,97,0.2)' : 'none',
            }}>
              {key === 'all' ? 'Toutes' : key}
            </button>
          ))}
        </div>

        {/* Contenu */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: 80 }}>
            <BookOpen size={40} color="#9CA3AF" />
          </div>
        ) : filtered.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '60px',
            background: 'white', borderRadius: 20,
            border: '1px solid #e8c8c0',
          }}>
            <Search size={48} color="#9CA3AF" style={{ marginBottom: 16 }} />
            <p style={{ color: '#9CA3AF' }}>Aucune leçon trouvée.</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: 20,
          }}>
            {filtered.map((lesson, i) => {
              const color = themeColors[lesson.theme?.nom ?? ''] ?? defaultColor;
              return (
                <Link
                  key={lesson.id}
                  href={isAdmin ? '/admin/lessons' : `/lessons/${lesson.id}`}
                  style={{ textDecoration: 'none' }}
                >
                  <div
                    style={{
                      background: 'white', borderRadius: 20, padding: 28,
                      border: '1px solid #e8c8c0', cursor: 'pointer',
                      transition: 'all 0.2s', height: '100%',
                      display: 'flex', flexDirection: 'column',
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)';
                      (e.currentTarget as HTMLDivElement).style.boxShadow = '0 12px 28px rgba(45,53,97,0.1)';
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
                      (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
                    }}
                  >
                    {/* Top */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 18 }}>
                      <div style={{
                        width: 48, height: 48, borderRadius: 14,
                        background: '#F9E8E4',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                      }}>
                        <BookOpen size={22} color="#E8A898" />
                      </div>
                      {lesson.theme?.nom && (
                        <span style={{
                          padding: '4px 12px', borderRadius: 50,
                          background: color.bg, color: color.text,
                          fontSize: 11, fontWeight: 700,
                          textTransform: 'uppercase', letterSpacing: '0.06em',
                        }}>
                          {lesson.theme.nom}
                        </span>
                      )}
                    </div>

                    {/* Corps */}
                    <h3 style={{ fontSize: 17, fontWeight: 700, color: '#2D3561', marginBottom: 8, lineHeight: 1.4 }}>
                      {lesson.titre}
                    </h3>
                    <p style={{ fontSize: 13, color: '#9CA3AF', lineHeight: 1.6, flex: 1 }}>
                      {lesson.description || 'Cliquez pour voir le contenu de cette leçon.'}
                    </p>

                    {/* Footer */}
                    <div style={{
                      display: 'flex', alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingTop: 16, marginTop: 16,
                      borderTop: '1px solid #f3e8e4',
                    }}>
                      {lesson.theme?.niveau?.nom && (
                        <span style={{
                          fontSize: 12, color: '#9CA3AF', fontWeight: 500,
                          background: '#f9f0ee', padding: '3px 10px', borderRadius: 50,
                        }}>
                          {lesson.theme.niveau.nom}
                        </span>
                      )}
                      <span style={{
                        color: '#E8A898', fontWeight: 700, fontSize: 13,
                        marginLeft: 'auto',
                      }}>
                        {isAdmin ? 'Modifier →' : 'Commencer →'}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}