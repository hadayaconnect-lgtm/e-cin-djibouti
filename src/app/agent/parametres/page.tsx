"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import { cinDb } from "@/lib/cin/db";

export default function ParametresAgent() {
  const [ageMinimum, setAgeMinimum] = useState(18);
  const [enregistre, setEnregistre] = useState(false);

  useEffect(() => {
    setAgeMinimum(cinDb.obtenirParametres().ageMinimum);
  }, []);

  function enregistrer() {
    cinDb.enregistrerParametres({ ageMinimum });
    setEnregistre(true);
    setTimeout(() => setEnregistre(false), 2000);
  }

  return (
    <main className="min-h-screen bg-[var(--paper)]">
      <Header contexte="Paramètres administratifs" />
      <div className="mx-auto max-w-xl px-5 py-10">
        <Link href="/agent" className="mb-4 block text-xs text-[var(--ink-soft)] hover:underline">
          ← Retour au tableau de bord
        </Link>
        <h1 className="font-display text-2xl text-[var(--navy)]">Paramètres administratifs</h1>
        <p className="mt-2 text-sm text-[var(--ink-soft)]">
          Ces réglages s&apos;appliquent immédiatement au parcours citoyen, sans modification du code.
        </p>

        <div className="mt-6 rounded-md border border-[var(--line)] bg-[var(--panel)] p-5">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-[var(--ink)]">
              Âge minimum requis pour une demande de CIN
            </span>
            <input
              type="number"
              min={0}
              max={99}
              value={ageMinimum}
              onChange={(e) => setAgeMinimum(Number(e.target.value))}
              className="w-32 rounded-md border border-[var(--line)] bg-[var(--paper)] px-3 py-2 text-sm outline-none focus:border-[var(--navy)]"
            />
            <span className="ml-2 text-sm text-[var(--ink-soft)]">ans</span>
          </label>
          <p className="mt-2 text-xs text-[var(--ink-soft)]">
            Actuellement fixé à 18 ans, conformément à la réglementation en vigueur. Toute évolution
            réglementaire future peut être appliquée ici.
          </p>
          <button
            onClick={enregistrer}
            className="mt-4 rounded-md bg-[var(--navy)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--navy-strong)]"
          >
            Enregistrer
          </button>
          {enregistre && (
            <span className="ml-3 text-xs text-[var(--green)]">✓ Paramètre enregistré</span>
          )}
        </div>
      </div>
    </main>
  );
}
