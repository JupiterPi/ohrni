export function Logo() {
  return (
    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/15 ring-1 ring-emerald-400/40 shadow-[0_0_0_1px_rgba(16,185,129,0.35)]">
      <svg
        viewBox="0 0 64 64"
        aria-hidden="true"
        className="h-8 w-8 text-emerald-300"
      >
        {/* Bird head & beak */}
        <path
          d="M18 32c0-9 7-16 16-16 6 0 11 3 14 8"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.6"
          strokeLinecap="round"
        />
        <path
          d="M32 20l8-3-4 7"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Eye */}
        <circle cx="30" cy="24" r="1.3" fill="currentColor" />

        {/* Body */}
        <path
          d="M18 32c1 10 7 16 14 16 7 0 12-5 14-14"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
        />

        {/* Tail */}
        <path
          d="M22 40l-4 7"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.1"
          strokeLinecap="round"
        />
        <path
          d="M26 42l-2.5 7.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.1"
          strokeLinecap="round"
        />

        {/* Musical note the bird is chirping */}
        <path
          d="M41 18v10.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
        <path
          d="M41 18c3.2.5 5.3 1.4 7.5 3"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <circle cx="36" cy="30.5" r="2.4" fill="currentColor" />

        {/* Little chirp lines */}
        <path
          d="M47 17.5c1.1.6 2 1.4 2.8 2.3"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <path
          d="M45.5 15.5c.9.4 1.6.9 2.3 1.4"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

