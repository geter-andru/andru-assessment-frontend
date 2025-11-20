// CORE PHASE: Basic question definitions for revenue readiness assessment

export interface Question {
  id: string;
  category: 'buyer' | 'tech';
  text: string;
  weight: number;
}

export const assessmentQuestions: Question[] = [
  // Customer Intelligence Questions (60% weight)
  {
    id: 'q1',
    category: 'buyer',
    text: 'I can name the exact three pain points that cost my buyers the most money annually',
    weight: 8.57
  },
  {
    id: 'q2',
    category: 'buyer',
    text: 'I know the specific job titles, LinkedIn headlines, and reporting structure of my champions',
    weight: 8.57
  },
  {
    id: 'q3',
    category: 'buyer',
    text: 'I can map out the exact 7-step evaluation process my buyers follow, including who signs off at each stage',
    weight: 8.57
  },
  {
    id: 'q4',
    category: 'buyer',
    text: 'I have calculated the specific dollar amount my solution saves/earns per customer per quarter',
    weight: 8.57
  },
  {
    id: 'q5',
    category: 'buyer',
    text: 'I know the exact internal event or metric threshold that triggers buyers to seek my solution urgently',
    weight: 8.57
  },
  {
    id: 'q6',
    category: 'buyer',
    text: 'I can list my top 3 competitors and explain why buyers choose them over me in specific scenarios',
    weight: 8.57
  },
  {
    id: 'q7',
    category: 'buyer',
    text: 'I know exactly how my product features map to executive KPIs like CAC, NRR, or operational efficiency',
    weight: 8.57
  },
  
  // Value Communication Questions (40% weight)
  {
    id: 'q8',
    category: 'tech',
    text: 'I can explain my API architecture to a CFO in terms of cost savings and risk reduction',
    weight: 10
  },
  {
    id: 'q9',
    category: 'tech',
    text: 'I have a one-page business case that quantifies value without mentioning technology stack',
    weight: 10
  },
  {
    id: 'q10',
    category: 'tech',
    text: 'I can demonstrate my product\'s value in under 5 minutes using only business metrics',
    weight: 10
  },
  {
    id: 'q11',
    category: 'tech',
    text: 'I have 3+ case studies showing specific percentage improvements in revenue, costs, or time',
    weight: 10
  },
  
  // Mixed Assessment Questions
  {
    id: 'q12',
    category: 'buyer',
    text: 'I conduct 5+ customer discovery calls per week and document specific quotes about their problems',
    weight: 8.57
  },
  {
    id: 'q13',
    category: 'buyer',
    text: 'I have a documented ICP that includes company size, tech stack, team structure, and budget range',
    weight: 8.57
  },
  {
    id: 'q14',
    category: 'buyer',
    text: 'I track time-to-value, feature adoption rate, and expansion revenue for each customer cohort',
    weight: 8.58
  }
];

export interface AssessmentResult {
  buyerScore: number;
  techScore: number;
  overallScore: number;
  qualification: 'Qualified' | 'Promising' | 'Developing' | 'Early Stage';
}

export function calculateScore(responses: Record<string, number>): AssessmentResult {
  let buyerTotal = 0;
  let techTotal = 0;
  
  assessmentQuestions.forEach(question => {
    const response = responses[question.id] || 0;
    const points = (response / 4) * question.weight;
    
    if (question.category === 'buyer') {
      buyerTotal += points;
    } else {
      techTotal += points;
    }
  });
  
  const overallScore = Math.round(buyerTotal + techTotal);
  
  let qualification: AssessmentResult['qualification'];
  if (overallScore >= 80) {
    qualification = 'Qualified';
  } else if (overallScore >= 60) {
    qualification = 'Promising';
  } else if (overallScore >= 40) {
    qualification = 'Developing';
  } else {
    qualification = 'Early Stage';
  }
  
  return {
    buyerScore: Math.round(buyerTotal),
    techScore: Math.round(techTotal),
    overallScore,
    qualification
  };
}