export function Logo() {
  return (
    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/15 ring-1 ring-emerald-400/40 shadow-[0_0_0_1px_rgba(16,185,129,0.35)]">
      <svg
        viewBox="0 0 72 64"
        aria-hidden="true"
        className="h-8 w-9 text-emerald-300"
      >
        {/* Bird body + head — single organic silhouette */}
        <path
          fill="currentColor"
          d="M36,19 C32,12 22,10 15,14 C8,18 3,27 4,35 C5,42 8,47 12,49
             L4,57 L13,51 L7,60 L18,52
             C23,55 30,54 35,49 C40,44 43,37 43,27 C43,22 40,19 36,19 Z"
        />

        {/* Upper beak (open mouth) */}
        <polygon fill="currentColor" points="36,19 46,14 36,24" />

        {/* Lower beak (open mouth) */}
        <polygon fill="currentColor" points="36,29 46,32 36,33" />

        {/* Eye */}
        <circle fill="rgba(0,0,0,0.75)" cx="29" cy="20" r="2.6" />

        {/* Two beamed eighth notes */}
        <ellipse fill="currentColor" cx="54" cy="17" rx="4" ry="3" transform="rotate(-20 54 17)" />
        <line stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" x1="57.5" y1="15" x2="57.5" y2="5" />

        <ellipse fill="currentColor" cx="62" cy="11" rx="4" ry="3" transform="rotate(-20 62 11)" />
        <line stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" x1="65.5" y1="9" x2="65.5" y2="1" />

        {/* Beam */}
        <line stroke="currentColor" strokeWidth="3" strokeLinecap="round" x1="57.5" y1="5" x2="65.5" y2="1" />
      </svg>
    </div>
  );
}
