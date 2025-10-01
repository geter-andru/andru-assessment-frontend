'use client';

// POLISH PHASE: Dynamic environmental background effects

import { useEffect, useState } from 'react';
import { calculateEnvironmentalState, generateParticles } from '@/lib/environmental-effects';

interface EnvironmentalBackgroundProps {
  overallScore: number;
  answeredQuestions: number;
  totalQuestions: number;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
}

export default function EnvironmentalBackground({
  overallScore,
  answeredQuestions,
  totalQuestions
}: EnvironmentalBackgroundProps) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [mounted, setMounted] = useState(false);
  
  const environmentalState = calculateEnvironmentalState(
    overallScore,
    answeredQuestions,
    totalQuestions
  );
  
  useEffect(() => {
    setMounted(true);
    setParticles(generateParticles(environmentalState.mood));
  }, [environmentalState.mood]);
  
  useEffect(() => {
    if (!mounted || particles.length === 0) return;
    
    const interval = setInterval(() => {
      setParticles(prev => prev.map(particle => ({
        ...particle,
        y: particle.y - particle.speed,
        x: particle.x + Math.sin(Date.now() * 0.001 + particle.id) * 0.1,
        // Reset particle when it goes off screen
        ...(particle.y < -5 ? {
          y: 105,
          x: Math.random() * 100,
        } : {})
      })));
    }, 50);
    
    return () => clearInterval(interval);
  }, [mounted, particles.length]);
  
  if (!mounted) return null;
  
  return (
    <>
      {/* Dynamic background gradient overlay */}
      <div 
        className="fixed inset-0 transition-all duration-1000 ease-out pointer-events-none z-0"
        style={{ 
          background: environmentalState.backgroundGradient,
          opacity: 1 
        }}
      />
      
      {/* Animated particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute rounded-full animate-pulse"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              backgroundColor: environmentalState.particleColor,
              opacity: particle.opacity,
              transition: 'left 0.1s ease-out, top 0.1s ease-out',
            }}
          />
        ))}
      </div>
      
      {/* Performance mood indicator */}
      {answeredQuestions >= 3 && (
        <div className="fixed top-4 left-4 z-10">
          <div 
            className="px-3 py-2 rounded-full text-xs font-medium backdrop-blur-sm transition-all duration-500"
            style={{
              backgroundColor: `${environmentalState.accentColor}20`,
              color: environmentalState.accentColor,
              border: `1px solid ${environmentalState.accentColor}40`
            }}
          >
            {environmentalState.mood === 'excellent' && '🌟 Excellent Progress'}
            {environmentalState.mood === 'good' && '✨ Good Momentum'}  
            {environmentalState.mood === 'developing' && '🌱 Building Knowledge'}
            {environmentalState.mood === 'needs-work' && '🎯 Room to Grow'}
          </div>
        </div>
      )}
    </>
  );
}