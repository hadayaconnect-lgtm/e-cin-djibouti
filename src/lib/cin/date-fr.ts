// Formate une date ISO (yyyy-mm-dd) au format français JJ/MM/AAAA.
export function formaterDateFr(iso: string | undefined | null): string {
  if (!iso) return "";
  const [an, mois, jour] = iso.split("-");
  if (!an || !mois || !jour) return iso;
  return `${jour}/${mois}/${an}`;
}
