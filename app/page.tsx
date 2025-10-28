'use client';

// CORE PHASE: Simple landing page with assessment CTA

import { useEffect } from 'react';
import Link from 'next/link';
import { startAssessment } from '../lib/api';
import { trackEvent, trackPageView, getSessionId } from '../lib/analytics';

export default function Home() {
  useEffect(() => {
    // Track homepage view
    const analyticsSessionId = getSessionId();
    trackPageView('homepage', {
      sessionId: analyticsSessionId
    });
    trackEvent('homepage_viewed', {
      sessionId: analyticsSessionId
    });
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ padding: 'var(--spacing-2xl)' }}>
      <div style={{ maxWidth: 'var(--container-max-width)', margin: '0 auto', textAlign: 'center' }}>
        <h1 className="results-title" style={{ marginBottom: 'var(--spacing-xl)' }}>
          Are You Revenue Ready?
        </h1>
        
        <p className="results-subtitle" style={{ marginBottom: 'var(--spacing-4xl)' }}>
          Take our 5-minute assessment to discover your revenue readiness score 
          and get personalized recommendations for technical founders.
        </p>
        
        <div className="glass-card" style={{ marginBottom: 'var(--spacing-4xl)' }}>
          <h2 style={{ 
            fontSize: 'var(--font-size-2xl)', 
            fontWeight: '600', 
            marginBottom: 'var(--spacing-2xl)',
            color: 'var(--color-text-primary)'
          }}>
            14 Questions. 5 Minutes. Instant Results.
          </h2>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(2, 1fr)', 
            gap: 'var(--spacing-lg)', 
            marginBottom: 'var(--spacing-xl)',
            textAlign: 'left'
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start' }}>
              <span style={{ color: 'var(--color-accent-success)', marginRight: 'var(--spacing-sm)' }}>✓</span>
              <span style={{ color: 'var(--color-text-secondary)' }}>Buyer Understanding Score</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start' }}>
              <span style={{ color: 'var(--color-accent-success)', marginRight: 'var(--spacing-sm)' }}>✓</span>
              <span style={{ color: 'var(--color-text-secondary)' }}>Tech Translation Score</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start' }}>
              <span style={{ color: 'var(--color-accent-success)', marginRight: 'var(--spacing-sm)' }}>✓</span>
              <span style={{ color: 'var(--color-text-secondary)' }}>Revenue Readiness Rating</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start' }}>
              <span style={{ color: 'var(--color-accent-success)', marginRight: 'var(--spacing-sm)' }}>✓</span>
              <span style={{ color: 'var(--color-text-secondary)' }}>Personalized Insights</span>
            </div>
          </div>
          
          <button
            onClick={async () => {
              // Track CTA click
              const analyticsSessionId = getSessionId();
              trackEvent('cta_clicked', {
                sessionId: analyticsSessionId,
                ctaLocation: 'homepage_hero'
              });

              // Generate 12-character alphanumeric session ID
              const generateSessionId = () => {
                const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
                let result = '';
                for (let i = 0; i < 12; i++) {
                  result += chars.charAt(Math.floor(Math.random() * chars.length));
                }
                return result;
              };

              const sessionId = generateSessionId();

              try {
                // Create assessment record with session ID
                const response = await startAssessment({
                  sessionId,
                  startTime: new Date().toISOString()
                });

                if (response.success) {
                  // Store session ID for assessment page
                  sessionStorage.setItem('assessmentSessionId', sessionId);
                  window.location.href = '/assessment';
                } else {
                  alert('Failed to start assessment. Please try again.');
                }
              } catch (error) {
                console.error('Start assessment error:', error);
                alert('Failed to start assessment. Please try again.');
              }
            }}
            className="btn-primary"
            style={{ display: 'inline-block', width: '100%', textDecoration: 'none' }}
          >
            Start Assessment →
          </button>
        </div>
        
        <p style={{ 
          fontSize: 'var(--font-size-sm)', 
          color: 'var(--color-text-subtle)' 
        }}>
          No registration required. Your data is private and secure.
        </p>
      </div>
    </div>
  );
}
