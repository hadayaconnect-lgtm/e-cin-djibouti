import { Dossier, EvenementHistorique, StatutDossier } from "./types";
import { PIECES_PAR_DEFAUT } from "./pieces";
import { PieceRequise } from "./types";

// Façade localStorage "cinDb" — MVP fonctionnant sans backend.
// Architecture pensée pour être remplacée par une vraie base (Supabase / API
// gouvernementale) sans changer la forme des appels ci-dessous.

const CLE_DOSSIERS = "ecin_dossiers_v1";
const CLE_PIECES = "ecin_pieces_v1";
const CLE_TENTATIVES = "ecin_tentatives_registre_v1"; // protection anti-devinette
const CLE_SEED = "ecin_seed_v1";
const CLE_PARAMETRES = "ecin_parametres_v1";

export interface ParametresAdministratifs {
  ageMinimum: number;
}

const PARAMETRES_PAR_DEFAUT: ParametresAdministratifs = {
  ageMinimum: 18,
};

function lireJSON<T>(cle: string, valeurParDefaut: T): T {
  if (typeof window === "undefined") return valeurParDefaut;
  try {
    const brut = window.localStorage.getItem(cle);
    return brut ? (JSON.parse(brut) as T) : valeurParDefaut;
  } catch {
    return valeurParDefaut;
  }
}

function ecrireJSON<T>(cle: string, valeur: T): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(cle, JSON.stringify(valeur));
}

function genererReference(): string {
  const annee = new Date().getFullYear();
  const suffixe = Math.floor(100000 + Math.random() * 899999);
  return `ECIN-${annee}-${suffixe}`;
}

function evenement(auteur: string, action: string): EvenementHistorique {
  return { date: new Date().toISOString(), auteur, action };
}

export const cinDb = {
  // --- Dossiers -----------------------------------------------------
  listerDossiers(): Dossier[] {
    return lireJSON<Dossier[]>(CLE_DOSSIERS, []);
  },

  obtenirDossier(id: string): Dossier | undefined {
    return this.listerDossiers().find((d) => d.id === id);
  },

  creerDossier(partiel: Omit<Dossier, "id" | "historique" | "dateCreation" | "dateMiseAJour" | "statut">): Dossier {
    const dossiers = this.listerDossiers();
    const dossier: Dossier = {
      ...partiel,
      id: genererReference(),
      statut: "enregistree",
      historique: [evenement("citoyen", "Dossier créé et transmis")],
      dateCreation: new Date().toISOString(),
      dateMiseAJour: new Date().toISOString(),
    };
    dossiers.push(dossier);
    ecrireJSON(CLE_DOSSIERS, dossiers);
    return dossier;
  },

  mettreAJourDossier(id: string, patch: Partial<Dossier>, auteur = "systeme", action?: string): Dossier | undefined {
    const dossiers = this.listerDossiers();
    const index = dossiers.findIndex((d) => d.id === id);
    if (index === -1) return undefined;
    const avant = dossiers[index];
    const apres: Dossier = {
      ...avant,
      ...patch,
      dateMiseAJour: new Date().toISOString(),
      historique: action ? [...avant.historique, evenement(auteur, action)] : avant.historique,
    };
    dossiers[index] = apres;
    ecrireJSON(CLE_DOSSIERS, dossiers);
    return apres;
  },

  changerStatut(id: string, statut: StatutDossier, auteur: string, action: string): Dossier | undefined {
    return this.mettreAJourDossier(id, { statut }, auteur, action);
  },

  // --- Pièces requises (modifiable par l'administration) -------------
  obtenirPiecesRequises(): PieceRequise[] {
    return lireJSON<PieceRequise[]>(CLE_PIECES, PIECES_PAR_DEFAUT);
  },

  enregistrerPiecesRequises(pieces: PieceRequise[]): void {
    ecrireJSON(CLE_PIECES, pieces);
  },

  // --- Paramètres administratifs (modifiables sans toucher au code) --
  obtenirParametres(): ParametresAdministratifs {
    return lireJSON<ParametresAdministratifs>(CLE_PARAMETRES, PARAMETRES_PAR_DEFAUT);
  },

  enregistrerParametres(parametres: ParametresAdministratifs): void {
    ecrireJSON(CLE_PARAMETRES, parametres);
  },

  // --- Protection anti-devinette pour la vérification registre -------
  obtenirTentatives(cle: string): { nombre: number; verrouilleJusqua?: string } {
    const table = lireJSON<Record<string, { nombre: number; verrouilleJusqua?: string }>>(
      CLE_TENTATIVES,
      {}
    );
    return table[cle] ?? { nombre: 0 };
  },

  enregistrerTentative(cle: string, echec: boolean): { nombre: number; verrouilleJusqua?: string } {
    const table = lireJSON<Record<string, { nombre: number; verrouilleJusqua?: string }>>(
      CLE_TENTATIVES,
      {}
    );
    const actuel = table[cle] ?? { nombre: 0 };
    if (!echec) {
      delete table[cle];
      ecrireJSON(CLE_TENTATIVES, table);
      return { nombre: 0 };
    }
    const nombre = actuel.nombre + 1;
    const MAX_TENTATIVES = 3;
    const entree =
      nombre >= MAX_TENTATIVES
        ? { nombre, verrouilleJusqua: new Date(Date.now() + 30 * 60 * 1000).toISOString() }
        : { nombre };
    table[cle] = entree;
    ecrireJSON(CLE_TENTATIVES, table);
    return entree;
  },

  // --- Données de démonstration --------------------------------------
  estAmorce(): boolean {
    return lireJSON<boolean>(CLE_SEED, false);
  },

  marquerAmorce(): void {
    ecrireJSON(CLE_SEED, true);
  },

  reinitialiser(): void {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(CLE_DOSSIERS);
    window.localStorage.removeItem(CLE_TENTATIVES);
    window.localStorage.removeItem(CLE_SEED);
  },
};
