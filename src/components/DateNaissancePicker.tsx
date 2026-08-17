"use client";

import { useEffect, useRef, useState } from "react";
import { formaterDateFr } from "@/lib/cin/date-fr";

const MOIS_FR = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
];
const JOURS_FR = ["Lu", "Ma", "Me", "Je", "Ve", "Sa", "Di"]; // semaine commençant le lundi

function auFormatISO(annee: number, mois: number, jour: number): string {
  return `${annee}-${String(mois + 1).padStart(2, "0")}-${String(jour).padStart(2, "0")}`;
}

function decomposerISO(iso: string): { annee: number; mois: number; jour: number } | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return null;
  return { annee: Number(m[1]), mois: Number(m[2]) - 1, jour: Number(m[3]) };
}

export default function DateNaissancePicker({
  label,
  valeur,
  onChange,
  dateMax,
}: {
  label: string;
  valeur: string; // ISO yyyy-mm-dd
  onChange: (iso: string) => void;
  /** Date la plus récente sélectionnable (ISO). Par défaut : aujourd'hui. */
  dateMax?: string;
}) {
  const conteneurRef = useRef<HTMLDivElement>(null);
  const [ouvert, setOuvert] = useState(false);

  const limiteMax = dateMax ?? new Date().toISOString().slice(0, 10);
  const decomposeMax = decomposerISO(limiteMax)!;
  const initial = decomposerISO(valeur) ?? decomposeMax;

  const [vueAnnee, setVueAnnee] = useState(initial.annee);
  const [vueMois, setVueMois] = useState(initial.mois);

  useEffect(() => {
    function fermerSiExterieur(e: MouseEvent) {
      if (conteneurRef.current && !conteneurRef.current.contains(e.target as Node)) {
        setOuvert(false);
      }
    }
    document.addEventListener("mousedown", fermerSiExterieur);
    return () => document.removeEventListener("mousedown", fermerSiExterieur);
  }, []);

  const dateMaxObj = new Date(limiteMax);
  const premierJourMois = new Date(vueAnnee, vueMois, 1);
  const decalage = (premierJourMois.getDay() + 6) % 7; // 0 = lundi
  const joursDansMois = new Date(vueAnnee, vueMois + 1, 0).getDate();

  const cellules: (number | null)[] = [
    ...Array(decalage).fill(null),
    ...Array.from({ length: joursDansMois }, (_, i) => i + 1),
  ];

  function estDesactive(jour: number): boolean {
    const d = new Date(vueAnnee, vueMois, jour);
    return d > dateMaxObj;
  }

  function moisPrecedent() {
    setVueMois((m) => {
      if (m === 0) {
        setVueAnnee((a) => a - 1);
        return 11;
      }
      return m - 1;
    });
  }

  function moisSuivant() {
    const prochain = new Date(vueAnnee, vueMois + 1, 1);
    if (prochain > dateMaxObj && prochain.getMonth() !== dateMaxObj.getMonth()) return;
    setVueMois((m) => {
      if (m === 11) {
        setVueAnnee((a) => a + 1);
        return 0;
      }
      return m + 1;
    });
  }

  const moisSuivantDesactive =
    vueAnnee === dateMaxObj.getFullYear() && vueMois === dateMaxObj.getMonth();

  return (
    <div className="relative" ref={conteneurRef}>
      <span className="mb-1.5 block text-sm font-medium text-[var(--ink)]">{label}</span>
      <button
        type="button"
        onClick={() => setOuvert((v) => !v)}
        className="flex w-full items-center justify-between rounded-md border border-[var(--line)] bg-[var(--panel)] px-3 py-2 text-left text-sm outline-none focus:border-[var(--navy)]"
      >
        <span className={valeur ? "text-[var(--ink)]" : "text-[var(--ink-soft)]"}>
          {valeur ? formaterDateFr(valeur) : "JJ/MM/AAAA"}
        </span>
        <span aria-hidden className="text-[var(--ink-soft)]">📅</span>
      </button>

      {ouvert && (
        <div className="absolute z-20 mt-2 w-72 rounded-md border border-[var(--line)] bg-[var(--panel)] p-3 shadow-lg">
          <div className="mb-2 flex items-center justify-between">
            <button
              type="button"
              onClick={moisPrecedent}
              className="rounded px-2 py-1 text-sm text-[var(--ink-soft)] hover:bg-[var(--paper)]"
              aria-label="Mois précédent"
            >
              ‹
            </button>
            <span className="font-display text-sm text-[var(--navy)]">
              {MOIS_FR[vueMois]} {vueAnnee}
            </span>
            <button
              type="button"
              onClick={moisSuivant}
              disabled={moisSuivantDesactive}
              className="rounded px-2 py-1 text-sm text-[var(--ink-soft)] hover:bg-[var(--paper)] disabled:opacity-30"
              aria-label="Mois suivant"
            >
              ›
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-medium text-[var(--ink-soft)]">
            {JOURS_FR.map((j) => (
              <span key={j}>{j}</span>
            ))}
          </div>
          <div className="mt-1 grid grid-cols-7 gap-1">
            {cellules.map((jour, i) => {
              if (jour === null) return <span key={`vide-${i}`} />;
              const desactive = estDesactive(jour);
              const estSelectionne =
                initial.annee === vueAnnee && initial.mois === vueMois && initial.jour === jour && valeur !== "";
              return (
                <button
                  key={jour}
                  type="button"
                  disabled={desactive}
                  onClick={() => {
                    onChange(auFormatISO(vueAnnee, vueMois, jour));
                    setOuvert(false);
                  }}
                  className={`rounded-md py-1.5 text-xs ${
                    desactive
                      ? "cursor-not-allowed text-[var(--line)]"
                      : estSelectionne
                      ? "bg-[var(--navy)] text-white"
                      : "text-[var(--ink)] hover:bg-[var(--paper)]"
                  }`}
                >
                  {jour}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
