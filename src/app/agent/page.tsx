"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import StatutBadge from "@/components/StatutBadge";
import { cinDb } from "@/lib/cin/db";
import { amorcerDonneesDemo } from "@/lib/cin/seed";
import { Dossier, StatutDossier } from "@/lib/cin/types";

const COLONNES: { statut: StatutDossier; titre: string }[] = [
  { statut: "enregistree", titre: "Nouvelles demandes" },
  { statut: "verification", titre: "En vérification" },
  { statut: "anomalie_verification_manuelle", titre: "Anomalies à vérifier" },
  { statut: "a_corriger", titre: "Retournés pour correction" },
  { statut: "pre_validee", titre: "Pré-validés" },
  { statut: "rdv_planifie", titre: "Rendez-vous biométriques" },
  { statut: "rejetee", titre: "Rejetés" },
];

const LIBELLE_TYPE: Record<Dossier["type"], string> = {
  premiere: "Première demande",
  renouvellement: "Renouvellement",
  remplacement: "Remplacement",
};

export default function EspaceAgent() {
  const [dossiers, setDossiers] = useState<Dossier[]>([]);
  const [filtre, setFiltre] = useState<StatutDossier | "tous">("tous");

  useEffect(() => {
    amorcerDonneesDemo();
    setDossiers(cinDb.listerDossiers());
  }, []);

  const compteurs = useMemo(() => {
    const m = new Map<StatutDossier, number>();
    dossiers.forEach((d) => m.set(d.statut, (m.get(d.statut) ?? 0) + 1));
    return m;
  }, [dossiers]);

  const affiches = filtre === "tous" ? dossiers : dossiers.filter((d) => d.statut === filtre);

  return (
    <main className="min-h-screen bg-[var(--paper)]">
      <Header contexte="Espace agent" />
      <div className="mx-auto max-w-6xl px-5 py-10">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-2xl text-[var(--navy)]">Tableau de bord</h1>
          <div className="flex items-center gap-4">
            <Link href="/agent/parametres" className="text-xs text-[var(--navy)] hover:underline">
              Paramètres
            </Link>
            <span className="font-mono-data text-xs text-[var(--ink-soft)]">
              {dossiers.length} dossier(s)
            </span>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          <button
            onClick={() => setFiltre("tous")}
            className={`rounded-full border px-3 py-1.5 text-xs ${
              filtre === "tous"
                ? "border-[var(--navy)] bg-[var(--navy)] text-white"
                : "border-[var(--line)] text-[var(--ink-soft)]"
            }`}
          >
            Tous ({dossiers.length})
          </button>
          {COLONNES.map((c) => (
            <button
              key={c.statut}
              onClick={() => setFiltre(c.statut)}
              className={`rounded-full border px-3 py-1.5 text-xs ${
                filtre === c.statut
                  ? "border-[var(--navy)] bg-[var(--navy)] text-white"
                  : "border-[var(--line)] text-[var(--ink-soft)]"
              }`}
            >
              {c.titre} ({compteurs.get(c.statut) ?? 0})
            </button>
          ))}
        </div>

        <div className="mt-6 overflow-hidden rounded-md border border-[var(--line)] bg-[var(--panel)]">
          <table className="w-full text-sm">
            <thead className="bg-[var(--paper)] text-left text-xs uppercase tracking-wide text-[var(--ink-soft)]">
              <tr>
                <th className="px-4 py-3">Référence</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Citoyen</th>
                <th className="px-4 py-3">Statut</th>
                <th className="px-4 py-3">Mis à jour</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--line)]">
              {affiches.map((d) => (
                <tr key={d.id}>
                  <td className="px-4 py-3 font-mono-data text-xs">
                    <Link href={`/agent/${d.id}`} className="text-[var(--navy)] hover:underline">
                      {d.id}
                    </Link>
                  </td>
                  <td className="px-4 py-3">{LIBELLE_TYPE[d.type]}</td>
                  <td className="px-4 py-3">
                    {d.citoyen.prenom} {d.citoyen.nom}
                  </td>
                  <td className="px-4 py-3">
                    <StatutBadge statut={d.statut} />
                  </td>
                  <td className="px-4 py-3 text-xs text-[var(--ink-soft)]">
                    {new Date(d.dateMiseAJour).toLocaleDateString("fr-FR")}
                  </td>
                </tr>
              ))}
              {affiches.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-[var(--ink-soft)]">
                    Aucun dossier pour ce filtre.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
