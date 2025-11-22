'use client';

/**
 * SocialShareCard Component
 *
 * Generates a visually appealing share card for assessment results.
 * Uses canvas to create a 1200x630 image (LinkedIn optimal dimensions).
 * Includes score, qualification status, and branding.
 *
 * Ported from archived assessment (pre_nextjs/index.html) social sharing system.
 *
 * @see /frontend/docs/ARCHIVED_ASSESSMENT_UX_ANALYSIS_2025-11-21.md
 */

import { useCallback, useState } from 'react';
import { Share2, Download, Linkedin, Twitter, Copy, Check } from 'lucide-react';

interface SocialShareCardProps {
  /** Overall assessment score (0-100) */
  score: number;
  /** Qualification status */
  qualification: 'Qualified' | 'Promising' | 'Developing' | 'Needs Work';
  /** Buyer understanding score */
  buyerScore: number;
  /** Tech translation score */
  techScore: number;
  /** User name (optional) */
  userName?: string;
  /** Company name (optional) */
  companyName?: string;
}

export default function SocialShareCard({
  score,
  qualification,
  buyerScore,
  techScore,
  userName,
  companyName,
}: SocialShareCardProps) {
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Generate share text
  const shareText = `I just completed the Andru AI Revenue Readiness Assessment and scored ${score}%! ${
    qualification === 'Qualified' ? 'Ready to scale!' :
    qualification === 'Promising' ? 'On track for growth!' :
    'Valuable insights for improvement!'
  }`;

  const shareUrl = 'https://andru-ai.com/assessment';

  // Generate canvas image for sharing
  const generateShareImage = useCallback(async (): Promise<string> => {
    setIsGenerating(true);

    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 630;
    const ctx = canvas.getContext('2d')!;

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, 1200, 630);
    gradient.addColorStop(0, '#000000');
    gradient.addColorStop(1, '#0a0a0a');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1200, 630);

    // Decorative accent lines
    ctx.strokeStyle = 'rgba(59, 130, 246, 0.3)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, 100);
    ctx.lineTo(400, 100);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(800, 530);
    ctx.lineTo(1200, 530);
    ctx.stroke();

    // Andru AI branding
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 32px system-ui, -apple-system, sans-serif';
    ctx.fillText('ANDRU AI', 60, 80);

    ctx.fillStyle = '#a3a3a3';
    ctx.font = '20px system-ui, -apple-system, sans-serif';
    ctx.fillText('Revenue Readiness Assessment', 60, 120);

    // Main score circle
    const centerX = 600;
    const centerY = 280;
    const radius = 120;

    // Score circle background
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(59, 130, 246, 0.2)';
    ctx.lineWidth = 12;
    ctx.stroke();

    // Score arc (progress)
    const scoreAngle = (score / 100) * Math.PI * 2 - Math.PI / 2;
    const scoreGradient = ctx.createLinearGradient(centerX - radius, centerY, centerX + radius, centerY);
    scoreGradient.addColorStop(0, '#3b82f6');
    scoreGradient.addColorStop(1, '#8b5cf6');

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, -Math.PI / 2, scoreAngle);
    ctx.strokeStyle = scoreGradient;
    ctx.lineWidth = 12;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Score number
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 72px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`${score}%`, centerX, centerY + 20);

    // Qualification badge
    const qualColors = {
      'Qualified': '#22c55e',
      'Promising': '#3b82f6',
      'Developing': '#f59e0b',
      'Needs Work': '#ef4444',
    };

    ctx.fillStyle = qualColors[qualification];
    ctx.font = 'bold 24px system-ui, -apple-system, sans-serif';
    ctx.fillText(qualification.toUpperCase(), centerX, centerY + 180);

    // Category scores
    ctx.textAlign = 'left';
    ctx.font = '18px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = '#a3a3a3';
    ctx.fillText('Buyer Understanding', 80, 480);
    ctx.fillStyle = '#60a5fa';
    ctx.font = 'bold 28px system-ui, -apple-system, sans-serif';
    ctx.fillText(`${buyerScore}%`, 80, 520);

    ctx.font = '18px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = '#a3a3a3';
    ctx.textAlign = 'right';
    ctx.fillText('Tech-to-Value', 1120, 480);
    ctx.fillStyle = '#34d399';
    ctx.font = 'bold 28px system-ui, -apple-system, sans-serif';
    ctx.fillText(`${techScore}%`, 1120, 520);

    // User info (if available)
    if (userName || companyName) {
      ctx.textAlign = 'center';
      ctx.fillStyle = '#a3a3a3';
      ctx.font = '20px system-ui, -apple-system, sans-serif';
      const userLine = [userName, companyName].filter(Boolean).join(' • ');
      ctx.fillText(userLine, centerX, 580);
    }

    // URL
    ctx.textAlign = 'right';
    ctx.fillStyle = '#525252';
    ctx.font = '16px system-ui, -apple-system, sans-serif';
    ctx.fillText('andru-ai.com/assessment', 1140, 610);

    setIsGenerating(false);
    return canvas.toDataURL('image/png');
  }, [score, qualification, buyerScore, techScore, userName, companyName]);

  // Download share image
  const handleDownload = useCallback(async () => {
    const dataUrl = await generateShareImage();
    const link = document.createElement('a');
    link.download = `andru-ai-assessment-${score}.png`;
    link.href = dataUrl;
    link.click();
  }, [generateShareImage, score]);

  // Copy share link
  const handleCopyLink = useCallback(async () => {
    await navigator.clipboard.writeText(`${shareText}\n\n${shareUrl}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [shareText]);

  // Share to LinkedIn
  const handleLinkedInShare = useCallback(() => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}&summary=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank', 'width=600,height=600');
  }, [shareText]);

  // Share to Twitter/X
  const handleTwitterShare = useCallback(() => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank', 'width=600,height=400');
  }, [shareText]);

  return (
    <div
      style={{
        background: 'var(--glass-background)',
        border: '1px solid var(--glass-border)',
        borderRadius: 'var(--border-radius-lg)',
        padding: 'var(--spacing-2xl)',
      }}
    >
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--spacing-sm)',
        marginBottom: 'var(--spacing-xl)',
      }}>
        <Share2 size={20} color="var(--color-brand-primary)" />
        <h3 style={{
          fontSize: 'var(--font-size-lg)',
          fontWeight: '600',
          color: 'var(--color-text-primary)',
          margin: 0,
        }}>
          Share Your Results
        </h3>
      </div>

      {/* Share buttons */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: 'var(--spacing-md)',
      }}>
        {/* LinkedIn */}
        <button
          onClick={handleLinkedInShare}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 'var(--spacing-sm)',
            padding: 'var(--spacing-md) var(--spacing-lg)',
            background: '#0077b5',
            border: 'none',
            borderRadius: 'var(--border-radius-md)',
            color: 'white',
            fontSize: 'var(--font-size-sm)',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
          onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
          onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
        >
          <Linkedin size={18} />
          LinkedIn
        </button>

        {/* Twitter/X */}
        <button
          onClick={handleTwitterShare}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 'var(--spacing-sm)',
            padding: 'var(--spacing-md) var(--spacing-lg)',
            background: '#000000',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--border-radius-md)',
            color: 'white',
            fontSize: 'var(--font-size-sm)',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
          onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
          onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
        >
          <Twitter size={18} />
          X / Twitter
        </button>

        {/* Download Image */}
        <button
          onClick={handleDownload}
          disabled={isGenerating}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 'var(--spacing-sm)',
            padding: 'var(--spacing-md) var(--spacing-lg)',
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--border-radius-md)',
            color: 'var(--color-text-secondary)',
            fontSize: 'var(--font-size-sm)',
            fontWeight: '500',
            cursor: isGenerating ? 'wait' : 'pointer',
            transition: 'all 0.2s ease',
          }}
          onMouseOver={(e) => { e.currentTarget.style.background = 'var(--color-surface-hover)'; }}
          onMouseOut={(e) => { e.currentTarget.style.background = 'var(--color-surface)'; }}
        >
          <Download size={18} />
          {isGenerating ? 'Generating...' : 'Download Image'}
        </button>

        {/* Copy Link */}
        <button
          onClick={handleCopyLink}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 'var(--spacing-sm)',
            padding: 'var(--spacing-md) var(--spacing-lg)',
            background: copied ? 'var(--color-accent-success)' : 'var(--color-surface)',
            border: `1px solid ${copied ? 'var(--color-accent-success)' : 'var(--color-border)'}`,
            borderRadius: 'var(--border-radius-md)',
            color: copied ? 'white' : 'var(--color-text-secondary)',
            fontSize: 'var(--font-size-sm)',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
          onMouseOver={(e) => { if (!copied) e.currentTarget.style.background = 'var(--color-surface-hover)'; }}
          onMouseOut={(e) => { if (!copied) e.currentTarget.style.background = 'var(--color-surface)'; }}
        >
          {copied ? <Check size={18} /> : <Copy size={18} />}
          {copied ? 'Copied!' : 'Copy Link'}
        </button>
      </div>
    </div>
  );
}
