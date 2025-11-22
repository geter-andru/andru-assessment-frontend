'use client';

/**
 * SliderInput Component
 *
 * Premium slider input for assessment questions. Provides an engaging,
 * interactive alternative to the traditional 4-option buttons.
 * Maps slider values (0-100) to the standard 4-point scale (1-4).
 *
 * Ported from archived assessment (pre_nextjs/index.html) premium slider styling.
 * Preserves full compatibility with the existing 4-option system.
 *
 * @see /frontend/docs/ARCHIVED_ASSESSMENT_UX_ANALYSIS_2025-11-21.md
 */

import { useState, useCallback } from 'react';

interface SliderInputProps {
  value?: number; // 1-4 scale value
  onChange: (value: number) => void;
  questionId: string;
}

// Map slider position (0-100) to 4-point scale
const sliderToScale = (sliderValue: number): number => {
  if (sliderValue <= 25) return 1; // Definitely No
  if (sliderValue <= 50) return 2; // Not Sure
  if (sliderValue <= 75) return 3; // Yes, I believe so
  return 4; // Definitely Yes
};

// Map 4-point scale to slider position for initialization
const scaleToSlider = (scaleValue: number): number => {
  switch (scaleValue) {
    case 1: return 12.5;
    case 2: return 37.5;
    case 3: return 62.5;
    case 4: return 87.5;
    default: return 50;
  }
};

const LABELS = [
  { value: 1, label: 'Definitely No', position: '0%' },
  { value: 2, label: 'Not Sure', position: '33%' },
  { value: 3, label: 'Believe So', position: '66%' },
  { value: 4, label: 'Definitely Yes', position: '100%' },
];

export default function SliderInput({ value, onChange, questionId }: SliderInputProps) {
  const [sliderValue, setSliderValue] = useState(value ? scaleToSlider(value) : 50);
  const [isDragging, setIsDragging] = useState(false);

  const currentScaleValue = sliderToScale(sliderValue);

  const handleSliderChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.target.value);
    setSliderValue(newValue);
  }, []);

  const handleSliderRelease = useCallback(() => {
    setIsDragging(false);
    const scaleValue = sliderToScale(sliderValue);
    onChange(scaleValue);
  }, [sliderValue, onChange]);

  const handleSliderStart = useCallback(() => {
    setIsDragging(true);
  }, []);

  // Calculate gradient for the track based on current value
  const getTrackGradient = () => {
    const percent = sliderValue;
    return `linear-gradient(90deg,
      var(--color-brand-primary) 0%,
      var(--color-brand-accent) ${percent}%,
      var(--color-surface) ${percent}%,
      var(--color-surface) 100%)`;
  };

  return (
    <div
      style={{
        padding: 'var(--spacing-xl) 0',
      }}
    >
      {/* Current value indicator */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: 'var(--spacing-xl)',
        }}
      >
        <div
          style={{
            background: isDragging
              ? 'linear-gradient(135deg, var(--color-brand-primary) 0%, var(--color-brand-accent) 100%)'
              : 'var(--color-surface)',
            border: `2px solid ${isDragging ? 'var(--color-brand-primary)' : 'var(--color-border)'}`,
            borderRadius: 'var(--border-radius-lg)',
            padding: 'var(--spacing-md) var(--spacing-xl)',
            transition: 'all 0.2s ease',
            boxShadow: isDragging ? '0 0 20px rgba(59, 130, 246, 0.3)' : 'none',
          }}
        >
          <span
            style={{
              fontSize: 'var(--font-size-lg)',
              fontWeight: '600',
              color: isDragging ? 'white' : 'var(--color-text-primary)',
            }}
          >
            {LABELS.find(l => l.value === currentScaleValue)?.label || 'Select...'}
          </span>
        </div>
      </div>

      {/* Slider container */}
      <div
        style={{
          position: 'relative',
          padding: '0 var(--spacing-md)',
        }}
      >
        {/* Custom styled slider */}
        <input
          type="range"
          id={`slider-${questionId}`}
          min="0"
          max="100"
          value={sliderValue}
          onChange={handleSliderChange}
          onMouseDown={handleSliderStart}
          onTouchStart={handleSliderStart}
          onMouseUp={handleSliderRelease}
          onTouchEnd={handleSliderRelease}
          style={{
            width: '100%',
            height: '8px',
            appearance: 'none',
            WebkitAppearance: 'none',
            background: getTrackGradient(),
            borderRadius: '4px',
            outline: 'none',
            cursor: 'pointer',
          }}
        />

        {/* Labels */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: 'var(--spacing-md)',
            paddingTop: 'var(--spacing-sm)',
          }}
        >
          {LABELS.map((label) => (
            <span
              key={label.value}
              style={{
                fontSize: 'var(--font-size-xs)',
                fontWeight: currentScaleValue === label.value ? '600' : '400',
                color: currentScaleValue === label.value
                  ? 'var(--color-brand-primary)'
                  : 'var(--color-text-muted)',
                transition: 'all 0.2s ease',
                textAlign: 'center',
                flex: 1,
              }}
            >
              {label.label}
            </span>
          ))}
        </div>
      </div>

      {/* Slider thumb styles - injected via style tag */}
      <style jsx>{`
        input[type="range"]::-webkit-slider-thumb {
          appearance: none;
          -webkit-appearance: none;
          width: 24px;
          height: 24px;
          background: linear-gradient(135deg, var(--color-brand-primary) 0%, var(--color-brand-accent) 100%);
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(59, 130, 246, 0.4);
          border: 3px solid white;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        input[type="range"]::-webkit-slider-thumb:hover {
          transform: scale(1.1);
          box-shadow: 0 4px 16px rgba(59, 130, 246, 0.5);
        }

        input[type="range"]::-webkit-slider-thumb:active {
          transform: scale(1.15);
          box-shadow: 0 6px 20px rgba(59, 130, 246, 0.6);
        }

        input[type="range"]::-moz-range-thumb {
          width: 24px;
          height: 24px;
          background: linear-gradient(135deg, var(--color-brand-primary) 0%, var(--color-brand-accent) 100%);
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(59, 130, 246, 0.4);
          border: 3px solid white;
        }
      `}</style>
    </div>
  );
}
