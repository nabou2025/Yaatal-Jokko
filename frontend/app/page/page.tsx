import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#061a30] text-white overflow-hidden relative">
      {/* Decorative background circles */}
      <div className="absolute top-[-80px] right-[-80px] w-[400px] h-[400px] rounded-full bg-[#0d6e56] opacity-20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-100px] left-[-60px] w-[300px] h-[300px] rounded-full bg-[#1a4a7a] opacity-30 blur-3xl pointer-events-none" />

      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-5 relative z-10">
        <span className="font-serif text-xl font-bold tracking-tight">
          Yaatal <span className="text-[#1d9e75]">Jokko</span>
        </span>
        <div className="flex gap-3">
          <Link
            href="/login"
            className="px-5 py-2 text-sm text-white/80 hover:text-white transition-colors"
          >
            Connexion
          </Link>
          <Link
            href="/register"
            className="px-5 py-2 text-sm bg-[#1d9e75] hover:bg-[#18876a] text-white rounded-lg transition-colors font-medium"
          >
            S&apos;inscrire
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 flex flex-col items-center text-center px-6 pt-20 pb-24 gap-6">
        <span className="bg-white/10 text-white/80 text-xs uppercase tracking-widest px-4 py-1.5 rounded-full border border-white/20">
          🤟 Apprendre la Langue des Signes
        </span>
        <h1 className="font-serif text-5xl md:text-6xl font-bold leading-tight max-w-2xl">
          Parlez avec vos{' '}
          <span className="text-[#1d9e75]">mains</span>,<br />
          connectez vos cœurs
        </h1>
        <p className="text-white/60 text-lg max-w-lg leading-relaxed">
          Yaatal Jokko est une plateforme éducative interactive pour apprendre la langue des signes
          à votre rythme — leçons, exercices et progression personnalisée.
        </p>
        <div className="flex gap-4 mt-2 flex-wrap justify-center">
          <Link
            href="/register"
            className="px-8 py-3.5 bg-[#1d9e75] hover:bg-[#18876a] text-white rounded-xl font-medium text-base transition-all hover:scale-105 shadow-lg"
          >
            Commencer gratuitement →
          </Link>
          <Link
            href="/login"
            className="px-8 py-3.5 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium text-base transition-all border border-white/20"
          >
            J&apos;ai déjà un compte
          </Link>
        </div>
      </section>

      {/* Feature cards */}
      <section className="relative z-10 px-8 pb-24 grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto">
        {[
          { icon: '📚', title: 'Leçons structurées', desc: 'De débutant à avancé, avec vidéos et illustrations.' },
          { icon: '✏️', title: 'Exercices interactifs', desc: 'Pratiquez et testez vos acquis à chaque étape.' },
          { icon: '📈', title: 'Suivi de progression', desc: 'Visualisez votre avancement en temps réel.' },
        ].map((f) => (
          <div
            key={f.title}
            className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col gap-3 hover:bg-white/10 transition-colors"
          >
            <span className="text-3xl">{f.icon}</span>
            <h3 className="font-semibold text-white text-base">{f.title}</h3>
            <p className="text-white/50 text-sm leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </section>

      {/* Footer */}
      <footer className="relative z-10 text-center pb-8 text-white/30 text-xs">
        © {new Date().getFullYear()} Yaatal Jokko — Projet éducatif
      </footer>
    </main>
  );
}