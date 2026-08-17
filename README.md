# e-CIN Djibouti — MVP de démonstration

Plateforme de pré-demande de Carte d'Identité Nationale. Toutes les données sont fictives.

## Démarrer en local
```
npm install
npm run dev
```
Puis ouvrir http://localhost:3000

## Pages principales
- `/` — accueil, choix du parcours
- `/premiere-demande` — parcours guidé première demande
- `/renouvellement` — ancienne CIN + vérification registre (grand-mères)
- `/perte` — déclaration policière obligatoire puis remplacement
- `/suivi` — suivi de dossier + prise de rendez-vous biométrique
- `/agent` — espace agent (tableau de bord) et `/agent/[id]` (décision humaine)

## Notes techniques
- Stockage : `localStorage` via `src/lib/cin/db.ts` (façade `cinDb`), migration future vers Supabase.
- OCR et contrôle photo : simulés dans `src/lib/cin/ocr-sim.ts` (déterministe selon le nom de fichier
  pour rejouer les scénarios de démonstration — voir noms `cas-b`, `cas-c`, `cas-f`, `flou`, etc.)
- Registre national : simulé dans `src/lib/cin/registre-fictif.ts`, avec protection anti-devinette
  (verrouillage après 3 tentatives) et messages génériques qui ne révèlent jamais la bonne réponse.
- Liste des pièces requises : `src/lib/cin/pieces.ts`, pensée pour devenir éditable par l'administration.
- Assistant IA : base de connaissances fermée dans `src/lib/cin/assistant-data.ts` — ne répond
  qu'à partir des procédures enregistrées, jamais d'invention.

## Prochaines étapes suggérées
- Espace "Paramètres" agent pour éditer la liste des pièces sans toucher au code.
- Ajout arabe / somali dans l'assistant (structure déjà prévue).
- Migration Supabase (RLS par rôle citoyen / agent / administrateur), authentification réelle.
- Remplacer les simulations OCR/photo par de vrais services, en gardant la règle : aucune décision
  automatique ne devient définitive sans validation humaine.
