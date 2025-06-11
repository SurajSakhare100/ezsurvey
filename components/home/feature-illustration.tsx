export function FeatureIllustration({ type }: { type: "speed" | "simple" | "payment" }) {
  if (type === "speed") {
    return (
      <svg width="200" height="150" viewBox="0 0 200 150" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Lightning bolt with speed lines */}
        <g transform="translate(100, 75)">
          <path d="M-15 -30 L5 -10 L-5 -10 L15 30 L-5 10 L5 10 Z" fill="url(#speedGradient)" stroke="none" />
          {/* Speed lines */}
          <path d="M-40 -20 L-25 -20" stroke="#06b6d4" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
          <path d="M-45 -5 L-25 -5" stroke="#06b6d4" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
          <path d="M-40 10 L-25 10" stroke="#06b6d4" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
          <path d="M25 -15 L45 -15" stroke="#06b6d4" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
          <path d="M25 0 L50 0" stroke="#06b6d4" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
          <path d="M25 15 L45 15" stroke="#06b6d4" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
        </g>
        <defs>
          <linearGradient id="speedGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
        </defs>
      </svg>
    )
  }

  if (type === "simple") {
    return (
      <svg width="200" height="150" viewBox="0 0 200 150" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Simple interface mockup */}
        <rect x="50" y="30" width="100" height="90" rx="8" fill="white" stroke="#e2e8f0" strokeWidth="2" />
        <rect x="60" y="45" width="60" height="4" rx="2" fill="#06b6d4" />
        <rect x="60" y="55" width="80" height="3" rx="1.5" fill="#cbd5e1" />
        <circle cx="70" cy="75" r="4" fill="#10b981" />
        <rect x="80" y="72" width="50" height="3" rx="1.5" fill="#64748b" />
        <circle cx="70" cy="90" r="4" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="1" />
        <rect x="80" y="87" width="40" height="3" rx="1.5" fill="#64748b" />
        <rect x="110" y="105" width="30" height="8" rx="4" fill="url(#simpleGradient)" />

        {/* Floating elements */}
        <circle cx="40" cy="40" r="3" fill="#22d3ee" opacity="0.8" />
        <rect x="160" y="50" width="6" height="6" rx="1" fill="#10b981" opacity="0.8" />
        <circle cx="170" cy="100" r="2" fill="#f59e0b" opacity="0.6" />

        <defs>
          <linearGradient id="simpleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
        </defs>
      </svg>
    )
  }

  if (type === "payment") {
    return (
      <svg width="200" height="150" viewBox="0 0 200 150" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Credit card and coins */}
        <rect x="60" y="50" width="80" height="50" rx="6" fill="url(#cardGradient)" />
        <rect x="70" y="60" width="20" height="12" rx="2" fill="white" opacity="0.9" />
        <rect x="70" y="80" width="60" height="2" rx="1" fill="white" opacity="0.7" />
        <rect x="70" y="85" width="40" height="2" rx="1" fill="white" opacity="0.7" />

        {/* Coins */}
        <circle cx="45" cy="40" r="8" fill="#f59e0b" />
        <circle cx="45" cy="40" r="6" fill="#fbbf24" />
        <text x="45" y="44" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">
          $
        </text>

        <circle cx="155" cy="110" r="6" fill="#10b981" />
        <circle cx="155" cy="110" r="4" fill="#34d399" />
        <text x="155" y="113" textAnchor="middle" fill="white" fontSize="6" fontWeight="bold">
          $
        </text>

        {/* "One time" text effect */}
        <path d="M80 25 Q100 20 120 25" stroke="#06b6d4" strokeWidth="2" fill="none" />
        <text x="100" y="20" textAnchor="middle" fill="#06b6d4" fontSize="10" fontWeight="600">
          ONE TIME
        </text>

        <defs>
          <linearGradient id="cardGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
        </defs>
      </svg>
    )
  }

  return null
}
