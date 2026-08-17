import { StatutDossier } from "@/lib/cin/types";

const ETAPES: { statut: StatutDossier; libelle: string }[] = [
  { statut: "enregistree", libelle: "Demande enregistrée" },
  { statut: "verification", libelle: "Vérification administrative" },
  { statut: "pre_validee", libelle: "Pré-validée" },
  { statut: "rdv_planifie", libelle: "Rendez-vous biométrique" },
  { statut: "biometrie_effectuee", libelle: "Biométrie effectuée" },
  { statut: "en_production", libelle: "CIN en production" },
  { statut: "disponible", libelle: "CIN disponible" },
];

export default function SuiviTimeline({ statutActuel }: { statutActuel: StatutDossier }) {
  const enAlerte = statutActuel === "a_corriger" || statutActuel === "anomalie_verification_manuelle" || statutActuel === "rejetee";
  const indexActuel = ETAPES.findIndex((e) => e.statut === statutActuel);

  return (
    <div>
      {enAlerte && (
        <div className="mb-5 rounded-md border border-[var(--red)]/30 bg-[var(--red-soft)] px-4 py-3 text-sm text-[var(--red)]">
          {statutActuel === "a_corriger" &&
            "Votre dossier nécessite une correction. Consultez le détail ci-dessous."}
          {statutActuel === "anomalie_verification_manuelle" &&
            "Votre dossier fait l'objet d'une vérification manuelle par un agent."}
          {statutActuel === "rejetee" && "Votre dossier a été rejeté. Consultez le motif ci-dessous."}
        </div>
      )}
      <ol className="relative ml-3 border-l-2 border-[var(--line)] pl-6">
        {ETAPES.map((etape, i) => {
          const franchie = indexActuel >= 0 && i <= indexActuel && !enAlerte;
          const active = i === indexActuel && !enAlerte;
          return (
            <li key={etape.statut} className="mb-7 last:mb-0">
              <span
                className={`absolute -left-[9px] mt-0.5 h-4 w-4 rounded-full border-2 ${
                  franchie
                    ? "border-[var(--green)] bg-[var(--green)]"
                    : "border-[var(--line)] bg-[var(--panel)]"
                }`}
              />
              <p
                className={`text-sm ${
                  active
                    ? "font-semibold text-[var(--navy)]"
                    : franchie
                    ? "text-[var(--ink)]"
                    : "text-[var(--ink-soft)]"
                }`}
              >
                {etape.libelle}
                {active && (
                  <span className="ml-2 rounded-full bg-[var(--navy)] px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-white">
                    en cours
                  </span>
                )}
              </p>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
