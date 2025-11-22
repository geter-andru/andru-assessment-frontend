'use client';

/**
 * LoadingScreen Component
 *
 * Premium loading animation that displays when the assessment first loads.
 * Ported from archived assessment (pre_nextjs/index.html) LoadingManager.
 *
 * Features:
 * - Animated rocket icon with glow effect
 * - Progressive status messages that build anticipation
 * - Gradient progress bar with shimmer animation
 * - 4-second total duration before callback
 *
 * @see /frontend/docs/ARCHIVED_ASSESSMENT_UX_ANALYSIS_2025-11-21.md
 */

import { useEffect, useState, useCallback } from 'react';

interface LoadingScreenProps {
  onLoadingComplete: () => void;
}

interface LoadingStep {
  time: number;
  progress: number;
  status: string;
}

const LOADING_SEQUENCE: LoadingStep[] = [
  { time: 0, progress: 0, status: "Initializing assessment services..." },
  { time: 800, progress: 25, status: "Loading buyer intelligence framework..." },
  { time: 1600, progress: 50, status: "Preparing analytics engine..." },
  { time: 2400, progress: 75, status: "Configuring recommendation system..." },
  { time: 3200, progress: 95, status: "Finalizing revenue optimization tools..." },
  { time: 4000, progress: 100, status: "Assessment ready!" }
];

export default function LoadingScreen({ onLoadingComplete }: LoadingScreenProps) {
  const [currentProgress, setCurrentProgress] = useState(0);
  const [currentStatus, setCurrentStatus] = useState(LOADING_SEQUENCE[0].status);
  const [isStatusFading, setIsStatusFading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const updateStatus = useCallback((newStatus: string) => {
    setIsStatusFading(true);
    setTimeout(() => {
      setCurrentStatus(newStatus);
      setIsStatusFading(false);
    }, 150);
  }, []);

  useEffect(() => {
    const timeouts: NodeJS.Timeout[] = [];

    LOADING_SEQUENCE.forEach((step, index) => {
      const timeout = setTimeout(() => {
        setCurrentProgress(step.progress);
        updateStatus(step.status);

        // On final step, trigger completion
        if (index === LOADING_SEQUENCE.length - 1) {
          setTimeout(() => {
            setIsComplete(true);
            setTimeout(() => {
              onLoadingComplete();
            }, 500); // Allow fade-out animation
          }, 500);
        }
      }, step.time);

      timeouts.push(timeout);
    });

    return () => {
      timeouts.forEach(timeout => clearTimeout(timeout));
    };
  }, [onLoadingComplete, updateStatus]);

  return (
    <div
      className={`loading-screen ${isComplete ? 'loading-screen--complete' : ''}`}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'linear-gradient(135deg, var(--color-background-primary) 0%, var(--color-background-secondary) 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        opacity: isComplete ? 0 : 1,
        transition: 'opacity 0.5s ease-out',
      }}
    >
      {/* Animated Rocket Icon */}
      <div
        className="loading-icon"
        style={{
          fontSize: '64px',
          marginBottom: 'var(--spacing-2xl)',
          animation: 'float 2s ease-in-out infinite',
          filter: 'drop-shadow(0 0 20px rgba(59, 130, 246, 0.5))',
        }}
      >
        🚀
      </div>

      {/* Title */}
      <h1
        style={{
          fontSize: 'var(--font-size-3xl)',
          fontWeight: '700',
          color: 'var(--color-text-primary)',
          marginBottom: 'var(--spacing-sm)',
          textAlign: 'center',
        }}
      >
        Andru Revenue Assessment
      </h1>

      {/* Subtitle */}
      <p
        style={{
          fontSize: 'var(--font-size-lg)',
          color: 'var(--color-text-muted)',
          marginBottom: 'var(--spacing-3xl)',
          textAlign: 'center',
        }}
      >
        Systematic Performance Analysis for Technical Founders
      </p>

      {/* Progress Bar Container */}
      <div
        style={{
          width: '100%',
          maxWidth: '400px',
          padding: '0 var(--spacing-2xl)',
        }}
      >
        {/* Progress Bar Track */}
        <div
          style={{
            width: '100%',
            height: '6px',
            background: 'var(--color-surface)',
            borderRadius: '3px',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          {/* Progress Bar Fill */}
          <div
            style={{
              height: '100%',
              width: `${currentProgress}%`,
              background: 'linear-gradient(90deg, var(--color-brand-primary) 0%, var(--color-brand-accent) 100%)',
              borderRadius: '3px',
              transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Shimmer Effect */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: '-100%',
                width: '100%',
                height: '100%',
                background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.3) 50%, transparent 100%)',
                animation: 'shimmer 2s ease-in-out infinite',
              }}
            />
          </div>
        </div>

        {/* Status Text */}
        <p
          style={{
            fontSize: 'var(--font-size-sm)',
            color: 'var(--color-text-muted)',
            textAlign: 'center',
            marginTop: 'var(--spacing-lg)',
            fontFamily: 'var(--font-family-mono)',
            letterSpacing: '0.02em',
            opacity: isStatusFading ? 0 : 1,
            transition: 'opacity 0.15s ease-out',
            minHeight: '20px',
          }}
        >
          {currentStatus}
        </p>
      </div>

      {/* Keyframe Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes shimmer {
          0% {
            left: -100%;
          }
          100% {
            left: 100%;
          }
        }
      `}</style>
    </div>
  );
}
