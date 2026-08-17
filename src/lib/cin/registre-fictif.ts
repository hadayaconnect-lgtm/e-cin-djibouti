// Registre national de population — VERSION FICTIVE POUR DÉMONSTRATION.
// Aucune donnée réelle. Sert uniquement à simuler la vérification croisée
// utilisée lors d'un renouvellement ou remplacement (noms des grand-mères).

export interface EntreeRegistre {
  numeroCin: string;
  nom: string;
  prenom: string;
  dateNaissance: string;
  grandMerePaternelle: string;
  grandMereMaternelle: string;
}

export const REGISTRE_FICTIF: EntreeRegistre[] = [
  {
    numeroCin: "DJ-CIN-0041827",
    nom: "Awaleh",
    prenom: "Hodan",
    dateNaissance: "1994-03-12",
    grandMerePaternelle: "Amina Guelleh",
    grandMereMaternelle: "Souad Robleh",
  },
  {
    numeroCin: "DJ-CIN-0073391",
    nom: "Doualeh",
    prenom: "Ismael",
    dateNaissance: "1988-11-02",
    grandMerePaternelle: "Fatouma Ali",
    grandMereMaternelle: "Kadra Waberi",
  },
  {
    numeroCin: "DJ-CIN-0095512",
    nom: "Robleh",
    prenom: "Warsama",
    dateNaissance: "1975-06-30",
    grandMerePaternelle: "Zeinab Farah",
    grandMereMaternelle: "Halima Osman",
  },
];

function normaliser(texte: string): string {
  return texte
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

export type ResultatVerification = "confirmee" | "non_conforme" | "verification_manuelle";

/**
 * Compare les informations saisies par le citoyen à la fiche du registre fictif.
 * Ne révèle JAMAIS les valeurs de référence — retourne uniquement un résultat.
 */
export function verifierAvecRegistre(params: {
  numeroCinAncienne: string;
  grandMerePaternelleSaisie: string;
  grandMereMaternelleSaisie: string;
}): ResultatVerification {
  const entree = REGISTRE_FICTIF.find(
    (e) => normaliser(e.numeroCin) === normaliser(params.numeroCinAncienne)
  );

  // Numéro de CIN inconnu du registre fictif → ne peut être tranché automatiquement
  if (!entree) return "verification_manuelle";

  const paternelleOk =
    normaliser(entree.grandMerePaternelle) === normaliser(params.grandMerePaternelleSaisie);
  const maternelleOk =
    normaliser(entree.grandMereMaternelle) === normaliser(params.grandMereMaternelleSaisie);

  if (paternelleOk && maternelleOk) return "confirmee";

  // Une correspondance partielle est traitée avec prudence plutôt que rejetée sèchement
  if (paternelleOk || maternelleOk) return "verification_manuelle";

  return "non_conforme";
}

export const NUMEROS_CIN_DEMO = REGISTRE_FICTIF.map((e) => e.numeroCin);
