/**
 * Card — Composant exemple Yaatal-Jokko
 * Branche: frontend-theme
 *
 * Utilise les classes CSS du thème (theme.css) et les tokens TypeScript.
 */

import { colors, radii, shadows } from '../styles/tokens';

interface CardProps {
  title: string;
  description?: string;
  badge?: string;
  children?: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export function Card({
  title,
  description,
  badge,
  children,
  onClick,
  className = '',
}: CardProps) {
  return (
    <div
      className={`card ${className}`}
      style={{
        background: colors.card,
        borderRadius: radii.md,
        boxShadow: shadows.card,
        padding: '1.5rem',
        border: `1px solid ${colors.border}`,
        cursor: onClick ? 'pointer' : 'default',
        transition: 'box-shadow 0.25s ease, transform 0.25s ease',
      }}
      onClick={onClick}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = shadows.cardHover;
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = shadows.card;
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
      }}
    >
      {badge && (
        <span
          className="badge"
          style={{ marginBottom: '0.75rem', display: 'inline-block' }}
        >
          {badge}
        </span>
      )}

      <h3
        style={{
          color: colors.title,
          marginBottom: description ? '0.5rem' : '0',
        }}
      >
        {title}
      </h3>

      {description && (
        <p style={{ color: colors.textMuted, fontSize: '0.9rem' }}>
          {description}
        </p>
      )}

      {children && <div style={{ marginTop: '1rem' }}>{children}</div>}
    </div>
  );
}

export default Card;
