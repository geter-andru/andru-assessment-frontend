'use client';

import { useEffect } from 'react';
import { initAnalytics } from '@/lib/analytics';

/**
 * PostHog Analytics Provider
 *
 * Initializes PostHog analytics on client-side mount
 * Must be a client component due to browser-only PostHog initialization
 */
export default function PostHogProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Initialize PostHog on mount (client-side only)
    initAnalytics();
  }, []);

  return <>{children}</>;
}
