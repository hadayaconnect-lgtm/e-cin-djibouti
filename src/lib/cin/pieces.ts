import { PieceRequise } from "./types";

// Liste officielle des pièces — architecture pensée pour être modifiable par l'administration
// (interface d'édition prévue dans l'espace agent, section "Paramètres").
// Ces données sont chargées depuis cinDb.getPiecesRequises() ; ce fichier ne sert
// que de configuration initiale par défaut.

export const PIECES_PAR_DEFAUT: PieceRequise[] = [
  {
    id: "acte_naissance",
    libelle: "Acte de naissance ou extrait d'acte de naissance",
    cas: ["premiere"],
    obligatoire: true,
  },
  {
    id: "certificat_nationalite",
    libelle: "Certificat de nationalité djiboutienne",
    cas: ["premiere"],
    obligatoire: true,
  },
  {
    id: "justificatif_domicile",
    libelle: "Justificatif de domicile récent",
    cas: ["premiere", "renouvellement", "remplacement"],
    obligatoire: true,
  },
  {
    id: "photo_identite",
    libelle: "Photo d'identité numérique récente (fournie par un photographe agréé)",
    cas: ["premiere", "renouvellement", "remplacement"],
    obligatoire: true,
  },
  {
    id: "ancienne_cin",
    libelle: "Ancienne Carte d'Identité Nationale",
    cas: ["renouvellement"],
    obligatoire: true,
  },
  {
    id: "info_familiale",
    libelle: "Noms des grand-mères paternelle et maternelle",
    cas: ["renouvellement", "remplacement"],
    obligatoire: true,
  },
  {
    id: "declaration_perte",
    libelle: "Document officiel de déclaration de perte remis par la Police",
    cas: ["remplacement"],
    obligatoire: true,
  },
];

export function piecesPourCas(cas: string): PieceRequise[] {
  return PIECES_PAR_DEFAUT.filter((p) => p.cas.includes(cas));
}
