import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark';
  onClick?: () => void;
}

const Logo: React.FC<LogoProps> = ({ className = "", variant = 'light', onClick }) => {
  return (
    <div className={`flex items-center gap-3 ${className}`} onClick={onClick}>
      {/* Simple Line Pestle and Mortar SVG Icon */}
      <svg 
        width="40" 
        height="40" 
        viewBox="0 0 40 40" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        {/* Mortar Bowl - simple line version */}
        <path 
          d="M8 18C8 16 9 14 11 13H29C31 14 32 16 32 18V28C32 32 28 36 24 36H16C12 36 8 32 8 28V18Z" 
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
        
        {/* Pestle - simple line version */}
        <path 
          d="M25 8L30 4C31 3 32 3 33 4C34 5 34 6 33 7L29 11L27 13L22 15.5" 
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Mortar Content - simple dots */}
        <circle cx="16" cy="22" r="1" fill="currentColor" opacity="0.6" />
        <circle cx="22" cy="25" r="1" fill="currentColor" opacity="0.4" />
        <circle cx="18" cy="26" r="0.5" fill="currentColor" opacity="0.8" />
      </svg>

      {/* Brand Text */}
      <div className="flex flex-col">
        <h1 className={`sanskrit-title text-2xl font-bold leading-tight ${
          variant === 'light' ? 'text-white' : 'gradient-text'
        }`}>
          Ved-Aahaar
        </h1>
        <p className={`text-xs font-medium tracking-wide ${
          variant === 'light' ? 'text-white/70' : 'text-muted-foreground'
        }`}>
          आयुर्वेदिक आहार
        </p>
      </div>
    </div>
  );
};

export default Logo;