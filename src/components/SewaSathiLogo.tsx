import React, { useState } from 'react';

interface SewaSathiLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  showText?: boolean;
  textColor?: string;
  onClick?: () => void;
}

export const SewaSathiLogo: React.FC<SewaSathiLogoProps> = ({
  className = '',
  size = 'md',
  showText = true,
  textColor = 'text-neutral-900',
  onClick,
}) => {
  const [hasError, setHasError] = useState(false);

  const iconSizes = {
    sm: 'w-10 h-10',
    md: 'w-13 h-13 sm:w-14 sm:h-14',
    lg: 'w-18 h-18',
    xl: 'w-24 h-24',
    '2xl': 'w-28 h-28 sm:w-32 sm:h-32',
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-xl sm:text-2xl',
    lg: 'text-2xl sm:text-3xl',
    xl: 'text-3xl sm:text-4xl',
    '2xl': 'text-4xl sm:text-5xl',
  };

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-2.5 select-none ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {/* Official SewaSathi Emblem */}
      <div className={`relative ${iconSizes[size]} shrink-0 rounded-full bg-white p-0.5 shadow-sm border border-neutral-200/90 overflow-hidden flex items-center justify-center`}>
        <img
          src={hasError ? '/sewasathi_logo.jpg' : '/images/sewasathi_logo.jpg'}
          alt="SewaSathi Official Emblem"
          referrerPolicy="no-referrer"
          onError={() => setHasError(true)}
          className="w-full h-full object-contain rounded-full"
        />
        {/* Subtle active status indicator dot */}
        <span className="absolute bottom-0.5 right-0.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white" />
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

