'use client';

// POLISH PHASE: Enterprise-grade real-time score visualization with Recharts

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';

interface EnterpriseScoreChartProps {
  results: {
    overallScore: number;
    buyerScore: number;
    techScore: number;
    qualification: string;
  };
  questionTimings: Record<string, number>;
  answeredQuestions: number;
  totalQuestions: number;
}

export default function EnterpriseScoreChart({ 
  results, 
  // questionTimings, 
  answeredQuestions 
  // totalQuestions 
}: EnterpriseScoreChartProps) {
  const [scoreHistory, setScoreHistory] = useState<Array<{
    question: number;
    overall: number;
    buyer: number;
    tech: number;
    timestamp: number;
  }>>([]);
  
  // Build real-time score progression data
  useEffect(() => {
    if (answeredQuestions > 0) {
      const newDataPoint = {
        question: answeredQuestions,
        overall: results.overallScore,
        buyer: results.buyerScore,
        tech: results.techScore,
        timestamp: Date.now()
      };
      
      setScoreHistory(prev => {
        const updated = [...prev];
        const existingIndex = updated.findIndex(p => p.question === answeredQuestions);
        if (existingIndex >= 0) {
          updated[existingIndex] = newDataPoint;
        } else {
          updated.push(newDataPoint);
        }
        return updated.sort((a, b) => a.question - b.question);
      });
    }
  }, [results, answeredQuestions]);
  
  // Radar chart data for professional competency visualization
  const radarData = [
    {
      subject: 'Customer Intelligence',
      score: results.buyerScore,
      fullMark: 100,
    },
    {
      subject: 'Value Communication',
      score: results.techScore,
      fullMark: 100,
    },
    {
      subject: 'Revenue Strategy',
      score: Math.round((results.buyerScore + results.techScore) / 2),
      fullMark: 100,
    },
    {
      subject: 'Market Understanding',
      score: Math.max(0, results.buyerScore - 10),
      fullMark: 100,
    },
    {
      subject: 'Business Development',
      score: Math.max(0, results.techScore - 5),
      fullMark: 100,
    },
    {
      subject: 'Executive Readiness',
      score: Math.round(results.overallScore * 0.9),
      fullMark: 100,
    },
  ];
  
  // Custom tooltip for professional presentation
  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; color: string; dataKey: string }>; label?: string }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800/95 border border-gray-600 rounded-lg p-3 shadow-xl backdrop-blur-sm">
          <p className="text-gray-300 text-sm font-medium mb-2">Question {label}</p>
          {payload.map((entry, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.dataKey === 'overall' ? 'Overall' :
               entry.dataKey === 'buyer' ? 'Customer Intelligence' :
               'Value Communication'}: {entry.value}%
            </p>
          ))}
        </div>
      );
    }
    return null;
  };
  
  const CustomRadarTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ value: number; payload: { subject: string } }> }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800/95 border border-gray-600 rounded-lg p-3 shadow-xl backdrop-blur-sm">
          <p className="text-gray-300 text-sm font-medium">{payload[0].payload.subject}</p>
          <p className="text-cyan-400 text-sm">Score: {payload[0].value}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8 mb-8">
      
      {/* Real-time Score Progression */}
      <motion.div 
        className="bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-gray-700 p-6"
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <h3 className="text-xl font-semibold text-white mb-4">
          Real-time Score Progression
        </h3>
        <p className="text-gray-400 text-sm mb-6">
          Intelligence building as you progress through assessment
        </p>
        
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={scoreHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="question" 
                stroke="#9ca3af"
                fontSize={12}
                tick={{ fill: '#9ca3af' }}
              />
              <YAxis 
                stroke="#9ca3af"
                fontSize={12}
                tick={{ fill: '#9ca3af' }}
                domain={[0, 100]}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="overall" 
                stroke="#06b6d4" 
                strokeWidth={3}
                dot={{ fill: '#06b6d4', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#06b6d4', strokeWidth: 2, fill: '#ffffff' }}
              />
              <Line 
                type="monotone" 
                dataKey="buyer" 
                stroke="#10b981" 
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ fill: '#10b981', strokeWidth: 2, r: 3 }}
              />
              <Line 
                type="monotone" 
                dataKey="tech" 
                stroke="#8b5cf6" 
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="flex justify-center gap-6 mt-4 text-xs">
          <div className="flex items-center">
            <div className="w-3 h-0.5 bg-cyan-400 mr-2" />
            <span className="text-gray-400">Overall</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-0.5 bg-green-400 mr-2 opacity-70" style={{ borderTop: '1px dashed' }} />
            <span className="text-gray-400">Customer</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-0.5 bg-purple-400 mr-2 opacity-70" style={{ borderTop: '1px dashed' }} />
            <span className="text-gray-400">Technical</span>
          </div>
        </div>
      </motion.div>
      
      {/* Professional Competency Radar */}
      <motion.div 
        className="bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-gray-700 p-6"
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <h3 className="text-xl font-semibold text-white mb-4">
          Revenue Competency Profile
        </h3>
        <p className="text-gray-400 text-sm mb-6">
          Multi-dimensional readiness analysis
        </p>
        
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData}>
              <PolarGrid stroke="#374151" />
              <PolarAngleAxis 
                dataKey="subject" 
                tick={{ fill: '#9ca3af', fontSize: 11 }}
              />
              <PolarRadiusAxis 
                angle={90} 
                domain={[0, 100]} 
                tick={{ fill: '#6b7280', fontSize: 10 }}
                tickCount={5}
              />
              <Radar
                name="Revenue Readiness"
                dataKey="score"
                stroke="#06b6d4"
                fill="#06b6d4"
                fillOpacity={0.1}
                strokeWidth={2}
                dot={{ fill: '#06b6d4', strokeWidth: 2, r: 3 }}
              />
              <Tooltip content={<CustomRadarTooltip />} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="text-center mt-4">
          <div className="text-lg font-semibold text-cyan-400">
            {results.qualification}
          </div>
          <div className="text-xs text-gray-500">Professional Level</div>
        </div>
      </motion.div>
    </div>
  );
}