import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark';
  onClick?: () => void;
}

const Logo: React.FC<LogoProps> = ({ className = "", variant = 'light', onClick }) => {
  const colors = variant === 'light' 
    ? { primary: '#22c55e', secondary: '#84cc16', accent: '#064e3b' }
    : { primary: '#16a34a', secondary: '#65a30d', accent: '#052e2b' };

  return (
    <div className={`flex items-center gap-3 cursor-pointer ${className}`} onClick={onClick}>
      {/* Simplified continuous pestle & mortar with leaf */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 64 64"
        width="40"
        height="40"
        fill="none"
        className="shrink-0"
      >
        {/* Continuous bowl silhouette */}
        <path
          d="M8 28c0 0 0 0 0 0h48c0 0 0 0 0 0v4c0 10.5-11.2 19-24 19S8 42.5 8 32v-4z"
          fill={colors.primary}
        />
        {/* Bowl rim (single continuous stroke) */}
        <path
          d="M8 28c6 0 50 0 48 0"
          stroke={colors.accent}
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        {/* Base */}
        <rect x="24" y="51" width="16" height="5" rx="2.5" fill={colors.accent} />
        {/* Pestle (simple continuous shape) */}
        <path
          d="M46 10c2 0 4 2 4 4 0 1-.4 1.9-1.1 2.6L36 29l-6-6 12.6-12.9c.7-.7 1.6-1.1 2.4-1.1z"
          fill={colors.secondary}
        />
        {/* Leaf */}
        <path
          d="M20 22c6-4 12-2 14 2-6 4-12 2-14-2z"
          fill={colors.secondary}
        />
        <path
          d="M20 22c6-4 12-2 14 2"
          stroke={colors.accent}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>

      {/* Brand Text */}
      <div className="flex flex-col">
        <h1 className="sanskrit-title text-2xl font-bold gradient-text leading-tight">Ved-Aahaar</h1>
        <p className="text-xs text-muted-foreground font-medium tracking-wide">
          Ayurvedic Nutrition
        </p>
      </div>
    </div>
  );
};

export default Logo;