"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import UploadBox from "@/components/UploadBox";
import { simulerControlePhoto, simulerOCRAncienneCIN } from "@/lib/cin/ocr-sim";
import { verifierAvecRegistre, ResultatVerification } from "@/lib/cin/registre-fictif";
import { cinDb } from "@/lib/cin/db";
import { ResultatControlePhoto, ResultatOCR } from "@/lib/cin/types";

const ETAPES = ["Ancienne carte", "Photo", "Vérification familiale", "Confirmation"];
const MAX_TENTATIVES = 3;

export default function Renouvellement() {
  const router = useRouter();
  const [etape, setEtape] = useState(0);

  const [ancienneCinFichier, setAncienneCinFichier] = useState<string>("");
  const [ocr, setOcr] = useState<ResultatOCR | null>(null);

  const [photoFichier, setPhotoFichier] = useState<string>("");
  const [controlePhoto, setControlePhoto] = useState<ResultatControlePhoto | null>(null);

  const [numeroCin, setNumeroCin] = useState("");
  const [grandMerePaternelle, setGrandMerePaternelle] = useState("");
  const [grandMereMaternelle, setGrandMereMaternelle] = useState("");
  const [resultat, setResultat] = useState<ResultatVerification | null>(null);
  const [tentatives, setTentatives] = useState(0);
  const [verrouille, setVerrouille] = useState(false);

  const [envoye, setEnvoye] = useState(false);
  const [reference, setReference] = useState("");

  function gererAncienneCin(fichier: File) {
    setAncienneCinFichier(fichier.name);
    const resultatOcr = simulerOCRAncienneCIN(fichier.name);
    setOcr(resultatOcr);
    if (resultatOcr.champsExtraits.numeroCin) {
      setNumeroCin(resultatOcr.champsExtraits.numeroCin);
    }
  }

  function gererPhoto(fichier: File) {
    setPhotoFichier(fichier.name);
    setControlePhoto(simulerControlePhoto(fichier.name));
  }

  function verifier() {
    if (verrouille) return;
    const cle = `${numeroCin}`;
    const stat = cinDb.obtenirTentatives(cle);
    if (stat.verrouilleJusqua && new Date(stat.verrouilleJusqua) > new Date()) {
      setVerrouille(true);
      return;
    }

    const r = verifierAvecRegistre({
      numeroCinAncienne: numeroCin,
      grandMerePaternelleSaisie: grandMerePaternelle,
      grandMereMaternelleSaisie: grandMereMaternelle,
    });
    setResultat(r);

    const echec = r !== "confirmee";
    const apres = cinDb.enregistrerTentative(cle, echec);
    setTentatives(apres.nombre);
    if (apres.verrouilleJusqua) setVerrouille(true);
  }

  function transmettre() {
    const dossier = cinDb.creerDossier({
      type: "renouvellement",
      citoyen: {
        nom: ocr?.champsExtraits.nom || "",
        prenom: ocr?.champsExtraits.prenom || "",
        dateNaissance: ocr?.champsExtraits.dateNaissance || "",
        numeroCinAncienne: numeroCin,
        grandMerePaternelle,
        grandMereMaternelle,
      },
      documents: [
        {
          id: "ancienne_cin",
          type: "ancienne_cin",
          nomFichier: ancienneCinFichier,
          dateTeleversement: new Date().toISOString(),
          ocr: ocr ?? undefined,
        },
      ],
      photoIdentite: {
        id: "photo_identite",
        type: "photo_identite",
        nomFichier: photoFichier,
        dateTeleversement: new Date().toISOString(),
      },
      controlePhoto: controlePhoto ?? undefined,
      verificationRegistre: { resultat: resultat ?? "verification_manuelle", tentatives },
    } as any);

    const statutInitial =
      resultat === "confirmee" ? "verification" : "anomalie_verification_manuelle";
    cinDb.changerStatut(
      dossier.id,
      statutInitial as any,
      "systeme",
      resultat === "confirmee"
        ? "Correspondance registre confirmée, transmis pour vérification"
        : "Vérification manuelle requise avant traitement"
    );
    setReference(dossier.id);
    setEnvoye(true);
  }

  if (envoye) {
    return (
      <main className="min-h-screen bg-[var(--paper)]">
        <Header contexte="Renouvellement" />
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

  return (
    <main className="min-h-screen bg-[var(--paper)]">
      <Header contexte="Renouvellement" />
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
            <h1 className="font-display text-2xl text-[var(--navy)]">Votre ancienne carte</h1>
            <p className="mt-2 text-sm text-[var(--ink-soft)]">
              Photographiez ou téléversez votre ancienne Carte d&apos;Identité Nationale. Certaines
              informations seront extraites automatiquement.
            </p>
            <div className="mt-6">
              <UploadBox label="Ancienne CIN *" onFichier={gererAncienneCin} />
            </div>
            {ocr && (
              <div className="mt-5 rounded-md border border-[var(--line)] bg-[var(--panel)] p-4 text-sm">
                {ocr.lisible ? (
                  <>
                    <p className="mb-2 font-medium text-[var(--green)]">✓ Document lu</p>
                    <p className="text-[var(--ink-soft)]">
                      Numéro CIN détecté :{" "}
                      <span className="font-mono-data text-[var(--ink)]">
                        {ocr.champsExtraits.numeroCin || "non détecté"}
                      </span>
                    </p>
                    {ocr.incoherencesDetectees.length > 0 && (
                      <p className="mt-2 text-xs text-[var(--amber)]">
                        ⚠ {ocr.incoherencesDetectees[0]}
                      </p>
                    )}
                  </>
                ) : (
                  <p className="text-[var(--red)]">⚠ {ocr.incoherencesDetectees[0]}</p>
                )}
              </div>
            )}
            <label className="mt-5 block">
              <span className="mb-1.5 block text-sm font-medium text-[var(--ink)]">
                Numéro de CIN (vérifiez ou complétez)
              </span>
              <input
                value={numeroCin}
                onChange={(e) => setNumeroCin(e.target.value)}
                className="w-full rounded-md border border-[var(--line)] bg-[var(--panel)] px-3 py-2 text-sm font-mono-data outline-none focus:border-[var(--navy)]"
              />
            </label>
          </section>
        )}

        {etape === 1 && (
          <section>
            <h1 className="font-display text-2xl text-[var(--navy)]">Photo d&apos;identité récente</h1>
            <p className="mt-2 text-sm text-[var(--ink-soft)]">
              Téléversez le fichier numérique reçu de votre photographe. Un seul fichier suffit pour le
              dossier e-CIN.
            </p>
            <div className="mt-6">
              <UploadBox label="Photo d'identité *" onFichier={gererPhoto} />
            </div>
            {controlePhoto && (
              <p
                className={`mt-3 text-sm ${
                  controlePhoto.statut === "acceptee" ? "text-[var(--green)]" : "text-[var(--red)]"
                }`}
              >
                {controlePhoto.statut === "acceptee" ? "✓ " : "⚠ "}
                {controlePhoto.message}
              </p>
            )}
            <p className="mt-4 rounded-md bg-[var(--amber-soft)] px-3 py-2 text-xs text-[var(--amber)]">
              Important : conservez vos 3 photos d&apos;identité physiques. Elles pourront vous être
              demandées lors de votre rendez-vous.
            </p>
          </section>
        )}

        {etape === 2 && (
          <section>
            <h1 className="font-display text-2xl text-[var(--navy)]">Vérification familiale</h1>
            <p className="mt-2 text-sm text-[var(--ink-soft)]">
              Renseignez les noms exacts des grand-mères paternelle et maternelle de la personne
              concernée, tels qu&apos;enregistrés auprès de l&apos;administration.
            </p>

            {verrouille ? (
              <div className="mt-6 rounded-md border border-[var(--red)]/30 bg-[var(--red-soft)] px-4 py-3 text-sm text-[var(--red)]">
                Trop de tentatives infructueuses. Cette vérification est temporairement verrouillée.
                Veuillez réessayer plus tard ou vous rapprocher du service compétent.
              </div>
            ) : (
              <>
                <div className="mt-6 space-y-4">
                  <label className="block">
                    <span className="mb-1.5 block text-sm font-medium text-[var(--ink)]">
                      Nom de la grand-mère paternelle
                    </span>
                    <input
                      value={grandMerePaternelle}
                      onChange={(e) => setGrandMerePaternelle(e.target.value)}
                      className="w-full rounded-md border border-[var(--line)] bg-[var(--panel)] px-3 py-2 text-sm outline-none focus:border-[var(--navy)]"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-1.5 block text-sm font-medium text-[var(--ink)]">
                      Nom de la grand-mère maternelle
                    </span>
                    <input
                      value={grandMereMaternelle}
                      onChange={(e) => setGrandMereMaternelle(e.target.value)}
                      className="w-full rounded-md border border-[var(--line)] bg-[var(--panel)] px-3 py-2 text-sm outline-none focus:border-[var(--navy)]"
                    />
                  </label>
                </div>

                <button
                  onClick={verifier}
                  className="mt-4 rounded-md border border-[var(--navy)] px-4 py-2 text-sm font-medium text-[var(--navy)] hover:bg-[var(--navy)] hover:text-white"
                >
                  Vérifier ces informations
                </button>

                {resultat === "confirmee" && (
                  <p className="mt-4 rounded-md bg-[var(--green-soft)] px-3 py-2 text-sm text-[var(--green)]">
                    ✅ Correspondance confirmée.
                  </p>
                )}
                {resultat === "non_conforme" && (
                  <p className="mt-4 rounded-md bg-[var(--red-soft)] px-3 py-2 text-sm text-[var(--red)]">
                    Les informations renseignées ne correspondent pas aux informations enregistrées.
                    Veuillez vérifier votre saisie. ({tentatives}/{MAX_TENTATIVES} tentatives)
                  </p>
                )}
                {resultat === "verification_manuelle" && (
                  <p className="mt-4 rounded-md bg-[var(--amber-soft)] px-3 py-2 text-sm text-[var(--amber)]">
                    🔎 Vérification manuelle nécessaire. Votre dossier sera examiné par un agent.
                  </p>
                )}
              </>
            )}
          </section>
        )}

        {etape === 3 && (
          <section>
            <h1 className="font-display text-2xl text-[var(--navy)]">Confirmation</h1>
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
              disabled={
                (etape === 0 && !ancienneCinFichier) ||
                (etape === 1 && controlePhoto?.statut !== "acceptee") ||
                (etape === 2 && resultat !== "confirmee" && resultat !== "verification_manuelle")
              }
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
