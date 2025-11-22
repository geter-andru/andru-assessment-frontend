'use client';

/**
 * ExitIntentModal Component
 *
 * Detects exit intent (mouse leaving viewport, beforeunload, visibility change)
 * and shows a modal offering to save progress or continue assessment.
 *
 * Ported from archived assessment (pre_nextjs/index.html) exit intent detection.
 * Only shows once per session to avoid frustrating users.
 *
 * @see /frontend/docs/ARCHIVED_ASSESSMENT_UX_ANALYSIS_2025-11-21.md
 */

import { useState, useEffect, useCallback } from 'react';
import { X, Save, ArrowRight } from 'lucide-react';

interface ExitIntentModalProps {
  /** Current progress (0-14 questions answered) */
  answeredQuestions: number;
  /** Total questions in assessment */
  totalQuestions: number;
  /** User email (if collected) for save functionality */
  userEmail?: string;
  /** Callback when user clicks "Continue Assessment" */
  onContinue: () => void;
  /** Callback when user clicks "Save Progress" */
  onSaveProgress?: (email: string) => void;
  /** Whether exit intent detection is enabled */
  enabled?: boolean;
}

export default function ExitIntentModal({
  answeredQuestions,
  totalQuestions,
  userEmail,
  onContinue,
  onSaveProgress,
  enabled = true,
}: ExitIntentModalProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasShown, setHasShown] = useState(false);
  const [email, setEmail] = useState(userEmail || '');

  const progressPercent = Math.round((answeredQuestions / totalQuestions) * 100);

  const showModal = useCallback(() => {
    // Only show once per session and if enabled
    if (hasShown || !enabled || answeredQuestions === 0) return;

    setIsVisible(true);
    setHasShown(true);
  }, [hasShown, enabled, answeredQuestions]);

  const handleClose = useCallback(() => {
    setIsVisible(false);
  }, []);

  const handleContinue = useCallback(() => {
    setIsVisible(false);
    onContinue();
  }, [onContinue]);

  const handleSave = useCallback(() => {
    if (email && onSaveProgress) {
      onSaveProgress(email);
    }
    setIsVisible(false);
  }, [email, onSaveProgress]);

  useEffect(() => {
    if (!enabled) return;

    // Mouse leave detection (desktop)
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) {
        showModal();
      }
    };

    // Visibility change (tab switch)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        showModal();
      }
    };

    // Before unload (closing tab/window)
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (answeredQuestions > 0 && answeredQuestions < totalQuestions) {
        e.preventDefault();
        e.returnValue = '';
        showModal();
      }
    };

    // Add listeners
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [enabled, answeredQuestions, totalQuestions, showModal]);

  if (!isVisible) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(8px)',
          zIndex: 9998,
          animation: 'fadeIn 0.3s ease',
        }}
        onClick={handleClose}
      />

      {/* Modal */}
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'var(--color-background-elevated)',
          border: '1px solid var(--glass-border)',
          borderRadius: 'var(--border-radius-xl)',
          padding: 'var(--spacing-4xl)',
          maxWidth: '480px',
          width: '90%',
          zIndex: 9999,
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)',
          animation: 'slideUp 0.3s ease',
        }}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          style={{
            position: 'absolute',
            top: 'var(--spacing-lg)',
            right: 'var(--spacing-lg)',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: 'var(--spacing-xs)',
            color: 'var(--color-text-muted)',
            transition: 'color 0.2s ease',
          }}
          onMouseOver={(e) => { e.currentTarget.style.color = 'var(--color-text-primary)'; }}
          onMouseOut={(e) => { e.currentTarget.style.color = 'var(--color-text-muted)'; }}
        >
          <X size={20} strokeWidth={2} />
        </button>

        {/* Content */}
        <div style={{ textAlign: 'center' }}>
          {/* Progress indicator */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 'var(--spacing-sm)',
              padding: 'var(--spacing-xs) var(--spacing-md)',
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(139, 92, 246, 0.15) 100%)',
              borderRadius: 'var(--border-radius-md)',
              marginBottom: 'var(--spacing-xl)',
            }}
          >
            <span style={{
              fontSize: 'var(--font-size-sm)',
              fontWeight: '600',
              color: 'var(--color-brand-primary)'
            }}>
              {progressPercent}% Complete
            </span>
          </div>

          <h2
            style={{
              fontSize: 'var(--font-size-2xl)',
              fontWeight: '700',
              color: 'var(--color-text-primary)',
              marginBottom: 'var(--spacing-md)',
            }}
          >
            Wait! Don&apos;t lose your progress
          </h2>

          <p
            style={{
              fontSize: 'var(--font-size-base)',
              color: 'var(--color-text-secondary)',
              marginBottom: 'var(--spacing-3xl)',
              lineHeight: 'var(--line-height-relaxed)',
            }}
          >
            You&apos;ve answered {answeredQuestions} of {totalQuestions} questions.
            Your insights are waiting to be unlocked.
          </p>

          {/* Email input for save (if not already collected) */}
          {!userEmail && onSaveProgress && (
            <div style={{ marginBottom: 'var(--spacing-xl)' }}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email to save progress"
                style={{
                  width: '100%',
                  padding: 'var(--spacing-md) var(--spacing-lg)',
                  border: '2px solid var(--color-border)',
                  borderRadius: 'var(--border-radius-md)',
                  fontSize: 'var(--font-size-base)',
                  backgroundColor: 'var(--color-surface)',
                  color: 'var(--color-text-primary)',
                  outline: 'none',
                  transition: 'border-color 0.2s ease',
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--color-brand-primary)'; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--color-border)'; }}
              />
            </div>
          )}

          {/* Action buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
            {/* Continue button - primary */}
            <button
              onClick={handleContinue}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 'var(--spacing-sm)',
                width: '100%',
                padding: 'var(--spacing-lg) var(--spacing-xl)',
                background: 'linear-gradient(135deg, var(--color-brand-primary) 0%, var(--color-brand-accent) 100%)',
                border: 'none',
                borderRadius: 'var(--border-radius-md)',
                fontSize: 'var(--font-size-base)',
                fontWeight: '600',
                color: 'white',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(59, 130, 246, 0.4)'; }}
              onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              <ArrowRight size={18} strokeWidth={2} />
              Continue Assessment
            </button>

            {/* Save button - secondary (if onSaveProgress provided) */}
            {onSaveProgress && (
              <button
                onClick={handleSave}
                disabled={!email && !userEmail}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 'var(--spacing-sm)',
                  width: '100%',
                  padding: 'var(--spacing-md) var(--spacing-xl)',
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--border-radius-md)',
                  fontSize: 'var(--font-size-base)',
                  fontWeight: '500',
                  color: 'var(--color-text-secondary)',
                  cursor: (!email && !userEmail) ? 'not-allowed' : 'pointer',
                  opacity: (!email && !userEmail) ? 0.5 : 1,
                  transition: 'all 0.2s ease',
                }}
                onMouseOver={(e) => {
                  if (email || userEmail) {
                    e.currentTarget.style.background = 'var(--color-surface-hover)';
                    e.currentTarget.style.color = 'var(--color-text-primary)';
                  }
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'var(--color-surface)';
                  e.currentTarget.style.color = 'var(--color-text-secondary)';
                }}
              >
                <Save size={18} strokeWidth={2} />
                Save Progress & Exit
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translate(-50%, -45%);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%);
          }
        }
      `}</style>
    </>
  );
}
