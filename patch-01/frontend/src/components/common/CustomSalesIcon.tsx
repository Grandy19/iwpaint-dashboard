import React from 'react';

export const CustomSalesIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {/* Head */}
      <circle cx="8" cy="8" r="4" />
      {/* Left shoulder */}
      <path d="M3 21v-2a4 4 0 0 1 4-4h2" />
      
      {/* Dollar sign (top right) */}
      <line x1="18" x2="18" y1="4" y2="12" />
      <path d="M21 5.5h-4a1.5 1.5 0 0 0 0 3h2a1.5 1.5 0 0 1 0 3h-4" />
      
      {/* Trending up arrow (bottom right) */}
      <polyline points="11 19 14 16 17 19 22 14" />
      <polyline points="18 14 22 14 22 18" />
    </svg>
  );
};
