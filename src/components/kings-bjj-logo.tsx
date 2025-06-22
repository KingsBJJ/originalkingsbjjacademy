export function KingsBjjLogo({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 100 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Kings BJJ Logo"
    >
      <g fill="hsl(var(--primary))">
        <path d="M10,80 L20,30 L40,50 L50,20 L60,50 L80,30 L90,80 L10,80 Z" />
        <circle cx="20" cy="30" r="5" />
        <circle cx="50" cy="20" r="5" />
        <circle cx="80" cy="30" r="5" />
      </g>
    </svg>
  );
}
