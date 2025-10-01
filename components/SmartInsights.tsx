'use client';

// Smart Insights - Pattern detection and insight generation (shows at 50% and 75% only)

import { useCallback, useEffect, useState } from 'react';

interface SmartInsightsProps {
  currentResults: {
    overallScore: number;
    buyerScore: number;
    techScore: number;
    qualification: string;
  };
  answeredQuestions: number;
  totalQuestions: number;
  questionTimings: Record<string, number>;
  generatedContent?: {
    icpGenerated?: string;
    tbpGenerated?: string;
    buyerGap?: number;
  };
}

interface Insight {
  type: 'pattern' | 'gap' | 'strength' | 'timing';
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'success';
}

export default function SmartInsights({
  currentResults,
  answeredQuestions,
  totalQuestions,
  questionTimings,
  generatedContent
}: SmartInsightsProps) {
  const [currentInsight, setCurrentInsight] = useState<Insight | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasShown50, setHasShown50] = useState(false);
  const [hasShown75, setHasShown75] = useState(false);
  const [lastProgressMilestone, setLastProgressMilestone] = useState(0);
  
  const progress = (answeredQuestions / totalQuestions) * 100;
  
  // Generate insight based on patterns
  const generateInsight = useCallback((): Insight | null => {
    // Analyze buyer vs tech scores
    const buyerTechGap = Math.abs(currentResults.buyerScore - currentResults.techScore);
    
    // Analyze timing patterns
    const timings = Object.values(questionTimings);
    const avgTime = timings.length > 0 ? timings.reduce((a, b) => a + b, 0) / timings.length : 0;
    const slowQuestions = timings.filter(t => t > avgTime * 1.5).length;
    
    // Determine which insight milestone we're at
    const currentMilestone = progress >= 75 ? 75 : progress >= 50 ? 50 : 0;
    
    // At 50%: Show ICP/TBP-based insights if available
    if (currentMilestone === 50 && generatedContent?.icpGenerated) {
      // Extract key insights from generated ICP content
      const icpContent = generatedContent.icpGenerated.toLowerCase();
      const tbpContent = generatedContent.tbpGenerated?.toLowerCase() || '';
      
      // Pattern recognition for buyer preferences
      const buyerInsights = [];
      
      // Extract more specific, contextual insights from ICP/TBP content
      // Look for specific buyer characteristics and pain points
      if (icpContent.includes('series a') || icpContent.includes('series b') || icpContent.includes('funded')) {
        if (icpContent.includes('growth') || icpContent.includes('scale')) {
          buyerInsights.push('are scaling rapidly and need solutions that grow 10x without breaking');
        }
        if (icpContent.includes('metric') || icpContent.includes('kpi')) {
          buyerInsights.push('track everything and make data-driven decisions on vendor selection');
        }
      }
      
      if (icpContent.includes('enterprise') && (icpContent.includes('500') || icpContent.includes('1000') || icpContent.includes('employee'))) {
        buyerInsights.push('have complex procurement processes with 6+ stakeholders');
        if (icpContent.includes('legacy') || icpContent.includes('existing')) {
          buyerInsights.push('are constrained by legacy systems and need gradual migration paths');
        }
      }
      
      if (icpContent.includes('technical founder') || icpContent.includes('engineering') || icpContent.includes('developer')) {
        buyerInsights.push('evaluate technical architecture before business value');
        if (icpContent.includes('api') || icpContent.includes('integration')) {
          buyerInsights.push('expect API-first design and extensive documentation');
        }
      }
      
      if (icpContent.includes('smb') || icpContent.includes('small business') || (icpContent.includes('employee') && icpContent.includes('50'))) {
        buyerInsights.push('have limited budgets and need immediate value within 30 days');
        buyerInsights.push('prefer self-service onboarding over enterprise sales cycles');
      }
      
      // Extract specific pain points mentioned
      if (icpContent.includes('manual') && icpContent.includes('process')) {
        buyerInsights.push('waste 15+ hours weekly on manual processes that should be automated');
      }
      if (icpContent.includes('silo') || icpContent.includes('disconnect')) {
        buyerInsights.push('struggle with disconnected tools and data silos across departments');
      }
      if (icpContent.includes('visibility') || icpContent.includes('insight')) {
        buyerInsights.push('lack real-time visibility into critical business metrics');
      }
      if (icpContent.includes('customer churn') || icpContent.includes('retention')) {
        buyerInsights.push('are losing 20%+ annual revenue to preventable customer churn');
      }
      
      // Extract decision-making patterns
      if (tbpContent.includes('pilot') || tbpContent.includes('proof of concept')) {
        buyerInsights.push('require proof-of-concept before committing to annual contracts');
      }
      if (tbpContent.includes('champion') && tbpContent.includes('internal')) {
        buyerInsights.push('need an internal champion to navigate organizational politics');
      }
      
      // If no specific insights found, look for industry-specific patterns
      if (buyerInsights.length === 0) {
        if (icpContent.includes('saas') || icpContent.includes('software')) {
          buyerInsights.push('are competing on product velocity and time-to-market');
        }
        if (icpContent.includes('finance') || icpContent.includes('fintech')) {
          buyerInsights.push('prioritize security, compliance, and audit trails above features');
        }
        if (icpContent.includes('healthcare') || icpContent.includes('medical')) {
          buyerInsights.push('require HIPAA compliance and extensive data privacy controls');
        }
      }
      
      // Generate diagnostic message without prescriptive guidance
      if (buyerInsights.length > 0) {
        if (generatedContent.buyerGap && generatedContent.buyerGap > 60) {
          const topInsights = buyerInsights.slice(0, 2).join(', ');
          return {
            type: 'gap',
            title: 'Critical Buyer Reality Check',
            message: `Your target buyers ${topInsights}. Your current positioning has a ${generatedContent.buyerGap}% gap from these realities.`,
            severity: 'warning'
          };
        } else if (generatedContent.buyerGap && generatedContent.buyerGap > 40) {
          const topInsights = buyerInsights.slice(0, 2).join(' and ');
          return {
            type: 'pattern',
            title: 'Buyer Profile Analysis',
            message: `Your ideal customers ${topInsights}. Your understanding shows a ${generatedContent.buyerGap}% variance from this profile.`,
            severity: 'info'
          };
        } else {
          const topInsights = buyerInsights.slice(0, 2).join(' and ');
          return {
            type: 'strength',
            title: 'Buyer Alignment Confirmed',
            message: `Your ideal customers ${topInsights}. ${generatedContent.buyerGap ? `Your positioning aligns within ${100 - generatedContent.buyerGap}% of market reality.` : 'Market patterns confirm your understanding.'}`,
            severity: 'success'
          };
        }
      }
    }
    
    // At 75%: Show pattern-based or performance insights
    if (currentMilestone === 75) {
      // Timing insights have priority at 75%
      if (slowQuestions >= 3) {
        return {
          type: 'timing',
          title: 'Decision Pattern Analysis',
          message: `You spent extra time on ${slowQuestions} questions. ${slowQuestions > 5 ? 'This indicates deep consideration of complex revenue concepts.' : 'These hesitation points reveal specific skill gaps.'}`,
          severity: slowQuestions > 5 ? 'info' : 'warning'
        };
      }
      
      // Pattern insight at 75% - no scores revealed
      return {
        type: 'progress',
        title: 'Assessment Nearing Completion',
        message: `You're 75% complete. The final questions focus on advanced revenue execution skills that separate successful founders from the rest.`,
        severity: 'info'
      };
    }
    
    // Pattern detection without revealing scores
    const responsePatterns = Object.values(responses);
    const consistentResponses = responsePatterns.filter(r => r >= 3).length;
    const inconsistentResponses = responsePatterns.filter(r => r <= 2).length;
    
    if (currentMilestone === 50) {
      if (consistentResponses > inconsistentResponses) {
        return {
          type: 'pattern',
          title: 'Strong Foundation Detected',
          message: 'Your responses show consistent confidence across revenue areas. This suggests solid fundamentals - the remaining questions will reveal advanced capabilities.',
          severity: 'success'
        };
      } else {
        return {
          type: 'pattern',
          title: 'Development Opportunities Emerging',
          message: 'Your responses reveal specific areas for growth - exactly what we want to identify. The second half will pinpoint your strongest improvement opportunities.',
          severity: 'info'
        };
      }
    }
    
    // For 75% milestone
    if (currentMilestone === 75) {
      return {
        type: 'progress',
        title: 'Assessment Nearly Complete',
        message: 'You\'re in the final stretch. These last questions cover advanced revenue execution that distinguishes top performers.',
        severity: 'info'
      };
    }
    
    // Should not reach here - only show at 50% and 75%
    return null;
  }, [currentResults, questionTimings, generatedContent, progress]);
  
  useEffect(() => {
    const currentMilestone = progress >= 75 ? 75 : progress >= 50 ? 50 : 0;
    
    // Only trigger if we've reached a new milestone
    if (currentMilestone > lastProgressMilestone && currentMilestone > 0) {
      const insight = generateInsight();
      
      if (insight) {
        setCurrentInsight(insight);
        setIsVisible(true);
        setLastProgressMilestone(currentMilestone);
        
        // Update milestone flags
        if (currentMilestone === 50) setHasShown50(true);
        if (currentMilestone === 75) setHasShown75(true);
        
        // Hide after 6 seconds
        const timer = setTimeout(() => {
          setIsVisible(false);
        }, 6000);
        
        return () => clearTimeout(timer);
      }
    }
  }, [progress, currentResults, lastProgressMilestone, generateInsight]);
  
  if (!currentInsight || !isVisible) return null;
  
  const getInsightStyles = () => {
    const base = 'fixed top-4 right-4 max-w-xs p-4 rounded-lg shadow-xl z-50 transition-all duration-500';
    
    switch (currentInsight.severity) {
      case 'success':
        return `${base} bg-green-900/90 border border-green-500/30 text-green-100`;
      case 'warning':
        return `${base} bg-amber-900/90 border border-amber-500/30 text-amber-100`;
      case 'info':
      default:
        return `${base} bg-blue-900/90 border border-blue-500/30 text-blue-100`;
    }
  };
  
  const getIcon = () => {
    switch (currentInsight.type) {
      case 'pattern': return '🔍';
      case 'gap': return '⚠️';
      case 'strength': return '💪';
      case 'timing': return '⏱️';
      default: return '💡';
    }
  };
  
  return (
    <div className={getInsightStyles()}>
      <div className="flex items-start">
        <span className="text-xl mr-2">{getIcon()}</span>
        <div className="flex-1">
          <h3 className="font-semibold text-base mb-1">
            {currentInsight.title}
          </h3>
          <p className="text-xs opacity-90 leading-snug">
            {currentInsight.message}
          </p>
          <div className="mt-2 text-xs opacity-75">
            Insight {hasShown75 ? '2 of 2' : '1 of 2'}
          </div>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="ml-2 text-white/50 hover:text-white transition-colors text-sm"
          aria-label="Close insight"
        >
          ×
        </button>
      </div>
    </div>
  );
}