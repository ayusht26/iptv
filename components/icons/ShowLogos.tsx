import React from "react";

export function DoraemonLogo({ className = "w-7 h-7" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="46" fill="#00A0E9" stroke="#000" strokeWidth="3" />
      <ellipse cx="50" cy="58" rx="34" ry="28" fill="#FFF" stroke="#000" strokeWidth="2.5" />
      <circle cx="41" cy="36" r="10" fill="#FFF" stroke="#000" strokeWidth="2" />
      <circle cx="59" cy="36" r="10" fill="#FFF" stroke="#000" strokeWidth="2" />
      <circle cx="43" cy="38" r="3.5" fill="#000" />
      <circle cx="57" cy="38" r="3.5" fill="#000" />
      <circle cx="50" cy="46" r="6" fill="#E60012" stroke="#000" strokeWidth="2" />
      <line x1="50" y1="52" x2="50" y2="72" stroke="#000" strokeWidth="2.5" />
      <path d="M 26 66 Q 50 82 74 66" fill="none" stroke="#000" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export function PokemonLogo({ className = "w-7 h-7" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="46" fill="#FFF" stroke="#000" strokeWidth="5" />
      <path d="M 4 50 A 46 46 0 0 1 96 50 Z" fill="#EE1515" stroke="#000" strokeWidth="5" />
      <line x1="4" y1="50" x2="96" y2="50" stroke="#000" strokeWidth="6" />
      <circle cx="50" cy="50" r="14" fill="#FFF" stroke="#000" strokeWidth="5" />
      <circle cx="50" cy="50" r="7" fill="#FFF" stroke="#000" strokeWidth="3" />
    </svg>
  );
}

export function ShinchanLogo({ className = "w-7 h-7" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" rx="20" fill="#FFCC00" />
      <circle cx="50" cy="45" r="36" fill="#FFD2B2" stroke="#000" strokeWidth="3" />
      <path d="M 18 36 Q 34 18 50 32 Q 66 18 82 36 Q 50 10 18 36 Z" fill="#000" />
      <ellipse cx="36" cy="45" rx="5" ry="7" fill="#000" />
      <ellipse cx="64" cy="45" rx="5" ry="7" fill="#000" />
      <ellipse cx="30" cy="58" rx="6" ry="4" fill="#FF8888" opacity="0.7" />
      <ellipse cx="70" cy="58" rx="6" ry="4" fill="#FF8888" opacity="0.7" />
      <path d="M 38 65 Q 50 78 62 65" fill="none" stroke="#000" strokeWidth="3.5" strokeLinecap="round" />
    </svg>
  );
}

export function Ben10Logo({ className = "w-7 h-7" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="46" fill="#111" stroke="#00FF00" strokeWidth="4" />
      <polygon points="50,15 22,50 36,50 50,28 64,50 78,50" fill="#00FF00" />
      <polygon points="50,85 22,50 36,50 50,72 64,50 78,50" fill="#00FF00" />
      <circle cx="50" cy="50" r="10" fill="#00FF00" stroke="#000" strokeWidth="2" />
    </svg>
  );
}

export function NarutoLogo({ className = "w-7 h-7" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="46" fill="#FF6600" stroke="#000" strokeWidth="4" />
      <circle cx="50" cy="50" r="32" fill="#777" stroke="#000" strokeWidth="3" />
      <path d="M 50 25 C 34 25 30 40 42 48 C 54 56 46 72 32 66" fill="none" stroke="#FFF" strokeWidth="5" strokeLinecap="round" />
      <circle cx="34" cy="65" r="3.5" fill="#FFF" />
    </svg>
  );
}

export function SpidermanLogo({ className = "w-7 h-7" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="46" fill="#D00000" stroke="#000" strokeWidth="4" />
      <path d="M 50 10 L 50 90 M 10 50 L 90 50 M 22 22 L 78 78 M 22 78 L 78 22" stroke="#000" strokeWidth="1.5" opacity="0.6" />
      <polygon points="26,38 42,48 26,62 34,50" fill="#FFF" stroke="#000" strokeWidth="3" />
      <polygon points="74,38 58,48 74,62 66,50" fill="#FFF" stroke="#000" strokeWidth="3" />
    </svg>
  );
}

export function getShowLogo(showId: string, className = "w-7 h-7") {
  switch (showId) {
    case "doraemon-247":
    case "doraemon":
      return <DoraemonLogo className={className} />;
    case "pokemon-247":
    case "pokemon":
      return <PokemonLogo className={className} />;
    case "shinchan-247":
    case "shinchan":
      return <ShinchanLogo className={className} />;
    case "ben10-247":
    case "ben10":
      return <Ben10Logo className={className} />;
    case "naruto-247":
    case "naruto":
      return <NarutoLogo className={className} />;
    case "spiderman-247":
    case "spiderman":
      return <SpidermanLogo className={className} />;
    default:
      return <DoraemonLogo className={className} />;
  }
}
