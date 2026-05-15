'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../../../components/Sidebar';
import { api, auth, Sign } from '../../../lib/api';

const EMPTY: Partial<Sign> = { title: '', description: '', category: 'alphabet', video_url: '', image_url: '' };

export default function AdminSignsPage() {
  const router = useRouter();
  const [signs, setSigns] = useState<Sign[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<'create' | 'edit' | null>(null);
  const [form, setForm] = useState<Partial<Sign>>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!auth.isLoggedIn()) { router.push('/login'); return; }
    load();
  }, [router]);

  const load = () => {
    api.get<Sign[]>('/signs')
      .then(data => setSigns(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  };

  const handle = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const openCreate = () => { setForm(EMPTY); setError(''); setModal('create'); };
  const openEdit = (s: Sign) => { setForm(s); setError(''); setModal('edit'); };

  const save = async () => {
    setError(''); setSaving(true);
    try {
      if (modal === 'create') {
        await api.post('/signs', form);
        setSuccess('Signe créé avec succès !');
      } else {
        await api.put(`/signs/${form.id}`, form);
        setSuccess('Signe mis à jour !');
      }
      setModal(null);
      load();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: number) => {
    if (!confirm('Supprimer ce signe ?')) return;
    try {
      await api.delete(`/signs/${id}`);
      setSigns(prev => prev.filter(s => s.id !== id));
      setSuccess('Signe supprimé.');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Erreur');
    }
  };

  return (
    <div className="dash-layout">
      <Sidebar />
      <main className="dash-content">
        <div className="dash-header animate-up" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ fontSize: 32 }}>🖼️ Gestion des signes</h1>
            <p style={{ color: 'var(--gray)', marginTop: 4 }}>{signs.length} signe{signs.length > 1 ? 's' : ''}</p>
          </div>
          <button className="btn btn-primary" onClick={openCreate}>➕ Nouveau signe</button>
        </div>

        {success && <div className="alert alert-success animate-in">{success}</div>}

        {loading ? (
          <div style={{ textAlign: 'center', padding: 80, fontSize: 40 }}>🖼️</div>
        ) : (
          <div className="animate-up delay-1" style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Titre</th>
                  <th>Catégorie</th>
                  <th>Description</th>
                  <th>Vidéo</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {signs.length === 0 ? (
                  <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--gray)', padding: 40 }}>Aucun signe créé</td></tr>
                ) : signs.map(s => (
                  <tr key={s.id}>
                    <td style={{ fontWeight: 600 }}>{s.title}</td>
                    <td>
                      <span className={`badge ${s.category === 'alphabet' ? 'badge-forest' : s.category === 'word' ? 'badge-ocre' : 'badge-terra'}`}>
                        {s.category}
                      </span>
                    </td>
                    <td style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--gray)' }}>
                      {s.description || '—'}
                    </td>
                    <td style={{ color: s.video_url ? 'var(--forest)' : 'var(--gray-light)' }}>
                      {s.video_url ? '✅' : '—'}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button className="btn btn-ghost" style={{ padding: '6px 12px', fontSize: 13 }} onClick={() => openEdit(s)}>✏️ Modifier</button>
                        <button className="btn btn-danger" style={{ padding: '6px 12px', fontSize: 13 }} onClick={() => remove(s.id)}>🗑️</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal */}
        {modal && (
          <div className="modal-overlay" onClick={() => setModal(null)}>
            <div className="modal-box" onClick={e => e.stopPropagation()}>
              <h2 className="modal-title">{modal === 'create' ? '➕ Nouveau signe' : '✏️ Modifier le signe'}</h2>
              {error && <div className="alert alert-error">{error}</div>}

              <div className="form-group">
                <label className="label">Titre *</label>
                <input className="input-field" name="title" value={form.title || ''} onChange={handle} placeholder="Ex: Bonjour" />
              </div>
              <div className="form-group">
                <label className="label">Catégorie *</label>
                <select className="input-field" name="category" value={form.category || 'alphabet'} onChange={handle}>
                  <option value="alphabet">Alphabet</option>
                  <option value="word">Mot</option>
                  <option value="phrase">Phrase</option>
                </select>
              </div>
              <div className="form-group">
                <label className="label">Description</label>
                <textarea className="input-field" name="description" value={form.description || ''} onChange={handle as React.ChangeEventHandler<HTMLTextAreaElement>} placeholder="Description du signe..." rows={3} style={{ resize: 'vertical' }} />
              </div>
              <div className="form-group">
                <label className="label">URL Vidéo</label>
                <input className="input-field" name="video_url" value={form.video_url || ''} onChange={handle} placeholder="https://..." />
              </div>
              <div className="form-group">
                <label className="label">URL Image</label>
                <input className="input-field" name="image_url" value={form.image_url || ''} onChange={handle} placeholder="https://..." />
              </div>

              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 8 }}>
                <button className="btn btn-ghost" onClick={() => setModal(null)}>Annuler</button>
                <button className="btn btn-primary" onClick={save} disabled={saving}>
                  {saving ? 'Enregistrement...' : '✅ Enregistrer'}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
