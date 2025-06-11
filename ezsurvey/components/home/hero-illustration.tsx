export function HeroIllustration() {
  return (
    <div className="relative">
      <svg
        width="500"
        height="400"
        viewBox="0 0 500 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full max-w-lg"
      >
        {/* Background Elements */}
        <circle cx="400" cy="80" r="60" fill="url(#gradient1)" opacity="0.1" />
        <circle cx="100" cy="320" r="40" fill="url(#gradient2)" opacity="0.1" />

        {/* Main Survey Card */}
        <rect
          x="80"
          y="120"
          width="340"
          height="200"
          rx="20"
          fill="white"
          stroke="#e2e8f0"
          strokeWidth="2"
          filter="url(#shadow)"
        />

        {/* Survey Header */}
        <rect x="100" y="140" width="120" height="8" rx="4" fill="#0891b2" />
        <rect x="100" y="155" width="200" height="6" rx="3" fill="#cbd5e1" />

        {/* Progress Bar */}
        <rect x="100" y="180" width="300" height="4" rx="2" fill="#f1f5f9" />
        <rect x="100" y="180" width="180" height="4" rx="2" fill="#0891b2" />

        {/* Question */}
        <rect x="100" y="200" width="250" height="8" rx="4" fill="#1e293b" />
        <rect x="100" y="215" width="180" height="6" rx="3" fill="#64748b" />

        {/* Answer Options */}
        <circle cx="110" cy="240" r="6" fill="#0891b2" />
        <rect x="125" y="235" width="150" height="6" rx="3" fill="#64748b" />

        <circle cx="110" cy="260" r="6" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="2" />
        <rect x="125" y="255" width="120" height="6" rx="3" fill="#64748b" />

        <circle cx="110" cy="280" r="6" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="2" />
        <rect x="125" y="275" width="100" height="6" rx="3" fill="#64748b" />

        {/* Submit Button */}
        <rect x="320" y="290" width="80" height="20" rx="10" fill="url(#buttonGradient)" />
        <text x="360" y="302" textAnchor="middle" fill="white" fontSize="10" fontWeight="600">
          Next
        </text>

        {/* Floating Elements */}
        <g transform="translate(50, 50)">
          <circle cx="0" cy="0" r="8" fill="#22d3ee" opacity="0.8" />
          <path d="M-3 -1 L-1 1 L3 -3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </g>

        <g transform="translate(420, 280)">
          <circle cx="0" cy="0" r="6" fill="#06b6d4" opacity="0.6" />
          <text x="0" y="2" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">
            5
          </text>
        </g>

        <g transform="translate(60, 200)">
          <rect x="0" y="0" width="12" height="12" rx="2" fill="#10b981" opacity="0.8" />
          <path d="M3 6 L5 8 L9 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </g>

        {/* Decorative Lines */}
        <path d="M30 100 Q50 90 70 100" stroke="url(#gradient1)" strokeWidth="2" fill="none" opacity="0.3" />
        <path d="M430 350 Q450 340 470 350" stroke="url(#gradient2)" strokeWidth="2" fill="none" opacity="0.3" />

        {/* Gradients and Filters */}
        <defs>
          <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
          <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
          <linearGradient id="buttonGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0891b2" />
            <stop offset="100%" stopColor="#0e7490" />
          </linearGradient>
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="#000000" floodOpacity="0.1" />
          </filter>
        </defs>
      </svg>
    </div>
  )
}
