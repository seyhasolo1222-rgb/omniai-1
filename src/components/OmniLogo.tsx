import React from 'react';

interface OmniLogoProps {
  className?: string;
  size?: number;
}

export const OmniLogo: React.FC<OmniLogoProps> = ({ className = '', size = 28 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Omni AI Logo"
    >
      {/* Refined minimalist 'O' logo: sleek geometric ring with subtle modern inner contour */}
      <circle
        cx="50"
        cy="50"
        r="38"
        stroke="currentColor"
        strokeWidth="11"
        className="text-[#0d0d0d]"
      />
      <circle
        cx="50"
        cy="50"
        r="21"
        stroke="currentColor"
        strokeWidth="4"
        strokeDasharray="4 4"
        className="text-neutral-400"
        opacity="0.35"
      />
      <circle
        cx="50"
        cy="12"
        r="4.5"
        fill="currentColor"
        className="text-[#0d0d0d]"
      />
    </svg>
  );
};
