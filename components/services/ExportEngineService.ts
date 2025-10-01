// Simplified Export Engine Service for Assessment Results

interface AssessmentResults {
  overallScore: number;
  buyerScore: number;
  techScore: number;
  qualification: string;
}

export const ExportEngineService = {
  // Generate export data for different formats
  generateExportData: (results: AssessmentResults, format: string) => {
    switch (format) {
      case 'linkedin':
        return ExportEngineService.generateLinkedInPost(results);
      case 'pdf':
        return ExportEngineService.generatePDFData(results);
      case 'csv':
        return ExportEngineService.generateCSVData(results);
      default:
        return null;
    }
  },

  // LinkedIn sharing format
  generateLinkedInPost: (results: AssessmentResults) => {
    const { overallScore, buyerScore, techScore } = results;
    const level = ExportEngineService.getProfessionalLevel(overallScore);
    const percentile = Math.min(Math.round(overallScore * 1.2), 99);
    
    return `🎯 Revenue Readiness Assessment Results

📊 Overall: ${overallScore}% | Customer: ${buyerScore}% | Value: ${Math.round((buyerScore + techScore) / 2)}% | Sales: ${techScore}%

Level: ${level} (Top ${100 - percentile}% of technical founders)

#RevenueReadiness #TechnicalFounders #StartupGrowth`;
  },

  // PDF export data
  generatePDFData: (results: AssessmentResults) => {
    return {
      title: 'Revenue Readiness Assessment Results',
      sections: [
        {
          title: 'Executive Summary',
          content: `Overall Score: ${results.overallScore}%`
        },
        {
          title: 'Detailed Breakdown',
          content: `Buyer Score: ${results.buyerScore}%, Tech Score: ${results.techScore}%`
        }
      ]
    };
  },

  // CSV export data
  generateCSVData: (results: AssessmentResults) => {
    return {
      headers: ['Metric', 'Score', 'Level'],
      rows: [
        ['Overall', `${results.overallScore}%`, ExportEngineService.getProfessionalLevel(results.overallScore)],
        ['Buyer Understanding', `${results.buyerScore}%`, ExportEngineService.getProfessionalLevel(results.buyerScore)],
        ['Tech Communication', `${results.techScore}%`, ExportEngineService.getProfessionalLevel(results.techScore)]
      ]
    };
  },

  // Professional level mapping
  getProfessionalLevel: (score: number): string => {
    if (score >= 90) return 'Master';
    if (score >= 80) return 'Advanced';
    if (score >= 70) return 'Proficient';
    if (score >= 60) return 'Developing';
    if (score >= 50) return 'Foundation';
    return 'Beginning';
  }
};