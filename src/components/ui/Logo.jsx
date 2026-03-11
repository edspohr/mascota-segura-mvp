import React from 'react';

/**
 * Pakuna Logo Component
 * High-fidelity SVG recreation of the heart-cat-dog logo.
 */
export const Logo = ({ className = "w-8 h-8", withText = false, light = false }) => (
  <div className={`flex items-center gap-3 ${className}`}>
    <svg viewBox="0 0 100 100" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="pakunaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00457C" /> {/* Navy Blue */}
          <stop offset="100%" stopColor="#008894" /> {/* Teal */}
        </linearGradient>
      </defs>
      
      {/* Outer Heart Shape */}
      <path 
        d="M50 85 C20 70 10 50 10 35 C10 20 25 10 40 10 C45 10 50 15 50 15 C50 15 55 10 60 10 C75 10 90 20 90 35 C90 50 80 70 50 85" 
        fill="none" 
        stroke="url(#pakunaGrad)" 
        strokeWidth="6"
        strokeLinecap="round"
      />

      {/* Cat Silhouette (Left side of heart) */}
      <path 
        d="M42 22 C38 22 35 25 35 30 C35 38 45 45 45 55 L45 65" 
        fill="none" 
        stroke="#00457C" 
        strokeWidth="4" 
        strokeLinecap="round"
        opacity="0.8"
      />
      <path d="M38 22 L35 15 L32 24" fill="none" stroke="#00457C" strokeWidth="3" strokeLinejoin="round" />

      {/* Dog Silhouette (Right side of heart) */}
      <path 
        d="M58 22 C62 22 65 25 65 30 C65 38 55 45 55 55 L55 65" 
        fill="none" 
        stroke="#008894" 
        strokeWidth="4" 
        strokeLinecap="round"
        opacity="0.8"
      />
      <path d="M65 30 C70 30 72 35 72 40 C72 45 68 45 65 45" fill="none" stroke="#008894" strokeWidth="3" />
    </svg>
    {withText && (
      <div className="flex flex-col leading-none">
        <span className={`font-bold text-2xl tracking-tight ${light ? 'text-white' : 'text-[#00457C]'}`}>
          PAKUNA
        </span>
        <span className={`text-[10px] uppercase font-semibold tracking-[0.2em] ${light ? 'text-teal-100' : 'text-[#008894]'}`}>
          Pet Health Hub
        </span>
      </div>
    )}
  </div>
);

export default Logo;
