// L'assistant e-CIN répond UNIQUEMENT à partir des procédures enregistrées ici.
// Il ne doit jamais inventer une règle administrative. Si une question ne
// correspond à aucune entrée connue, l'assistant renvoie le message de repli
// standard défini dans REPONSE_INCONNUE.

export interface EntreeFAQ {
  motsClefs: string[];
  question: string;
  reponse: string;
}

export const REPONSE_INCONNUE =
  "Cette information doit être confirmée auprès du service compétent.";

export const FAQ_ECIN: EntreeFAQ[] = [
  {
    motsClefs: ["document", "pieces", "fournir", "papiers"],
    question: "Quels documents dois-je fournir ?",
    reponse:
      "Les pièces demandées dépendent de votre situation (première demande, renouvellement ou remplacement après perte). Répondez aux quelques questions du parcours guidé : la liste exacte des pièces à téléverser s'affichera automatiquement pour votre cas.",
  },
  {
    motsClefs: ["renouveler", "renouvellement"],
    question: "Comment renouveler ma CIN ?",
    reponse:
      "Pour un renouvellement, préparez votre ancienne Carte d'Identité Nationale, une photo d'identité numérique récente, ainsi que les noms exacts des grand-mères paternelle et maternelle. Ces informations seront comparées au registre pour confirmer votre identité. Conservez aussi vos 3 photos physiques : elles pourront être demandées à votre rendez-vous.",
  },
  {
    motsClefs: ["perdu", "perte", "vole", "vol"],
    question: "J'ai perdu ma carte, que dois-je faire ?",
    reponse:
      "Vous devez d'abord vous présenter personnellement auprès du service de police compétent pour effectuer votre déclaration de perte. Ce n'est qu'une fois ce document officiel obtenu que vous pourrez revenir sur e-CIN pour poursuivre votre demande de remplacement.",
  },
  {
    motsClefs: ["incomplet", "manque", "manquant"],
    question: "Pourquoi mon dossier est incomplet ?",
    reponse:
      "Un dossier est signalé incomplet lorsqu'une pièce obligatoire n'a pas été téléversée ou qu'un document n'a pas pu être lu correctement. Consultez la page de suivi de votre dossier : les pièces manquantes ou à corriger y sont indiquées.",
  },
  {
    motsClefs: ["rendez-vous", "rdv", "apporter", "biometrie", "biométrie"],
    question: "Que dois-je apporter à mon rendez-vous ?",
    reponse:
      "Apportez une pièce d'identité valide, la convocation ou le QR code de votre dossier, ainsi que vos 3 photos d'identité physiques. L'enrôlement biométrique (empreintes, photo officielle) est réalisé sur place par l'administration.",
  },
  {
    motsClefs: ["delai", "délai", "combien de temps", "attendre"],
    question: "Quel est le délai de traitement ?",
    reponse: REPONSE_INCONNUE,
  },
];

export function repondreAssistant(question: string): string {
  const q = question.toLowerCase();
  const correspondance = FAQ_ECIN.find((entree) =>
    entree.motsClefs.some((mot) => q.includes(mot))
  );
  return correspondance ? correspondance.reponse : REPONSE_INCONNUE;
}
