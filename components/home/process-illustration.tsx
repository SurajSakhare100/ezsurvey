export function ProcessIllustration() {
  return (
    <div className="relative mx-auto max-w-4xl">
      <svg
        width="800"
        height="300"
        viewBox="0 0 800 300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full"
      >
        {/* Step 1: Create */}
        <g transform="translate(50, 50)">
          <circle cx="50" cy="50" r="40" fill="url(#step1Gradient)" />
          <path d="M35 50 L45 50 M50 35 L50 65 M55 50 L65 50" stroke="white" strokeWidth="3" strokeLinecap="round" />
          <text x="50" y="120" textAnchor="middle" fill="#1e293b" fontSize="14" fontWeight="600">
            Create
          </text>
          <text x="50" y="140" textAnchor="middle" fill="#64748b" fontSize="12">
            Build your survey
          </text>
        </g>

        {/* Arrow 1 */}
        <path
          d="M150 100 Q200 80 250 100"
          stroke="url(#arrowGradient)"
          strokeWidth="3"
          fill="none"
          markerEnd="url(#arrowhead)"
        />

        {/* Step 2: Share */}
        <g transform="translate(300, 50)">
          <circle cx="50" cy="50" r="40" fill="url(#step2Gradient)" />
          <path
            d="M35 45 L50 35 L65 45 M50 35 L50 65"
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="35" cy="55" r="3" fill="white" />
          <circle cx="65" cy="55" r="3" fill="white" />
          <text x="50" y="120" textAnchor="middle" fill="#1e293b" fontSize="14" fontWeight="600">
            Share
          </text>
          <text x="50" y="140" textAnchor="middle" fill="#64748b" fontSize="12">
            Send to audience
          </text>
        </g>

        {/* Arrow 2 */}
        <path
          d="M400 100 Q450 80 500 100"
          stroke="url(#arrowGradient)"
          strokeWidth="3"
          fill="none"
          markerEnd="url(#arrowhead)"
        />

        {/* Step 3: Analyze */}
        <g transform="translate(550, 50)">
          <circle cx="50" cy="50" r="40" fill="url(#step3Gradient)" />
          <rect x="35" y="60" width="6" height="15" rx="1" fill="white" />
          <rect x="44" y="50" width="6" height="25" rx="1" fill="white" />
          <rect x="53" y="55" width="6" height="20" rx="1" fill="white" />
          <rect x="62" y="45" width="6" height="30" rx="1" fill="white" />
          <text x="50" y="120" textAnchor="middle" fill="#1e293b" fontSize="14" fontWeight="600">
            Analyze
          </text>
          <text x="50" y="140" textAnchor="middle" fill="#64748b" fontSize="12">
            Get insights
          </text>
        </g>

        {/* Floating elements */}
        <circle cx="150" cy="200" r="4" fill="#22d3ee" opacity="0.6">
          <animate attributeName="cy" values="200;190;200" dur="3s" repeatCount="indefinite" />
        </circle>
        <rect x="400" y="180" width="8" height="8" rx="2" fill="#10b981" opacity="0.6">
          <animate attributeName="y" values="180;170;180" dur="2.5s" repeatCount="indefinite" />
        </rect>
        <circle cx="650" cy="220" r="3" fill="#f59e0b" opacity="0.6">
          <animate attributeName="cy" values="220;210;220" dur="3.5s" repeatCount="indefinite" />
        </circle>

        <defs>
          <linearGradient id="step1Gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
          <linearGradient id="step2Gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
          <linearGradient id="step3Gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
          <linearGradient id="arrowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="url(#arrowGradient)" />
          </marker>
        </defs>
      </svg>
    </div>
  )
}
