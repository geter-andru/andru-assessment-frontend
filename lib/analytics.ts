/**
 * Analytics Service - PostHog Integration
 *
 * Tracks user behavior, conversion funnel, and AI insight performance
 * for andru-ai.com assessment flow
 *
 * Target Buyer: Technical founders of B2B SaaS companies
 */

import posthog from 'posthog-js';

// Analytics configuration
const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY || '';
const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com';
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

// Initialize PostHog
export const initAnalytics = () => {
  if (typeof window !== 'undefined' && POSTHOG_KEY && IS_PRODUCTION) {
    posthog.init(POSTHOG_KEY, {
      api_host: POSTHOG_HOST,
      loaded: (posthog) => {
        if (process.env.NODE_ENV === 'development') console.log('PostHog loaded');
      },
      capture_pageview: true,
      capture_pageleave: true,
      autocapture: false, // We'll manually track relevant events
    });
  }
};

// Analytics event types
export type AnalyticsEvent =
  // Assessment Flow
  | 'assessment_started'
  | 'question_answered'
  | 'question_skipped'
  | 'assessment_paused'
  | 'assessment_resumed'
  | 'assessment_completed'

  // AI Insights
  | 'ai_insight_requested'
  | 'ai_insight_generated'
  | 'ai_insight_displayed'
  | 'ai_insight_failed'

  // Results
  | 'results_viewed'
  | 'results_tab_clicked'
  | 'linkedin_share_clicked'
  | 'user_info_submitted'
  | 'user_info_skipped'

  // Navigation
  | 'homepage_viewed'
  | 'cta_clicked';

// Analytics properties interface
interface AnalyticsProperties {
  // Session
  sessionId?: string;

  // Assessment
  questionNumber?: number;
  questionId?: string;
  questionText?: string;
  responseValue?: number;
  responseTime?: number;
  totalQuestions?: number;
  progress?: number;

  // AI Insights
  batchNumber?: number;
  insightChallenge?: string;
  insightConfidence?: number;
  processingTime?: number;
  aiSuccess?: boolean;
  errorMessage?: string;

  // Results
  overallScore?: number;
  buyerScore?: number;
  techScore?: number;
  qualification?: string;
  tabName?: string;

  // User Info
  hasEmail?: boolean;
  hasName?: boolean;
  hasCompany?: boolean;

  // General
  timestamp?: string;
  [key: string]: any;
}

/**
 * Track an analytics event
 */
export const trackEvent = (
  eventName: AnalyticsEvent,
  properties?: AnalyticsProperties
) => {
  if (typeof window === 'undefined') return;

  const eventProperties = {
    ...properties,
    timestamp: new Date().toISOString(),
    environment: IS_PRODUCTION ? 'production' : 'development',
  };

  // Log in development
  if (!IS_PRODUCTION) {
    console.log('📊 Analytics Event:', eventName, eventProperties);
  }

  // Track with PostHog in production
  if (IS_PRODUCTION && POSTHOG_KEY) {
    posthog.capture(eventName, eventProperties);
  }
};

/**
 * Track page view
 */
export const trackPageView = (pageName: string, properties?: AnalyticsProperties) => {
  if (typeof window === 'undefined') return;

  if (IS_PRODUCTION && POSTHOG_KEY) {
    posthog.capture('$pageview', {
      page: pageName,
      ...properties,
    });
  } else if (!IS_PRODUCTION) {
    console.log('📄 Page View:', pageName, properties);
  }
};

/**
 * Identify user (for authenticated sessions)
 */
export const identifyUser = (userId: string, traits?: Record<string, any>) => {
  if (typeof window === 'undefined') return;

  if (IS_PRODUCTION && POSTHOG_KEY) {
    posthog.identify(userId, traits);
  } else if (!IS_PRODUCTION) {
    console.log('👤 User Identified:', userId, traits);
  }
};

/**
 * Track assessment milestone
 */
export const trackAssessmentMilestone = (
  milestone: '25%' | '50%' | '75%' | '100%',
  sessionId: string,
  properties?: AnalyticsProperties
) => {
  trackEvent('question_answered', {
    sessionId,
    progress: parseInt(milestone),
    milestone,
    ...properties,
  });
};

/**
 * Track AI insight generation
 */
export const trackAIInsight = (
  success: boolean,
  batchNumber: number,
  sessionId: string,
  properties?: AnalyticsProperties
) => {
  if (success) {
    trackEvent('ai_insight_generated', {
      sessionId,
      batchNumber,
      aiSuccess: true,
      ...properties,
    });
  } else {
    trackEvent('ai_insight_failed', {
      sessionId,
      batchNumber,
      aiSuccess: false,
      ...properties,
    });
  }
};

/**
 * Track conversion funnel
 */
export const trackConversion = (
  conversionType: 'assessment_completed' | 'user_info_submitted' | 'linkedin_share',
  sessionId: string,
  properties?: AnalyticsProperties
) => {
  trackEvent(conversionType as AnalyticsEvent, {
    sessionId,
    conversionType,
    ...properties,
  });
};

/**
 * Get or create anonymous session ID
 */
export const getSessionId = (): string => {
  if (typeof window === 'undefined') return '';

  let sessionId = sessionStorage.getItem('assessment_session_id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('assessment_session_id', sessionId);
  }
  return sessionId;
};

/**
 * Reset analytics (for testing)
 */
export const resetAnalytics = () => {
  if (typeof window === 'undefined') return;

  if (IS_PRODUCTION && POSTHOG_KEY) {
    posthog.reset();
  }
  sessionStorage.removeItem('assessment_session_id');
};

export default {
  initAnalytics,
  trackEvent,
  trackPageView,
  identifyUser,
  trackAssessmentMilestone,
  trackAIInsight,
  trackConversion,
  getSessionId,
  resetAnalytics,
};
