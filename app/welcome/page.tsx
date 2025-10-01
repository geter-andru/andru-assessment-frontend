'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { getWelcomeData } from '../lib/api';

interface WelcomeData {
  sessionId: string;
  company: string;
  qualification: string;
  overallScore: number;
  topChallenge: string;
  icpContent: any;
  tbpContent: any;
  accessToken: string;
}

function WelcomePageContent() {
  const [welcomeData, setWelcomeData] = useState<WelcomeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    const loadWelcomeData = async () => {
      try {
        // Get session ID from URL or sessionStorage
        const sessionId = searchParams.get('sessionId') || sessionStorage.getItem('assessmentSessionId');
        
        if (!sessionId) {
          console.error('No session ID found for welcome page');
          setLoading(false);
          return;
        }

        // Fetch complete assessment + customer data
        const data = await getWelcomeData(sessionId);
        setWelcomeData(data);
        
      } catch (error) {
        console.error('Welcome data loading error:', error);
      } finally {
        setLoading(false);
      }
    };

    loadWelcomeData();
  }, [searchParams]);

  const handleAccessPlatform = async () => {
    if (welcomeData?.sessionId) {
      setSyncing(true);
      try {
        // Import AssessmentServiceLite for data sync
        const assessmentServiceLite = (await import('../../services/assessmentServiceLite')).default;
        
        // Sync assessment data to modern-platform
        const syncResult = await assessmentServiceLite.syncToModernPlatform(
          welcomeData.sessionId, 
          welcomeData.sessionId // Using sessionId as userId for now
        );
        
        if (syncResult.success && syncResult.redirectUrl) {
          // Redirect to platform using our new redirect system
          window.location.href = syncResult.redirectUrl;
        } else {
          // Fallback to direct redirect if sync fails
          console.warn('Sync failed, using fallback redirect:', syncResult.error);
          window.location.href = `/redirect?sessionId=${welcomeData.sessionId}&userId=${welcomeData.sessionId}`;
        }
      } catch (error) {
        console.error('Error syncing to platform:', error);
        // Fallback to direct redirect
        window.location.href = `/redirect?sessionId=${welcomeData.sessionId}&userId=${welcomeData.sessionId}`;
      } finally {
        setSyncing(false);
      }
    } else {
      alert('Session not found. Please contact support.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="animate-pulse text-gray-400 text-lg">
            Preparing your personalized revenue intelligence...
          </div>
        </motion.div>
      </div>
    );
  }

  if (!welcomeData) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl text-red-400 mb-4">Welcome Data Not Found</h1>
          <p className="text-gray-400 mb-6">Your assessment session may have expired.</p>
          <button 
            onClick={() => window.location.href = '/'}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
          >
            Start New Assessment
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-gray-200">
      {/* Header Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-black to-gray-900 border-b border-gray-800">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent" />
        
        <div className="relative z-10 max-w-4xl mx-auto px-6 py-20 text-center">
          {/* Achievement Badge */}
          <motion.div 
            className={`inline-flex items-center px-6 py-3 rounded-full text-sm font-medium mb-8 shadow-lg ${
              welcomeData.qualification === 'Qualified' ? 'bg-gradient-to-r from-green-500 to-green-600 text-black' :
              welcomeData.qualification === 'Promising' ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white' :
              'bg-gradient-to-r from-yellow-500 to-yellow-600 text-black'
            }`}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <span className="mr-2">🎯</span>
            Assessment Complete - {welcomeData.qualification} Level
          </motion.div>
          
          {/* Welcome Headline */}
          <motion.h1 
            className="text-4xl md:text-5xl lg:text-6xl font-light mb-6 text-white leading-tight tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Welcome, {welcomeData.company ? `${welcomeData.company} Leader` : 'Strategic Leader'}
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl text-gray-400 mb-10 font-light max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            Your personalized revenue intelligence tools are ready
          </motion.p>
        </div>
      </section>

      {/* Current State → Promised Land */}
      <section className="relative bg-gradient-to-b from-gray-900 to-black">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/5 to-transparent" />
        
        <div className="relative z-10 max-w-6xl mx-auto px-6 py-20">
          <motion.div 
            className="grid md:grid-cols-2 gap-12 items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            {/* Current State */}
            <div className="text-center">
              <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-red-400">Current State</h2>
              <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-6 mb-4">
                <p className="text-gray-300 text-lg leading-relaxed">
                  <strong className="text-red-400">Challenge:</strong> {welcomeData.topChallenge}
                </p>
                <div className="mt-4 text-sm text-gray-400">
                  Score: {welcomeData.overallScore}% Revenue Readiness
                </div>
              </div>
              
              {welcomeData.icpContent && (
                <div className="bg-gray-800/50 rounded-lg p-4 text-left">
                  <h4 className="text-sm font-medium text-gray-400 mb-2">Current Customer Understanding:</h4>
                  <p className="text-gray-300 text-sm">
                    {typeof welcomeData.icpContent === 'string' 
                      ? welcomeData.icpContent.substring(0, 150) + '...'
                      : 'Basic customer profile identified'}
                  </p>
                </div>
              )}
            </div>

            {/* Arrow */}
            <div className="flex justify-center">
              <motion.div
                animate={{ x: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="text-4xl text-cyan-400"
              >
                →
              </motion.div>
            </div>

            {/* Promised Land */}
            <div className="text-center">
              <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-green-400">Promised Land</h2>
              <div className="bg-green-900/20 border border-green-500/30 rounded-xl p-6 mb-4">
                <p className="text-gray-300 text-lg leading-relaxed">
                  <strong className="text-green-400">Solution:</strong> Systematic revenue intelligence with 3 personalized tools
                </p>
                <div className="mt-4 text-sm text-gray-400">
                  Target: 80%+ Revenue Readiness
                </div>
              </div>
              
              {welcomeData.tbpContent && (
                <div className="bg-gray-800/50 rounded-lg p-4 text-left">
                  <h4 className="text-sm font-medium text-gray-400 mb-2">Enhanced Buyer Understanding:</h4>
                  <p className="text-gray-300 text-sm">
                    {typeof welcomeData.tbpContent === 'string' 
                      ? welcomeData.tbpContent.substring(0, 150) + '...'
                      : 'Comprehensive buyer persona framework ready'}
                  </p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Platform Access CTA */}
          <motion.div 
            className="text-center mt-16"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.2 }}
          >
            <button
              onClick={handleAccessPlatform}
              disabled={syncing}
              className="bg-gradient-to-r from-cyan-500 to-cyan-600 text-black px-12 py-6 rounded-xl text-lg font-medium hover:from-cyan-600 hover:to-cyan-700 transition-all duration-300 hover:transform hover:-translate-y-1 shadow-lg hover:shadow-cyan-500/25 relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none"
            >
              <span className="relative z-10">
                {syncing ? 'Syncing to Platform...' : 'Access Your Revenue Intelligence Platform'}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-500" />
            </button>
            
            <p className="text-gray-400 text-sm mt-4">
              Your tools: ICP Analysis • Cost Calculator • Business Case Builder
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

export default function WelcomePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="animate-pulse text-gray-400 text-lg">
            Loading your personalized revenue intelligence...
          </div>
        </motion.div>
      </div>
    }>
      <WelcomePageContent />
    </Suspense>
  );
}