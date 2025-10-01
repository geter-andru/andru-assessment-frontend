'use client';

// ESSENTIAL PHASE: Enhanced assessment with real-time features

import { useState } from 'react';
import { assessmentQuestions, calculateScore } from '@/lib/assessment-questions';
import { detectIndustry } from '@/lib/industry-data';
import SmartInsights from '@/components/SmartInsights';
import UserInfoForm from '@/components/UserInfoForm';
import ProductInputForm from '@/components/ProductInputForm';
import { submitAssessment } from '../lib/api';
import AnswerExplanation from '@/components/AnswerExplanation';
import AnimatedTransition from '@/components/AnimatedTransition';
import EnvironmentalBackground from '@/components/EnvironmentalBackground';
import AssessmentResults from '@/components/AssessmentResults';
import ModernCard from '@/components/ui/ModernCard';
import { AssessmentErrorBoundary } from '@/components/ErrorBoundary';

interface UserInfo {
  name: string;
  email: string;
  company: string;
  role?: string;
}

interface ProductInfo {
  productName: string;
  productDescription: string;
  keyFeatures: string;
  idealCustomerDescription: string;
  businessModel: string;
  customerCount: string;
  distinguishingFeature: string;
}

interface GeneratedContent {
  icpGenerated?: string;
  tbpGenerated?: string;
  buyerGap?: number;
}

