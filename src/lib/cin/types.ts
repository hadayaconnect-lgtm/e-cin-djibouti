// Types du domaine e-CIN Djibouti — toutes les données sont fictives (MVP de démonstration).

export type TypeDemande = "premiere" | "renouvellement" | "remplacement";

export type StatutDossier =
  | "enregistree"
  | "verification"
  | "a_corriger"
  | "anomalie_verification_manuelle"
  | "pre_validee"
  | "rdv_planifie"
  | "biometrie_effectuee"
  | "en_production"
  | "disponible"
  | "rejetee";

export const LIBELLES_STATUT: Record<StatutDossier, string> = {
  enregistree: "Demande enregistrée",
  verification: "Vérification administrative",
  a_corriger: "À corriger",
  anomalie_verification_manuelle: "Vérification manuelle nécessaire",
  pre_validee: "Pré-validée",
  rdv_planifie: "Rendez-vous biométrique planifié",
  biometrie_effectuee: "Biométrie effectuée",
  en_production: "CIN en production",
  disponible: "CIN disponible",
  rejetee: "Rejetée",
};

export interface ChampDonnee<T = string> {
  valeur: T;
  statut: "reel" | "simule" | "indisponible";
  source: string;
}

export interface DocumentTeleverse {
  id: string;
  type: string; // ex: "acte_naissance", "ancienne_cin", "declaration_perte", "photo_identite"
  nomFichier: string;
  dateTeleversement: string;
  ocr?: ResultatOCR;
}

export interface ResultatOCR {
  lisible: boolean;
  champsExtraits: Record<string, string>;
  incoherencesDetectees: string[];
  confiance: "haute" | "moyenne" | "faible";
}

export interface ResultatControlePhoto {
  statut: "acceptee" | "floue" | "mal_cadree" | "plusieurs_visages" | "resolution_insuffisante";
  message: string;
}

export interface VerificationRegistre {
  resultat: "confirmee" | "non_conforme" | "verification_manuelle";
  tentatives: number;
  verrouilleJusqua?: string; // ISO date — protection anti-devinette
}

export interface EvenementHistorique {
  date: string;
  auteur: string; // "citoyen" | "agent:<nom>" | "systeme"
  action: string;
}

export interface Dossier {
  id: string; // référence dossier, ex: ECIN-2026-000123
  type: TypeDemande;
  citoyen: {
    nom: string;
    prenom: string;
    dateNaissance: string;
    numeroCinAncienne?: string;
    grandMerePaternelle?: string;
    grandMereMaternelle?: string;
  };
  documents: DocumentTeleverse[];
  photoIdentite?: DocumentTeleverse;
  controlePhoto?: ResultatControlePhoto;
  verificationRegistre?: VerificationRegistre;
  statut: StatutDossier;
  motifRejetOuCorrection?: string;
  rendezVous?: {
    centre: string;
    date: string;
    creneau: string;
    qrCode: string;
  };
  historique: EvenementHistorique[];
  dateCreation: string;
  dateMiseAJour: string;
}

export interface PieceRequise {
  id: string;
  libelle: string;
  cas: string[]; // situations pour lesquelles cette pièce est requise
  obligatoire: boolean;
}
