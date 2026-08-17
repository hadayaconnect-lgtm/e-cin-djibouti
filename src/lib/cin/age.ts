// Calcule l'âge en années révolues à partir d'une date de naissance ISO (yyyy-mm-dd).
// Retourne null si la date est absente ou invalide.
export function calculerAge(dateNaissanceISO: string | undefined | null): number | null {
  if (!dateNaissanceISO) return null;
  const naissance = new Date(dateNaissanceISO);
  if (isNaN(naissance.getTime())) return null;

  const aujourdhui = new Date();
  let age = aujourdhui.getFullYear() - naissance.getFullYear();
  const decalageMois = aujourdhui.getMonth() - naissance.getMonth();
  if (decalageMois < 0 || (decalageMois === 0 && aujourdhui.getDate() < naissance.getDate())) {
    age -= 1;
  }
  return age;
}

// Dérive la date de naissance limite (au format ISO yyyy-mm-dd) correspondant à un âge
// minimum donné. Sert uniquement à borner la sélection dans le calendrier — la logique
// de calcul d'âge elle-même reste centralisée dans calculerAge() ci-dessus.
export function dateLimitePourAge(ageMinimum: number): string {
  const limite = new Date();
  limite.setFullYear(limite.getFullYear() - ageMinimum);
  return limite.toISOString().slice(0, 10);
}
