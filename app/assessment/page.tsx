'use client';

// ESSENTIAL PHASE: Enhanced assessment with real-time features

import { useState } from 'react';
import { assessmentQuestions, calculateScore } from '@/lib/assessment-questions';
import { detectIndustry } from '@/lib/industry-data';
import SmartInsights from '@/components/SmartInsights';
import UserInfoForm from '@/components/UserInfoForm';
import ProductInputForm from '@/components/ProductInputForm';
import { submitAssessment, generateBatch1Insight, generateBatch2Insight, generateBatch3Insight, type AssessmentInsight } from '@/lib/api';
import AnswerExplanation from '@/components/AnswerExplanation';
import AnimatedTransition from '@/components/AnimatedTransition';
import EnvironmentalBackground from '@/components/EnvironmentalBackground';
import AssessmentResults from '@/components/AssessmentResults';
import ModernCard from '@/components/ui/ModernCard';
import { AssessmentErrorBoundary } from '@/components/ErrorBoundary';
import { trackEvent, trackAIInsight, trackConversion, getSessionId } from '@/lib/analytics';

interface UserInfo {
  name: string;
  email: string;
  company: string;
  role?: string;
}

interface ProductInfo {
  businessModel: string;
  productDescription: string;
}

interface GeneratedContent {
  icpGenerated?: string;
  tbpGenerated?: string;
  buyerGap?: number;
}

