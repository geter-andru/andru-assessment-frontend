'use client';

/**
 * Assessment Widgets - TypeScript Migration
 * 
 * Specific widget implementations for assessment results
 * Enhanced with TypeScript type safety and context integration
 * Migrated from legacy platform with improved error handling
 */

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import ModernCard from '@/components/ui/ModernCard';
import { useAssessment } from '@/contexts/AssessmentContext';
import { WidgetData, WidgetConfig, WidgetProps } from './WidgetSystem';

// TypeScript interfaces for assessment-specific widgets
export interface AssessmentResultsData {
  overallScore: number;
  buyerScore: number;
  techScore: number;
  qualification: 'Qualified' | 'Promising' | 'Developing' | 'Early Stage';
}

export interface ChallengeData {
  name: string;
  severity: 'high' | 'medium' | 'low';
  evidence: string;
  pattern: string;
  revenueImpact: string;
}

export interface RecommendationData {
  name: string;
  description: string;
  whyRecommended: string;
  expectedImprovement: string;
  directLink: string;
}

export interface InsightData {
  type: 'unconscious-incompetence' | 'overconfidence' | 'industry-comparison' | 'aha-moment';
  title: string;
  description: string;
}

// Overview Widget Component
export const AssessmentOverviewWidget: React.FC<WidgetProps> = ({ data, config }) => {
  const { assessmentData, personalizedMessaging } = useAssessment();
  const [results, setResults] = useState<AssessmentResultsData | null>(null);

  useEffect(() => {
    if (assessmentData?.results) {
      setResults(assessmentData.results);
    }
  }, [assessmentData]);

  if (!results) {
    return (
      <div className="text-center text-gray-400">
        <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p>Loading assessment overview...</p>
      </div>
    );
  }

  const getProfessionalLevel = (score: number): string => {
    if (score >= 90) return 'Master';
    if (score >= 80) return 'Advanced';
    if (score >= 70) return 'Proficient';
    if (score >= 60) return 'Developing';
    if (score >= 50) return 'Foundation';
    return 'Beginning';
  };

  const getQualificationColor = (qualification: string) => {
    switch (qualification) {
      case 'Qualified': return 'text-green-400';
      case 'Promising': return 'text-blue-400';
      case 'Developing': return 'text-yellow-400';
      case 'Early Stage': return 'text-orange-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Score Overview */}
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center">
          <div className="text-3xl font-bold text-white mb-1">{results.overallScore}%</div>
          <div className="text-sm text-gray-400">Overall Score</div>
          <div className="text-xs text-blue-400 mt-1">{getProfessionalLevel(results.overallScore)}</div>
        </div>
        <div className="text-center">
          <div className={`text-2xl font-bold mb-1 ${getQualificationColor(results.qualification)}`}>
            {results.qualification}
          </div>
          <div className="text-sm text-gray-400">Qualification</div>
        </div>
      </div>

      {/* Detailed Scores */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-300">Customer Understanding</span>
          <span className="text-sm font-medium text-white">{results.buyerScore}%</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div 
            className="bg-blue-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${results.buyerScore}%` }}
          ></div>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-300">Technical Value Translation</span>
          <span className="text-sm font-medium text-white">{results.techScore}%</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div 
            className="bg-purple-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${results.techScore}%` }}
          ></div>
        </div>
      </div>

      {/* Personalized Message */}
      {personalizedMessaging?.welcomeMessage && (
        <div className="bg-gray-800/50 rounded-lg p-4">
          <p className="text-sm text-gray-300">
            {personalizedMessaging.welcomeMessage.secondary}
          </p>
        </div>
      )}
    </div>
  );
};

// Challenges Widget Component
export const AssessmentChallengesWidget: React.FC<WidgetProps> = ({ data, config }) => {
  const { assessmentData } = useAssessment();
  const [challenges, setChallenges] = useState<ChallengeData[]>([]);

  useEffect(() => {
    // Generate challenges based on assessment data
    if (assessmentData?.results) {
      const generatedChallenges = generateChallenges(assessmentData.results);
      setChallenges(generatedChallenges);
    }
  }, [assessmentData]);

  const generateChallenges = (results: AssessmentResultsData): ChallengeData[] => {
    const challenges: ChallengeData[] = [];
    const buyerTechGap = Math.abs(results.buyerScore - results.techScore);

    // Score-based challenges
    if (results.overallScore < 70) {
      challenges.push({
        name: 'Revenue Foundation Building',
        severity: results.overallScore < 50 ? 'high' : 'medium',
        evidence: `Overall readiness at ${results.overallScore}% indicates foundational gaps`,
        pattern: 'Technical founder challenge - strong product vision needs revenue execution',
        revenueImpact: 'Foundation improvements typically accelerate revenue 2-3x within 6 months'
      });
    }

    // Buyer-tech gap analysis
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

    return challenges.slice(0, 3); // Top 3 challenges
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

  if (challenges.length === 0) {
    return (
      <div className="text-center text-gray-400">
        <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p>Analyzing challenges...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {challenges.map((challenge, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="border border-gray-700 rounded-lg p-4"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-2">
              <span className="text-lg">{getSeverityIcon(challenge.severity)}</span>
              <h4 className="font-semibold text-white">{challenge.name}</h4>
            </div>
            <span className={`px-2 py-1 rounded text-xs font-medium ${getSeverityStyles(challenge.severity)}`}>
              {challenge.severity.toUpperCase()}
            </span>
          </div>
          
          <p className="text-sm text-gray-300 mb-2">{challenge.evidence}</p>
          <p className="text-xs text-gray-400 mb-2">{challenge.pattern}</p>
          <p className="text-xs text-green-400 font-medium">{challenge.revenueImpact}</p>
        </motion.div>
      ))}
    </div>
  );
};

// Recommendations Widget Component
export const AssessmentRecommendationsWidget: React.FC<WidgetProps> = ({ data, config }) => {
  const { assessmentData } = useAssessment();
  const [recommendations, setRecommendations] = useState<RecommendationData[]>([]);

  useEffect(() => {
    // Generate recommendations based on assessment data
    if (assessmentData?.results) {
      const generatedRecommendations = generateRecommendations(assessmentData.results);
      setRecommendations(generatedRecommendations);
    }
  }, [assessmentData]);

  const generateRecommendations = (results: AssessmentResultsData): RecommendationData[] => {
    const recommendations: RecommendationData[] = [];

    // Score-based recommendations
    if (results.buyerScore < 60) {
      recommendations.push({
        name: 'Customer Interview Tracker',
        description: 'Notion template to document and analyze 100+ customer conversations systematically',
        whyRecommended: 'Build deep buyer empathy through structured customer research',
        expectedImprovement: 'Gain 20+ buyer insights per week',
        directLink: '/resources/interview-tracker'
      });
    }

    if (results.techScore < 60) {
      recommendations.push({
        name: 'Feature-to-Benefit Translator',
        description: 'AI-powered tool that converts technical specs into customer value statements',
        whyRecommended: 'Bridge the gap between what you built and why customers care',
        expectedImprovement: 'Create compelling value props in 5 minutes instead of hours',
        directLink: '/resources/feature-translator'
      });
    }

    if (results.overallScore < 70) {
      recommendations.push({
        name: 'Revenue Foundation Playbook',
        description: 'Step-by-step guide to building systematic revenue processes',
        whyRecommended: 'Your assessment shows foundational gaps that need systematic approach',
        expectedImprovement: 'Establish consistent revenue processes within 30 days',
        directLink: '/resources/foundation-playbook'
      });
    }

    // High performer resources
    if (results.overallScore > 75) {
      recommendations.push({
        name: 'Enterprise Deal Orchestrator',
        description: 'Advanced framework for managing $100K+ deals with multiple stakeholders',
        whyRecommended: 'You are ready for bigger deals - this helps you close them',
        expectedImprovement: 'Increase average deal size by 2.5x',
        directLink: '/resources/enterprise-orchestrator'
      });
    }

    return recommendations.slice(0, 3); // Top 3 recommendations
  };

  if (recommendations.length === 0) {
    return (
      <div className="text-center text-gray-400">
        <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p>Generating recommendations...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {recommendations.map((recommendation, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="border border-gray-700 rounded-lg p-4"
        >
          <div className="flex justify-between items-start mb-3">
            <h4 className="font-semibold text-blue-400">{recommendation.name}</h4>
            <span className="text-sm text-gray-400">Priority #{index + 1}</span>
          </div>
          
          <p className="text-sm text-gray-300 mb-3">{recommendation.description}</p>
          
          <div className="grid md:grid-cols-2 gap-3 text-sm mb-3">
            <div>
              <div className="text-gray-400 mb-1">Why Recommended</div>
              <div className="text-gray-300">{recommendation.whyRecommended}</div>
            </div>
            <div>
              <div className="text-gray-400 mb-1">Expected Improvement</div>
              <div className="text-green-400">{recommendation.expectedImprovement}</div>
            </div>
          </div>
          
          <button 
            onClick={() => {
              // Store assessment data and redirect to platform
              sessionStorage.setItem('assessmentResults', JSON.stringify({
                results: assessmentData?.results,
                timestamp: Date.now()
              }));
              window.location.href = 'https://platform.andru-ai.com/login';
            }}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors text-sm"
          >
            Get Early Access
          </button>
        </motion.div>
      ))}
    </div>
  );
};

// Insights Widget Component
export const AssessmentInsightsWidget: React.FC<WidgetProps> = ({ data, config }) => {
  const { assessmentData } = useAssessment();
  const [insights, setInsights] = useState<InsightData[]>([]);

  useEffect(() => {
    // Generate insights based on assessment data
    if (assessmentData?.results) {
      const generatedInsights = generateInsights(assessmentData.results);
      setInsights(generatedInsights);
    }
  }, [assessmentData]);

  const generateInsights = (results: AssessmentResultsData): InsightData[] => {
    const insights: InsightData[] = [];
    const buyerTechGap = Math.abs(results.buyerScore - results.techScore);

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

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'industry-comparison': return '📊';
      case 'aha-moment': return '💡';
      case 'unconscious-incompetence': return '⚠️';
      case 'overconfidence': return '🎯';
      default: return '🔍';
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'industry-comparison': return 'text-blue-400';
      case 'aha-moment': return 'text-yellow-400';
      case 'unconscious-incompetence': return 'text-red-400';
      case 'overconfidence': return 'text-orange-400';
      default: return 'text-gray-400';
    }
  };

  if (insights.length === 0) {
    return (
      <div className="text-center text-gray-400">
        <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p>Generating insights...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {insights.map((insight, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="border border-gray-700 rounded-lg p-4"
        >
          <div className="flex items-start space-x-3">
            <span className="text-2xl">{getInsightIcon(insight.type)}</span>
            <div className="flex-1">
              <h4 className={`font-semibold mb-2 ${getInsightColor(insight.type)}`}>
                {insight.title}
              </h4>
              <p className="text-sm text-gray-300">{insight.description}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

// Widgets are already exported above with their declarations
