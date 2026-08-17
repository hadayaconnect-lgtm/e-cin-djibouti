// Arrière-plan institutionnel discret : silhouette approximative de la carte de
// Djibouti + un motif inspiré des symboles nationaux (étoile, lances croisées),
// dessinés en traits originaux — et non une reproduction exacte de l'emblème
// officiel — utilisés en filigrane très clair pour rester lisible et sobre.

export default function ArrierePlanNational() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden>
      {/* Silhouette du territoire de Djibouti (tracé original, inspiré du contour
          général du pays : échancrure du golfe de Tadjoura à l'ouest, côte
          découpée à l'est), en bas à droite */}
      <svg
        className="absolute -bottom-20 -right-20 h-[30rem] w-[30rem] opacity-[0.05] sm:h-[38rem] sm:w-[38rem]"
        viewBox="0 0 400 400"
        fill="none"
      >
        <path
          d="M150 55
             L190 50 L210 70 L235 60 L255 75
             L275 68 L300 85 L292 105 L315 118
             L308 138 L330 150 L322 172 L340 190
             L325 205 L335 225 L312 235 L300 258
             L278 260 L268 282 L245 278 L228 298
             L205 292 L188 308 L165 300 L150 315
             L128 298 L110 302 L98 280 L75 275
             L70 250 L48 240 L55 218 L38 200
             L52 182 L45 160 L65 148 L60 125
             L82 118 L78 95 L100 88 L98 65
             L122 68 Z"
          stroke="var(--navy)"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        {/* Échancrure évoquant le golfe de Tadjoura */}
        <path
          d="M150 55 L175 130 L120 165 L98 120"
          stroke="var(--navy)"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </svg>

      {/* Motif inspiré des symboles nationaux — couronne, lances croisées tenues par
          deux mains, bouclier rond, pointe de lance et étoile — dessin original en
          traits simples, en haut à gauche */}
      <svg
        className="absolute -left-16 -top-16 h-80 w-80 opacity-[0.05] sm:h-96 sm:w-96"
        viewBox="0 0 200 200"
        fill="none"
        stroke="var(--gold-seal)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Couronne circulaire (feuillage stylisé) */}
        <circle cx="100" cy="105" r="72" strokeDasharray="6 5" />

        {/* Deux mains à la base */}
        <path d="M62 155 q-10 8 -6 18 q10 6 20 -2" />
        <path d="M138 155 q10 8 6 18 q-10 6 -20 -2" />

        {/* Lances croisées */}
        <path d="M66 160 L142 55" />
        <path d="M134 160 L58 55" />
        <path d="M58 55 L50 42 L64 48 Z" fill="var(--gold-seal)" stroke="none" />
        <path d="M142 55 L150 42 L136 48 Z" fill="var(--gold-seal)" stroke="none" />

        {/* Bouclier rond au centre */}
        <circle cx="100" cy="112" r="22" />
        <circle cx="100" cy="112" r="10" />

        {/* Pointe de lance verticale au-dessus du bouclier */}
        <path d="M100 85 L100 50 L92 62 M100 50 L108 62" />

        {/* Étoile à cinq branches, au sommet */}
        <path
          d="M100 20 L106 35 L122 35 L109 45 L114 60 L100 51 L86 60 L91 45 L78 35 L94 35 Z"
          fill="var(--gold-seal)"
          stroke="none"
        />
      </svg>
    </div>
  );
}
