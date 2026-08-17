"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import UploadBox from "@/components/UploadBox";
import { simulerOCRDeclarationPerte } from "@/lib/cin/ocr-sim";
import { cinDb } from "@/lib/cin/db";
import { ResultatOCR } from "@/lib/cin/types";

export default function Perte() {
  const router = useRouter();
  const [declarationFaite, setDeclarationFaite] = useState(false);

  const [identite, setIdentite] = useState({ nom: "", prenom: "", dateNaissance: "" });
  const [fichier, setFichier] = useState("");
  const [ocr, setOcr] = useState<ResultatOCR | null>(null);
  const [envoye, setEnvoye] = useState(false);
  const [reference, setReference] = useState("");

  function gererFichier(f: File) {
    setFichier(f.name);
    setOcr(simulerOCRDeclarationPerte(f.name, identite));
  }

  function transmettre() {
    const anomalie = (ocr?.incoherencesDetectees.length ?? 0) > 0 || ocr?.lisible === false;
    const dossier = cinDb.creerDossier({
      type: "remplacement",
      citoyen: identite,
      documents: [
        {
          id: "declaration_perte",
          type: "declaration_perte",
          nomFichier: fichier,
          dateTeleversement: new Date().toISOString(),
          ocr: ocr ?? undefined,
        },
      ],
    } as any);
    cinDb.changerStatut(
      dossier.id,
      anomalie ? "anomalie_verification_manuelle" : ("verification" as any),
      "systeme",
      anomalie
        ? "Incohérence détectée sur la déclaration de perte — vérification manuelle requise"
        : "Déclaration de perte cohérente, transmis pour vérification"
    );
    setReference(dossier.id);
    setEnvoye(true);
  }

  if (envoye) {
    return (
      <main className="min-h-screen bg-[var(--paper)]">
        <Header contexte="Remplacement après perte" />
        <div className="mx-auto max-w-2xl px-5 py-16 text-center">
          <span className="sceau mx-auto h-14 w-14 font-display text-base font-semibold">✓</span>
          <h1 className="font-display mt-5 text-2xl text-[var(--navy)]">Demande transmise</h1>
          <p className="mt-4 font-mono-data text-lg text-[var(--navy)]">{reference}</p>
          <button
            onClick={() => router.push(`/suivi?ref=${reference}`)}
            className="mt-8 rounded-md bg-[var(--navy)] px-5 py-2.5 text-sm font-medium text-white hover:bg-[var(--navy-strong)]"
          >
            Suivre ma demande
          </button>
        </div>
      </main>
    );
  }

  if (!declarationFaite) {
    return (
      <main className="min-h-screen bg-[var(--paper)]">
        <Header contexte="Remplacement après perte" />
        <div className="mx-auto max-w-xl px-5 py-16">
          <h1 className="font-display text-2xl text-[var(--navy)]">Carte perdue ou volée</h1>
          <div className="mt-6 rounded-md border border-[var(--navy)]/20 bg-[var(--panel)] p-5 text-sm leading-relaxed text-[var(--ink)]">
            Vous devez d&apos;abord vous présenter personnellement auprès du service de police compétent
            afin d&apos;effectuer votre déclaration de perte. La police vous remettra un document officiel,
            indispensable pour la suite de votre démarche.
          </div>
          <button
            onClick={() => setDeclarationFaite(true)}
            className="mt-6 rounded-md bg-[var(--navy)] px-5 py-2.5 text-sm font-medium text-white hover:bg-[var(--navy-strong)]"
          >
            J&apos;ai effectué ma déclaration de perte
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--paper)]">
      <Header contexte="Remplacement après perte" />
      <div className="mx-auto max-w-xl px-5 py-10">
        <h1 className="font-display text-2xl text-[var(--navy)]">Votre déclaration</h1>
        <div className="mt-6 space-y-4">
          <Champ label="Nom" valeur={identite.nom} onChange={(v) => setIdentite((i) => ({ ...i, nom: v }))} />
          <Champ label="Prénom" valeur={identite.prenom} onChange={(v) => setIdentite((i) => ({ ...i, prenom: v }))} />
          <Champ
            label="Date de naissance"
            type="date"
            valeur={identite.dateNaissance}
            onChange={(v) => setIdentite((i) => ({ ...i, dateNaissance: v }))}
          />
        </div>

        <div className="mt-6">
          <UploadBox
            label="Document officiel remis par la Police *"
            aide="Photographiez ou téléversez le document de déclaration de perte."
            onFichier={gererFichier}
          />
        </div>

        {ocr && (
          <div className="mt-4 rounded-md border border-[var(--line)] bg-[var(--panel)] p-4 text-sm">
            {!ocr.lisible ? (
              <p className="text-[var(--red)]">⚠ {ocr.incoherencesDetectees[0]}</p>
            ) : ocr.incoherencesDetectees.length > 0 ? (
              <p className="text-[var(--amber)]">🔎 {ocr.incoherencesDetectees[0]}</p>
            ) : (
              <>
                <p className="font-medium text-[var(--green)]">✓ Document lu et cohérent</p>
                <p className="mt-1 text-[var(--ink-soft)]">
                  Référence :{" "}
                  <span className="font-mono-data text-[var(--ink)]">
                    {ocr.champsExtraits.reference}
                  </span>
                </p>
              </>
            )}
          </div>
        )}

        <button
          onClick={transmettre}
          disabled={!fichier || !identite.nom || !identite.prenom}
          className="mt-8 rounded-md bg-[var(--green)] px-5 py-2.5 text-sm font-medium text-white hover:opacity-90 disabled:opacity-40"
        >
          Poursuivre ma demande de remplacement
        </button>
      </div>
    </main>
  );
}

function Champ({
  label,
  valeur,
  onChange,
  type = "text",
}: {
  label: string;
  valeur: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-[var(--ink)]">{label}</span>
      <input
        type={type}
        value={valeur}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-[var(--line)] bg-[var(--panel)] px-3 py-2 text-sm outline-none focus:border-[var(--navy)]"
      />
    </label>
  );
}
