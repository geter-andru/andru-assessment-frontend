'use client';

/**
 * Assessment Context - TypeScript Migration
 * 
 * Assessment data management and personalization with professional development language
 * Enhanced with Supabase integration and TypeScript type safety
 * Migrated from legacy platform with improved error handling
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// TypeScript interfaces for assessment context
export interface AssessmentData {
  performance?: string;
  strategy?: string;
  revenue?: {
    opportunity: number;
    current: number;
  };
  challenges?: string[];
  competencyAreas?: string[];
  skillLevels?: {
    customerAnalysis: number;
    valueCommunication: number;
    executiveReadiness: number;
    overall: number;
  };
  lastAssessment?: number;
  // Assessment-specific data
  results?: {
    overallScore: number;
    buyerScore: number;
    techScore: number;
    qualification: 'Qualified' | 'Promising' | 'Developing' | 'Early Stage';
  };
  questionTimings?: Record<string, number>;
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
    productName?: string;
    productDescription: string;
    keyFeatures?: string;
    idealCustomerDescription?: string;
    businessModel: string;
    customerCount?: string;
    distinguishingFeature?: string;
  };
}

export interface CompetencyBaselines {
  customerAnalysis?: number;
  valueCommunication?: number;
  executiveReadiness?: number;
  overall?: number;
  baselineDate?: string;
}

export interface PersonalizedMessaging {
  welcomeMessage: {
    primary: string;
    secondary: string;
    urgency: 'immediate' | 'moderate' | 'low';
    tone: 'professional' | 'supportive' | 'encouraging';
  };
  toolDescriptions: {
    icpTool: string;
    costTool: string;
    businessCase: string;
  };
  activityPersonalization: Array<{
    focusArea: string;
    activityPrefixes: string[];
    completionMessages: string[];
  }>;
  achievementPersonalization: {
    badgeContext: string;
    completionBonuses: string;
    milestoneMessages: string;
  };
  nextSteps: string[];
}

export interface CustomerData {
  assessment?: AssessmentData;
  competencyBaselines?: CompetencyBaselines;
  id?: string;
  [key: string]: any;
}

export interface AssessmentContextType {
  assessmentData: AssessmentData | null;
  personalizedMessaging: PersonalizedMessaging | null;
  competencyBaselines: CompetencyBaselines | null;
  isLoading: boolean;
  error: string | null;
  updateAssessment: (data: AssessmentData) => void;
  updateCompetencyBaselines: (baselines: CompetencyBaselines) => void;
  refreshAssessment: () => Promise<void>;
  clearAssessment: () => void;
  // Assessment-specific methods
  setAssessmentResults: (results: AssessmentData['results']) => void;
  setUserInfo: (userInfo: AssessmentData['userInfo']) => void;
  setProductInfo: (productInfo: AssessmentData['productInfo']) => void;
  setGeneratedContent: (content: AssessmentData['generatedContent']) => void;
  setQuestionTimings: (timings: AssessmentData['questionTimings']) => void;
}

// Create context
const AssessmentContext = createContext<AssessmentContextType | undefined>(undefined);

// Custom hook to use assessment context
export const useAssessment = (): AssessmentContextType => {
  const context = useContext(AssessmentContext);
  if (!context) {
    throw new Error('useAssessment must be used within AssessmentProvider');
  }
  return context;
};

// Provider component props
interface AssessmentProviderProps {
  children: ReactNode;
  customerData?: CustomerData;
  customerId?: string;
}

// Assessment Provider component
export const AssessmentProvider: React.FC<AssessmentProviderProps> = ({ 
  children, 
  customerData, 
  customerId 
}) => {
  const [assessmentData, setAssessmentData] = useState<AssessmentData | null>(null);
  const [personalizedMessaging, setPersonalizedMessaging] = useState<PersonalizedMessaging | null>(null);
  const [competencyBaselines, setCompetencyBaselines] = useState<CompetencyBaselines | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize assessment data from props or fetch from storage
  useEffect(() => {
    const initializeAssessment = async () => {
      setIsLoading(true);
      setError(null);

      try {
        if (customerData?.assessment) {
          // Use provided customer data
          setAssessmentData(customerData.assessment);
          setCompetencyBaselines(customerData.competencyBaselines || null);
          
          // Generate personalized messaging
          const messaging = generatePersonalizedMessaging(customerData.assessment);
          setPersonalizedMessaging(messaging);
        } else if (customerId) {
          // Fetch from storage (localStorage for now, could be Supabase later)
          await fetchAssessmentFromStorage(customerId);
        } else {
          // Set default messaging
          const defaultMessaging = generatePersonalizedMessaging(null);
          setPersonalizedMessaging(defaultMessaging);
        }
      } catch (err) {
        console.error('Error initializing assessment:', err);
        setError(err instanceof Error ? err.message : 'Failed to initialize assessment');
        
        // Set default messaging on error
        const defaultMessaging = generatePersonalizedMessaging(null);
        setPersonalizedMessaging(defaultMessaging);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAssessment();
  }, [customerData, customerId]);

  const fetchAssessmentFromStorage = async (id: string): Promise<void> => {
    try {
      // For now, we'll use localStorage. In production, this would fetch from Supabase
      const storedData = localStorage.getItem(`assessment_${id}`);
      if (storedData) {
        const assessment = JSON.parse(storedData);
        setAssessmentData(assessment);
        const messaging = generatePersonalizedMessaging(assessment);
        setPersonalizedMessaging(messaging);
      }
    } catch (err) {
      console.error('Error fetching assessment from storage:', err);
      throw err;
    }
  };

  const generatePersonalizedMessaging = (assessment: AssessmentData | null): PersonalizedMessaging => {
    // Handle null assessment data gracefully
    if (!assessment) {
      return {
        welcomeMessage: {
          primary: 'Welcome to your professional development platform',
          secondary: 'Begin your systematic revenue intelligence journey',
          urgency: 'moderate',
          tone: 'professional'
        },
        toolDescriptions: {
          icpTool: 'Systematic customer analysis and targeting',
          costTool: 'Financial impact analysis and opportunity quantification',
          businessCase: 'Executive-ready business case development'
        },
        activityPersonalization: [{
          focusArea: 'Professional Development',
          activityPrefixes: ['Professional development activity:'],
          completionMessages: ['advances professional development goals']
        }],
        achievementPersonalization: {
          badgeContext: 'Professional Achievement',
          completionBonuses: 'Professional Development Achievement',
          milestoneMessages: 'professional capabilities'
        },
        nextSteps: [
          'Begin with systematic customer analysis',
          'Focus on foundational professional development',
          'Build consistent methodology and processes'
        ]
      };
    }

    const { performance, strategy, revenue, challenges, results } = assessment;
    
    return {
      // Welcome messaging based on performance level or assessment results
      welcomeMessage: getWelcomeMessage(performance, revenue, results),
      
      // Focus area-specific tool descriptions
      toolDescriptions: getToolDescriptions(strategy, challenges, results),
      
      // Activity feed personalization
      activityPersonalization: getActivityPersonalization(strategy, challenges, results),
      
      // Achievement personalization
      achievementPersonalization: getAchievementPersonalization(strategy, challenges, results),
      
      // Next steps based on assessment
      nextSteps: getNextSteps(performance, strategy, results)
    };
  };

  const getWelcomeMessage = (
    performance?: string, 
    revenue?: { opportunity: number; current: number },
    results?: AssessmentData['results']
  ): PersonalizedMessaging['welcomeMessage'] => {
    // Use assessment results if available, otherwise fall back to performance
    const score = results?.overallScore;
    const qualification = results?.qualification;

    if (score !== undefined && qualification) {
      const messages: Record<string, PersonalizedMessaging['welcomeMessage']> = {
        'Qualified': {
          primary: `Excellent work! Your ${score}% assessment score shows strong revenue readiness`,
          secondary: `You're ready for advanced revenue strategies and enterprise-level opportunities`,
          urgency: 'low',
          tone: 'professional'
        },
        'Promising': {
          primary: `Great progress! Your ${score}% assessment shows solid revenue foundations`,
          secondary: `Focus on key areas to unlock your full revenue potential`,
          urgency: 'moderate',
          tone: 'encouraging'
        },
        'Developing': {
          primary: `Your ${score}% assessment reveals important growth opportunities`,
          secondary: `Systematic improvements can significantly accelerate your revenue growth`,
          urgency: 'moderate',
          tone: 'supportive'
        },
        'Early Stage': {
          primary: `Your assessment shows foundational areas for revenue development`,
          secondary: `Building strong fundamentals will create a solid revenue foundation`,
          urgency: 'immediate',
          tone: 'supportive'
        }
      };
      return messages[qualification] || messages['Developing'];
    }

    // Fallback to performance-based messaging
    if (!performance || !revenue) {
      return {
        primary: 'Welcome to your professional development platform',
        secondary: 'Begin your systematic revenue intelligence journey',
        urgency: 'moderate',
        tone: 'professional'
      };
    }

    const messages: Record<string, PersonalizedMessaging['welcomeMessage']> = {
      'Critical': {
        primary: `Your revenue optimization analysis reveals critical improvement opportunities`,
        secondary: `Based on your assessment, addressing key capability gaps could unlock ${Math.round(revenue.opportunity/1000)}K in revenue potential`,
        urgency: 'immediate',
        tone: 'supportive'
      },
      'Needs Work': {
        primary: `Your assessment indicates significant opportunities for professional development`,
        secondary: `Focusing on key areas could unlock ${Math.round(revenue.opportunity/1000)}K in additional revenue potential`,
        urgency: 'moderate',
        tone: 'encouraging'
      },
      'Good': {
        primary: `Your professional development foundation is solid with room for optimization`,
        secondary: `Strategic improvements could unlock ${Math.round(revenue.opportunity/1000)}K in additional revenue potential`,
        urgency: 'moderate',
        tone: 'professional'
      },
      'Excellent': {
        primary: `Your professional development capabilities are strong`,
        secondary: `Fine-tuning your approach could unlock ${Math.round(revenue.opportunity/1000)}K in additional revenue potential`,
        urgency: 'low',
        tone: 'professional'
      }
    };

    return messages[performance] || messages['Good'];
  };

  const getToolDescriptions = (
    strategy?: string, 
    challenges?: string[],
    results?: AssessmentData['results']
  ): PersonalizedMessaging['toolDescriptions'] => {
    const baseDescriptions = {
      icpTool: 'Systematic customer analysis and targeting',
      costTool: 'Financial impact analysis and opportunity quantification',
      businessCase: 'Executive-ready business case development'
    };

    if (!strategy && !challenges && !results) {
      return baseDescriptions;
    }

    // Customize based on assessment results
    if (results) {
      const { buyerScore, techScore, qualification } = results;
      
      if (buyerScore < 60) {
        return {
          ...baseDescriptions,
          icpTool: 'Deep customer discovery and buyer persona development',
          costTool: 'Customer value quantification and pain point analysis'
        };
      }
      
      if (techScore < 60) {
        return {
          ...baseDescriptions,
          businessCase: 'Technical value translation and ROI communication',
          costTool: 'Feature-to-benefit mapping and business case development'
        };
      }
      
      if (qualification === 'Qualified') {
        return {
          ...baseDescriptions,
          icpTool: 'Advanced customer segmentation and enterprise targeting',
          businessCase: 'Complex deal orchestration and stakeholder management'
        };
      }
    }

    return baseDescriptions;
  };

  const getActivityPersonalization = (
    strategy?: string, 
    challenges?: string[],
    results?: AssessmentData['results']
  ): PersonalizedMessaging['activityPersonalization'] => {
    if (results) {
      const { qualification, buyerScore, techScore } = results;
      
      if (qualification === 'Qualified') {
        return [{
          focusArea: 'Advanced Revenue Optimization',
          activityPrefixes: ['Advanced revenue strategy:', 'Enterprise-level optimization:'],
          completionMessages: ['advances enterprise revenue capabilities', 'strengthens advanced revenue positioning']
        }];
      }
      
      if (buyerScore < 60) {
        return [{
          focusArea: 'Customer Understanding Development',
          activityPrefixes: ['Customer discovery activity:', 'Buyer research:'],
          completionMessages: ['improves customer understanding', 'strengthens buyer empathy']
        }];
      }
      
      if (techScore < 60) {
        return [{
          focusArea: 'Technical Value Communication',
          activityPrefixes: ['Technical translation activity:', 'Value communication:'],
          completionMessages: ['enhances technical communication', 'improves value articulation']
        }];
      }
    }

    return [{
      focusArea: 'Professional Development',
      activityPrefixes: ['Professional development activity:'],
      completionMessages: ['advances professional development goals']
    }];
  };

  const getAchievementPersonalization = (
    strategy?: string, 
    challenges?: string[],
    results?: AssessmentData['results']
  ): PersonalizedMessaging['achievementPersonalization'] => {
    if (results) {
      const { qualification } = results;
      
      if (qualification === 'Qualified') {
        return {
          badgeContext: 'Revenue Excellence Achievement',
          completionBonuses: 'Advanced Revenue Strategy Achievement',
          milestoneMessages: 'revenue mastery capabilities'
        };
      }
      
      if (qualification === 'Promising') {
        return {
          badgeContext: 'Revenue Growth Achievement',
          completionBonuses: 'Revenue Development Achievement',
          milestoneMessages: 'revenue growth capabilities'
        };
      }
    }

    return {
      badgeContext: 'Professional Achievement',
      completionBonuses: 'Professional Development Achievement',
      milestoneMessages: 'professional capabilities'
    };
  };

  const getNextSteps = (
    performance?: string, 
    strategy?: string,
    results?: AssessmentData['results']
  ): string[] => {
    if (results) {
      const { qualification, buyerScore, techScore } = results;
      
      if (qualification === 'Qualified') {
        return [
          'Leverage advanced revenue strategies for enterprise deals',
          'Optimize existing processes for maximum efficiency',
          'Mentor others in revenue development best practices'
        ];
      }
      
      if (buyerScore < 60) {
        return [
          'Conduct systematic customer discovery interviews',
          'Develop comprehensive buyer personas',
          'Map customer journey and pain points'
        ];
      }
      
      if (techScore < 60) {
        return [
          'Create technical value communication frameworks',
          'Develop ROI calculators and business cases',
          'Practice translating features to business benefits'
        ];
      }
      
      return [
        'Focus on identified weak areas from assessment',
        'Use platform tools to systematically improve',
        'Track progress with regular assessments'
      ];
    }

    return [
      'Begin with systematic customer analysis',
      'Focus on foundational professional development',
      'Build consistent methodology and processes'
    ];
  };

  // Context methods
  const updateAssessment = (data: AssessmentData) => {
    setAssessmentData(data);
    const messaging = generatePersonalizedMessaging(data);
    setPersonalizedMessaging(messaging);
    setError(null);
  };

  const updateCompetencyBaselines = (baselines: CompetencyBaselines) => {
    setCompetencyBaselines(baselines);
  };

  const refreshAssessment = async () => {
    if (customerId) {
      await fetchAssessmentFromStorage(customerId);
    }
  };

  const clearAssessment = () => {
    setAssessmentData(null);
    setCompetencyBaselines(null);
    setPersonalizedMessaging(generatePersonalizedMessaging(null));
    setError(null);
  };

  // Assessment-specific methods
  const setAssessmentResults = (results: AssessmentData['results']) => {
    setAssessmentData(prev => ({
      ...prev,
      results
    }));
    // Regenerate messaging with new results
    const updatedData = { ...assessmentData, results };
    const messaging = generatePersonalizedMessaging(updatedData);
    setPersonalizedMessaging(messaging);
  };

  const setUserInfo = (userInfo: AssessmentData['userInfo']) => {
    setAssessmentData(prev => ({
      ...prev,
      userInfo
    }));
  };

  const setProductInfo = (productInfo: AssessmentData['productInfo']) => {
    setAssessmentData(prev => ({
      ...prev,
      productInfo
    }));
  };

  const setGeneratedContent = (generatedContent: AssessmentData['generatedContent']) => {
    setAssessmentData(prev => ({
      ...prev,
      generatedContent
    }));
  };

  const setQuestionTimings = (questionTimings: AssessmentData['questionTimings']) => {
    setAssessmentData(prev => ({
      ...prev,
      questionTimings
    }));
  };

  const contextValue: AssessmentContextType = {
    assessmentData,
    personalizedMessaging,
    competencyBaselines,
    isLoading,
    error,
    updateAssessment,
    updateCompetencyBaselines,
    refreshAssessment,
    clearAssessment,
    setAssessmentResults,
    setUserInfo,
    setProductInfo,
    setGeneratedContent,
    setQuestionTimings
  };

  return (
    <AssessmentContext.Provider value={contextValue}>
      {children}
    </AssessmentContext.Provider>
  );
};

// Export default
export default AssessmentProvider;

