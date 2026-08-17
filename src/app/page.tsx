import Link from "next/link";
import Header from "@/components/Header";

const PARCOURS = [
  {
    href: "/premiere-demande",
    titre: "Première demande",
    description:
      "Vous n'avez jamais eu de Carte d'Identité Nationale. Préparez votre dossier avant de vous présenter.",
    icone: "01",
  },
  {
    href: "/renouvellement",
    titre: "Renouvellement",
    description:
      "Votre carte arrive à expiration. Téléversez votre ancienne CIN et vos informations familiales.",
    icone: "02",
  },
  {
    href: "/perte",
    titre: "Remplacement après perte",
    description: "Votre carte a été perdue ou volée. Une déclaration à la Police est requise au préalable.",
    icone: "03",
  },
  {
    href: "/suivi",
    titre: "Suivre ma demande",
    description: "Consultez l'avancement de votre dossier grâce à votre référence.",
    icone: "04",
  },
];

const ETAPES = [
  { titre: "Depuis chez vous", texte: "Renseignez vos informations et téléversez vos documents." },
  { titre: "Contrôles intelligents", texte: "L'OCR et les vérifications automatiques préparent votre dossier." },
  { titre: "Vérification administrative", texte: "Un agent habilité examine et pré-valide votre dossier." },
  { titre: "Rendez-vous", texte: "Vous vous déplacez uniquement pour la biométrie, déjà planifiée." },
];

export default function Accueil() {
  return (
    <main className="min-h-screen bg-[var(--paper)]">
      <Header />

      <section className="mx-auto max-w-5xl px-5 pb-14 pt-16 sm:pt-20">
        <p className="mb-4 font-mono-data text-xs uppercase tracking-[0.16em] text-[var(--sky)]">
          Plateforme de pré-demande — République de Djibouti
        </p>
        <h1 className="font-display max-w-3xl text-4xl leading-tight text-[var(--navy)] sm:text-5xl">
          Préparez votre Carte d&apos;Identité Nationale avant de vous déplacer.
        </h1>
        <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-[var(--ink-soft)]">
          e-CIN ne remplace pas l&apos;enrôlement biométrique existant. Cette plateforme vous permet de
          commencer votre démarche depuis votre téléphone ou ordinateur, afin de ne vous présenter en
          personne que lorsque cela est réellement nécessaire.
        </p>
      </section>

      <section className="mx-auto max-w-5xl px-5 pb-16">
        <div className="grid gap-4 sm:grid-cols-2">
          {PARCOURS.map((p) => (
            <Link
              key={p.href}
              href={p.href}
              className="group rounded-lg border border-[var(--line)] bg-[var(--panel)] p-6 transition-colors hover:border-[var(--navy)]"
            >
              <span className="font-mono-data text-xs text-[var(--sky)]">{p.icone}</span>
              <h2 className="font-display mt-2 text-xl text-[var(--navy)] group-hover:underline">
                {p.titre}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-[var(--ink-soft)]">{p.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-y border-[var(--line)] bg-[var(--panel)]">
        <div className="mx-auto max-w-5xl px-5 py-14">
          <h2 className="font-display text-2xl text-[var(--navy)]">Comment ça marche</h2>
          <div className="mt-8 grid gap-8 sm:grid-cols-4">
            {ETAPES.map((e, i) => (
              <div key={e.titre}>
                <div className="mb-3 flex items-center gap-2">
                  <span className="font-mono-data text-sm text-[var(--sky)]">{i + 1}</span>
                  <div className="h-px flex-1 bg-[var(--line)]" />
                </div>
                <h3 className="text-sm font-semibold text-[var(--ink)]">{e.titre}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-[var(--ink-soft)]">{e.texte}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-14">
        <div className="rounded-lg border border-[var(--line)] bg-[var(--panel)] p-6 sm:p-8">
          <span className="sceau h-10 w-10 font-display text-xs font-semibold" aria-hidden>
            e-CIN
          </span>
          <h2 className="font-display mt-4 text-xl text-[var(--navy)]">
            La décision finale reste toujours humaine
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--ink-soft)]">
            Les contrôles automatiques et l&apos;intelligence artificielle assistent la préparation de
            votre dossier — ils ne prennent jamais seuls une décision administrative défavorable. La
            photographie et les données biométriques officielles continuent d&apos;être réalisées par
            l&apos;administration lors de votre rendez-vous.
          </p>
        </div>
      </section>

      <footer className="border-t border-[var(--line)] px-5 py-8 text-center text-xs text-[var(--ink-soft)]">
        e-CIN Djibouti — Prototype de démonstration à données fictives. Aucune donnée réelle de citoyen
        n&apos;est utilisée.
      </footer>
    </main>
  );
}
