// NICE-TO-HAVE PHASE: Industry-specific examples and imagery

export interface IndustryData {
  name: string;
  icon: string;
  examples: Record<string, string>;
  painPoints: string[];
  buyerTitles: string[];
}

export const industryDatabase: Record<string, IndustryData> = {
  saas: {
    name: 'SaaS',
    icon: '💻',
    examples: {
      q1: 'Users struggle with data silos across multiple tools, manual reporting processes, and lack of real-time visibility into key metrics',
      q2: 'VP of Sales, Head of Revenue Operations, CRO, Chief Marketing Officer, VP of Customer Success',
      q4: 'ROI from reducing manual work by 80%, increasing sales velocity by 40%, improving customer retention by 25%',
      q8: 'Instead of "API-first architecture with microservices," say "connects all your existing tools automatically"',
    },
    painPoints: ['Data silos', 'Manual processes', 'Scaling challenges', 'Integration complexity'],
    buyerTitles: ['VP Sales', 'CRO', 'Head of Ops', 'CMO']
  },
  
  fintech: {
    name: 'FinTech',
    icon: '💳',
    examples: {
      q1: 'Compliance overhead, legacy system integration challenges, customer onboarding friction, regulatory reporting complexity',
      q2: 'Chief Risk Officer, Head of Compliance, VP of Product, Chief Technology Officer, Head of Operations',
      q4: 'ROI from reducing compliance costs by 60%, accelerating customer onboarding by 50%, automating regulatory reporting',
      q8: 'Instead of "blockchain-based distributed ledger," say "secure, auditable transaction processing"',
    },
    painPoints: ['Regulatory compliance', 'Legacy systems', 'Security concerns', 'Customer onboarding'],
    buyerTitles: ['CRO', 'Head of Compliance', 'VP Product', 'CTO']
  },
  
  healthcare: {
    name: 'HealthTech',
    icon: '🏥',
    examples: {
      q1: 'HIPAA compliance burdens, patient data fragmentation, provider workflow inefficiencies, interoperability challenges',
      q2: 'Chief Medical Officer, VP of Clinical Operations, Health IT Director, Chief Information Officer',
      q4: 'ROI from reducing documentation time by 50%, improving patient outcomes, ensuring HIPAA compliance',
      q8: 'Instead of "machine learning algorithms for predictive analytics," say "helps predict patient risks early"',
    },
    painPoints: ['HIPAA compliance', 'Data fragmentation', 'Workflow inefficiencies', 'Interoperability'],
    buyerTitles: ['CMO', 'VP Clinical Ops', 'Health IT Director', 'CIO']
  },
  
  ecommerce: {
    name: 'E-commerce',
    icon: '🛒',
    examples: {
      q1: 'Cart abandonment issues, inventory management complexity, customer acquisition costs, personalization challenges',
      q2: 'VP of E-commerce, Head of Marketing, Operations Director, Chief Customer Officer',
      q4: 'ROI from increasing conversion rates by 30%, reducing cart abandonment by 40%, improving customer lifetime value',
      q8: 'Instead of "AI-powered recommendation engine," say "shows customers products they actually want to buy"',
    },
    painPoints: ['Cart abandonment', 'Inventory management', 'Customer acquisition', 'Personalization'],
    buyerTitles: ['VP Ecommerce', 'Head of Marketing', 'Ops Director', 'CCO']
  },
  
  manufacturing: {
    name: 'Manufacturing',
    icon: '🏭',
    examples: {
      q1: 'Supply chain disruptions, equipment downtime, quality control issues, production optimization challenges',
      q2: 'VP of Operations, Plant Manager, Supply Chain Director, Chief Operations Officer',
      q4: 'ROI from reducing downtime by 30%, optimizing production schedules, improving quality control',
      q8: 'Instead of "IoT sensors with edge computing," say "monitors equipment health to prevent breakdowns"',
    },
    painPoints: ['Supply chain issues', 'Equipment downtime', 'Quality control', 'Production optimization'],
    buyerTitles: ['VP Operations', 'Plant Manager', 'Supply Chain Dir', 'COO']
  },
  
  default: {
    name: 'Technology',
    icon: '⚡',
    examples: {
      q1: 'Scaling challenges, technical debt, integration complexity, user adoption barriers',
      q2: 'CTO, VP of Engineering, Head of Product, VP of Sales, Operations Director',
      q4: 'ROI from reducing development time, improving system reliability, increasing user adoption',
      q8: 'Instead of complex technical jargon, explain the business benefit and user impact',
    },
    painPoints: ['Scaling challenges', 'Technical debt', 'Integration issues', 'User adoption'],
    buyerTitles: ['CTO', 'VP Engineering', 'Head of Product', 'VP Sales']
  }
};

export function detectIndustry(userInfo: { company?: string; role?: string } | null): IndustryData {
  if (!userInfo?.company && !userInfo?.role) {
    return industryDatabase.default;
  }
  
  const company = userInfo.company?.toLowerCase() || '';
  const role = userInfo.role?.toLowerCase() || '';
  
  // Industry detection logic
  if (company.includes('bank') || company.includes('financial') || company.includes('fintech') || 
      company.includes('payment') || company.includes('crypto') || role.includes('finance')) {
    return industryDatabase.fintech;
  }
  
  if (company.includes('health') || company.includes('medical') || company.includes('hospital') || 
      company.includes('clinical') || role.includes('medical') || role.includes('clinical')) {
    return industryDatabase.healthcare;
  }
  
  if (company.includes('ecommerce') || company.includes('retail') || company.includes('shop') || 
      company.includes('marketplace') || role.includes('ecommerce')) {
    return industryDatabase.ecommerce;
  }
  
  if (company.includes('manufacturing') || company.includes('factory') || company.includes('industrial') || 
      role.includes('manufacturing') || role.includes('operations')) {
    return industryDatabase.manufacturing;
  }
  
  if (company.includes('saas') || company.includes('software') || company.includes('platform') || 
      company.includes('app') || role.includes('software')) {
    return industryDatabase.saas;
  }
  
  return industryDatabase.default;
}