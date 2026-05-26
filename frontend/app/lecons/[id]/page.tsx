'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import BottomNav from '../../../components/BottomNav';
import { Search, Hand, CheckCircle, Loader2, Puzzle } from 'lucide-react';

interface Lecon {
  id: number;
  titre: string;
  description?: string;
  video?: string;
  image?: string;
  theme_id: number;
  ordre: number;
  theme?: { id: number; nom: string };
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

export default function LeconDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [lecon, setLecon] = useState<Lecon | null>(null);
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState(false);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    fetchLecon();
  }, [router, id]);

  const fetchLecon = async () => {
    try {
      // On récupère toutes les leçons puis on filtre — endpoint single non exposé pour l'instant
      const res = await fetch(`${API_URL}/api/lecons`, { headers: { Accept: 'application/json' } });
      const data = await res.json();
      const found = (data.lecons || []).find((l: Lecon) => String(l.id) === String(id));
      setLecon(found || null);
    } catch (err) {
      console.error('Erreur chargement leçon :', err);
    } finally {
      setLoading(false);
    }
  };

  const markAsComplete = async () => {
    const token = localStorage.getItem('token');
    if (!token || !lecon) return;
    setMarking(true);
    try {
      const res = await fetch(`${API_URL}/api/progression/lecon`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ lecon_id: lecon.id }),
      });
      if (res.ok) setCompleted(true);
    } catch (err) {
      console.error('Erreur progression :', err);
    } finally {
      setMarking(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F9E8E4' }}>
        <p style={{ color: '#2D3561' }}>Chargement de la leçon...</p>
      </div>
    );
  }

  if (!lecon) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: '#F9E8E4' }}>
        <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
          <div className="mb-3 flex justify-center"><Search size={48} color="#9CA3AF" /></div>
          <p className="font-bold" style={{ color: '#2D3561' }}>Leçon introuvable.</p>
          <button
            onClick={() => router.push('/lecons')}
            className="mt-4 px-5 py-2 rounded-xl text-white text-sm font-medium"
            style={{ backgroundColor: '#2D3561' }}
          >
            Retour aux leçons
          </button>
        </div>
      </div>
    );
  }

  const videoUrl = lecon.video ? `${API_URL}/storage/${lecon.video}` : null;
  const imageUrl = lecon.image ? `${API_URL}/storage/${lecon.image}` : null;

  return (
    <div className="min-h-screen pb-28" style={{ backgroundColor: '#F9E8E4' }}>
      {/* Header */}
      <div className="px-6 pt-10 pb-4">
        <button
          onClick={() => router.push('/lecons')}
          className="flex items-center gap-2 mb-4 text-sm font-medium"
          style={{ color: '#2D3561' }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2D3561" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Retour aux leçons
        </button>

        <div className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-3" style={{ backgroundColor: '#E8A898', color: '#FFFFFF' }}>
          {lecon.theme?.nom || 'Leçon'}
        </div>
        <h1 className="text-2xl font-bold" style={{ color: '#2D3561', fontFamily: "'Playfair Display', serif", fontStyle: 'italic' }}>
          {lecon.titre}
        </h1>
      </div>

      {/* Vidéo / image */}
      <div className="px-6 mb-6">
        {videoUrl ? (
          <video
            controls
            className="w-full rounded-2xl shadow-sm bg-black"
            style={{ aspectRatio: '16/9' }}
          >
            <source src={videoUrl} />
            Votre navigateur ne supporte pas la vidéo.
          </video>
        ) : imageUrl ? (
          <img src={imageUrl} alt={lecon.titre} className="w-full rounded-2xl shadow-sm" />
        ) : (
          <div
            className="w-full rounded-2xl shadow-sm flex items-center justify-center"
            style={{ aspectRatio: '16/9', backgroundColor: '#2D3561', color: '#FFFFFF' }}
          >
            <Hand size={60} color="#FFFFFF" />
          </div>
        )}
      </div>

      {/* Description */}
      <div className="px-6 mb-6">
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <h2 className="text-sm font-bold mb-2" style={{ color: '#2D3561' }}>
            À propos de cette leçon
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: '#3a3a3a' }}>
            {lecon.description || 'Cette leçon vous initie à un signe de la langue des signes sénégalaise. Regardez attentivement la vidéo et entraînez-vous !'}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="px-6 space-y-3">
        <button
          onClick={markAsComplete}
          disabled={marking || completed}
          className="w-full py-3 rounded-2xl text-white font-bold text-sm shadow-sm disabled:opacity-60"
          style={{ backgroundColor: completed ? '#2D3561' : '#E8A898' }}
        >
          {completed ? (
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}><CheckCircle size={16} /> Leçon validée</span>
          ) : marking ? (
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}><Loader2 size={16} className="animate-spin" /> Enregistrement...</span>
          ) : (
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}><CheckCircle size={16} /> Marquer comme apprise</span>
          )}
        </button>

        <button
          onClick={() => router.push(`/quiz?lecon=${lecon.id}`)}
          className="w-full py-3 rounded-2xl text-white font-bold text-sm shadow-sm"
          style={{ backgroundColor: '#2D3561' }}
        >
          <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}><Puzzle size={16} /> Faire le quiz</span>
        </button>
      </div>

      <BottomNav active="lecons" />
    </div>
  );
}
