"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import SuiviTimeline from "@/components/SuiviTimeline";
import StatutBadge from "@/components/StatutBadge";
import { cinDb } from "@/lib/cin/db";
import { amorcerDonneesDemo } from "@/lib/cin/seed";
import { Dossier } from "@/lib/cin/types";

const CENTRES = ["Centre CIN — Djibouti-ville", "Centre CIN — Balbala", "Centre CIN — Ali Sabieh"];
const CRENEAUX = ["08:30", "09:30", "10:30", "14:00", "15:00"];

function SuiviContenu() {
  const params = useSearchParams();
  const [reference, setReference] = useState(params.get("ref") ?? "");
  const [dossier, setDossier] = useState<Dossier | null | undefined>(undefined);
  const [centre, setCentre] = useState(CENTRES[0]);
  const [date, setDate] = useState("");
  const [creneau, setCreneau] = useState(CRENEAUX[0]);

  useEffect(() => {
    amorcerDonneesDemo();
    if (params.get("ref")) rechercher(params.get("ref")!);
  }, []);

  function rechercher(ref: string) {
    const trouve = cinDb.obtenirDossier(ref.trim());
    setDossier(trouve ?? null);
  }

  function planifierRdv() {
    if (!dossier || !date) return;
    const qrCode = `QR-${dossier.id}-${Date.now().toString(36).toUpperCase()}`;
    const maj = cinDb.mettreAJourDossier(
      dossier.id,
      { rendezVous: { centre, date, creneau, qrCode }, statut: "rdv_planifie" },
      "citoyen",
      `Rendez-vous biométrique planifié — ${centre}, ${date} ${creneau}`
    );
    if (maj) setDossier(maj);
  }

  return (
    <main className="min-h-screen bg-[var(--paper)]">
      <Header contexte="Suivi de la demande" />
      <div className="mx-auto max-w-2xl px-5 py-10">
        <h1 className="font-display text-2xl text-[var(--navy)]">Suivre ma demande</h1>
        <p className="mt-2 text-sm text-[var(--ink-soft)]">
          Saisissez la référence de votre dossier, communiquée lors de la transmission.
        </p>

        <div className="mt-6 flex gap-2">
          <input
            value={reference}
            onChange={(e) => setReference(e.target.value)}
            placeholder="ECIN-2026-000123"
            className="flex-1 rounded-md border border-[var(--line)] bg-[var(--panel)] px-3 py-2 text-sm font-mono-data outline-none focus:border-[var(--navy)]"
          />
          <button
            onClick={() => rechercher(reference)}
            className="rounded-md bg-[var(--navy)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--navy-strong)]"
          >
            Rechercher
          </button>
        </div>

        {dossier === null && (
          <p className="mt-6 text-sm text-[var(--red)]">
            Aucun dossier ne correspond à cette référence. Vérifiez votre saisie.
          </p>
        )}

        {dossier && (
          <div className="mt-8">
            <div className="mb-6 flex items-center justify-between rounded-md border border-[var(--line)] bg-[var(--panel)] px-4 py-3">
              <div>
                <p className="font-mono-data text-sm text-[var(--navy)]">{dossier.id}</p>
                <p className="text-xs text-[var(--ink-soft)]">
                  {dossier.citoyen.prenom} {dossier.citoyen.nom}
                </p>
              </div>
              <StatutBadge statut={dossier.statut} />
            </div>

            <SuiviTimeline statutActuel={dossier.statut} />

            {dossier.motifRejetOuCorrection && (
              <div className="mt-6 rounded-md border border-[var(--red)]/30 bg-[var(--red-soft)] p-4 text-sm text-[var(--red)]">
                <p className="font-medium">Motif :</p>
                <p className="mt-1">{dossier.motifRejetOuCorrection}</p>
              </div>
            )}

            {dossier.statut === "pre_validee" && !dossier.rendezVous && (
              <div className="mt-8 rounded-md border border-[var(--green)]/30 bg-[var(--green-soft)] p-5">
                <p className="text-sm font-medium text-[var(--green)]">
                  Votre dossier a été pré-validé. Vous pouvez maintenant choisir votre rendez-vous pour
                  l&apos;enrôlement biométrique.
                </p>
                <div className="mt-4 space-y-3">
                  <label className="block">
                    <span className="mb-1 block text-xs font-medium text-[var(--ink)]">Centre</span>
                    <select
                      value={centre}
                      onChange={(e) => setCentre(e.target.value)}
                      className="w-full rounded-md border border-[var(--line)] bg-[var(--panel)] px-3 py-2 text-sm"
                    >
                      {CENTRES.map((c) => (
                        <option key={c}>{c}</option>
                      ))}
                    </select>
                  </label>
                  <label className="block">
                    <span className="mb-1 block text-xs font-medium text-[var(--ink)]">Date</span>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full rounded-md border border-[var(--line)] bg-[var(--panel)] px-3 py-2 text-sm"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-1 block text-xs font-medium text-[var(--ink)]">Créneau</span>
                    <select
                      value={creneau}
                      onChange={(e) => setCreneau(e.target.value)}
                      className="w-full rounded-md border border-[var(--line)] bg-[var(--panel)] px-3 py-2 text-sm"
                    >
                      {CRENEAUX.map((c) => (
                        <option key={c}>{c}</option>
                      ))}
                    </select>
                  </label>
                  <button
                    onClick={planifierRdv}
                    disabled={!date}
                    className="rounded-md bg-[var(--navy)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--navy-strong)] disabled:opacity-40"
                  >
                    Confirmer le rendez-vous
                  </button>
                </div>
              </div>
            )}

            {dossier.rendezVous && (
              <div className="mt-8 rounded-md border border-[var(--line)] bg-[var(--panel)] p-5">
                <p className="text-sm font-medium text-[var(--navy)]">Votre rendez-vous</p>
                <p className="mt-1 text-sm text-[var(--ink-soft)]">
                  {dossier.rendezVous.centre} — {dossier.rendezVous.date} à {dossier.rendezVous.creneau}
                </p>
                <div className="mt-4 flex items-center gap-3">
                  <span className="sceau h-12 w-12 shrink-0 font-mono-data text-[9px]">QR</span>
                  <p className="font-mono-data text-xs text-[var(--ink-soft)]">
                    {dossier.rendezVous.qrCode}
                  </p>
                </div>
                <p className="mt-3 text-xs text-[var(--ink-soft)]">
                  Présentez ce code à l&apos;accueil. Apportez vos 3 photos physiques et une pièce
                  d&apos;identité. Sur place, l&apos;administration procède à la photo biométrique
                  officielle, à la prise d&apos;empreintes digitales et à la capture de l&apos;iris —
                  aucune de ces données n&apos;est collectée avant votre venue.
                </p>
              </div>
            )}
          </div>
        )}

        <p className="mt-10 text-xs text-[var(--ink-soft)]">
          Exemples de références de démonstration : essayez de rechercher un dossier existant depuis
          l&apos;espace agent pour obtenir une référence valide.
        </p>
      </div>
    </main>
  );
}

export default function Suivi() {
  return (
    <Suspense fallback={null}>
      <SuiviContenu />
    </Suspense>
  );
}
