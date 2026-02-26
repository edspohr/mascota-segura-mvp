import React from 'react';

export const Logo = ({ className = "w-8 h-8", withText = false }) => (
  <div className={`flex items-center gap-2 ${className}`}>
    <svg viewBox="0 0 100 100" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#14b8a6" /> {/* teal-500 */}
          <stop offset="100%" stopColor="#10b981" /> {/* emerald-500 */}
        </linearGradient>
        <linearGradient id="pawGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#f8fafc" /> {/* slate-50 */}
          <stop offset="100%" stopColor="#cbd5e1" /> {/* slate-300 */}
        </linearGradient>
      </defs>
      
      {/* Background Shield */}
      <path 
        d="M50 5 L90 20 L90 50 C90 75 60 92 50 95 C40 92 10 75 10 50 L10 20 Z" 
        fill="url(#shieldGrad)" 
        stroke="#042f2e" /* teal-950 */
        strokeWidth="2"
      />
      
      {/* Digital Circuit Lines */}
      <path d="M50 5 L50 30 M10 50 L30 50 M90 50 L70 50 M50 95 L50 70" stroke="#ccfbf1" strokeWidth="1" strokeDasharray="2,2" opacity="0.4" />
      <circle cx="50" cy="30" r="2" fill="#ccfbf1" opacity="0.6"/>
      <circle cx="30" cy="50" r="2" fill="#ccfbf1" opacity="0.6"/>
      <circle cx="70" cy="50" r="2" fill="#ccfbf1" opacity="0.6"/>
      <circle cx="50" cy="70" r="2" fill="#ccfbf1" opacity="0.6"/>

      {/* Main Paw Pad */}
      <path d="M50 68 C42 68 35 62 38 52 C40 45 45 46 50 46 C55 46 60 45 62 52 C65 62 58 68 50 68 Z" fill="url(#pawGrad)"/>
      
      {/* Paw Toes */}
      <ellipse cx="36" cy="38" rx="6" ry="8" transform="rotate(-25 36 38)" fill="url(#pawGrad)"/>
      <ellipse cx="45" cy="32" rx="6" ry="8" transform="rotate(-10 45 32)" fill="url(#pawGrad)"/>
      <ellipse cx="55" cy="32" rx="6" ry="8" transform="rotate(10 55 32)" fill="url(#pawGrad)"/>
      <ellipse cx="64" cy="38" rx="6" ry="8" transform="rotate(25 64 38)" fill="url(#pawGrad)"/>
    </svg>
    {withText && <span className="font-bold text-xl text-teal-400 tracking-tight">Mascota Segura</span>}
  </div>
);

export default Logo;
