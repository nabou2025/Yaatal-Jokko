/**
 * Yaatal-Jokko – Design Tokens (TypeScript)
 * Branche: frontend-theme
 *
 * Source unique de vérité pour toutes les couleurs et valeurs
 * du thème. Importer depuis les composants React/Next.js.
 */

export const colors = {
  bg:           '#F9E8E4', // Rose pâle – fond général
  accent:       '#E8A898', // Rose/saumon – accents & CTA
  accentHover:  '#DC8E7B', // Saumon foncé (état hover)
  accentLight:  '#F5D4CC', // Saumon très clair (backgrounds subtils)
  title:        '#2D3561', // Bleu marine – titres & navbar
  titleLight:   '#3D4A82', // Bleu marine allégé
  card:         '#FFFFFF', // Blanc – fond des cards
  border:       '#E8C8C0', // Bordures légères
  textBody:     '#3A3A3A', // Corps de texte
  textMuted:    '#7A7A7A', // Texte secondaire / placeholder
  shadow:       'rgba(45, 53, 97, 0.10)',
} as const;

export type ColorKey = keyof typeof colors;

export const fonts = {
  display: '"Playfair Display", Georgia, serif',
  body:    '"DM Sans", system-ui, sans-serif',
} as const;

export const radii = {
  sm: '6px',
  md: '12px',
  lg: '20px',
  xl: '32px',
} as const;

export const shadows = {
  card:      '0 2px 16px rgba(45, 53, 97, 0.10)',
  cardHover: '0 6px 28px rgba(45, 53, 97, 0.15)',
  navbar:    '0 2px 12px rgba(45, 53, 97, 0.20)',
} as const;

export const transitions = {
  fast:   '0.15s ease',
  normal: '0.25s ease',
  slow:   '0.4s ease',
} as const;

/** CSS custom properties générées automatiquement depuis les tokens */
export const cssVariables: Record<string, string> = {
  '--color-bg':           colors.bg,
  '--color-accent':       colors.accent,
  '--color-accent-hover': colors.accentHover,
  '--color-accent-light': colors.accentLight,
  '--color-title':        colors.title,
  '--color-title-light':  colors.titleLight,
  '--color-card':         colors.card,
  '--color-border':       colors.border,
  '--color-text-body':    colors.textBody,
  '--color-text-muted':   colors.textMuted,
  '--color-shadow':       colors.shadow,
};
