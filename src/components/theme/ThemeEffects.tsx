'use client';

import { useEffect, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  sway: number;
  swaySpeed: number;
  petalType?: number;
}

export function ThemeEffects() {
  const [isDark, setIsDark] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const checkDark = () => setIsDark(document.documentElement.classList.contains('dark'));
    checkDark();
    
    const observer = new MutationObserver(checkDark);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const createParticles = () => {
      const newParticles: Particle[] = [];
      const count = isDark ? 80 : 40;
      
      for (let i = 0; i < count; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: isDark ? Math.random() * 6 + 3 : Math.random() * 12 + 6,
          speedX: (Math.random() - 0.5) * 0.8,
          speedY: isDark ? Math.random() * 1.5 + 0.8 : Math.random() * 0.8 + 0.4,
          rotation: Math.random() * 360,
          rotationSpeed: (Math.random() - 0.5) * 3,
          opacity: Math.random() * 0.4 + 0.4,
          sway: Math.random() * Math.PI * 2,
          swaySpeed: Math.random() * 0.02 + 0.01,
          petalType: isDark ? undefined : Math.floor(Math.random() * 3),
        });
      }
      setParticles(newParticles);
    };

    createParticles();
  }, [isDark]);

  useEffect(() => {
    const interval = setInterval(() => {
      setParticles(prev => prev.map(p => ({
        ...p,
        y: p.y + p.speedY,
        x: p.x + p.speedX + Math.sin(p.sway) * (isDark ? 0.5 : 1),
        rotation: p.rotation + p.rotationSpeed,
        sway: p.sway + p.swaySpeed,
      })).map(p => ({
        ...p,
        y: p.y > 110 ? -10 : p.y,
        x: p.x > 110 ? -10 : p.x < -10 ? 110 : p.x,
      })));
    }, 30);

    return () => clearInterval(interval);
  }, [isDark]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map(p => (
        <div
          key={p.id}
          className="absolute"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            transform: `rotate(${p.rotation}deg)`,
            opacity: p.opacity,
            transition: 'opacity 0.5s ease-in-out',
          }}
        >
          {isDark ? (
            // Realistic snowflake with glow
            <svg
              width={p.size}
              height={p.size}
              viewBox="0 0 24 24"
              style={{
                filter: 'drop-shadow(0 0 4px rgba(200, 220, 255, 0.8)) drop-shadow(0 0 8px rgba(150, 180, 255, 0.4))',
              }}
            >
              <path
                d="M12 0 L13 10 L24 12 L13 14 L12 24 L11 14 L0 12 L11 10 Z"
                fill="rgba(200, 220, 255, 0.9)"
              />
              <circle cx="12" cy="12" r="2" fill="rgba(255, 255, 255, 0.9)" />
            </svg>
          ) : (
            // Cherry blossom petal with realistic shape
            <div
              style={{
                width: '100%',
                height: '100%',
                background: p.petalType === 0 
                  ? 'linear-gradient(135deg, rgba(255, 182, 193, 0.95) 0%, rgba(255, 105, 180, 0.85) 50%, rgba(255, 182, 193, 0.7) 100%)'
                  : p.petalType === 1
                  ? 'linear-gradient(145deg, rgba(255, 192, 203, 0.95) 0%, rgba(255, 182, 193, 0.85) 50%, rgba(255, 160, 180, 0.7) 100%)'
                  : 'linear-gradient(125deg, rgba(255, 209, 220, 0.95) 0%, rgba(255, 182, 193, 0.85) 50%, rgba(255, 140, 170, 0.7) 100%)',
                borderRadius: '50% 50% 50% 50% / 70% 70% 30% 30%',
                boxShadow: '0 0 10px rgba(255, 182, 193, 0.5), inset 0 0 8px rgba(255, 255, 255, 0.3)',
                filter: 'blur(0.5px)',
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
}
