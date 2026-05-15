'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../../components/Sidebar';
import { api, auth, Sign } from '../../lib/api';

export default function SignsPage() {
  const router = useRouter();
  const [signs, setSigns] = useState<Sign[]>([]);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Sign | null>(null);

  useEffect(() => {
    if (!auth.isLoggedIn()) { router.push('/login'); return; }
    api.get<Sign[]>('/signs')
      .then(data => setSigns(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, [router]);

  const filtered = signs.filter(s => {
    const matchCat = filter === 'all' || s.category === filter;
    const matchSearch = s.title.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const catEmoji = (cat: string) => ({ alphabet: '🔤', word: '💬', phrase: '📝' }[cat] || '🤟');

  return (
    <div className="dash-layout">
      <Sidebar />
      <main className="dash-content">
        <div className="dash-header animate-up">
          <h1 style={{ fontSize: 32 }}>🤟 Bibliothèque des signes</h1>
          <p style={{ color: 'var(--gray)', marginTop: 4 }}>{signs.length} signe{signs.length > 1 ? 's' : ''} disponible{signs.length > 1 ? 's' : ''}</p>
        </div>

        {/* Search + Filter */}
        <div className="animate-up delay-1" style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap', alignItems: 'center' }}>
          <input
            className="input-field"
            placeholder="🔍 Rechercher un signe..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ maxWidth: 280 }}
          />
          <div className="filter-bar" style={{ margin: 0 }}>
            {[
              { key: 'all', label: 'Tous' },
              { key: 'alphabet', label: '🔤 Alphabet' },
              { key: 'word', label: '💬 Mots' },
              { key: 'phrase', label: '📝 Phrases' },
            ].map(f => (
              <button key={f.key} className={`filter-btn ${filter === f.key ? 'active' : ''}`} onClick={() => setFilter(f.key)}>
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 80, fontSize: 40 }}>🤟</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 60, color: 'var(--gray)', background: 'var(--white)', borderRadius: 'var(--radius-lg)' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
            <p>Aucun signe trouvé.</p>
          </div>
        ) : (
          <div className="signs-grid animate-up delay-2">
            {filtered.map(sign => (
              <div
                key={sign.id}
                className="card sign-card"
                style={{ cursor: 'pointer' }}
                onClick={() => setSelected(sign)}
              >
                <div className="sign-media">
                  {sign.image_url ? (
                    <img src={sign.image_url} alt={sign.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <span style={{ fontSize: 52 }}>{catEmoji(sign.category)}</span>
                  )}
                </div>
                <div className="sign-info">
                  <div className="sign-title">{sign.title}</div>
                  <div style={{ marginTop: 6 }}>
                    <span className={`badge ${sign.category === 'alphabet' ? 'badge-forest' : sign.category === 'word' ? 'badge-ocre' : 'badge-terra'}`} style={{ fontSize: 10 }}>
                      {sign.category}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal detail */}
        {selected && (
          <div className="modal-overlay" onClick={() => setSelected(null)}>
            <div className="modal-box" onClick={e => e.stopPropagation()}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
                <div>
                  <span className={`badge ${selected.category === 'alphabet' ? 'badge-forest' : selected.category === 'word' ? 'badge-ocre' : 'badge-terra'}`} style={{ marginBottom: 8 }}>
                    {selected.category}
                  </span>
                  <h2 className="modal-title" style={{ margin: 0 }}>{selected.title}</h2>
                </div>
                <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: 'var(--gray)' }}>✕</button>
              </div>

              {/* Media */}
              <div style={{ width: '100%', aspectRatio: '16/9', borderRadius: 12, overflow: 'hidden', background: 'var(--sand)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                {selected.video_url ? (
                  <video src={selected.video_url} controls style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : selected.image_url ? (
                  <img src={selected.image_url} alt={selected.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <span style={{ fontSize: 80 }}>{catEmoji(selected.category)}</span>
                )}
              </div>

              {selected.description && (
                <p style={{ color: 'var(--gray)', lineHeight: 1.7 }}>{selected.description}</p>
              )}

              <button className="btn btn-primary" onClick={() => setSelected(null)} style={{ width: '100%', justifyContent: 'center', marginTop: 20 }}>
                Fermer
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
