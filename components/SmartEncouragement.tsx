'use client';

// ESSENTIAL PHASE: Context-aware encouragement messages

import { useEffect, useState, useCallback } from 'react';

interface SmartEncouragementProps {
  currentScore: number;
  answeredQuestions: number;
  totalQuestions: number;
  timeSpent: number; // seconds
}

const encouragementMessages = {
  high_performer: [
    "🚀 Excellent! You're showing strong revenue readiness.",
    "⭐ Outstanding answers! You're ahead of most technical founders.",
    "🎯 Great job! Your understanding is clearly above average.",
    "💪 Impressive! You're demonstrating real sales maturity.",
  ],
  steady_progress: [
    "✨ Good progress! You're building a solid foundation.",
    "👍 Nice work! Keep this momentum going.",
    "📈 You're on track! Each answer strengthens your profile.",
    "🔥 Steady progress! You're doing better than you think.",
  ],
  needs_support: [
    "💡 Every founder starts somewhere - you're taking the right steps.",
    "🌱 Great that you're assessing! This awareness is valuable.",
    "🎯 Honest self-assessment is the first step to improvement.",
    "🚀 You're building the foundation for revenue success.",
  ],
  milestone_25: [
    "🎉 25% complete! You're off to a strong start.",
    "⚡ Quarter way there! Your score is taking shape.",
  ],
  milestone_50: [
    "🔥 Halfway there! You're showing real commitment.",
    "🎯 50% complete! The finish line is in sight.",
  ],
  milestone_75: [
    "💪 Almost there! Just a few more questions.",
    "🚀 75% done! You're crushing this assessment.",
  ],
  quick_responder: [
    "⚡ Decisive! Quick responses show confidence.",
    "🎯 Fast and focused - great founder trait!",
  ],
  thoughtful: [
    "🤔 Taking time to think - quality over speed!",
    "💭 Thoughtful responses lead to better insights.",
  ]
};

export default function SmartEncouragement({
  currentScore,
  answeredQuestions,
  totalQuestions,
  timeSpent
}: SmartEncouragementProps) {
  const [message, setMessage] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  
  const progress = (answeredQuestions / totalQuestions) * 100;
  const avgTimePerQuestion = timeSpent / answeredQuestions;
  
  const getEncouragementType = useCallback(() => {
    // Milestone messages take priority
    if (progress === 25) return 'milestone_25';
    if (progress === 50) return 'milestone_50';
    if (progress === 75) return 'milestone_75';
    
    // Response speed assessment
    if (avgTimePerQuestion < 10 && answeredQuestions > 3) return 'quick_responder';
    if (avgTimePerQuestion > 30 && answeredQuestions > 3) return 'thoughtful';
    
    // Performance-based encouragement
    if (currentScore >= 75) return 'high_performer';
    if (currentScore >= 50) return 'steady_progress';
    if (currentScore < 50) return 'needs_support';
    
    return 'steady_progress';
  }, [progress, avgTimePerQuestion, answeredQuestions, currentScore]);
  
  const getRandomMessage = (type: keyof typeof encouragementMessages) => {
    const messages = encouragementMessages[type];
    return messages[Math.floor(Math.random() * messages.length)];
  };
  
  useEffect(() => {
    if (answeredQuestions === 0) return;
    
    // Show encouragement every 3 questions or at milestones
    const shouldShow = answeredQuestions % 3 === 0 || 
                     progress === 25 || 
                     progress === 50 || 
                     progress === 75;
    
    if (shouldShow) {
      const encouragementType = getEncouragementType();
      const newMessage = getRandomMessage(encouragementType);
      
      setMessage(newMessage);
      setIsVisible(true);
      
      // Hide after 4 seconds
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 4000);
      
      return () => clearTimeout(timer);
    }
  }, [answeredQuestions, currentScore, progress, getEncouragementType]);
  
  if (!message || !isVisible) return null;
  
  return (
    <div className={`fixed top-4 right-4 max-w-sm transition-all duration-500 z-50 ${
      isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
    }`}>
      <div className="bg-gradient-to-r from-blue-500 to-green-500 text-white p-4 rounded-lg shadow-lg">
        <div className="text-sm font-medium">
          {message}
        </div>
        <div className="text-xs opacity-80 mt-1">
          Question {answeredQuestions} of {totalQuestions}
        </div>
      </div>
    </div>
  );
}