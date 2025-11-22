// Frontend API service for communicating with the backend

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface AssessmentStartRequest {
  sessionId: string;
  startTime: string;
  productInfo?: {
    businessModel: string;
    productDescription: string;
  };
}

export interface AssessmentStartResponse {
  success: boolean;
  sessionId: string;
  recordId: string;
}

export interface AssessmentSubmitRequest {
  sessionId: string;
  responses: Record<string, number>;
  results: {
    buyerScore: number;
    techScore: number;
    overallScore: number;
    qualification: string;
  };
  timestamp: string;
  userInfo?: {
    name?: string;
    email: string;
    company: string;
    role?: string;
  };
  productInfo?: {
    productName?: string;
    productDescription: string;
    keyFeatures?: string;
    idealCustomerDescription?: string;
    businessModel: string;
    customerCount?: string;
    distinguishingFeature?: string;
  };
  questionTimings?: Record<string, number>;
  generatedContent?: {
    icpGenerated?: string;
    tbpGenerated?: string;
    buyerGap?: number;
  };
}

export interface AssessmentSubmitResponse {
  success: boolean;
  recordId: string;
  sessionId: string;
}

export interface WelcomeData {
  sessionId: string;
  company: string;
  qualification: string;
  overallScore: number;
  topChallenge: string;
  icpContent: string | null;
  tbpContent: string | null;
  accessToken: string | null;
}

export interface HealthResponse {
  status: string;
  timestamp: string;
  responseTime: number;
  version: string;
  uptime: number;
  memory: {
    used: number;
    total: number;
    external: number;
  };
  environment: string;
}

// Real-time Insight Interfaces
export interface AssessmentInsight {
  id: string;
  sessionId: string;
  batchNumber: 1 | 2 | 3;
  questionRange: string;
  insight: string;
  challengeIdentified: string;
  businessImpact: string;
  confidence: number;
  generatedAt: string;
}

export interface InsightRequest {
  sessionId: string;
  responses: Array<{
    questionId: string;
    questionText: string;
    response: number;
  }>;
  userInfo?: {
    company: string;
    productName: string;
    businessModel: string;
  };
  previousInsights?: AssessmentInsight[];
}

export interface InsightResponse {
  success: boolean;
  insight: AssessmentInsight;
  metadata: {
    batchNumber: number;
    questionRange: string;
    generatedAt: string;
    processingTime: number;
    contextualContinuity?: boolean;
  };
}

class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    const response = await fetch(url, { ...defaultOptions, ...options });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }

    return response.json();
  }

  // Assessment API methods
  async startAssessment(data: AssessmentStartRequest): Promise<AssessmentStartResponse> {
    return this.request<AssessmentStartResponse>('/api/assessment/start', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async submitAssessment(data: AssessmentSubmitRequest): Promise<AssessmentSubmitResponse> {
    return this.request<AssessmentSubmitResponse>('/api/assessment/submit', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getWelcomeData(sessionId: string): Promise<WelcomeData> {
    return this.request<WelcomeData>(`/api/welcome/${sessionId}`);
  }

  async getHealth(): Promise<HealthResponse> {
    return this.request<HealthResponse>('/api/health');
  }

  // Real-time Insight API methods
  async generateBatch1Insight(data: InsightRequest): Promise<InsightResponse> {
    return this.request<InsightResponse>('/api/insights/batch1', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async generateBatch2Insight(data: InsightRequest): Promise<InsightResponse> {
    return this.request<InsightResponse>('/api/insights/batch2', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async generateBatch3Insight(data: InsightRequest): Promise<InsightResponse> {
    return this.request<InsightResponse>('/api/insights/batch3', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getSessionInsights(sessionId: string): Promise<{ success: boolean; insights: AssessmentInsight[]; count: number }> {
    return this.request<{ success: boolean; insights: AssessmentInsight[]; count: number }>(`/api/insights/session/${sessionId}`);
  }
}

// Export singleton instance
export const apiService = new ApiService();

// Convenience functions
export const startAssessment = (data: AssessmentStartRequest) => 
  apiService.startAssessment(data);

export const submitAssessment = (data: AssessmentSubmitRequest) => 
  apiService.submitAssessment(data);

export const getWelcomeData = (sessionId: string) => 
  apiService.getWelcomeData(sessionId);

export const getHealth = () =>
  apiService.getHealth();

export const generateBatch1Insight = (data: InsightRequest) =>
  apiService.generateBatch1Insight(data);

export const generateBatch2Insight = (data: InsightRequest) =>
  apiService.generateBatch2Insight(data);

export const generateBatch3Insight = (data: InsightRequest) =>
  apiService.generateBatch3Insight(data);

export const getSessionInsights = (sessionId: string) =>
  apiService.getSessionInsights(sessionId);
