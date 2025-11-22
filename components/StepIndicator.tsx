'use client';

/**
 * StepIndicator Component
 *
 * 5-step visual journey indicator showing user's progress through the assessment.
 * Ported from archived assessment (pre_nextjs/index.html) progress-indicator.
 *
 * Phases:
 * 1. Product Info - Initial product details
 * 2. Assessment - 14 questions
 * 3. Analysis - AI processing (implicit)
 * 4. Your Info - User contact details
 * 5. Results - Comprehensive results
 *
 * @see /frontend/docs/ARCHIVED_ASSESSMENT_UX_ANALYSIS_2025-11-21.md
 */

import { useMemo } from 'react';

export type AssessmentStep = 'product' | 'assessment' | 'analysis' | 'user-info' | 'results';

interface StepIndicatorProps {
  currentStep: AssessmentStep;
  /** Optional: Show progress within assessment (0-14) */
  assessmentProgress?: number;
}

interface StepConfig {
  id: AssessmentStep;
  number: number;
  label: string;
}

const STEPS: StepConfig[] = [
  { id: 'product', number: 1, label: 'Product' },
  { id: 'assessment', number: 2, label: 'Assessment' },
  { id: 'analysis', number: 3, label: 'Analysis' },
  { id: 'user-info', number: 4, label: 'Your Info' },
  { id: 'results', number: 5, label: 'Results' },
];

export default function StepIndicator({ currentStep, assessmentProgress }: StepIndicatorProps) {
  const currentStepIndex = useMemo(() => {
    return STEPS.findIndex(step => step.id === currentStep);
  }, [currentStep]);

  const getStepStatus = (stepIndex: number): 'completed' | 'active' | 'upcoming' => {
    if (stepIndex < currentStepIndex) return 'completed';
    if (stepIndex === currentStepIndex) return 'active';
    return 'upcoming';
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 'var(--spacing-xs)',
        marginBottom: 'var(--spacing-2xl)',
        padding: 'var(--spacing-lg) var(--spacing-xl)',
        background: 'var(--glass-background)',
        backdropFilter: 'var(--glass-backdrop)',
        borderRadius: 'var(--border-radius-lg)',
        border: '1px solid var(--glass-border)',
      }}
    >
      {STEPS.map((step, index) => {
        const status = getStepStatus(index);
        const isLast = index === STEPS.length - 1;

        return (
          <div
            key={step.id}
            style={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {/* Step */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 'var(--spacing-xs)',
              }}
            >
              {/* Step Number Circle */}
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 'var(--font-size-sm)',
                  fontWeight: '600',
                  transition: 'all 0.3s ease',
                  ...(status === 'completed' && {
                    background: 'var(--color-accent-success)',
                    border: '2px solid var(--color-accent-success)',
                    color: 'white',
                  }),
                  ...(status === 'active' && {
                    background: 'linear-gradient(135deg, var(--color-brand-primary) 0%, var(--color-brand-accent) 100%)',
                    border: '2px solid var(--color-brand-primary)',
                    color: 'white',
                    boxShadow: '0 0 16px rgba(59, 130, 246, 0.4)',
                  }),
                  ...(status === 'upcoming' && {
                    background: 'var(--color-surface)',
                    border: '2px solid var(--color-text-subtle)',
                    color: 'var(--color-text-muted)',
                  }),
                }}
              >
                {status === 'completed' ? (
                  <span style={{ fontSize: '14px' }}>✓</span>
                ) : (
                  step.number
                )}
              </div>

              {/* Step Label */}
              <span
                style={{
                  fontSize: 'var(--font-size-xs)',
                  fontWeight: '500',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  transition: 'color 0.3s ease',
                  whiteSpace: 'nowrap',
                  ...(status === 'completed' && {
                    color: 'var(--color-accent-success)',
                  }),
                  ...(status === 'active' && {
                    color: 'var(--color-brand-primary)',
                  }),
                  ...(status === 'upcoming' && {
                    color: 'var(--color-text-muted)',
                  }),
                }}
              >
                {step.label}
              </span>
            </div>

            {/* Connector (not after last step) */}
            {!isLast && (
              <div
                style={{
                  width: '32px',
                  height: '2px',
                  marginLeft: 'var(--spacing-sm)',
                  marginRight: 'var(--spacing-sm)',
                  background: status === 'completed'
                    ? 'linear-gradient(90deg, var(--color-accent-success) 0%, var(--color-accent-success) 100%)'
                    : 'linear-gradient(90deg, var(--color-brand-primary) 0%, var(--color-brand-accent) 100%)',
                  opacity: status === 'completed' ? 1 : 0.3,
                  borderRadius: '1px',
                  transition: 'opacity 0.3s ease',
                }}
              />
            )}
          </div>
        );
      })}

      {/* Assessment sub-progress indicator */}
      {currentStep === 'assessment' && assessmentProgress !== undefined && (
        <div
          style={{
            position: 'absolute',
            bottom: '-4px',
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: 'var(--font-size-xs)',
            color: 'var(--color-text-muted)',
            background: 'var(--color-background-primary)',
            padding: '2px 8px',
            borderRadius: 'var(--border-radius-sm)',
          }}
        >
          {assessmentProgress}/14
        </div>
      )}
    </div>
  );
}
