/** Vaso ilustrado en el mismo trazo de los personajes del menú (provisional hasta tener fotos). */
export function DrinkArt({ className }: { className?: string }) {
  const ink = '#4A0073';
  return (
    <svg className={className} viewBox="0 0 200 250" role="img" aria-hidden="true" focusable="false">
      <g fill="none" stroke={ink} strokeWidth="7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M118 52 132 10l26 6" fill="none" />
        <path d="M44 70h112l-14 158a12 12 0 0 1-12 11H70a12 12 0 0 1-12-11L44 70Z" fill="#FFFAE6" />
        <path d="M34 56c0-8 6-12 14-12h104c8 0 14 4 14 12v14H34V56Z" fill="#FFFAE6" />
        <path d="M54 112h92l-3 32H57l-3-32Z" fill="#E7DCF0" />
        <circle cx="82" cy="170" r="6" fill={ink} stroke="none" />
        <circle cx="118" cy="170" r="6" fill={ink} stroke="none" />
        <path d="M84 192c9 9 23 9 32 0" />
        <path d="M66 180c4 2 8 2 11 0M123 180c4 2 8 2 11 0" strokeWidth="4" opacity=".45" />
      </g>
      <g fill={ink}>
        <path d="M172 102c1.4 7 4 9.6 11 11-7 1.4-9.6 4-11 11-1.4-7-4-9.6-11-11 7-1.4 9.6-4 11-11Z" />
        <path d="M22 140c1 5 3 7 8 8-5 1-7 3-8 8-1-5-3-7-8-8 5-1 7-3 8-8Z" />
      </g>
    </svg>
  );
}
