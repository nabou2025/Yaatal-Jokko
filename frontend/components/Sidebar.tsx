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
    { href: '/admin/quiz', icon: '🧩', label: 'Gérer quiz' },
    { href: '/admin/themes', icon: '🎯', label: 'Gérer thèmes' },
    { href: '/admin/niveaux', icon: '📚', label: 'Gérer niveaux' },
  ];

  const isAdmin = user?.role === 'admin';

  return (
    <aside style={{
      width: 240,
      minHeight: '100vh',
      backgroundColor: 'var(--color-title)',
      padding: '24px 16px',
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
      position: 'fixed',
      top: 0,
      left: 0,
      zIndex: 100,
      boxShadow: '4px 0 20px rgba(45,53,97,0.15)',
    }}>

      {/* Logo */}
      <Link href={isAdmin ? "/admin" : "/"} style={{
        fontSize: 20,
        fontWeight: 800,
        color: 'white',
        textDecoration: 'none',
        marginBottom: 28,
        display: 'block',
        letterSpacing: '-0.3px',
      }}>
        Yaatal <span style={{ color: 'var(--color-accent)' }}>Jokko</span>
      </Link>

      {/* Section Navigation */}
      <div style={{
        fontSize: 10,
        textTransform: 'uppercase',
        color: 'rgba(255,255,255,0.35)',
        letterSpacing: '1.2px',
        marginBottom: 6,
        marginTop: 4,
        paddingLeft: 12,
      }}>Navigation</div>

      {links.map(l => (
        <Link key={l.href} href={l.href} style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '10px 12px',
          borderRadius: 10,
          color: isActive(l.href) ? 'white' : 'rgba(255,255,255,0.65)',
          textDecoration: 'none',
          fontSize: 14,
          fontWeight: isActive(l.href) ? 600 : 400,
          backgroundColor: isActive(l.href) ? 'rgba(255,255,255,0.12)' : 'transparent',
          transition: 'all 0.2s',
          borderLeft: isActive(l.href) ? '3px solid var(--color-accent)' : '3px solid transparent',
        }}>
          <span style={{ fontSize: 16 }}>{l.icon}</span>
          {l.label}
        </Link>
      ))}

      {/* Section Administration */}
      {isAdmin && (
        <>
          <div style={{
            fontSize: 10,
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.35)',
            letterSpacing: '1.2px',
            marginBottom: 6,
            marginTop: 16,
            paddingLeft: 12,
          }}>Administration</div>

          {adminLinks.map(l => (
            <Link key={l.href} href={l.href} style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '10px 12px',
              borderRadius: 10,
              color: isActive(l.href) ? 'white' : 'rgba(255,255,255,0.65)',
              textDecoration: 'none',
              fontSize: 14,
              fontWeight: isActive(l.href) ? 600 : 400,
              backgroundColor: isActive(l.href) ? 'rgba(255,255,255,0.12)' : 'transparent',
              transition: 'all 0.2s',
              borderLeft: isActive(l.href) ? '3px solid var(--color-accent)' : '3px solid transparent',
            }}>
              <span style={{ fontSize: 16 }}>{l.icon}</span>
              {l.label}
            </Link>
          ))}
        </>
      )}

      {/* User info en bas */}
      <div style={{ marginTop: 'auto' }}>
        {user && (
          <div style={{
            padding: 12,
            borderRadius: 12,
            background: 'rgba(255,255,255,0.07)',
            marginBottom: 8,
            border: '1px solid rgba(255,255,255,0.08)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 36, height: 36, borderRadius: '50%',
                backgroundColor: 'var(--color-accent)',
                display: 'flex', alignItems: 'center',
                justifyContent: 'center',
                color: 'white', fontSize: 14, fontWeight: 700, flexShrink: 0,
              }}>
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div style={{ overflow: 'hidden' }}>
                <div style={{
                  color: 'white', fontSize: 13, fontWeight: 600,
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                }}>{user.name}</div>
                <div style={{
                  color: 'rgba(255,255,255,0.4)', fontSize: 11,
                }}>{user.role}</div>
              </div>
            </div>
          </div>
        )}

        <button onClick={handleLogout} style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '10px 12px',
          borderRadius: 10,
          width: '100%',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: 'rgba(255,100,80,0.75)',
          fontSize: 14,
          transition: 'all 0.2s',
        }}>
          <span>🚪</span> Déconnexion
        </button>
      </div>
    </aside>
  );
}