export default function AssessmentPage() {
  const [showProductInput, setShowProductInput] = useState(true); // CORE: Start with product input
  const [productInfo, setProductInfo] = useState<ProductInfo | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState<Record<string, number>>({});
  const [showComprehensiveResults, setShowComprehensiveResults] = useState(false);
  const [showUserForm, setShowUserForm] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [questionTimings, setQuestionTimings] = useState<Record<string, number>>({});
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent>({});
  const [sessionId, setSessionId] = useState<string>('');
  const [_assessmentStartTime, setAssessmentStartTime] = useState<number>(0);
  
  const question = assessmentQuestions[currentQuestion];
  const isLastQuestion = currentQuestion === assessmentQuestions.length - 1;
  const answeredQuestions = Object.keys(responses).length;
  
  
  // Calculate real-time scores
  const currentResults = calculateScore(responses);
  
  // Detect industry for personalization
  const industryData = detectIndustry(userInfo);
  
  const handleResponse = (value: number) => {
    // Track time spent on this question
    const timeOnQuestion = Date.now() - questionStartTime;
    const newTimings = { ...questionTimings, [question.id]: timeOnQuestion };
    setQuestionTimings(newTimings);
    
    const newResponses = { ...responses, [question.id]: value };
    setResponses(newResponses);
    
    if (isLastQuestion) {
      setShowUserForm(true);
    } else {
      setCurrentQuestion(currentQuestion + 1);
      setQuestionStartTime(Date.now()); // Reset timer for next question
    }
  };
  
  const handleProductSubmit = async (info: ProductInfo) => {
    setProductInfo(info);
    setShowProductInput(false);
    
    // CORE: Use session ID from start assessment
    const existingSessionId = sessionStorage.getItem('assessmentSessionId');
    if (existingSessionId) {
      setSessionId(existingSessionId);
    } else {
      // Fallback if no session ID (shouldn't happen)
      const newSessionId = `assess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      setSessionId(newSessionId);
    }
    setAssessmentStartTime(Date.now());
    
    // ESSENTIAL: Trigger enhanced fallback system for ICP/TBP generation
    try {
      console.log('🚀 Starting enhanced fallback generation for assessment');
      console.log('📝 Product Info:', {
        productName: info.productName,
        businessModel: info.businessModel,
        productDescription: info.productDescription.substring(0, 100) + '...',
        keyFeatures: info.keyFeatures.substring(0, 100) + '...',
        idealCustomerDescription: info.idealCustomerDescription.substring(0, 100) + '...'
      });
      
      // Import webhook service dynamically
      console.log('📦 Importing webhook service...');
      const { default: webhookService } = await import('../../services/webhookService');
      console.log('✅ Webhook service imported successfully');
      
      // Start generation with session tracking
      console.log('🎯 Starting generation with session:', newSessionId);
      webhookService.startGeneration('ASSESS_USER', newSessionId);
      
      // Trigger enhanced fallback system with web research
      console.log('🔬 Triggering enhanced fallback system...');
      const enhancedResources = await webhookService.generateEnhancedRealisticResources({
        productName: info.productName,
        productDescription: info.productDescription,
        businessType: info.businessModel,
        keyFeatures: info.keyFeatures,
        customerId: 'ASSESS_USER'
      });
      
      console.log('📊 Enhanced resources generated:', {
        hasICP: !!enhancedResources.icp_analysis,
        hasTBP: !!enhancedResources.buyer_personas,
        icpLength: enhancedResources.icp_analysis?.content?.length || 0,
        tbpLength: enhancedResources.buyer_personas?.content?.length || 0
      });
      
      // Store generated content for gap analysis and submission
      const generatedIcp = enhancedResources.icp_analysis?.content || '';
      const buyerGap = calculateBuyerGap(info.idealCustomerDescription, generatedIcp);
      
      setGeneratedContent({
        icpGenerated: generatedIcp,
        tbpGenerated: enhancedResources.buyer_personas?.content || '',
        buyerGap: buyerGap
      });
      
      console.log('✅ Enhanced fallback generation completed successfully');
      console.log('🎯 Buyer understanding gap calculated:', buyerGap + '%');
    } catch (error) {
      console.error('⚠️ Fallback generation failed:', error);
      console.error('📍 Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack?.substring(0, 200) : undefined
      });
      // Continue with assessment even if generation fails
    }
  };
  
  // Calculate buyer understanding gap percentage
  const calculateBuyerGap = (userDescription: string, aiGenerated: string): number => {
    const userWords = userDescription.toLowerCase().split(/\s+/).filter(w => w.length > 3);
    const aiWords = aiGenerated.toLowerCase().split(/\s+/).filter(w => w.length > 3);
    
    const overlap = userWords.filter(word => 
      aiWords.some(aiWord => aiWord.includes(word) || word.includes(aiWord))
    );
    
    const overlapRatio = overlap.length / Math.max(aiWords.length, userWords.length);
    const gap = Math.round((1 - overlapRatio) * 100);
    
    return Math.max(15, Math.min(75, gap)); // Realistic gap between 15-75%
  };

  const handleUserInfoSubmit = (info: UserInfo) => {
    setUserInfo(info);
    setShowUserForm(false);
    setShowComprehensiveResults(true);
  };
  
  const handleSkipUserInfo = () => {
    setShowUserForm(false);
    setShowComprehensiveResults(true);
  };
  
  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };
  
  // Show comprehensive results
  if (showComprehensiveResults) {
    const results = calculateScore(responses);
    return (
      <AssessmentResults
        results={results}
        questionTimings={questionTimings}
        generatedContent={generatedContent}
        userInfo={userInfo || undefined}
        productInfo={productInfo || undefined}
      />
    );
  }

  // CORE: Show product input first
  if (showProductInput) {
    return (
      <ProductInputForm
        onSubmit={handleProductSubmit}
      />
    );
  }

  // Show user info form before results
  if (showUserForm) {
    return (
      <UserInfoForm
        onSubmit={handleUserInfoSubmit}
        onSkip={handleSkipUserInfo}
      />
    );
  }
  
  if (false) { // Basic results removed - go directly to comprehensive
    const results = calculateScore(responses);
    
    return (
      <div className="results-container" style={{
        background: 'linear-gradient(135deg, var(--color-background-primary) 0%, var(--color-background-secondary) 100%)',
        minHeight: '100vh'
      }}>
        <div className="glass-card">
          <div className="results-header">
            {userInfo && (
              <p style={{ 
                fontSize: 'var(--font-size-lg)', 
                color: 'var(--color-text-secondary)', 
                marginBottom: 'var(--spacing-sm)' 
              }}>
                Great work, {userInfo?.name}!
              </p>
            )}
            <h1 className="results-title">Your Revenue Readiness Results</h1>
            {userInfo?.company && (
              <p className="results-subtitle">
                Results for {userInfo?.company}
              </p>
            )}
          </div>
          
          <div className="score-container">
            <div className="score-card">
              <div className="score-label">Overall Score</div>
              <div className="score-value">{results.overallScore}<span className="score-suffix">%</span></div>
            </div>
          </div>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(2, 1fr)', 
            gap: 'var(--spacing-2xl)', 
            marginBottom: 'var(--spacing-4xl)' 
          }}>
            <div className="glass-card" style={{ padding: 'var(--spacing-2xl)' }}>
              <div className="score-label">Buyer Understanding</div>
              <div style={{ 
                fontSize: 'var(--font-size-3xl)', 
                fontWeight: '700',
                background: 'linear-gradient(135deg, var(--color-brand-primary) 0%, var(--color-brand-accent) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>{results.buyerScore}%</div>
            </div>
            
            <div className="glass-card" style={{ padding: 'var(--spacing-2xl)' }}>
              <div className="score-label">Tech Translation</div>
              <div style={{ 
                fontSize: 'var(--font-size-3xl)', 
                fontWeight: '700',
                background: 'linear-gradient(135deg, var(--color-brand-secondary) 0%, var(--color-brand-accent) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>{results.techScore}%</div>
            </div>
          </div>
          
          <div className="glass-card" style={{ 
            padding: 'var(--spacing-2xl)', 
            textAlign: 'center',
            marginBottom: 'var(--spacing-4xl)',
            background: results.qualification === 'Qualified' ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%)' :
                       results.qualification === 'Promising' ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)' :
                       results.qualification === 'Developing' ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(251, 146, 60, 0.1) 100%)' :
                       'var(--glass-background)'
          }}>
            <div className="score-label">Qualification Status</div>
            <div style={{ 
              fontSize: 'var(--font-size-2xl)', 
              fontWeight: '700',
              color: results.qualification === 'Qualified' ? 'var(--color-accent-success)' :
                     results.qualification === 'Promising' ? 'var(--color-brand-primary)' :
                     results.qualification === 'Developing' ? 'var(--color-accent-warning)' :
                     'var(--color-text-primary)'
            }}>{results.qualification}</div>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
            <button
              onClick={async () => {
                // Submit to Airtable
                try {
                  const response = await submitAssessment({
                    responses,
                    results,
                    timestamp: new Date().toISOString(),
                    sessionId,
                    userInfo,
                    productInfo,
                    questionTimings,
                    generatedContent,
                  });
                  
                  if (response.success) {
                    alert('Results saved successfully!');
                  } else {
                    alert('Failed to save results');
                  }
                } catch (error) {
                  console.error('Save error:', error);
                  alert('Failed to save results');
                }
              }}
              className="btn-primary"
              style={{ width: '100%' }}
            >
              Save Results
            </button>
            
            <button
              onClick={() => setShowComprehensiveResults(true)}
              className="btn-primary"
              style={{ 
                width: '100%',
                background: 'linear-gradient(135deg, var(--color-brand-primary) 0%, var(--color-brand-secondary) 100%)',
                padding: 'var(--spacing-xl) var(--spacing-2xl)'
              }}
            >
              📊 View Comprehensive Analysis & Recommendations →
            </button>
            
            {/* Platform redirect based on qualification */}
            {results.qualification === 'Qualified' && (
              <button
                onClick={() => {
                  // Generate platform access token and redirect
                  const platformUrl = userInfo 
                    ? `https://platform.andru-ai.com/onboarding?name=${encodeURIComponent(userInfo.name)}&email=${encodeURIComponent(userInfo.email)}&company=${encodeURIComponent(userInfo.company)}&score=${results.overallScore}`
                    : `https://platform.andru-ai.com/onboarding?score=${results.overallScore}`;
                  window.open(platformUrl, '_blank');
                }}
                className="btn-primary"
                style={{ 
                  width: '100%',
                  background: 'linear-gradient(135deg, var(--color-brand-accent) 0%, var(--color-accent-success) 100%)',
                  padding: 'var(--spacing-xl) var(--spacing-2xl)'
                }}
              >
                🚀 Access Your Revenue Intelligence Platform →
              </button>
            )}
            
            {results.qualification === 'Promising' && (
              <button
                onClick={() => {
                  const platformUrl = userInfo 
                    ? `https://platform.andru-ai.com/assessment-boost?name=${encodeURIComponent(userInfo.name)}&email=${encodeURIComponent(userInfo.email)}&company=${encodeURIComponent(userInfo.company)}&score=${results.overallScore}`
                    : `https://platform.andru-ai.com/assessment-boost?score=${results.overallScore}`;
                  window.open(platformUrl, '_blank');
                }}
                className="btn-primary"
                style={{ 
                  width: '100%',
                  background: 'linear-gradient(135deg, var(--color-brand-primary) 0%, var(--color-brand-secondary) 100%)',
                  padding: 'var(--spacing-xl) var(--spacing-2xl)'
                }}
              >
                💡 Get Revenue Readiness Boost →
              </button>
            )}
            
            <button
              onClick={() => window.location.href = '/'}
              style={{
                width: '100%',
                background: 'var(--color-surface)',
                color: 'var(--color-text-secondary)',
                padding: 'var(--spacing-lg) var(--spacing-2xl)',
                borderRadius: 'var(--border-radius-md)',
                border: '1px solid var(--glass-border)',
                cursor: 'pointer',
                transition: 'all var(--transition-normal)',
                fontSize: 'var(--font-size-base)',
                fontWeight: '500'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = 'var(--color-surface-hover)';
                e.currentTarget.style.color = 'var(--color-text-primary)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'var(--color-surface)';
                e.currentTarget.style.color = 'var(--color-text-secondary)';
              }}
            >
              Return Home
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <AssessmentErrorBoundary
      resetOnPropsChange={true}
      resetKeys={[currentQuestion, showProductInput, showUserForm]}
      onError={(error, errorInfo) => {
        console.error('Assessment page error:', error, errorInfo);
      }}
    >
      <div className="min-h-screen relative" style={{ 
        padding: 'var(--spacing-5xl) var(--spacing-2xl)',
        background: 'linear-gradient(135deg, var(--color-background-primary) 0%, var(--color-background-secondary) 100%)',
        minHeight: '100vh'
      }}>
      {/* Environmental background effects */}
      <EnvironmentalBackground
        overallScore={currentResults.overallScore}
        answeredQuestions={answeredQuestions}
        totalQuestions={assessmentQuestions.length}
      />
      
      {/* Smart insights overlay - shows only at 50% and 75% */}
      <SmartInsights
        currentResults={currentResults}
        answeredQuestions={answeredQuestions}
        totalQuestions={assessmentQuestions.length}
        questionTimings={questionTimings}
        generatedContent={generatedContent}
      />
      
      <div style={{ 
        maxWidth: 'var(--content-max-width)', 
        margin: '0 auto', 
        position: 'relative', 
        zIndex: 10 
      }}>
        {/* Progress bar */}
        <div className="progress-container">
          <div className="progress-header">
            <span className="progress-label">Question {currentQuestion + 1} of {assessmentQuestions.length}</span>
            <span className="progress-percentage">{Math.round(((currentQuestion + 1) / assessmentQuestions.length) * 100)}%</span>
          </div>
          <div className="progress-bar-container">
            <div 
              className="progress-bar"
              style={{ width: `${((currentQuestion + 1) / assessmentQuestions.length) * 100}%` }}
            />
          </div>
        </div>
        
        {/* Question card */}
        <AnimatedTransition trigger={currentQuestion}>
          <ModernCard variant="default" size="large" className="question-container">
          <div style={{ 
            display: 'flex', 
            alignItems: 'flex-start', 
            marginBottom: 'var(--spacing-xl)' 
          }}>
            <div style={{ 
              fontSize: 'var(--font-size-2xl)', 
              marginRight: 'var(--spacing-md)' 
            }}>{industryData.icon}</div>
            <div style={{ flex: 1 }}>
              <h2 className="question-text">{question.text}</h2>
              {industryData.examples[question.id] && (
                <div style={{
                  background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%)',
                  border: '1px solid rgba(59, 130, 246, 0.2)',
                  borderRadius: 'var(--border-radius-md)',
                  padding: 'var(--spacing-md)',
                  marginTop: 'var(--spacing-md)'
                }}>
                  <p style={{ 
                    fontSize: 'var(--font-size-sm)', 
                    color: 'var(--color-text-secondary)',
                    lineHeight: 'var(--line-height-relaxed)'
                  }}>
                    <span style={{ 
                      fontWeight: '600', 
                      color: 'var(--color-brand-primary)' 
                    }}>Example for {industryData.name}:</span> {industryData.examples[question.id]}
                  </p>
                </div>
              )}
            </div>
          </div>
          
          {/* Rating scale */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
            {[4, 3, 2, 1].map((value) => (
              <button
                key={value}
                onClick={() => handleResponse(value)}
                className={`rating-option ${responses[question.id] === value ? 'selected' : ''}`}
              >
                <div className="rating-option-indicator" />
                <span className="rating-option-text">
                  {value === 4 && 'Definitely Yes'}
                  {value === 3 && 'Yes, I believe so'}
                  {value === 2 && 'Not Sure'}
                  {value === 1 && 'Definitely No'}
                </span>
              </button>
            ))}
          </div>
          
          {/* Answer explanation */}
          <AnswerExplanation
            question={question}
            industryData={industryData}
            selectedAnswer={responses[question.id]}
          />
          
          {/* Navigation */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginTop: 'var(--spacing-4xl)' 
          }}>
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              style={{
                padding: 'var(--spacing-sm) var(--spacing-lg)',
                borderRadius: 'var(--border-radius-md)',
                fontSize: 'var(--font-size-base)',
                fontWeight: '500',
                border: 'none',
                cursor: currentQuestion === 0 ? 'not-allowed' : 'pointer',
                background: currentQuestion === 0 ? 'var(--color-surface)' : 'var(--color-surface-hover)',
                color: currentQuestion === 0 ? 'var(--color-text-disabled)' : 'var(--color-text-secondary)',
                transition: 'all var(--transition-normal)',
                opacity: currentQuestion === 0 ? 0.5 : 1
              }}
              onMouseOver={(e) => {
                if (currentQuestion > 0) {
                  e.currentTarget.style.background = 'var(--color-brand-primary)';
                  e.currentTarget.style.color = 'white';
                }
              }}
              onMouseOut={(e) => {
                if (currentQuestion > 0) {
                  e.currentTarget.style.background = 'var(--color-surface-hover)';
                  e.currentTarget.style.color = 'var(--color-text-secondary)';
                }
              }}
            >
              Previous
            </button>
            
            <span style={{ 
              fontSize: 'var(--font-size-sm)', 
              color: 'var(--color-text-muted)',
              fontStyle: 'italic'
            }}>
              {isLastQuestion ? 'Last Question' : 'Select an answer to continue'}
            </span>
          </div>
        </ModernCard>
        </AnimatedTransition>
      </div>
    </div>
    </AssessmentErrorBoundary>
  );
}