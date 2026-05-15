'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { auth, User } from '../lib/api';
import { useEffect, useState } from 'react';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    auth.me().then(res => setUser(res.user)).catch(() => {});
  }, []);

  const handleLogout = async () => {
    try { await auth.logout(); } catch {}
    auth.clearToken();
    router.push('/login');
  };

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  const links = [
    { href: '/dashboard', icon: '🏠', label: 'Tableau de bord' },
    { href: '/lessons', icon: '📚', label: 'Leçons' },
    { href: '/signs', icon: '🤟', label: 'Bibliothèque signes' },
  ];

  const adminLinks = [
    { href: '/admin/lessons', icon: '📝', label: 'Gérer leçons' },
    { href: '/admin/signs', icon: '🖼️', label: 'Gérer signes' },
    { href: '/admin/exercises', icon: '🧩', label: 'Gérer exercices' },
  ];

  const isAdmin = user?.role === 'teacher';

  return (
    <aside className="sidebar">
      <Link href="/" className="sidebar-logo">Yaatal <span>Jokko</span></Link>

      <div className="sidebar-section">Navigation</div>
      {links.map(l => (
        <Link key={l.href} href={l.href} className={`sidebar-link ${isActive(l.href) ? 'active' : ''}`}>
          <span style={{ fontSize: 16 }}>{l.icon}</span>
          {l.label}
        </Link>
      ))}

      {isAdmin && (
        <>
          <div className="sidebar-section">Administration</div>
          {adminLinks.map(l => (
            <Link key={l.href} href={l.href} className={`sidebar-link ${isActive(l.href) ? 'active' : ''}`}>
              <span style={{ fontSize: 16 }}>{l.icon}</span>
              {l.label}
            </Link>
          ))}
        </>
      )}

      {/* User info at bottom */}
      <div style={{ marginTop: 'auto' }}>
        {user && (
          <div style={{
            padding: '12px', borderRadius: 10,
            background: 'rgba(255,255,255,0.05)',
            marginBottom: 8,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 36, height: 36, borderRadius: '50%',
                background: 'var(--ocre)', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                color: 'white', fontSize: 14, fontWeight: 700, flexShrink: 0,
              }}>
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div style={{ overflow: 'hidden' }}>
                <div style={{ color: 'var(--white)', fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.name}</div>
                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>{user.role}</div>
              </div>
            </div>
          </div>
        )}
        <button onClick={handleLogout} className="sidebar-link" style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,100,80,0.7)' }}>
          <span>🚪</span> Déconnexion
        </button>
      </div>
    </aside>
  );
}
