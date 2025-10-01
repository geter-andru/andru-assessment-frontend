// POLISH PHASE: Ambient environmental effects based on performance

export interface EnvironmentalState {
  backgroundGradient: string;
  particleColor: string;
  accentColor: string;
  mood: 'excellent' | 'good' | 'developing' | 'needs-work';
}

export function calculateEnvironmentalState(
  overallScore: number,
  answeredQuestions: number,
  totalQuestions: number
): EnvironmentalState {
  const progress = answeredQuestions / totalQuestions;
  
  // Determine mood based on current score
  let mood: EnvironmentalState['mood'];
  if (overallScore >= 80) mood = 'excellent';
  else if (overallScore >= 60) mood = 'good';
  else if (overallScore >= 40) mood = 'developing';
  else mood = 'needs-work';
  
  // Adjust intensity based on progress (more pronounced toward the end)
  const intensity = 0.3 + (progress * 0.7);
  
  switch (mood) {
    case 'excellent':
      return {
        backgroundGradient: `radial-gradient(circle at 20% 80%, 
          rgba(59, 130, 246, 0.15) 0%, 
          rgba(59, 130, 246, 0.05) ${30 + intensity * 20}%, 
          transparent ${60 + intensity * 30}%)`,
        particleColor: '#3b82f6',
        accentColor: '#1d4ed8',
        mood
      };
      
    case 'good':
      return {
        backgroundGradient: `radial-gradient(circle at 80% 20%, 
          rgba(16, 185, 129, 0.12) 0%, 
          rgba(16, 185, 129, 0.04) ${30 + intensity * 20}%, 
          transparent ${60 + intensity * 30}%)`,
        particleColor: '#10b981',
        accentColor: '#059669',
        mood
      };
      
    case 'developing':
      return {
        backgroundGradient: `radial-gradient(circle at 50% 50%, 
          rgba(245, 158, 11, 0.1) 0%, 
          rgba(245, 158, 11, 0.03) ${30 + intensity * 15}%, 
          transparent ${60 + intensity * 25}%)`,
        particleColor: '#f59e0b',
        accentColor: '#d97706',
        mood
      };
      
    case 'needs-work':
      return {
        backgroundGradient: `radial-gradient(circle at 70% 70%, 
          rgba(107, 114, 128, 0.08) 0%, 
          rgba(107, 114, 128, 0.02) ${40}%, 
          transparent ${70}%)`,
        particleColor: '#6b7280',
        accentColor: '#4b5563',
        mood
      };
  }
}

export function generateParticles(mood: EnvironmentalState['mood'], count: number = 15) {
  const particles = [];
  
  for (let i = 0; i < count; i++) {
    particles.push({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: mood === 'excellent' ? Math.random() * 4 + 2 : Math.random() * 2 + 1,
      speed: mood === 'excellent' ? Math.random() * 0.5 + 0.3 : Math.random() * 0.2 + 0.1,
      opacity: mood === 'excellent' ? Math.random() * 0.3 + 0.2 : Math.random() * 0.2 + 0.1,
    });
  }
  
  return particles;
}