export default function AssessmentPage() {
  const [showProductInput, setShowProductInput] = useState(true); // Start with simplified product input
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
  const [aiInsights, setAiInsights] = useState<AssessmentInsight[]>([]);
  const [isGeneratingInsight, setIsGeneratingInsight] = useState(false);
  
  const question = assessmentQuestions[currentQuestion];
  const isLastQuestion = currentQuestion === assessmentQuestions.length - 1;
  const answeredQuestions = Object.keys(responses).length;
  
  
  // Calculate real-time scores
  const currentResults = calculateScore(responses);
  
  // Detect industry for personalization
  const industryData = detectIndustry(userInfo);

  // Helper function to get batch responses for AI insight generation
  const getBatchResponses = (batchNumber: 1 | 2 | 3, currentResponses: Record<string, number>) => {
    const questions = assessmentQuestions;
    let start: number, end: number;

    if (batchNumber === 1) {
      start = 0; end = 4;  // Questions 1-4
    } else if (batchNumber === 2) {
      start = 4; end = 9;  // Questions 5-9
    } else {
      start = 9; end = 14; // Questions 10-14
    }

    return questions.slice(start, end).map(q => ({
      questionId: q.id,
      questionText: q.text,
      response: currentResponses[q.id] || 0
    }));
  };

  // Generate real-time AI insight for a batch
  const generateRealtimeInsight = async (batchNumber: 1 | 2 | 3) => {
    if (!sessionId || !productInfo) {
      console.log('⏭️  Skipping insight generation: missing sessionId or productInfo');
      return;
    }

    setIsGeneratingInsight(true);
    console.log(`🤖 Generating batch ${batchNumber} insight...`);

    try {
      // Get responses for current batch
      const batchResponses = getBatchResponses(batchNumber, responses);

      // Prepare request data with simplified product info
      const requestData = {
        sessionId,
        responses: batchResponses,
        userInfo: {
          company: userInfo?.company || 'B2B Company',
          productName: productInfo.productDescription.split('.')[0].substring(0, 50) || 'Product', // Use first sentence as product name
          businessModel: productInfo.businessModel
        },
        previousInsights: aiInsights
      };

      // Call appropriate batch endpoint
      let result;
      if (batchNumber === 1) {
        result = await generateBatch1Insight(requestData);
      } else if (batchNumber === 2) {
        result = await generateBatch2Insight(requestData);
      } else {
        result = await generateBatch3Insight(requestData);
      }

      console.log(`✅ Batch ${batchNumber} insight generated:`, {
        challenge: result.insight.challengeIdentified,
        confidence: result.insight.confidence,
        processingTime: result.metadata.processingTime
      });

      // Add to insights array
      setAiInsights([...aiInsights, result.insight]);

      // Track successful AI insight generation
      const analyticsSessionId = getSessionId();
      trackAIInsight(true, batchNumber, analyticsSessionId, {
        insightChallenge: result.insight.challengeIdentified,
        insightConfidence: result.insight.confidence,
        processingTime: result.metadata.processingTime
      });

      // Track insight displayed
      trackEvent('ai_insight_displayed', {
        sessionId: analyticsSessionId,
        batchNumber,
        insightChallenge: result.insight.challengeIdentified,
        insightConfidence: result.insight.confidence
      });

    } catch (error) {
      console.error(`❌ Failed to generate batch ${batchNumber} insight:`, error);

      // Track AI insight failure
      const analyticsSessionId = getSessionId();
      trackAIInsight(false, batchNumber, analyticsSessionId, {
        errorMessage: error instanceof Error ? error.message : 'Unknown error'
      });

      // Don't block assessment on insight failure - user can continue
    } finally {
      setIsGeneratingInsight(false);
    }
  };

  const handleResponse = (value: number) => {
    // Track time spent on this question
    const timeOnQuestion = Date.now() - questionStartTime;
    const newTimings = { ...questionTimings, [question.id]: timeOnQuestion };
    setQuestionTimings(newTimings);

    const newResponses = { ...responses, [question.id]: value };
    setResponses(newResponses);

    const analyticsSessionId = getSessionId();
    const questionNumber = currentQuestion + 1;
    const progress = Math.round((questionNumber / assessmentQuestions.length) * 100);

    // Track question answered
    trackEvent('question_answered', {
      sessionId: analyticsSessionId,
      questionNumber,
      questionId: question.id,
      questionText: question.text,
      responseValue: value,
      responseTime: timeOnQuestion,
      totalQuestions: assessmentQuestions.length,
      progress
    });

    // Trigger AI insights at batch boundaries
    // Note: currentQuestion is 0-indexed, so question 4 is index 3
    if (questionNumber === 4) {
      // 25% complete - Batch 1 (questions 1-4)
      console.log('📊 Batch 1 complete - triggering AI insight generation');
      trackEvent('ai_insight_requested', {
        sessionId: analyticsSessionId,
        batchNumber: 1,
        progress: 28
      });
      generateRealtimeInsight(1);
    } else if (questionNumber === 9) {
      // ~64% complete - Batch 2 (questions 5-9)
      console.log('📊 Batch 2 complete - triggering AI insight generation');
      trackEvent('ai_insight_requested', {
        sessionId: analyticsSessionId,
        batchNumber: 2,
        progress: 64
      });
      generateRealtimeInsight(2);
    } else if (questionNumber === 14) {
      // 100% complete - Batch 3 (questions 10-14)
      console.log('📊 Batch 3 complete - triggering AI insight generation');
      trackEvent('ai_insight_requested', {
        sessionId: analyticsSessionId,
        batchNumber: 3,
        progress: 100
      });
      generateRealtimeInsight(3);

      // Track assessment completion
      trackConversion('assessment_completed', analyticsSessionId, {
        totalQuestions: assessmentQuestions.length,
        overallScore: calculateScore(newResponses).overallScore
      });
    }

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
    const analyticsSessionId = getSessionId();
    if (existingSessionId) {
      setSessionId(existingSessionId);
    } else {
      // Fallback if no session ID (shouldn't happen)
      const newSessionId = `assess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      setSessionId(newSessionId);
    }
    setAssessmentStartTime(Date.now());

    // Track assessment start
    trackEvent('assessment_started', {
      sessionId: analyticsSessionId,
      totalQuestions: assessmentQuestions.length,
      timestamp: new Date().toISOString(),
      businessModel: info.businessModel
    });

    console.log('✅ Assessment started with simplified product info');
    console.log('📝 Product Info:', {
      businessModel: info.businessModel,
      productDescription: info.productDescription.substring(0, 100) + '...'
    });
  };

  const handleUserInfoSubmit = (info: UserInfo) => {
    setUserInfo(info);
    setShowUserForm(false);
    setShowComprehensiveResults(true);

    // Track user info submission
    const analyticsSessionId = getSessionId();
    trackConversion('user_info_submitted', analyticsSessionId, {
      hasEmail: !!info.email,
      hasName: !!info.name,
      hasCompany: !!info.company
    });
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
        aiInsights={aiInsights}
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
                    sessionId,
                    responses,
                    results,
                    timestamp: new Date().toISOString(),
                    userInfo: userInfo || undefined,
                    productInfo: productInfo || undefined,
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
      resetKeys={[currentQuestion, showProductInput.toString(), showUserForm.toString()]}
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
      
      {/* Smart insights overlay - shows at 25%, 50%, and 75% with real AI insights */}
      <SmartInsights
        currentResults={currentResults}
        answeredQuestions={answeredQuestions}
        totalQuestions={assessmentQuestions.length}
        questionTimings={questionTimings}
        generatedContent={generatedContent}
        aiInsights={aiInsights}
        isGeneratingInsight={isGeneratingInsight}
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