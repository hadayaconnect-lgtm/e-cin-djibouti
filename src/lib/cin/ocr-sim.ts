import { ResultatControlePhoto, ResultatOCR } from "./types";

// --- SIMULATION D'OCR --------------------------------------------------
// Pour ce MVP, l'extraction OCR est simulée de façon déterministe à partir
// du nom de fichier téléversé, afin de permettre des scénarios de démonstration
// reproductibles (cf. section 16 du cahier des charges). Dans une version
// connectée, ce module appellerait un vrai service OCR + un modèle d'extraction
// documentaire, sans jamais laisser l'IA trancher seule une décision.

export function simulerOCRAncienneCIN(nomFichier: string): ResultatOCR {
  const f = nomFichier.toLowerCase();

  if (f.includes("illisible") || f.includes("flou")) {
    return {
      lisible: false,
      champsExtraits: {},
      incoherencesDetectees: ["Document trop peu lisible pour une extraction fiable"],
      confiance: "faible",
    };
  }

  if (f.includes("hodan") || f.includes("cas-b") || f.includes("casb")) {
    return {
      lisible: true,
      champsExtraits: {
        numeroCin: "DJ-CIN-0041827",
        nom: "AWALEH",
        prenom: "Hodan",
        dateNaissance: "1994-03-12",
      },
      incoherencesDetectees: [],
      confiance: "haute",
    };
  }

  if (f.includes("cas-c") || f.includes("casc")) {
    return {
      lisible: true,
      champsExtraits: {
        numeroCin: "DJ-CIN-0041827",
        nom: "AWALEH",
        prenom: "Hodan",
        dateNaissance: "1994-03-12",
      },
      incoherencesDetectees: [],
      confiance: "haute",
    };
  }

  // Cas générique : extraction partielle, confiance moyenne
  return {
    lisible: true,
    champsExtraits: {
      numeroCin: "",
      nom: "",
      prenom: "",
      dateNaissance: "",
    },
    incoherencesDetectees: ["Certains champs n'ont pas pu être extraits automatiquement"],
    confiance: "moyenne",
  };
}

export function simulerOCRDeclarationPerte(
  nomFichier: string,
  identiteDemandeur: { nom: string; prenom: string }
): ResultatOCR {
  const f = nomFichier.toLowerCase();

  if (f.includes("illisible")) {
    return {
      lisible: false,
      champsExtraits: {},
      incoherencesDetectees: ["Document trop peu lisible"],
      confiance: "faible",
    };
  }

  if (f.includes("cas-f") || f.includes("casf") || f.includes("incoherent")) {
    return {
      lisible: true,
      champsExtraits: {
        typeDocument: "Déclaration de perte",
        reference: "PN-2026-00219",
        date: "2026-08-10",
        identite: "Nom différent de celui du demandeur",
      },
      incoherencesDetectees: [
        "L'identité mentionnée sur le document ne correspond pas à celle du demandeur",
      ],
      confiance: "moyenne",
    };
  }

  return {
    lisible: true,
    champsExtraits: {
      typeDocument: "Déclaration de perte",
      reference: `PN-2026-${Math.floor(1000 + Math.random() * 8999)}`,
      date: "2026-08-10",
      identite: `${identiteDemandeur.prenom} ${identiteDemandeur.nom}`,
    },
    incoherencesDetectees: [],
    confiance: "haute",
  };
}

// --- SIMULATION DE CONTRÔLE QUALITÉ PHOTO -------------------------------
// Vérifie des critères techniques uniquement (cadrage, netteté, nombre de
// visages, résolution). N'utilise jamais d'IA générative pour modifier
// l'image — le fichier original du citoyen n'est jamais altéré.

export function simulerControlePhoto(nomFichier: string): ResultatControlePhoto {
  const f = nomFichier.toLowerCase();

  if (f.includes("flou")) {
    return { statut: "floue", message: "Photo trop floue. Merci de téléverser une photo nette." };
  }
  if (f.includes("cadrage") || f.includes("mal_cadre")) {
    return {
      statut: "mal_cadree",
      message: "Le visage n'est pas correctement cadré. Merci de recadrer la photo.",
    };
  }
  if (f.includes("plusieurs") || f.includes("groupe")) {
    return {
      statut: "plusieurs_visages",
      message: "Plusieurs visages détectés. La photo doit ne montrer qu'une seule personne.",
    };
  }
  if (f.includes("resolution") || f.includes("basse")) {
    return {
      statut: "resolution_insuffisante",
      message: "Résolution insuffisante. Demandez à votre photographe un fichier en meilleure qualité.",
    };
  }

  return { statut: "acceptee", message: "Photo acceptée pour le dossier." };
}
