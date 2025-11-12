'use client';

// POLISH PHASE: Enterprise-grade real-time score visualization with Framer Motion

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

interface ScoreAnimationProps {
  buyerScore: number;
  techScore: number;
  overallScore: number;
  totalQuestions: number;
  answeredQuestions: number;
  questionTimings?: Record<string, number>;
}

export default function ScoreAnimation({ 
  buyerScore, 
  techScore, 
  overallScore, 
  totalQuestions, 
  answeredQuestions,
  questionTimings = {}
}: ScoreAnimationProps) {
  const [hasScoreChanged, setHasScoreChanged] = useState(false);
  const [previousOverallScore, setPreviousOverallScore] = useState(0);
  
  const progress = (answeredQuestions / totalQuestions) * 100;
  
  // Detect score changes for celebration animations
  useEffect(() => {
    if (overallScore !== previousOverallScore && overallScore > 0) {
      setHasScoreChanged(true);
      setPreviousOverallScore(overallScore);
      
      // Reset animation flag after animation completes
      setTimeout(() => setHasScoreChanged(false), 1000);
    }
  }, [overallScore, previousOverallScore]);
  
  // Animation variants for professional micro-interactions
  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.4, 0, 0.2, 1] as any,
        staggerChildren: 0.1
      }
    }
  };

  const scoreVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] as any }
    },
    pulse: {
      scale: [1, 1.05, 1],
      transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] as any }
    }
  };

  const milestoneVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] as any }
    }
  };
  
  // Professional color scheme based on performance
  const getScoreColor = (score: number) => {
    if (score >= 80) return { primary: '#10b981', secondary: '#065f46' }; // Green
    if (score >= 60) return { primary: '#3b82f6', secondary: '#1e3a8a' }; // Blue
    if (score >= 40) return { primary: '#f59e0b', secondary: '#92400e' }; // Amber
    return { primary: '#ef4444', secondary: '#991b1b' }; // Red
  };
  
  const overallColors = getScoreColor(overallScore);
  const buyerColors = getScoreColor(buyerScore);
  const techColors = getScoreColor(techScore);
  
  return (
    <motion.div 
      className="bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-gray-700 p-8 mb-8 backdrop-blur-sm shadow-2xl"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ 
        scale: 1.02, 
        borderColor: overallColors.primary,
        boxShadow: `0 20px 60px ${overallColors.primary}15`,
        transition: { duration: 0.3 }
      }}
    >
      <motion.div className="text-center mb-8" variants={milestoneVariants}>
        <h3 className="text-2xl font-semibold text-white mb-2">
          Revenue Readiness Intelligence
        </h3>
        <p className="text-gray-400">
          Real-time analysis • {answeredQuestions}/{totalQuestions} complete
        </p>
      </motion.div>
      
      {/* Enhanced Overall Score with Framer Motion */}
      <div className="flex justify-center mb-10">
        <motion.div 
          className="relative w-40 h-40"
          variants={scoreVariants}
          animate={hasScoreChanged ? "pulse" : "visible"}
        >
          <CircularProgressbar
            value={overallScore}
            text={`${overallScore}%`}
            styles={buildStyles({
              textSize: '16px',
              pathColor: overallColors.primary,
              textColor: '#ffffff',
              trailColor: '#374151',
              backgroundColor: 'transparent',
              pathTransitionDuration: 0.8,
            })}
          />
          
          {/* Celebration animation for milestones */}
          <AnimatePresence>
            {hasScoreChanged && overallScore % 10 === 0 && overallScore > 0 && (
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-current opacity-75"
                style={{ color: overallColors.primary }}
                initial={{ scale: 1, opacity: 0.8 }}
                animate={{ scale: 1.5, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            )}
          </AnimatePresence>
          
          <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2">
            <span className="text-xs text-gray-500 font-medium tracking-wide uppercase">
              Overall Readiness
            </span>
          </div>
        </motion.div>
      </div>
      
      {/* Enhanced Category Scores Grid */}
      <motion.div 
        className="grid grid-cols-2 gap-8"
        variants={cardVariants}
      >
        {/* Buyer Understanding */}
        <motion.div 
          className="text-center group"
          variants={scoreVariants}
          whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
        >
          <div className="relative w-24 h-24 mx-auto mb-4">
            <CircularProgressbar
              value={buyerScore}
              text={`${buyerScore}%`}
              styles={buildStyles({
                textSize: '20px',
                pathColor: buyerColors.primary,
                textColor: '#ffffff',
                trailColor: '#374151',
                backgroundColor: 'transparent',
                pathTransitionDuration: 0.6,
              })}
            />
          </div>
          <div className="text-sm font-medium text-gray-300 mb-1">
            Customer Intelligence
          </div>
          <div className="text-xs text-gray-500">
            Understanding buyer needs & motivations
          </div>
          
          {/* Performance indicator */}
          <motion.div 
            className="mt-2 h-1 bg-gray-800 rounded-full overflow-hidden"
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: buyerColors.primary }}
              initial={{ width: '0%' }}
              animate={{ width: `${buyerScore}%` }}
              transition={{ duration: 0.8, delay: 0.5, ease: [0.4, 0, 0.2, 1] }}
            />
          </motion.div>
        </motion.div>
        
        {/* Tech Translation */}
        <motion.div 
          className="text-center group"
          variants={scoreVariants}
          whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
        >
          <div className="relative w-24 h-24 mx-auto mb-4">
            <CircularProgressbar
              value={techScore}
              text={`${techScore}%`}
              styles={buildStyles({
                textSize: '20px',
                pathColor: techColors.primary,
                textColor: '#ffffff',
                trailColor: '#374151',
                backgroundColor: 'transparent',
                pathTransitionDuration: 0.6,
              })}
            />
          </div>
          <div className="text-sm font-medium text-gray-300 mb-1">
            Value Communication
          </div>
          <div className="text-xs text-gray-500">
            Translating features to business value
          </div>
          
          {/* Performance indicator */}
          <motion.div 
            className="mt-2 h-1 bg-gray-800 rounded-full overflow-hidden"
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: techColors.primary }}
              initial={{ width: '0%' }}
              animate={{ width: `${techScore}%` }}
              transition={{ duration: 0.8, delay: 0.6, ease: [0.4, 0, 0.2, 1] }}
            />
          </motion.div>
        </motion.div>
      </motion.div>
      
      {/* Assessment Progress with Milestone Markers */}
      <motion.div 
        className="mt-8 pt-6 border-t border-gray-700"
        variants={milestoneVariants}
      >
        <div className="flex justify-between text-sm text-gray-400 mb-3">
          <span className="font-medium">Assessment Progress</span>
          <span className="font-mono">{Math.round(progress)}%</span>
        </div>
        
        <div className="relative">
          <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-green-500"
              initial={{ width: '0%' }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
            />
          </div>
          
          {/* Milestone markers */}
          <div className="absolute top-0 w-full h-3 flex justify-between items-center">
            {[25, 50, 75, 100].map((milestone) => (
              <motion.div
                key={milestone}
                className={`w-3 h-3 rounded-full border-2 ${
                  progress >= milestone 
                    ? 'bg-white border-white shadow-lg' 
                    : 'bg-gray-700 border-gray-600'
                }`}
                initial={{ scale: 0 }}
                animate={{ 
                  scale: progress >= milestone ? 1.2 : 1,
                  borderColor: progress >= milestone ? overallColors.primary : '#4b5563'
                }}
                transition={{ 
                  duration: 0.4, 
                  delay: milestone * 0.02,
                  type: "spring",
                  stiffness: 300
                }}
                whileHover={{ scale: 1.4 }}
              />
            ))}
          </div>
        </div>
        
        {/* Milestone labels */}
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span>Start</span>
          <span>Midpoint</span>
          <span>Analysis</span>
          <span>Complete</span>
        </div>
        
        {/* Performance indicators */}
        {answeredQuestions > 0 && (
          <motion.div 
            className="mt-4 grid grid-cols-3 gap-4 text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <div>
              <div className="text-lg font-bold" style={{ color: overallColors.primary }}>
                {Math.round(progress)}%
              </div>
              <div className="text-xs text-gray-500">Complete</div>
            </div>
            <div>
              <div className="text-lg font-bold text-blue-400">
                {answeredQuestions}
              </div>
              <div className="text-xs text-gray-500">Questions</div>
            </div>
            <div>
              <div className="text-lg font-bold text-purple-400">
                {Math.round(Object.values(questionTimings).reduce((sum, time) => sum + time, 0) / 1000 / 60) || 0}m
              </div>
              <div className="text-xs text-gray-500">Time</div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}