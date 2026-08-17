import { LIBELLES_STATUT, StatutDossier } from "@/lib/cin/types";

const STYLES: Record<StatutDossier, string> = {
  enregistree: "bg-[var(--sky)]/15 text-[var(--navy)]",
  verification: "bg-[var(--amber-soft)] text-[var(--amber)]",
  a_corriger: "bg-[var(--red-soft)] text-[var(--red)]",
  anomalie_verification_manuelle: "bg-[var(--amber-soft)] text-[var(--amber)]",
  pre_validee: "bg-[var(--green-soft)] text-[var(--green)]",
  rdv_planifie: "bg-[var(--sky)]/15 text-[var(--navy)]",
  biometrie_effectuee: "bg-[var(--green-soft)] text-[var(--green)]",
  en_production: "bg-[var(--sky)]/15 text-[var(--navy)]",
  disponible: "bg-[var(--green-soft)] text-[var(--green)]",
  rejetee: "bg-[var(--red-soft)] text-[var(--red)]",
};

export default function StatutBadge({ statut }: { statut: StatutDossier }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${STYLES[statut]}`}
    >
      {LIBELLES_STATUT[statut]}
    </span>
  );
}
