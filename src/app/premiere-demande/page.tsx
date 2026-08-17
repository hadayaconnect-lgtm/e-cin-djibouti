"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import UploadBox from "@/components/UploadBox";
import { piecesPourCas } from "@/lib/cin/pieces";
import { simulerControlePhoto } from "@/lib/cin/ocr-sim";
import { cinDb } from "@/lib/cin/db";
import { DocumentTeleverse, ResultatControlePhoto } from "@/lib/cin/types";

const ETAPES = ["Identité", "Situation", "Documents", "Vérification", "Transmission"];

export default function PremiereDemande() {
  const router = useRouter();
  const [etape, setEtape] = useState(0);

  const [identite, setIdentite] = useState({ nom: "", prenom: "", dateNaissance: "" });
  const [domicileConnu, setDomicileConnu] = useState<"oui" | "non" | "">("");

  const pieces = useMemo(() => piecesPourCas("premiere"), []);
  const [documents, setDocuments] = useState<Record<string, DocumentTeleverse>>({});
  const [controlePhoto, setControlePhoto] = useState<ResultatControlePhoto | null>(null);
  const [envoye, setEnvoye] = useState(false);
  const [reference, setReference] = useState("");

  function gererFichier(pieceId: string, fichier: File) {
    const doc: DocumentTeleverse = {
      id: pieceId,
      type: pieceId,
      nomFichier: fichier.name,
      dateTeleversement: new Date().toISOString(),
    };
    setDocuments((d) => ({ ...d, [pieceId]: doc }));
    if (pieceId === "photo_identite") {
      setControlePhoto(simulerControlePhoto(fichier.name));
    }
  }

  const documentsObligatoiresOk = pieces
    .filter((p) => p.obligatoire)
    .every((p) => documents[p.id]);
  const photoOk = controlePhoto?.statut === "acceptee";

  function transmettre() {
    const dossier = cinDb.creerDossier({
      type: "premiere",
      citoyen: identite,
      documents: Object.values(documents).filter((d) => d.type !== "photo_identite"),
      photoIdentite: documents["photo_identite"],
      controlePhoto: controlePhoto ?? undefined,
    } as any);
    cinDb.changerStatut(dossier.id, "verification", "systeme", "Dossier transmis, en attente de vérification administrative");
    setReference(dossier.id);
    setEnvoye(true);
  }

  if (envoye) {
    return (
      <main className="min-h-screen bg-[var(--paper)]">
        <Header contexte="Première demande" />
        <div className="mx-auto max-w-2xl px-5 py-16 text-center">
          <span className="sceau mx-auto h-14 w-14 font-display text-base font-semibold">✓</span>
          <h1 className="font-display mt-5 text-2xl text-[var(--navy)]">Demande transmise</h1>
          <p className="mt-3 text-sm text-[var(--ink-soft)]">
            Votre dossier a été enregistré et transmis pour vérification administrative.
          </p>
          <p className="mt-4 font-mono-data text-lg text-[var(--navy)]">{reference}</p>
          <p className="mt-1 text-xs text-[var(--ink-soft)]">Conservez cette référence pour suivre votre demande.</p>
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

  return (
    <main className="min-h-screen bg-[var(--paper)]">
      <Header contexte="Première demande" />
      <div className="mx-auto max-w-2xl px-5 py-10">
        <ol className="mb-8 flex flex-wrap gap-x-4 gap-y-2 text-xs">
          {ETAPES.map((e, i) => (
            <li
              key={e}
              className={`flex items-center gap-1.5 ${
                i === etape ? "font-semibold text-[var(--navy)]" : "text-[var(--ink-soft)]"
              }`}
            >
              <span className="font-mono-data">{i + 1}</span>
              {e}
            </li>
          ))}
        </ol>

        {etape === 0 && (
          <section>
            <h1 className="font-display text-2xl text-[var(--navy)]">Votre identité</h1>
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
          </section>
        )}

        {etape === 1 && (
          <section>
            <h1 className="font-display text-2xl text-[var(--navy)]">Votre situation</h1>
            <p className="mt-2 text-sm text-[var(--ink-soft)]">
              Ces réponses permettent de déterminer précisément les pièces à fournir pour votre cas.
            </p>
            <fieldset className="mt-6">
              <legend className="mb-2 text-sm font-medium text-[var(--ink)]">
                Disposez-vous d&apos;un justificatif de domicile récent ?
              </legend>
              <div className="flex gap-3">
                {(["oui", "non"] as const).map((v) => (
                  <button
                    key={v}
                    onClick={() => setDomicileConnu(v)}
                    className={`rounded-md border px-4 py-2 text-sm capitalize ${
                      domicileConnu === v
                        ? "border-[var(--navy)] bg-[var(--navy)] text-white"
                        : "border-[var(--line)] bg-[var(--panel)] text-[var(--ink)]"
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
              {domicileConnu === "non" && (
                <p className="mt-3 rounded-md bg-[var(--amber-soft)] px-3 py-2 text-xs text-[var(--amber)]">
                  Cette information doit être confirmée auprès du service compétent : rapprochez-vous de
                  votre chef de quartier ou de la mairie pour obtenir un justificatif.
                </p>
              )}
            </fieldset>
          </section>
        )}

        {etape === 2 && (
          <section>
            <h1 className="font-display text-2xl text-[var(--navy)]">Vos documents</h1>
            <p className="mt-2 text-sm text-[var(--ink-soft)]">
              Voici les pièces requises pour une première demande. Cette liste peut être ajustée par
              l&apos;administration.
            </p>
            <div className="mt-6 space-y-6">
              {pieces
                .filter((p) => p.id !== "photo_identite")
                .map((p) => (
                  <UploadBox
                    key={p.id}
                    label={p.libelle + (p.obligatoire ? " *" : "")}
                    onFichier={(f) => gererFichier(p.id, f)}
                  />
                ))}

              <div>
                <UploadBox
                  label="Photo d'identité récente *"
                  aide="Téléversez le fichier numérique reçu de votre photographe (par exemple via WhatsApp). Un seul fichier suffit."
                  onFichier={(f) => gererFichier("photo_identite", f)}
                />
                {controlePhoto && (
                  <p
                    className={`mt-2 text-xs ${
                      controlePhoto.statut === "acceptee" ? "text-[var(--green)]" : "text-[var(--red)]"
                    }`}
                  >
                    {controlePhoto.statut === "acceptee" ? "✓ " : "⚠ "}
                    {controlePhoto.message}
                  </p>
                )}
                <p className="mt-2 rounded-md bg-[var(--amber-soft)] px-3 py-2 text-xs text-[var(--amber)]">
                  Important : conservez vos 3 photos d&apos;identité physiques. Elles pourront vous être
                  demandées lors de votre rendez-vous auprès de l&apos;administration.
                </p>
              </div>
            </div>
          </section>
        )}

        {etape === 3 && (
          <section>
            <h1 className="font-display text-2xl text-[var(--navy)]">Vérifiez votre dossier</h1>
            <dl className="mt-6 divide-y divide-[var(--line)] rounded-md border border-[var(--line)] bg-[var(--panel)]">
              <Ligne label="Nom">{identite.nom || "—"}</Ligne>
              <Ligne label="Prénom">{identite.prenom || "—"}</Ligne>
              <Ligne label="Date de naissance">{identite.dateNaissance || "—"}</Ligne>
              {pieces.map((p) => (
                <Ligne key={p.id} label={p.libelle}>
                  {documents[p.id] ? `✓ ${documents[p.id].nomFichier}` : "Non fourni"}
                </Ligne>
              ))}
            </dl>
            {!documentsObligatoiresOk && (
              <p className="mt-3 text-xs text-[var(--red)]">
                Certaines pièces obligatoires sont manquantes. Revenez à l&apos;étape précédente.
              </p>
            )}
            {controlePhoto && !photoOk && (
              <p className="mt-3 text-xs text-[var(--red)]">
                La photo d&apos;identité doit être acceptée par le contrôle qualité avant transmission.
              </p>
            )}
          </section>
        )}

        {etape === 4 && (
          <section>
            <h1 className="font-display text-2xl text-[var(--navy)]">Transmission</h1>
            <p className="mt-3 rounded-md border border-[var(--navy)]/20 bg-[var(--panel)] px-4 py-3 text-sm leading-relaxed text-[var(--ink)]">
              Les informations renseignées doivent être exactes et conformes aux informations enregistrées
              auprès de l&apos;administration. Toute erreur ou non-conformité constatée lors des contrôles
              administratifs ou de l&apos;enrôlement biométrique peut entraîner le rejet, la suspension ou
              la demande de correction du dossier.
            </p>
            <label className="mt-4 flex items-start gap-2 text-sm text-[var(--ink)]">
              <input type="checkbox" id="confirmation" className="mt-1" />
              J&apos;ai compris et je confirme l&apos;exactitude des informations fournies.
            </label>
          </section>
        )}

        <div className="mt-10 flex justify-between">
          <button
            onClick={() => setEtape((e) => Math.max(0, e - 1))}
            disabled={etape === 0}
            className="rounded-md border border-[var(--line)] px-4 py-2 text-sm text-[var(--ink)] disabled:opacity-0"
          >
            Retour
          </button>
          {etape < ETAPES.length - 1 ? (
            <button
              onClick={() => setEtape((e) => Math.min(ETAPES.length - 1, e + 1))}
              disabled={etape === 3 && (!documentsObligatoiresOk || !photoOk)}
              className="rounded-md bg-[var(--navy)] px-5 py-2.5 text-sm font-medium text-white hover:bg-[var(--navy-strong)] disabled:opacity-40"
            >
              Continuer
            </button>
          ) : (
            <button
              onClick={() => {
                const coche = (document.getElementById("confirmation") as HTMLInputElement)?.checked;
                if (coche) transmettre();
              }}
              className="rounded-md bg-[var(--green)] px-5 py-2.5 text-sm font-medium text-white hover:opacity-90"
            >
              Transmettre ma demande
            </button>
          )}
        </div>
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

function Ligne({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 px-4 py-3 text-sm">
      <dt className="text-[var(--ink-soft)]">{label}</dt>
      <dd className="text-right font-medium text-[var(--ink)]">{children}</dd>
    </div>
  );
}
