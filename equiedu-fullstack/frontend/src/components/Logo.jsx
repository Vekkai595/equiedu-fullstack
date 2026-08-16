import React from 'react';

export default function Logo({ size = 'md', showText = true }) {
  const sizes = {
    sm: { icon: 28, text: 'text-lg' },
    md: { icon: 36, text: 'text-xl' },
    lg: { icon: 48, text: 'text-3xl' }
  };
  const s = sizes[size];

  return (
    <div className="flex items-center gap-2">
      <svg width={s.icon} height={s.icon} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        {/* Book base */}
        <path d="M8 36V12C8 10.9 8.9 10 10 10H38C39.1 10 40 10.9 40 12V36C40 37.1 39.1 38 38 38H10C8.9 38 8 37.1 8 36Z" fill="hsl(217, 71%, 25%)" opacity="0.9"/>
        {/* Bridge/path arc */}
        <path d="M12 30C12 30 18 22 24 22C30 22 36 30 36 30" stroke="hsl(199, 89%, 48%)" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
        {/* Light bulb / star */}
        <circle cx="24" cy="17" r="4" fill="hsl(45, 93%, 47%)" />
        <path d="M24 13V11M28 17H30M18 17H16M27 14L28.5 12.5M21 14L19.5 12.5" stroke="hsl(45, 93%, 60%)" strokeWidth="1.5" strokeLinecap="round"/>
        {/* Wing hints */}
        <path d="M14 26L10 22" stroke="hsl(199, 89%, 48%)" strokeWidth="1.5" strokeLinecap="round" opacity="0.7"/>
        <path d="M34 26L38 22" stroke="hsl(199, 89%, 48%)" strokeWidth="1.5" strokeLinecap="round" opacity="0.7"/>
        {/* Accessibility circle */}
        <circle cx="24" cy="33" r="3" stroke="white" strokeWidth="1.5" fill="none"/>
        <path d="M24 31V33L25.5 34.5" stroke="white" strokeWidth="1.2" strokeLinecap="round"/>
      </svg>
      {showText && (
        <div className="flex flex-col leading-none">
          <span className={`${s.text} font-heading font-bold text-primary`}>
            Equi<span className="text-secondary">Edu</span>
          </span>
          {size !== 'sm' && (
            <span className="text-[10px] text-muted-foreground tracking-wider uppercase">
              Oportunidades sem Barreiras
            </span>
          )}
        </div>
      )}
    </div>
  );
}