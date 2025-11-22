'use client';

/**
 * CategoryBadge Component
 *
 * Shows the question category with percentage weight for the assessment.
 * Ported from archived assessment (pre_nextjs/index.html) category-tag styling.
 * Uses modern Lucide React icons for clean, minimalist design.
 *
 * Categories:
 * - BUYER UNDERSTANDING (60% weight) - Customer intelligence questions
 * - TECH-TO-VALUE (40% weight) - Value communication questions
 *
 * @see /frontend/docs/ARCHIVED_ASSESSMENT_UX_ANALYSIS_2025-11-21.md
 */

import { Users, Zap } from 'lucide-react';

interface CategoryBadgeProps {
  category: 'buyer' | 'tech';
}

const CATEGORY_CONFIG = {
  buyer: {
    label: 'BUYER UNDERSTANDING',
    weight: '60%',
    gradient: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(139, 92, 246, 0.15) 100%)',
    borderColor: 'rgba(59, 130, 246, 0.3)',
    textColor: '#60a5fa', // Blue-400
    Icon: Users
  },
  tech: {
    label: 'TECH-TO-VALUE',
    weight: '40%',
    gradient: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(6, 182, 212, 0.15) 100%)',
    borderColor: 'rgba(16, 185, 129, 0.3)',
    textColor: '#34d399', // Emerald-400
    Icon: Zap
  }
};

export default function CategoryBadge({ category }: CategoryBadgeProps) {
  const config = CATEGORY_CONFIG[category];
  const IconComponent = config.Icon;

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 'var(--spacing-sm)',
        padding: 'var(--spacing-xs) var(--spacing-md)',
        background: config.gradient,
        border: `1px solid ${config.borderColor}`,
        borderRadius: 'var(--border-radius-md)',
        marginBottom: 'var(--spacing-lg)',
      }}
    >
      {/* Category Icon - Lucide React */}
      <IconComponent
        size={14}
        strokeWidth={2}
        color={config.textColor}
      />

      {/* Category Label */}
      <span
        style={{
          fontSize: 'var(--font-size-xs)',
          fontWeight: '600',
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          color: config.textColor,
        }}
      >
        {config.label}
      </span>

      {/* Weight Percentage */}
      <span
        style={{
          fontSize: 'var(--font-size-xs)',
          fontWeight: '500',
          color: 'var(--color-text-muted)',
          paddingLeft: 'var(--spacing-xs)',
          borderLeft: `1px solid ${config.borderColor}`,
        }}
      >
        {config.weight}
      </span>
    </div>
  );
}
