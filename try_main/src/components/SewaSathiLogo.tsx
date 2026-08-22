import React from 'react';

interface SewaSathiLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  textColor?: string;
}

export const SewaSathiLogo: React.FC<SewaSathiLogoProps> = ({
  className = '',
  size = 'md',
  showText = true,
  textColor = 'text-neutral-900',
}) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11',
    xl: 'w-14 h-14',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl',
  };

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Emblem Logo SVG */}
      <div className={`relative ${iconSizes[size]} shrink-0 rounded-xl bg-gradient-to-br from-red-700 via-red-800 to-red-950 p-1.5 text-white shadow-md shadow-red-900/20 flex items-center justify-center border border-red-600/30`}>
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Outer Crest Ring */}
          <circle cx="24" cy="24" r="21" stroke="#fecaca" strokeWidth="1.5" strokeDasharray="2 3" opacity="0.6" />
          
          {/* Stylized S Curve and Protective Wings / Hands */}
          <path
            d="M14 18C14 14.6863 16.6863 12 20 12H28C31.3137 12 34 14.6863 34 18C34 21.3137 31.3137 24 28 24H20C16.6863 24 14 26.6863 14 30C14 33.3137 16.6863 36 20 36H28C31.3137 36 34 33.3137 34 30"
            stroke="#ffffff"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {/* Central Civic Resolve Flame / Pin Dot */}
          <circle cx="24" cy="24" r="4.5" fill="#fef08a" />
          <path
            d="M24 8L27 13H21L24 8Z"
            fill="#ffffff"
          />
        </svg>

        {/* Small live heartbeat indicator */}
        <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
      </div>

      {showText && (
        <div className="flex flex-col text-left leading-tight">
          <div className={`font-sans-ui font-bold tracking-tight ${textSizes[size]} ${textColor} flex items-center gap-1`}>
            <span>SewaSathi</span>
          </div>
          <span className="text-[10px] font-mono tracking-wider uppercase text-neutral-500 font-medium">
            Citizen Grievance Redressal
          </span>
        </div>
      )}
    </div>
  );
};
