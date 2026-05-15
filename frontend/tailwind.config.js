/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],

  theme: {
    extend: {
      /* ─── Palette Yaatal-Jokko ─── */
      colors: {
        yj: {
          bg:            '#F9E8E4', // Rose pâle – fond
          accent:        '#E8A898', // Rose/saumon – accents
          'accent-hover':'#DC8E7B', // Saumon foncé (hover)
          'accent-light':'#F5D4CC', // Saumon très clair
          title:         '#2D3561', // Bleu marine – titres
          'title-light': '#3D4A82', // Bleu marine allégé
          card:          '#FFFFFF', // Blanc – cards
          border:        '#E8C8C0', // Bordures légères
          'text-body':   '#3A3A3A', // Texte courant
          'text-muted':  '#7A7A7A', // Texte secondaire
        },
      },

      /* ─── Typographie ─── */
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body:    ['"DM Sans"', 'system-ui', 'sans-serif'],
      },

      /* ─── Border-radius ─── */
      borderRadius: {
        sm: '6px',
        md: '12px',
        lg: '20px',
        xl: '32px',
      },

      /* ─── Box shadows ─── */
      boxShadow: {
        card: '0 2px 16px rgba(45, 53, 97, 0.10)',
        'card-hover': '0 6px 28px rgba(45, 53, 97, 0.15)',
        navbar: '0 2px 12px rgba(45, 53, 97, 0.20)',
      },

      /* ─── Gradients utiles (background-image) ─── */
      backgroundImage: {
        'hero-gradient':
          'linear-gradient(135deg, #F9E8E4 0%, #FDF0EC 50%, #F5D4CC 100%)',
        'divider-gradient':
          'linear-gradient(90deg, #E8A898 0%, #F5D4CC 60%, transparent 100%)',
      },
    },
  },

  plugins: [],
};
