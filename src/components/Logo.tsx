import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark';
  onClick?: () => void;
}

const Logo: React.FC<LogoProps> = ({ className = "", variant = 'light', onClick }) => {
  const colors = variant === 'light' 
    ? { primary: '#4ade80', secondary: '#fbbf24', accent: '#065f46' }
    : { primary: '#22c55e', secondary: '#f59e0b', accent: '#064e3b' };

  return (
    <div className={`flex items-center gap-3 ${className}`} onClick={onClick}>
      {/* Pestle and Mortar SVG Icon */}
      <svg 
        width="40" 
        height="40" 
        viewBox="0 0 40 40" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        {/* Mortar Bowl */}
        <path 
          d="M8 18C8 16 9 14 11 13H29C31 14 32 16 32 18V28C32 32 28 36 24 36H16C12 36 8 32 8 28V18Z" 
          fill={colors.primary}
          stroke={colors.accent}
          strokeWidth="1.5"
        />
        
        {/* Mortar Base */}
        <ellipse 
          cx="20" 
          cy="32" 
          rx="14" 
          ry="3" 
          fill={colors.accent}
          opacity="0.6"
        />
        
        {/* Pestle */}
        <path 
          d="M25 8L30 4C31 3 32 3 33 4C34 5 34 6 33 7L29 11L27 13C26.5 13.5 26 13.5 25.5 13L25 12.5L22 15.5C21.5 16 21 16 20.5 15.5C20 15 20 14.5 20.5 14L23.5 11L23 10.5C22.5 10 22.5 9.5 23 9L25 8Z" 
          fill={colors.secondary}
          stroke={colors.accent}
          strokeWidth="1"
        />
        
        {/* Pestle Handle Detail */}
        <circle 
          cx="31" 
          cy="5.5" 
          r="1.5" 
          fill={colors.accent}
        />
        
        {/* Mortar Content/Herbs */}
        <circle cx="16" cy="22" r="2" fill={colors.secondary} opacity="0.7" />
        <circle cx="22" cy="25" r="1.5" fill={colors.secondary} opacity="0.5" />
        <circle cx="18" cy="26" r="1" fill={colors.accent} opacity="0.6" />
      </svg>

      {/* Brand Text */}
      <div className="flex flex-col">
        <h1 className="sanskrit-title text-2xl font-bold gradient-text leading-tight">
          Ved-Aahaar
        </h1>
        <p className="text-xs text-muted-foreground font-medium tracking-wide">
          आयुर्वेदिक आहार
        </p>
      </div>
    </div>
  );
};

export default Logo;