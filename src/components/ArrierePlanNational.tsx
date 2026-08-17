// Arrière-plan institutionnel discret : silhouette approximative de la carte de
// Djibouti + un motif inspiré des symboles nationaux (étoile, lances croisées),
// dessinés en traits originaux — et non une reproduction exacte de l'emblème
// officiel — utilisés en filigrane très clair pour rester lisible et sobre.

export default function ArrierePlanNational() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden>
      {/* Silhouette de la carte de Djibouti, en bas à droite */}
      <svg
        className="absolute -bottom-24 -right-24 h-[34rem] w-[34rem] opacity-[0.05] sm:h-[42rem] sm:w-[42rem]"
        viewBox="0 0 400 400"
        fill="none"
      >
        <path
          d="M120 40
             L165 55 L205 45 L235 65 L250 60 L275 80
             L300 95 L288 120 L305 135 L330 150
             L340 175 L320 200 L330 225 L310 245
             L285 250 L270 275 L240 280 L215 300
             L190 290 L170 305 L145 295 L130 270
             L105 260 L95 235 L70 220 L60 195
             L75 175 L65 150 L85 130 L80 105
             L100 90 L95 65 Z"
          stroke="var(--navy)"
          strokeWidth="3"
        />
      </svg>

      {/* Motif national stylisé (étoile à cinq branches encadrée de lances croisées),
          inspiré des symboles nationaux, en haut à gauche */}
      <svg
        className="absolute -left-16 -top-16 h-80 w-80 opacity-[0.05] sm:h-96 sm:w-96"
        viewBox="0 0 200 200"
        fill="none"
      >
        <line x1="30" y1="170" x2="170" y2="30" stroke="var(--gold-seal)" strokeWidth="3" />
        <line x1="30" y1="30" x2="170" y2="170" stroke="var(--gold-seal)" strokeWidth="3" />
        <path
          d="M100 60 L110 88 L140 88 L116 106 L125 134 L100 117 L75 134 L84 106 L60 88 L90 88 Z"
          stroke="var(--gold-seal)"
          strokeWidth="3"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
