import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface DotsRingProps {
  size?: number;
  count?: number;
  color?: string;
}

export const DotsRing: React.FC<DotsRingProps> = ({
  size = 56,
  count = 10,
  color = '#3b0764',
}) => {
  const radius = 18;
  const center = 25;
  const dotRadius = 3;
  const dots = Array.from({ length: count });

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 50 50"
        className="w-full h-full animate-[spin_2s_linear_infinite]"
      >
        {dots.map((_, i) => {
          const angle = (i * 360) / count;
          const rad = (angle * Math.PI) / 180;
          const x = center + radius * Math.cos(rad);
          const y = center + radius * Math.sin(rad);
          // Bertingkat dari 0.15 sampai 1.0 agar tercipta efek ekor berputar (chasing trail) yang halus
          const opacity = 0.15 + (0.85 * (i + 1)) / count;

          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r={dotRadius}
              fill={color}
              opacity={opacity}
            />
          );
        })}
      </svg>
    </div>
  );
};

export const PageTransitionLoader: React.FC = () => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Aktifkan loading selama 2 detik setiap kali halaman/rute berpindah
    setIsLoading(true);

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

    return () => {
      clearTimeout(timer);
    };
  }, [location.pathname]);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#f8fafc]/85 backdrop-blur-[2px] transition-all duration-300 animate-fadeIn">
      {/* Dots Ring Loader sesuai tema IW Paint */}
      <DotsRing size={52} count={10} color="#3b0764" />
    </div>
  );
};
