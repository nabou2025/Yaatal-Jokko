'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import BottomNav from '../../components/BottomNav';
import { BookOpen, Inbox, Hand } from 'lucide-react';

interface Theme {
  id: number;
  nom: string;
  description?: string;
  niveau_id: number;
  niveau?: { id: number; nom: string };
}

interface Lecon {
  id: number;
  titre: string;
  description?: string;
  video?: string;
  image?: string;
  theme_id: number;
  ordre: number;
  theme?: Theme;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

function LeconsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const themeParam = searchParams?.get('theme');

  const [lecons, setLecons] = useState<Lecon[]>([]);
  const [themes, setThemes] = useState<Theme[]>([]);
  const [activeTheme, setActiveTheme] = useState<number | 'all'>(themeParam ? Number(themeParam) : 'all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    fetchData();
  }, [router]);

  const fetchData = async () => {
    try {
      const [leconsRes, themesRes] = await Promise.all([
        fetch(`${API_URL}/api/lecons`, { headers: { Accept: 'application/json' } }),
        fetch(`${API_URL}/api/themes`, { headers: { Accept: 'application/json' } }),
      ]);
      const leconsData = await leconsRes.json();
      const themesData = await themesRes.json();
      setLecons(leconsData.lecons || []);
      setThemes(themesData.themes || []);
    } catch (err) {
      console.error('Erreur chargement leçons :', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredLecons =
    activeTheme === 'all' ? lecons : lecons.filter(l => l.theme_id === activeTheme);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F9E8E4' }}>
        <div className="text-center">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" className="mx-auto mb-4 animate-spin">
            <circle cx="12" cy="12" r="10" stroke="#E8A898" strokeWidth="2" />
            <path d="M12 2a10 10 0 0 1 10 10" stroke="#2D3561" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <p style={{ color: '#2D3561' }}>Chargement des leçons...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24" style={{ backgroundColor: '#F9E8E4' }}>
      {/* Header */}
      <div className="px-6 pt-10 pb-4">
        <button
          onClick={() => router.push('/dashboard')}
          className="flex items-center gap-2 mb-4 text-sm font-medium"
          style={{ color: '#2D3561' }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2D3561" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Retour
        </button>
        <h1 className="text-3xl font-bold" style={{ color: '#2D3561', fontFamily: "'Playfair Display', serif", fontStyle: 'italic', display: 'flex', alignItems: 'center', gap: 10 }}>
          <BookOpen size={28} color="#2D3561" /> Leçons
        </h1>
        <p className="text-sm mt-1" style={{ color: '#E8A898' }}>
          {filteredLecons.length} leçon{filteredLecons.length > 1 ? 's' : ''} disponible{filteredLecons.length > 1 ? 's' : ''}
        </p>
      </div>

      {/* Filtres par thème */}
      <div className="px-6 mb-4">
        <div className="flex gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveTheme('all')}
            className="px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap"
            style={{
              backgroundColor: activeTheme === 'all' ? '#2D3561' : '#FFFFFF',
              color: activeTheme === 'all' ? '#FFFFFF' : '#2D3561',
              border: activeTheme === 'all' ? 'none' : '1.5px solid #E8A898',
            }}
          >
            Toutes
          </button>
          {themes.map(theme => (
            <button
              key={theme.id}
              onClick={() => setActiveTheme(theme.id)}
              className="px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap"
              style={{
                backgroundColor: activeTheme === theme.id ? '#2D3561' : '#FFFFFF',
                color: activeTheme === theme.id ? '#FFFFFF' : '#2D3561',
                border: activeTheme === theme.id ? 'none' : '1.5px solid #E8A898',
              }}
            >
              {theme.nom}
            </button>
          ))}
        </div>
      </div>

      {/* Liste des leçons */}
      <div className="px-6 space-y-3">
        {filteredLecons.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
            <div className="mb-3 flex justify-center"><Inbox size={48} color="#9CA3AF" /></div>
            <p className="text-sm font-medium" style={{ color: '#2D3561' }}>Aucune leçon trouvée.</p>
            <p className="text-xs mt-1" style={{ color: '#E8A898' }}>Essayez un autre thème.</p>
          </div>
        ) : (
          filteredLecons
            .sort((a, b) => a.ordre - b.ordre)
            .map(lecon => (
              <button
                key={lecon.id}
                onClick={() => router.push(`/lecons/${lecon.id}`)}
                className="w-full bg-white rounded-2xl p-4 shadow-sm flex items-center gap-4 text-left"
              >
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: '#F9E8E4' }}
                >
                  <Hand size={24} color="#2D3561" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm truncate" style={{ color: '#2D3561' }}>
                    {lecon.titre}
                  </p>
                  {lecon.description && (
                    <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">{lecon.description}</p>
                  )}
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#E8A898' }}></div>
                    <p className="text-xs" style={{ color: '#E8A898' }}>{lecon.theme?.nom || 'Thème'}</p>
                  </div>
                </div>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2D3561" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            ))
        )}
      </div>

      <BottomNav active="lecons" />
    </div>
  );
}

export default function LeconsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F9E8E4', color: '#2D3561' }}>Chargement...</div>}>
      <LeconsPageContent />
    </Suspense>
  );
}
