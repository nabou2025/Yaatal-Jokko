import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Yaatal Jokko — Apprendre la langue des signes',
  description: 'Plateforme éducative pour apprendre la langue des signes sénégalaise',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
