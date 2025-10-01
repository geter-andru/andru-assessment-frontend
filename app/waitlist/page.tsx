'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';

interface AssessmentData {
  email: string;
  productName: string;
  score: number;
  challenges: number;
  riskLevel: string;
  focusArea: string;
  revenueOpportunity: string;
  businessModel: string;
  customerCount: string;
  qualified: boolean;
  sessionId: string;
}

function WaitlistPageContent() {
  const [assessmentData, setAssessmentData] = useState<AssessmentData>({
    email: '',
    productName: '',
    score: 0,
    challenges: 0,
    riskLevel: '',
    focusArea: '',
    revenueOpportunity: '',
    businessModel: '',
    customerCount: '',
    qualified: false,
    sessionId: Date.now().toString()
  });
  const [spotsRemaining, setSpotsRemaining] = useState(7);
  const [canReturnToResults, setCanReturnToResults] = useState(false);
  
  const searchParams = useSearchParams();
  
  useEffect(() => {
    // Check if user has session storage from assessment results
    const storedResults = sessionStorage.getItem('assessmentResults');
    if (storedResults) {
      setCanReturnToResults(true);
    }
    
    // Process assessment data from URL params
    const urlData = {
      email: searchParams.get('email') || '',
      productName: searchParams.get('productName') || searchParams.get('company') || '',
      score: parseInt(searchParams.get('score') || '0'),
      challenges: parseInt(searchParams.get('challenges') || '0'),
      riskLevel: searchParams.get('riskLevel') || '',
      focusArea: searchParams.get('focusArea') || '',
      revenueOpportunity: searchParams.get('revenueOpportunity') || '',
      businessModel: searchParams.get('businessModel') || '',
      customerCount: searchParams.get('customerCount') || '',
      qualified: searchParams.get('qualified') === 'true',
      sessionId: searchParams.get('sessionId') || Date.now().toString()
    };
    
    // Store assessment data
    if (urlData.email || urlData.score > 0) {
      localStorage.setItem('hs_assessment_data', JSON.stringify(urlData));
      setAssessmentData(urlData);
    } else {
      // Try to load from localStorage if no URL params
      const stored = localStorage.getItem('hs_assessment_data');
      if (stored) {
        const parsedData = JSON.parse(stored);
        setAssessmentData(parsedData);
      }
    }
    
    // Calculate spots remaining (43/50 taken = 7 remaining)
    setSpotsRemaining(50 - 43);
  }, [searchParams]);
  
  const getBadgeContent = () => {
    if (assessmentData.score > 0) {
      if (assessmentData.score < 40) {
        return {
          text: `Critical: ${assessmentData.challenges} Gaps Found`,
          className: 'bg-gradient-to-r from-red-500 to-red-600'
        };
      } else if (assessmentData.score < 60) {
        return {
          text: `Warning: ${assessmentData.challenges} Issues`,
          className: 'bg-gradient-to-r from-yellow-500 to-yellow-600'
        };
      } else {
        return {
          text: 'Qualified for Tools',
          className: 'bg-gradient-to-r from-green-500 to-green-600'
        };
      }
    }
    return {
      text: 'Assessment Complete',
      className: 'bg-gradient-to-r from-cyan-500 to-cyan-600'
    };
  };
  
  const getHeadline = () => {
    if (assessmentData.challenges > 0) {
      return `Your Assessment Identified ${assessmentData.challenges} Revenue Gaps`;
    }
    return 'Your Assessment Identified Revenue Gaps';
  };
  
  
  const handlePayment = () => {
    
    // Build Stripe metadata
    const metadata = {
      email: assessmentData.email,
      company: assessmentData.productName,
      score: assessmentData.score,
      challenges: assessmentData.challenges,
      focusArea: assessmentData.focusArea,
      revenueOpportunity: assessmentData.revenueOpportunity,
      sessionId: assessmentData.sessionId,
      timestamp: new Date().toISOString()
    };
    
    // Store for recovery
    localStorage.setItem('hs_payment_pending', JSON.stringify(metadata));
    
    // Professional loading sequence
    setTimeout(() => {
      const checkoutUrl = 'https://buy.stripe.com/6oU9AVgJn4y78iqdU6bsc0n';
      const emailParam = metadata.email ? `?prefilled_email=${encodeURIComponent(metadata.email)}` : '';
      window.location.href = checkoutUrl + emailParam;
    }, 1200);
  };
  
  const badge = getBadgeContent();
  
  return (
    <div className="min-h-screen bg-black text-gray-200">
      {/* Enhanced Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-black to-gray-900 border-b border-gray-800">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent" />
        
        <div className="relative z-10 max-w-4xl mx-auto px-6 py-20 text-center">
          {/* Assessment Badge */}
          <div className={`inline-flex items-center ${badge.className} text-black px-6 py-3 rounded-full text-sm font-medium mb-8 shadow-lg`}>
            <span className="mr-2">⚡</span>
            {badge.text}
          </div>
          
          {/* Return to Results Button */}
          {canReturnToResults && (
            <div className="mb-6">
              <button
                onClick={() => {
                  const storedResults = sessionStorage.getItem('assessmentResults');
                  if (storedResults) {
                    // Navigate back to assessment with results
                    window.history.back();
                  }
                }}
                className="bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white px-6 py-2 rounded-lg transition-colors text-sm border border-gray-600"
              >
                ← Return to Assessment Results
              </button>
            </div>
          )}
          
          {/* Hero Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-light mb-6 text-white leading-tight tracking-tight">
            {getHeadline()}
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-400 mb-10 font-light max-w-2xl mx-auto">
            Get the tools to fix them. Today.
          </p>
          
          {/* Founder Note */}
          <div className="bg-gray-800/80 border border-gray-700 rounded-xl p-6 mb-12 max-w-2xl mx-auto backdrop-blur-sm">
            <p className="text-gray-300 italic leading-relaxed">
              <strong className="text-cyan-400 not-italic">For Series A technical founders:</strong> Before AI agents or sales acceleration tools can help, you need foundational buyer intelligence that makes acceleration meaningful rather than just faster bad decisions.
            </p>
          </div>
          
          {/* Assessment Results Display */}
          <div className="flex justify-center gap-6 mb-12 flex-wrap">
            <div className="bg-gradient-to-b from-gray-800 to-gray-900 p-6 rounded-2xl border border-gray-700 min-w-32 hover:transform hover:-translate-y-1 transition-all duration-300 hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/20">
              <div className="text-3xl md:text-4xl font-light text-cyan-400 font-mono tracking-tight">
                {assessmentData.score || '--'}
              </div>
              <div className="text-xs text-gray-500 uppercase tracking-wide mt-2">Score</div>
            </div>
            
            <div className="bg-gradient-to-b from-gray-800 to-gray-900 p-6 rounded-2xl border border-gray-700 min-w-32 hover:transform hover:-translate-y-1 transition-all duration-300 hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/20">
              <div className="text-3xl md:text-4xl font-light text-cyan-400 font-mono tracking-tight">
                {assessmentData.challenges || '--'}
              </div>
              <div className="text-xs text-gray-500 uppercase tracking-wide mt-2">Challenges</div>
            </div>
            
            <div className="bg-gradient-to-b from-gray-800 to-gray-900 p-6 rounded-2xl border border-gray-700 min-w-32 hover:transform hover:-translate-y-1 transition-all duration-300 hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/20">
              <div className="text-3xl md:text-4xl font-light text-cyan-400 font-mono tracking-tight">
                {assessmentData.revenueOpportunity || '--'}
              </div>
              <div className="text-xs text-gray-500 uppercase tracking-wide mt-2">Opportunity</div>
            </div>
          </div>
          
          {/* Main CTA */}
          <button
            onClick={handlePayment}
            className="bg-gradient-to-r from-cyan-500 to-cyan-600 text-black px-12 py-6 rounded-xl text-lg font-medium hover:from-cyan-600 hover:to-cyan-700 transition-all duration-300 hover:transform hover:-translate-y-1 shadow-lg hover:shadow-cyan-500/25 relative overflow-hidden group"
          >
            <span className="relative z-10">Get Your 3 Tools Now - $497</span>
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-500" />
          </button>
        </div>
      </section>
      
      {/* Enhanced Three Tools Section */}
      <section className="relative bg-gradient-to-b from-gray-900 to-black border-b border-gray-800">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-500/5 to-transparent" />
        
        <div className="relative z-10 max-w-6xl mx-auto px-6 py-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-light mb-6 text-white leading-tight">
              Your 3 Personalized Revenue Tools
            </h2>
            <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto mb-8 leading-relaxed">
              Transform technical capabilities into enterprise value propositions that convert prospects into strategic partnerships
            </p>
            
            <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6 max-w-3xl mx-auto">
              <p className="text-gray-300">
                The <strong className="text-green-400">essential prerequisite</strong> that creates the &quot;good customer data&quot; your future sales acceleration tools will need
              </p>
            </div>
          </div>
          
          {/* Tools Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {/* Tool 1: Discovery Frameworks */}
            <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700 relative overflow-hidden hover:transform hover:-translate-y-2 transition-all duration-300 hover:border-cyan-500/50 hover:shadow-xl hover:shadow-cyan-500/10 group">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative z-10">
                <div className="flex items-center mb-6">
                  <div className="bg-gradient-to-r from-cyan-500 to-cyan-600 text-black w-12 h-12 rounded-xl flex items-center justify-center font-medium text-lg mr-4 shadow-lg">
                    1
                  </div>
                  <h3 className="text-xl font-medium text-white">Discovery Frameworks</h3>
                </div>
                
                <p className="text-gray-400 mb-6 leading-relaxed">
                  Transform technical conversations into strategic business discussions
                </p>
                
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start">
                    <span className="text-green-400 mr-3 mt-1 flex-shrink-0">✓</span>
                    <span>Executive discovery scripts tailored to your product</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-3 mt-1 flex-shrink-0">✓</span>
                    <span>Technical buyer → business buyer translation guides</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-3 mt-1 flex-shrink-0">✓</span>
                    <span>Feature → value mapping for enterprise conversations</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-3 mt-1 flex-shrink-0">✓</span>
                    <span>Competitive differentiation frameworks</span>
                  </li>
                </ul>
              </div>
            </div>
            
            {/* Tool 2: ROI Calculator */}
            <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700 relative overflow-hidden hover:transform hover:-translate-y-2 transition-all duration-300 hover:border-cyan-500/50 hover:shadow-xl hover:shadow-cyan-500/10 group">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative z-10">
                <div className="flex items-center mb-6">
                  <div className="bg-gradient-to-r from-cyan-500 to-cyan-600 text-black w-12 h-12 rounded-xl flex items-center justify-center font-medium text-lg mr-4 shadow-lg">
                    2
                  </div>
                  <h3 className="text-xl font-medium text-white">ROI Calculator</h3>
                </div>
                
                <p className="text-gray-400 mb-6 leading-relaxed">
                  Quantify business impact with enterprise-grade financial modeling
                </p>
                
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start">
                    <span className="text-green-400 mr-3 mt-1 flex-shrink-0">✓</span>
                    <span>Your pricing & value props pre-configured</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-3 mt-1 flex-shrink-0">✓</span>
                    <span>Industry benchmarks and cost models included</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-3 mt-1 flex-shrink-0">✓</span>
                    <span>Live demo ready (Excel + web versions)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-3 mt-1 flex-shrink-0">✓</span>
                    <span>C-suite presentation templates included</span>
                  </li>
                </ul>
              </div>
            </div>
            
            {/* Tool 3: Pilot-to-Contract System */}
            <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700 relative overflow-hidden hover:transform hover:-translate-y-2 transition-all duration-300 hover:border-cyan-500/50 hover:shadow-xl hover:shadow-cyan-500/10 group">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative z-10">
                <div className="flex items-center mb-6">
                  <div className="bg-gradient-to-r from-cyan-500 to-cyan-600 text-black w-12 h-12 rounded-xl flex items-center justify-center font-medium text-lg mr-4 shadow-lg">
                    3
                  </div>
                  <h3 className="text-xl font-medium text-white">Pilot-to-Contract System</h3>
                </div>
                
                <p className="text-gray-400 mb-6 leading-relaxed">
                  Convert &quot;paid pilots&quot; into strategic enterprise partnerships
                </p>
                
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start">
                    <span className="text-green-400 mr-3 mt-1 flex-shrink-0">✓</span>
                    <span>Pilot success measurement frameworks</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-3 mt-1 flex-shrink-0">✓</span>
                    <span>Scaling justification & expansion tools</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-3 mt-1 flex-shrink-0">✓</span>
                    <span>Executive presentation deck templates</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-3 mt-1 flex-shrink-0">✓</span>
                    <span>Contract negotiation value anchors</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Enhanced Guarantee Section */}
      <section className="relative bg-black">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/8 to-transparent" />
        
        <div className="relative z-10 max-w-4xl mx-auto px-6 py-20 text-center">
          {/* Guarantee Badge */}
          <div className="inline-flex items-center bg-gradient-to-r from-gray-800 to-gray-900 border-2 border-green-500 rounded-2xl px-8 py-4 mb-8 shadow-lg shadow-green-500/20">
            <span className="mr-2">🛡️</span>
            <span className="text-green-400 font-semibold text-lg">30-Day Money-Back Guarantee</span>
          </div>
          
          {/* Founding Member Section */}
          <div className="bg-gray-800/60 border border-gray-700 rounded-2xl p-8 mb-8 max-w-lg mx-auto backdrop-blur-sm">
            <p className="text-3xl text-red-400 font-bold mb-4 font-mono">
              {spotsRemaining} founding spots remaining
            </p>
            <p className="text-green-400 font-medium">
              Founding members: 50% off all future features
            </p>
          </div>
          
          {/* Final CTA */}
          <button
            onClick={handlePayment}
            className="bg-gradient-to-r from-cyan-500 to-cyan-600 text-black px-12 py-6 rounded-xl text-lg font-medium hover:from-cyan-600 hover:to-cyan-700 transition-all duration-300 hover:transform hover:-translate-y-1 shadow-lg hover:shadow-cyan-500/25 relative overflow-hidden group mb-12"
          >
            <span className="relative z-10">Get Your Tools - $497</span>
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-500" />
          </button>
          
          {/* Enterprise Trust */}
          <div className="pt-8 border-t border-gray-800">
            <p className="text-gray-500 text-sm uppercase tracking-wide mb-4 font-medium">
              Trusted by Series A Technical Founders
            </p>
            <div className="flex justify-center gap-8 flex-wrap">
              <div className="flex items-center text-gray-400 text-sm">
                <span className="mr-2">🔒</span>
                Secure Checkout
              </div>
              <div className="flex items-center text-gray-400 text-sm">
                <span className="mr-2">🔒</span>
                Instant Access
              </div>
              <div className="flex items-center text-gray-400 text-sm">
                <span className="mr-2">🔒</span>
                30-Day Guarantee
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function WaitlistPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="animate-pulse text-gray-400 text-lg">
            Loading your personalized waitlist experience...
          </div>
        </motion.div>
      </div>
    }>
      <WaitlistPageContent />
    </Suspense>
  );
}