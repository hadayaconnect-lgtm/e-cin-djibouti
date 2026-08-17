import { cinDb } from "./db";

// Scénarios fictifs de démonstration (cahier des charges, section 16).
// Exécuté une seule fois côté client, uniquement pour peupler le tableau de
// bord agent et la page de suivi avec des exemples réalistes.

export function amorcerDonneesDemo(): void {
  if (cinDb.estAmorce()) return;

  // Cas A — Première demande, dossier complet → pré-validation
  const a = cinDb.creerDossier({
    type: "premiere",
    citoyen: { nom: "Farah", prenom: "Amina", dateNaissance: "2001-05-14" },
    documents: [
      { id: "d1", type: "acte_naissance", nomFichier: "acte_naissance_amina.pdf", dateTeleversement: new Date().toISOString() },
      { id: "d2", type: "certificat_nationalite", nomFichier: "certificat_nationalite_amina.pdf", dateTeleversement: new Date().toISOString() },
    ],
    photoIdentite: { id: "p1", type: "photo_identite", nomFichier: "photo_amina.jpg", dateTeleversement: new Date().toISOString() },
    controlePhoto: { statut: "acceptee", message: "Photo acceptée pour le dossier." },
  } as any);
  cinDb.changerStatut(a.id, "pre_validee", "agent:demo", "Dossier complet — pré-validé (scénario A)");

  // Cas B — Renouvellement conforme
  const b = cinDb.creerDossier({
    type: "renouvellement",
    citoyen: {
      nom: "Awaleh",
      prenom: "Hodan",
      dateNaissance: "1994-03-12",
      numeroCinAncienne: "DJ-CIN-0041827",
      grandMerePaternelle: "Amina Guelleh",
      grandMereMaternelle: "Souad Robleh",
    },
    documents: [
      { id: "d3", type: "ancienne_cin", nomFichier: "cas-b-ancienne-cin.jpg", dateTeleversement: new Date().toISOString() },
    ],
    photoIdentite: { id: "p2", type: "photo_identite", nomFichier: "photo_hodan.jpg", dateTeleversement: new Date().toISOString() },
    controlePhoto: { statut: "acceptee", message: "Photo acceptée pour le dossier." },
    verificationRegistre: { resultat: "confirmee", tentatives: 1 },
  } as any);
  cinDb.changerStatut(b.id, "pre_validee", "agent:demo", "Correspondance registre confirmée — pré-validé (scénario B)");

  // Cas C — Renouvellement avec erreur sur une grand-mère → anomalie
  const c = cinDb.creerDossier({
    type: "renouvellement",
    citoyen: {
      nom: "Awaleh",
      prenom: "Hodan",
      dateNaissance: "1994-03-12",
      numeroCinAncienne: "DJ-CIN-0041827",
      grandMerePaternelle: "Amina Guelleh",
      grandMereMaternelle: "Nom incorrect saisi",
    },
    documents: [
      { id: "d4", type: "ancienne_cin", nomFichier: "cas-c-ancienne-cin.jpg", dateTeleversement: new Date().toISOString() },
    ],
    verificationRegistre: { resultat: "verification_manuelle", tentatives: 1 },
  } as any);
  cinDb.changerStatut(
    c.id,
    "anomalie_verification_manuelle",
    "systeme",
    "Correspondance partielle avec le registre — vérification manuelle requise (scénario C)"
  );

  // Cas D — Photo non conforme
  const d = cinDb.creerDossier({
    type: "premiere",
    citoyen: { nom: "Guedi", prenom: "Nima", dateNaissance: "1999-01-20" },
    documents: [],
    photoIdentite: { id: "p3", type: "photo_identite", nomFichier: "photo_nima_floue.jpg", dateTeleversement: new Date().toISOString() },
    controlePhoto: { statut: "floue", message: "Photo trop floue. Merci de téléverser une photo nette." },
  } as any);
  cinDb.changerStatut(d.id, "a_corriger", "systeme", "Photo refusée par le contrôle qualité (scénario D)");

  // Cas E — CIN perdue, déclaration police conforme
  const e = cinDb.creerDossier({
    type: "remplacement",
    citoyen: { nom: "Robleh", prenom: "Warsama", dateNaissance: "1975-06-30" },
    documents: [
      { id: "d5", type: "declaration_perte", nomFichier: "cas-e-declaration-perte.jpg", dateTeleversement: new Date().toISOString() },
    ],
  } as any);
  cinDb.changerStatut(e.id, "pre_validee", "agent:demo", "Déclaration de perte cohérente — pré-validé (scénario E)");

  // Cas F — Déclaration de perte incohérente → vérification manuelle
  const f = cinDb.creerDossier({
    type: "remplacement",
    citoyen: { nom: "Doualeh", prenom: "Ismael", dateNaissance: "1988-11-02" },
    documents: [
      { id: "d6", type: "declaration_perte", nomFichier: "cas-f-declaration-perte.jpg", dateTeleversement: new Date().toISOString() },
    ],
  } as any);
  cinDb.changerStatut(
    f.id,
    "anomalie_verification_manuelle",
    "systeme",
    "Identité du document de perte différente du demandeur (scénario F)"
  );

  // Cas G — Mineur : demande bloquée avant transmission (illustratif, aucun dossier
  // n'est réellement créé pour un mineur — ce cas est documenté pour la démonstration
  // uniquement, la vérification ayant lieu côté citoyen avant toute transmission).

  cinDb.marquerAmorce();
}
