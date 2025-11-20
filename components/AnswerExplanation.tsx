'use client';

// NICE-TO-HAVE PHASE: AI-powered answer explanations

import { useState } from 'react';
import { Question } from '@/lib/assessment-questions';
import { IndustryData } from '@/lib/industry-data';

interface AnswerExplanationProps {
  question: Question;
  industryData: IndustryData;
  selectedAnswer?: number;
}

const explanations: Record<string, Record<number, string>> = {
  // Customer Intelligence Questions
  q1: {
    5: "Excellent! Clearly understanding customer pain points is the foundation of effective selling. You can speak their language and address real challenges.",
    4: "Good understanding! You have a solid grasp of customer problems, which gives you credibility in sales conversations.",
    3: "Developing. Consider conducting more customer interviews to deepen your understanding of their specific pain points.",
    2: "This is a critical area for improvement. Without understanding pain points, it's hard to create compelling value propositions.",
    1: "This should be your top priority. Understanding customer pain is fundamental to all revenue activities."
  },
  
  q2: {
    5: "Perfect! Knowing exact buyer personas helps you target the right people and use appropriate language for each role.",
    4: "Strong foundation! You understand who makes decisions, which is crucial for effective outreach and presentations.",
    3: "Good start, but consider mapping out the complete buying committee and their specific concerns.",
    2: "This gap could lead to wasted time talking to the wrong people. Map out your ideal customer profile.",
    1: "Critical knowledge gap. Start by identifying who has budget authority and decision-making power."
  },
  
  q4: {
    5: "Excellent ROI articulation! Being able to quantify business impact is what separates great salespeople from average ones.",
    4: "Good foundation! You understand value creation, which helps justify purchasing decisions.",
    3: "Solid understanding, but work on making the ROI more specific and measurable.",
    2: "This is crucial for B2B sales. Develop case studies and ROI calculators to demonstrate value.",
    1: "High priority area. Buyers need to see clear financial justification for technology purchases."
  },
  
  // Tech Translation Questions  
  q8: {
    5: "Outstanding! The best technical founders can explain complex solutions in simple business terms that resonate with buyers.",
    4: "Good translation skills! You understand that buyers care about outcomes, not technical architecture.",
    3: "Improving, but practice explaining your solution to a non-technical audience more often.",
    2: "Common challenge for technical founders. Focus on business benefits rather than technical features.",
    1: "This is often the biggest barrier for technical founders in sales. Practice translating tech to business value."
  },
  
  q9: {
    5: "Perfect! Clear, jargon-free descriptions make your solution accessible to all stakeholders.",
    4: "Good clarity! You avoid technical overwhelm while still conveying what your product does.",
    3: "Making progress, but ensure your descriptions focus on user benefits rather than features.",
    2: "Work on simplifying your language. Pretend you're explaining to a smart 12-year-old.",
    1: "This is critical for sales success. Your marketing and sales materials need to be crystal clear."
  }
};

const industrySpecificTips: Record<string, string> = {
  saas: "In SaaS, buyers care about integration ease, time-to-value, and scalability. Focus on these outcomes.",
  fintech: "Financial buyers prioritize security, compliance, and risk reduction. Lead with these benefits.",
  healthcare: "Healthcare buyers need HIPAA compliance, workflow improvement, and patient outcome benefits.",
  ecommerce: "E-commerce buyers focus on conversion rates, customer experience, and revenue impact.",
  manufacturing: "Manufacturing buyers care about efficiency, cost reduction, and operational reliability.",
  default: "Focus on the business outcomes and competitive advantages your solution provides."
};

export default function AnswerExplanation({ 
  question, 
  industryData, 
  selectedAnswer 
}: AnswerExplanationProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  if (!selectedAnswer) return null;
  
  const explanation = explanations[question.id]?.[selectedAnswer];
  const industryTip = industrySpecificTips[industryData.name.toLowerCase().replace(/[^a-z]/g, '')] || 
                     industrySpecificTips.default;
  
  if (!explanation) return null;
  
  return (
    <div className="mt-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
      >
        <svg 
          className={`w-4 h-4 mr-2 transition-transform ${isOpen ? 'rotate-90' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        Tell me why this matters
      </button>
      
      {isOpen && (
        <div className="mt-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="space-y-3">
            <div>
              <h4 className="font-medium text-blue-900 mb-2">
                Why This Question Matters:
              </h4>
              <p className="text-blue-800 text-sm leading-relaxed">
                {explanation}
              </p>
            </div>
            
            <div className="pt-3 border-t border-blue-200">
              <h4 className="font-medium text-blue-900 mb-2 flex items-center">
                {industryData.icon} {industryData.name} Industry Insight:
              </h4>
              <p className="text-blue-800 text-sm leading-relaxed">
                {industryTip}
              </p>
            </div>
            
            {industryData.examples[question.id] && (
              <div className="pt-3 border-t border-blue-200">
                <h4 className="font-medium text-blue-900 mb-2">
                  Example for {industryData.name}:
                </h4>
                <p className="text-blue-800 text-sm leading-relaxed italic">
                  &ldquo;{industryData.examples[question.id]}&rdquo;
                </p>
              </div>
            )}
            
            {selectedAnswer <= 3 && (
              <div className="pt-3 border-t border-blue-200 bg-amber-50 -m-4 p-4 rounded-b-lg">
                <h4 className="font-medium text-amber-900 mb-2 flex items-center">
                  💡 Quick Improvement Tip:
                </h4>
                <p className="text-amber-800 text-sm">
                  {selectedAnswer === 3 && "Schedule 3 customer interviews this week to deepen your understanding."}
                  {selectedAnswer === 2 && "Create a simple one-page document capturing what you learn from each customer conversation."}
                  {selectedAnswer === 1 && "Start with one customer call per day to build this critical knowledge."}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}