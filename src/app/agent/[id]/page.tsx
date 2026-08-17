"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Header from "@/components/Header";
import StatutBadge from "@/components/StatutBadge";
import { cinDb } from "@/lib/cin/db";
import { Dossier } from "@/lib/cin/types";

export default function DetailDossierAgent() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [dossier, setDossier] = useState<Dossier | null | undefined>(undefined);
  const [motif, setMotif] = useState("");

  useEffect(() => {
    setDossier(cinDb.obtenirDossier(id) ?? null);
  }, [id]);

  function agir(action: "valider" | "corriger" | "verifier" | "rejeter") {
    if (!dossier) return;
    let maj;
    if (action === "valider") {
      maj = cinDb.mettreAJourDossier(
        dossier.id,
        { statut: "pre_validee" },
        "agent:demo",
        "Dossier validé par un agent"
      );
    } else if (action === "corriger") {
      maj = cinDb.mettreAJourDossier(
        dossier.id,
        { statut: "a_corriger", motifRejetOuCorrection: motif || "Pièce manquante ou illisible" },
        "agent:demo",
        `Correction demandée : ${motif || "non précisé"}`
      );
    } else if (action === "verifier") {
      maj = cinDb.mettreAJourDossier(
        dossier.id,
        { statut: "anomalie_verification_manuelle" },
        "agent:demo",
        "Placé en vérification manuelle par un agent"
      );
    } else {
      maj = cinDb.mettreAJourDossier(
        dossier.id,
        { statut: "rejetee", motifRejetOuCorrection: motif || "Motif non précisé" },
        "agent:demo",
        `Dossier rejeté : ${motif || "non précisé"}`
      );
    }
    if (maj) setDossier(maj);
  }

  if (dossier === undefined) return null;
  if (dossier === null) {
    return (
      <main className="min-h-screen bg-[var(--paper)]">
        <Header contexte="Espace agent" />
        <div className="mx-auto max-w-2xl px-5 py-16 text-center text-[var(--ink-soft)]">
          Dossier introuvable.
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--paper)]">
      <Header contexte="Espace agent" />
      <div className="mx-auto max-w-3xl px-5 py-10">
        <button onClick={() => router.push("/agent")} className="mb-4 text-xs text-[var(--ink-soft)] hover:underline">
          ← Retour au tableau de bord
        </button>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-mono-data text-lg text-[var(--navy)]">{dossier.id}</h1>
            <p className="text-sm text-[var(--ink-soft)]">
              {dossier.citoyen.prenom} {dossier.citoyen.nom} — {dossier.type}
            </p>
          </div>
          <StatutBadge statut={dossier.statut} />
        </div>

        <section className="mt-6 rounded-md border border-[var(--line)] bg-[var(--panel)] p-5">
          <h2 className="text-sm font-semibold text-[var(--ink)]">Identité</h2>
          <dl className="mt-3 grid grid-cols-2 gap-3 text-sm">
            <div>
              <dt className="text-xs text-[var(--ink-soft)]">Nom</dt>
              <dd>{dossier.citoyen.nom || "—"}</dd>
            </div>
            <div>
              <dt className="text-xs text-[var(--ink-soft)]">Prénom</dt>
              <dd>{dossier.citoyen.prenom || "—"}</dd>
            </div>
            <div>
              <dt className="text-xs text-[var(--ink-soft)]">Date de naissance</dt>
              <dd>{dossier.citoyen.dateNaissance || "—"}</dd>
            </div>
            {dossier.citoyen.numeroCinAncienne && (
              <div>
                <dt className="text-xs text-[var(--ink-soft)]">Ancien numéro CIN</dt>
                <dd className="font-mono-data">{dossier.citoyen.numeroCinAncienne}</dd>
              </div>
            )}
          </dl>
        </section>

        <section className="mt-4 rounded-md border border-[var(--line)] bg-[var(--panel)] p-5">
          <h2 className="text-sm font-semibold text-[var(--ink)]">Documents et contrôles</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {dossier.documents.map((doc) => (
              <li key={doc.id} className="flex items-center justify-between border-b border-[var(--line)] pb-2 last:border-0">
                <span>{doc.nomFichier}</span>
                {doc.ocr && (
                  <span className={doc.ocr.lisible ? "text-xs text-[var(--green)]" : "text-xs text-[var(--red)]"}>
                    {doc.ocr.lisible ? "OCR lisible" : "OCR illisible"}
                    {doc.ocr.incoherencesDetectees.length > 0 && " · incohérence"}
                  </span>
                )}
              </li>
            ))}
            {dossier.photoIdentite && (
              <li className="flex items-center justify-between border-b border-[var(--line)] pb-2">
                <span>{dossier.photoIdentite.nomFichier} (photo d&apos;identité)</span>
                {dossier.controlePhoto && (
                  <span
                    className={
                      dossier.controlePhoto.statut === "acceptee"
                        ? "text-xs text-[var(--green)]"
                        : "text-xs text-[var(--red)]"
                    }
                  >
                    {dossier.controlePhoto.message}
                  </span>
                )}
              </li>
            )}
            {dossier.verificationRegistre && (
              <li className="pt-1 text-xs text-[var(--ink-soft)]">
                Vérification registre : {dossier.verificationRegistre.resultat} (
                {dossier.verificationRegistre.tentatives} tentative(s))
              </li>
            )}
          </ul>
        </section>

        <section className="mt-4 rounded-md border border-[var(--line)] bg-[var(--panel)] p-5">
          <h2 className="text-sm font-semibold text-[var(--ink)]">Historique</h2>
          <ul className="mt-3 space-y-2 text-xs text-[var(--ink-soft)]">
            {dossier.historique.map((h, i) => (
              <li key={i}>
                <span className="font-mono-data">{new Date(h.date).toLocaleString("fr-FR")}</span> —{" "}
                {h.auteur} : {h.action}
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-6 rounded-md border border-[var(--navy)]/20 bg-[var(--panel)] p-5">
          <h2 className="text-sm font-semibold text-[var(--navy)]">Actions (décision humaine)</h2>
          <input
            value={motif}
            onChange={(e) => setMotif(e.target.value)}
            placeholder="Motif (pour correction ou rejet)"
            className="mt-3 w-full rounded-md border border-[var(--line)] bg-[var(--paper)] px-3 py-2 text-sm outline-none focus:border-[var(--navy)]"
          />
          <div className="mt-3 flex flex-wrap gap-2">
            <button onClick={() => agir("valider")} className="rounded-md bg-[var(--green)] px-4 py-2 text-sm font-medium text-white hover:opacity-90">
              Valider le dossier
            </button>
            <button onClick={() => agir("corriger")} className="rounded-md border border-[var(--amber)] px-4 py-2 text-sm font-medium text-[var(--amber)] hover:bg-[var(--amber-soft)]">
              Demander une correction
            </button>
            <button onClick={() => agir("verifier")} className="rounded-md border border-[var(--line)] px-4 py-2 text-sm font-medium text-[var(--ink)] hover:bg-[var(--paper)]">
              Mettre en vérification
            </button>
            <button onClick={() => agir("rejeter")} className="rounded-md border border-[var(--red)] px-4 py-2 text-sm font-medium text-[var(--red)] hover:bg-[var(--red-soft)]">
              Rejeter avec motif
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
