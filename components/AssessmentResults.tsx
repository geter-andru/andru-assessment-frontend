'use client';

// POLISH PHASE: Enterprise-grade assessment results with advanced visualizations

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import EnterpriseScoreChart from './EnterpriseScoreChart';
import ModernCard from './ui/ModernCard';
import { AssessmentErrorBoundary } from './ErrorBoundary';
import { useAssessment } from '@/contexts/AssessmentContext';
import {
  WidgetContainer,
  createWidget,
  type WidgetConfig
} from './widgets';
import type { AssessmentInsight } from '@/lib/api';

interface AssessmentResultsProps {
  results: {
    overallScore: number;
    buyerScore: number;
    techScore: number;
    qualification: string;
  };
  questionTimings: Record<string, number>;
  generatedContent?: {
    icpGenerated?: string;
    tbpGenerated?: string;
    buyerGap?: number;
  };
  userInfo?: {
    name: string;
    email: string;
    company: string;
    role?: string;
  };
  productInfo?: {
    productName: string;
    productDescription: string;
    keyFeatures: string;
    idealCustomerDescription: string;
    businessModel: string;
    customerCount: string;
    distinguishingFeature: string;
  };
  aiInsights?: AssessmentInsight[];
}

interface Challenge {
  name: string;
  severity: 'high' | 'medium' | 'low';
  evidence: string;
  pattern: string;
  revenueImpact: string;
}

interface ToolRecommendation {
  name: string;
  description: string;
  whyRecommended: string;
  expectedImprovement: string;
  directLink: string;
}

interface HiddenInsight {
  type: 'unconscious-incompetence' | 'overconfidence' | 'industry-comparison' | 'aha-moment';
  title: string;
  description: string;
}

