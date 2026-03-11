import React from 'react';

/**
 * Pakuna Logo Component
 * High-fidelity SVG recreation of the heart-cat-dog logo.
 */
export const Logo = ({ className = "h-10" }) => (
  <div className="flex items-center shrink-0">
    <img 
      src="/Pakuna-logo.png" 
      alt="Pakuna Logo" 
      className={`${className} w-auto object-contain shrink-0 mix-blend-multiply`} 
    />
  </div>
);

export default Logo;
