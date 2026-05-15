'use client';

/**
 * ThemeProvider — Yaatal-Jokko
 * Branche: frontend-theme
 *
 * Injecte les variables CSS du thème dans :root via le style inline.
 * À placer dans app/layout.tsx (Next.js App Router) ou _app.tsx (Pages Router).
 *
 * Utilisation :
 *   <ThemeProvider>
 *     {children}
 *   </ThemeProvider>
 */

import { cssVariables } from '../styles/tokens';

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  return (
    <div
      style={cssVariables as React.CSSProperties}
      className="yaatal-theme-root"
    >
      {children}
    </div>
  );
}

export default ThemeProvider;