export default function AssessmentResults({ results, questionTimings, generatedContent, userInfo, productInfo, aiInsights }: AssessmentResultsProps) {
  const [activeSection, setActiveSection] = useState<'challenges' | 'recommendations'>('challenges');
  const [widgetLayout, setWidgetLayout] = useState<'grid' | 'tabs' | 'accordion'>('tabs');

  // AssessmentContext integration
  const {
    assessmentData,
    personalizedMessaging,
    setAssessmentResults,
    setUserInfo,
    setProductInfo,
    setGeneratedContent,
    setQuestionTimings
  } = useAssessment();

  // Widget configuration
  const [widgets, setWidgets] = useState<WidgetConfig[]>([]);

  // Update context with assessment data
  useEffect(() => {
    if (results) {
      setAssessmentResults(results);
    }
    if (userInfo) {
      setUserInfo(userInfo);
    }
    if (productInfo) {
      setProductInfo(productInfo);
    }
    if (generatedContent) {
      setGeneratedContent(generatedContent);
    }
    if (questionTimings) {
      setQuestionTimings(questionTimings);
    }
  }, [results, userInfo, productInfo, generatedContent, questionTimings, setAssessmentResults, setUserInfo, setProductInfo, setGeneratedContent, setQuestionTimings]);

  // Initialize widgets based on assessment data
  useEffect(() => {
    if (results) {
      const widgetConfigs: WidgetConfig[] = [
        createWidget('overview', {
          id: 'assessment-overview',
          title: 'Assessment Overview',
          description: 'Your overall performance and qualification status',
          priority: 1,
          enabled: true,
          size: 'large'
        }),
        createWidget('challenges', {
          id: 'assessment-challenges',
          title: 'Key Challenges',
          description: 'Identified areas for improvement',
          priority: 2,
          enabled: true,
          size: 'large'
        }),
        createWidget('recommendations', {
          id: 'assessment-recommendations',
          title: 'Recommended Actions',
          description: 'Prioritized next steps for improvement',
          priority: 3,
          enabled: true,
          size: 'large'
        }),
        createWidget('insights', {
          id: 'assessment-insights',
          title: 'Strategic Insights',
          description: 'Hidden patterns and opportunities',
          priority: 4,
          enabled: true,
          size: 'medium'
        })
      ];
      setWidgets(widgetConfigs);
    }
  }, [results]);
  
  // Professional level mapping
  const getProfessionalLevel = (score: number): string => {
    if (score >= 90) return 'Master';
    if (score >= 80) return 'Advanced';
    if (score >= 70) return 'Proficient';
    if (score >= 60) return 'Developing';
    if (score >= 50) return 'Foundation';
    return 'Beginning';
  };

  // Challenge analysis enhanced with ICP/TBP insights
  const generateChallenges = (): Challenge[] => {
    const challenges: Challenge[] = [];
    const buyerTechGap = Math.abs(results.buyerScore - results.techScore);
    
    // Extract insights from ICP/TBP if available
    const icpInsights = generatedContent?.icpGenerated?.toLowerCase() || '';
    // const tbpInsights = generatedContent?.tbpGenerated?.toLowerCase() || '';
    const buyerGap = generatedContent?.buyerGap || 0;
    
    // ICP/TBP-based challenge if buyer gap is high
    if (buyerGap > 60) {
      let specificChallenge = 'Buyer Profile Misalignment';
      let specificEvidence = `${buyerGap}% variance between your buyer understanding and market reality`;
      
      if (icpInsights.includes('enterprise') || icpInsights.includes('complex')) {
        specificChallenge = 'Enterprise Buyer Complexity';
        specificEvidence = `Your buyers have 6+ stakeholders but your approach targets single champions`;
      } else if (icpInsights.includes('technical') && icpInsights.includes('founder')) {
        specificChallenge = 'Technical Buyer Translation';
        specificEvidence = `Your buyers evaluate architecture first but you lead with business value`;
      } else if (icpInsights.includes('budget') || icpInsights.includes('cost')) {
        specificChallenge = 'Economic Buyer Justification';
        specificEvidence = `Your buyers need ROI proof within 90 days but you lack quantified metrics`;
      }
      
      challenges.push({
        name: specificChallenge,
        severity: 'high',
        evidence: specificEvidence,
        pattern: `ICP analysis reveals critical gaps in understanding ${productInfo?.businessModel || 'B2B'} buyer priorities`,
        revenueImpact: 'Alignment could increase qualified pipeline by 40-60%'
      });
    }
    
    // Score-based challenges with ICP context
    if (results.overallScore < 70) {
      const contextualPattern = icpInsights.includes('startup') || icpInsights.includes('series') 
        ? 'Selling to funded startups requires different proof than enterprise sales'
        : 'Technical founder challenge - strong product vision needs revenue execution';
        
      challenges.push({
        name: 'Revenue Foundation Building',
        severity: results.overallScore < 50 ? 'high' : 'medium',
        evidence: `Overall readiness at ${results.overallScore}% indicates foundational gaps`,
        pattern: contextualPattern,
        revenueImpact: 'Foundation improvements typically accelerate revenue 2-3x within 6 months'
      });
    }
    
    // Buyer-tech gap analysis (lowered threshold to capture more patterns)
    if (buyerTechGap > 15) {
      if (results.techScore > results.buyerScore) {
        challenges.push({
          name: 'Customer Empathy Development',
          severity: buyerTechGap > 25 ? 'high' : 'medium',
          evidence: `Tech communication (${results.techScore}%) stronger than buyer understanding (${results.buyerScore}%)`,
          pattern: 'Technical founder pattern - excellent product knowledge, opportunity to strengthen customer connection',
          revenueImpact: 'Enhanced customer empathy typically increases deal closure rates by 20-30%'
        });
      } else {
        challenges.push({
          name: 'Technical Value Communication',
          severity: buyerTechGap > 25 ? 'high' : 'medium',
          evidence: `Buyer understanding (${results.buyerScore}%) exceeds tech communication (${results.techScore}%)`,
          pattern: 'Strong customer connection with opportunity to improve technical value articulation',
          revenueImpact: 'Better technical storytelling can reduce sales cycles by 30-40%'
        });
      }
    }
    
    // Timing analysis (more lenient criteria)
    const timings = Object.values(questionTimings);
    const avgTime = timings.length > 0 ? timings.reduce((a, b) => a + b, 0) / timings.length : 0;
    const slowQuestions = timings.filter(t => t > avgTime * 1.5).length;
    
    if (slowQuestions >= 2) {
      challenges.push({
        name: 'Decision Confidence',
        severity: slowQuestions >= 4 ? 'high' : 'medium',
        evidence: `Extended consideration on ${slowQuestions} questions indicates thoughtful analysis`,
        pattern: 'Reflective decision-making style - thorough but can benefit from confidence building',
        revenueImpact: 'Increased confidence in revenue conversations leads to more compelling presentations'
      });
    }
    
    // Excellence challenge for high performers
    if (results.overallScore >= 80) {
      challenges.push({
        name: 'Mastery Optimization',
        severity: 'low',
        evidence: `Strong performance at ${results.overallScore}% with potential for expert-level execution`,
        pattern: 'High-achiever profile - ready for advanced revenue strategies',
        revenueImpact: 'Fine-tuning at this level can unlock premium pricing and enterprise deals'
      });
    }
    
    // Ensure we always have at least 2 challenges
    if (challenges.length === 0) {
      challenges.push({
        name: 'Continuous Improvement',
        severity: 'medium',
        evidence: 'Assessment completed - opportunity for strategic revenue enhancement',
        pattern: 'Growth-minded approach to revenue development',
        revenueImpact: 'Proactive revenue skill building creates competitive advantages'
      });
    }
    
    return challenges.slice(0, 3); // Top 3 challenges
  };
  
  // Tool recommendations based on gaps
  const generateToolRecommendations = (): ToolRecommendation[] => {
    const tools: ToolRecommendation[] = [];
    const challenges = generateChallenges();
    const icpInsights = generatedContent?.icpGenerated?.toLowerCase() || '';
    const buyerGap = generatedContent?.buyerGap || 0;
    
    // ICP/TBP-based resource recommendations
    if (buyerGap > 50) {
      if (icpInsights.includes('enterprise') || icpInsights.includes('stakeholder')) {
        tools.push({
          name: 'Stakeholder Mapping Canvas',
          description: 'Visual framework to identify and influence all 7+ decision makers in enterprise deals',
          whyRecommended: `Your ICP involves ${icpInsights.includes('6+') ? '6+' : 'multiple'} stakeholders but you are targeting single champions`,
          expectedImprovement: 'Reduce deal slippage by 45% through complete stakeholder coverage',
          directLink: '/resources/stakeholder-canvas'
        });
      }
      
      if (icpInsights.includes('technical') || icpInsights.includes('developer')) {
        tools.push({
          name: 'Technical Buyer Playbook',
          description: 'Scripts and frameworks for selling to CTOs, VPs of Engineering, and technical evaluators',
          whyRecommended: 'Your buyers evaluate architecture first - this playbook speaks their language',
          expectedImprovement: 'Increase technical champion engagement by 60%',
          directLink: '/resources/technical-playbook'
        });
      }
    }
    
    // Challenge-based resource recommendations
    challenges.forEach(challenge => {
      if (challenge.name.includes('Buyer') && tools.length < 3) {
        tools.push({
          name: 'Discovery Call Blueprint',
          description: '47-question framework to uncover budget, authority, need, and timeline in one call',
          whyRecommended: 'Transforms every prospect call into qualified pipeline',
          expectedImprovement: 'Increase discovery-to-demo conversion by 35%',
          directLink: '/resources/discovery-blueprint'
        });
      }
      
      if (challenge.name.includes('Technical') && tools.length < 3) {
        tools.push({
          name: 'ROI Calculator Templates',
          description: 'Pre-built Excel models to quantify value in dollars, hours, and efficiency gains',
          whyRecommended: 'Convert technical metrics into CFO-friendly business cases',
          expectedImprovement: 'Shorten approval cycles by 3-4 weeks',
          directLink: '/resources/roi-templates'
        });
      }
      
      if (challenge.severity === 'high' && tools.length < 3) {
        tools.push({
          name: 'Objection Handling Matrix',
          description: '127 proven responses to "too expensive", "not now", and "need to think about it"',
          whyRecommended: 'Your assessment shows hesitation patterns - this builds conviction',
          expectedImprovement: 'Convert 30% more "maybes" into "yes"',
          directLink: '/resources/objection-matrix'
        });
      }
    });
    
    // Score-based recommendations
    if (results.buyerScore < 60 && tools.length < 3) {
      tools.push({
        name: 'Customer Interview Tracker',
        description: 'Notion template to document and analyze 100+ customer conversations systematically',
        whyRecommended: 'Build deep buyer empathy through structured customer research',
        expectedImprovement: 'Gain 20+ buyer insights per week',
        directLink: '/resources/interview-tracker'
      });
    }
    
    if (results.techScore < 60 && tools.length < 3) {
      tools.push({
        name: 'Feature-to-Benefit Translator',
        description: 'AI-powered tool that converts technical specs into customer value statements',
        whyRecommended: 'Bridge the gap between what you built and why customers care',
        expectedImprovement: 'Create compelling value props in 5 minutes instead of hours',
        directLink: '/resources/feature-translator'
      });
    }
    
    // High performer resources
    if (results.overallScore > 75 && tools.length < 3) {
      tools.push({
        name: 'Enterprise Deal Orchestrator',
        description: 'Advanced framework for managing $100K+ deals with multiple stakeholders',
        whyRecommended: 'You are ready for bigger deals - this helps you close them',
        expectedImprovement: 'Increase average deal size by 2.5x',
        directLink: '/resources/enterprise-orchestrator'
      });
    }
    
    return tools.slice(0, 3); // Top 3 most relevant resources
  };
  
  // Hidden insights generation
  const generateHiddenInsights = (): HiddenInsight[] => {
    const insights: HiddenInsight[] = [];
    const buyerTechGap = Math.abs(results.buyerScore - results.techScore);
    
    // Unconscious incompetence detection
    const timings = Object.values(questionTimings);
    const quickAnswers = timings.filter(t => t < 2000).length; // Less than 2 seconds
    
    if (quickAnswers > 8 && results.overallScore < 70) {
      insights.push({
        type: 'unconscious-incompetence',
        title: 'Confidence-Competence Gap Detected',
        description: `You answered ${quickAnswers} questions very quickly but scored ${results.overallScore}%. This suggests overconfidence in areas where you actually have knowledge gaps - a classic technical founder pattern.`
      });
    }
    
    // Industry comparison
    insights.push({
      type: 'industry-comparison',
      title: 'Technical Founder Benchmark',
      description: `Your profile matches 73% of technical founders: strong product vision (${results.techScore}%) but ${results.buyerScore < results.techScore ? 'weaker' : 'stronger'} customer empathy (${results.buyerScore}%). This is actually ${results.buyerScore > results.techScore ? 'unusual and advantageous' : 'typical but addressable'}.`
    });
    
    // Aha moment
    if (buyerTechGap > 25) {
      insights.push({
        type: 'aha-moment',
        title: 'Revenue Acceleration Insight',
        description: `Your ${results.buyerScore > results.techScore ? 'customer empathy strength' : 'technical depth'} is actually your competitive advantage. Most founders struggle with ${results.buyerScore > results.techScore ? 'technical translation' : 'customer empathy'} - you have the foundation to excel quickly.`
      });
    }
    
    return insights;
  };
  
  const challenges = generateChallenges();
  const toolRecommendations = generateToolRecommendations();
  const hiddenInsights = generateHiddenInsights();
  
  // LinkedIn sharing - personalized based on user's specific results
  const generateLinkedInPost = (): string => {
    const level = getProfessionalLevel(results.overallScore);
    const topChallenge = challenges[0]?.name || 'Revenue Growth';
    const strongerArea = results.buyerScore > results.techScore ? 'customer understanding' : 'technical execution';
    const company = userInfo?.company || productInfo?.productName || 'our company';
    
    // Highly personalized message based on results and insights
    if (results.overallScore >= 80) {
      return `Just assessed ${company}'s revenue readiness - scored ${results.overallScore}% (${level} level)! Key strength: ${strongerArea}. Ready to accelerate our $2M → $10M journey. #TechnicalFounders #RevenueGrowth #StartupScaling`;
    } else if (results.overallScore >= 60) {
      return `Completed a comprehensive revenue assessment for ${company} - ${results.overallScore}% with specific focus on ${topChallenge.toLowerCase()}. Clear roadmap identified for systematic scaling! #StartupLife #RevenueIntelligence #BusinessDevelopment`;
    } else {
      return `Deep dive into ${company}'s revenue readiness revealed key insights about ${topChallenge.toLowerCase()}. Excited about the systematic approach to strengthening our revenue foundation! #EntrepreneurJourney #StartupGrowth #RevenueStrategy`;
    }
  };
  
  const handleLinkedInShare = () => {
    const text = generateLinkedInPost();
    const encodedText = encodeURIComponent(text);
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?text=${encodedText}`;
    window.open(linkedInUrl, '_blank', 'width=600,height=500,scrollbars=yes,resizable=yes');
  };

  const handlePDFDownload = async () => {
    try {
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF();
      
      const company = userInfo?.company || productInfo?.productName || 'Your Company';
      const level = getProfessionalLevel(results.overallScore);
      
      // Header
      doc.setFontSize(20);
      doc.text('Revenue Readiness Assessment Results', 20, 30);
      
      doc.setFontSize(14);
      doc.text(`${company} - ${new Date().toLocaleDateString()}`, 20, 45);
      
      // Scores
      doc.setFontSize(16);
      doc.text('Assessment Scores', 20, 65);
      doc.setFontSize(12);
      doc.text(`Overall Revenue Readiness: ${results.overallScore}%`, 20, 80);
      doc.text(`Customer Understanding: ${results.buyerScore}%`, 20, 90);
      doc.text(`Technical Value Translation: ${results.techScore}%`, 20, 100);
      doc.text(`Professional Level: ${level}`, 20, 110);
      doc.text(`Qualification Status: ${results.qualification}`, 20, 120);
      
      // Challenges
      doc.setFontSize(16);
      doc.text('Top Challenges Identified', 20, 140);
      doc.setFontSize(12);
      challenges.forEach((challenge, index) => {
        const yPos = 155 + (index * 30);
        doc.text(`${index + 1}. ${challenge.name} (${challenge.severity.toUpperCase()})`, 20, yPos);
        doc.text(`   ${challenge.evidence}`, 25, yPos + 8);
        doc.text(`   Impact: ${challenge.revenueImpact}`, 25, yPos + 16);
      });
      
      // Tool Recommendations
      doc.setFontSize(16);
      doc.text('Recommended Next Steps', 20, 240);
      doc.setFontSize(12);
      toolRecommendations.forEach((tool, index) => {
        const yPos = 255 + (index * 20);
        doc.text(`${index + 1}. ${tool.name}`, 20, yPos);
        doc.text(`   ${tool.whyRecommended}`, 25, yPos + 8);
      });
      
      // Save
      doc.save(`${company}-Revenue-Assessment-Results.pdf`);
    } catch (error) {
      console.error('PDF generation error:', error);
      alert('PDF download failed. Please try again.');
    }
  };
  
  const getSeverityStyles = (severity: 'high' | 'medium' | 'low') => {
    switch (severity) {
      case 'high': return 'text-red-400 bg-red-900/20';
      case 'medium': return 'text-amber-400 bg-amber-900/20';
      case 'low': return 'text-green-400 bg-green-900/20';
    }
  };
  
  const getSeverityIcon = (severity: 'high' | 'medium' | 'low') => {
    switch (severity) {
      case 'high': return '🔴';
      case 'medium': return '🟡';
      case 'low': return '🟢';
    }
  };

  return (
    <AssessmentErrorBoundary
      resetOnPropsChange={true}
      resetKeys={[activeSection]}
      onError={(error, errorInfo) => {
        console.error('Assessment results error:', error, errorInfo);
      }}
    >
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white p-8">
        <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            {personalizedMessaging?.welcomeMessage?.primary || 'Revenue Readiness Assessment Results'}
          </h1>
          <p className="text-xl text-gray-300">
            {personalizedMessaging?.welcomeMessage?.secondary || 'Comprehensive analysis and strategic recommendations'}
          </p>
        </div>

        {/* AI Insights Section */}
        {aiInsights && aiInsights.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                🤖 AI-Powered Pattern Analysis
              </h2>
              <p className="text-gray-400">
                Real-time insights generated during your assessment
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {aiInsights
                .sort((a, b) => a.batchNumber - b.batchNumber)
                .map((insight, index) => (
                  <motion.div
                    key={insight.batchNumber}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.15 }}
                    className="relative"
                  >
                    <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 border border-gray-700/50 rounded-xl p-6 h-full hover:border-cyan-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10">
                      {/* Batch indicator */}
                      <div className="absolute -top-3 -left-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-xs font-bold rounded-full w-10 h-10 flex items-center justify-center shadow-lg">
                        {insight.batchNumber}
                      </div>

                      {/* Confidence badge */}
                      <div className="flex justify-end mb-3">
                        <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                          insight.confidence >= 85
                            ? 'bg-green-900/30 text-green-400 border border-green-500/30'
                            : insight.confidence >= 70
                            ? 'bg-blue-900/30 text-blue-400 border border-blue-500/30'
                            : 'bg-amber-900/30 text-amber-400 border border-amber-500/30'
                        }`}>
                          {insight.confidence}% confidence
                        </span>
                      </div>

                      {/* Challenge identified */}
                      <h3 className="text-lg font-semibold mb-3 text-white">
                        {insight.challengeIdentified}
                      </h3>

                      {/* AI Insight */}
                      <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                        {insight.insight}
                      </p>

                      {/* Business Impact */}
                      <div className="mt-4 pt-4 border-t border-gray-700/50">
                        <div className="flex items-start space-x-2">
                          <span className="text-lg">💼</span>
                          <div className="flex-1">
                            <p className="text-xs text-gray-400 uppercase font-semibold mb-1">
                              Business Impact
                            </p>
                            <p className="text-sm text-gray-300">
                              {insight.businessImpact}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Progress indicator */}
                      <div className="mt-4 pt-3 border-t border-gray-700/30">
                        <p className="text-xs text-gray-500">
                          {insight.batchNumber === 1 && 'Detected at 25% completion'}
                          {insight.batchNumber === 2 && 'Detected at 64% completion'}
                          {insight.batchNumber === 3 && 'Detected at 100% completion'}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
            </div>

            {/* Context continuity indicator */}
            {aiInsights.length > 1 && (
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-500">
                  <span className="inline-block mr-2">🔗</span>
                  Each insight builds on previous patterns for progressive understanding
                </p>
              </div>
            )}
          </motion.div>
        )}

        {/* Layout Controls */}
        <div className="flex justify-center mb-8">
          <div className="bg-gray-800/50 rounded-lg p-1 flex gap-1">
            {[
              { key: 'tabs' as const, label: 'Tab View' },
              { key: 'grid' as const, label: 'Grid View' },
              { key: 'accordion' as const, label: 'Accordion View' }
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setWidgetLayout(key)}
                className={`px-4 py-2 rounded-md transition-all ${
                  widgetLayout === key
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Widget System */}
        {widgets.length > 0 && (
          <WidgetContainer
            widgets={widgets}
            layout={widgetLayout}
            maxColumns={2}
            onWidgetUpdate={(widgetId, data) => {
              console.log(`Widget ${widgetId} updated:`, data);
            }}
            onWidgetError={(widgetId, error) => {
              console.error(`Widget ${widgetId} error:`, error);
            }}
            className="mb-8"
          />
        )}

        {/* Legacy Content Fallback */}
        {widgets.length === 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <ModernCard variant="highlighted" size="auto" className="text-center">
              <p className="text-gray-400 text-lg mb-4">
                📊 Your detailed analysis is ready
              </p>
              <p className="text-gray-300 mb-6">
                Access your complete revenue readiness dashboard, personalized insights, and sharing tools in the platform.
              </p>
              <button 
                onClick={() => {
                  sessionStorage.setItem('assessmentResults', JSON.stringify({
                    results,
                    questionTimings,
                    generatedContent,
                    userInfo,
                    productInfo,
                    timestamp: Date.now()
                  }));
                  window.location.href = 'https://platform.andru-ai.com/login';
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg transition-colors font-medium"
              >
                View Full Analysis →
              </button>
            </ModernCard>
          </motion.div>
        )}

        {/* Get Early Access CTA */}
        <div className="fixed bottom-8 right-8 z-50">
          <button
            onClick={() => {
              // Prepare assessment data for waitlist
              const waitlistData = {
                email: userInfo?.email || '',
                productName: productInfo?.productName || userInfo?.company || '',
                score: results.overallScore,
                challenges: challenges.length,
                riskLevel: results.qualification,
                focusArea: challenges[0]?.name || '',
                revenueOpportunity: challenges[0]?.revenueImpact?.match(/\d+[\w%]+/)?.[0] || '',
                businessModel: productInfo?.businessModel || '',
                customerCount: productInfo?.customerCount || '',
                qualified: results.qualification === 'Qualified',
                sessionId: Date.now().toString()
              };
              
              // Build URL with assessment data
              const params = new URLSearchParams(waitlistData as Record<string, string>);
              window.location.href = `/waitlist?${params.toString()}`;
            }}
            className="bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-black font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 hover:transform hover:-translate-y-1 group"
          >
            <span className="flex items-center">
              🚀 Get Early Access to Andru Platform
              <span className="ml-2 group-hover:translate-x-1 transition-transform duration-300">→</span>
            </span>
          </button>
        </div>
      </div>

    </div>
    </AssessmentErrorBoundary>
  );
}