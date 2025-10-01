/**
 * Widget System Exports
 * 
 * Clean exports for the widget architecture system
 * Provides organized access to all widget components and utilities
 */

// Core widget system
export {
  Widget,
  WidgetContainer,
  createWidget,
  sortWidgetsByPriority,
  filterActiveWidgets,
  getWidgetById,
  type WidgetData,
  type WidgetConfig,
  type WidgetProps,
  type WidgetContainerProps,
  type WidgetType
} from './WidgetSystem';

// Assessment-specific widgets
export {
  AssessmentOverviewWidget,
  AssessmentChallengesWidget,
  AssessmentRecommendationsWidget,
  AssessmentInsightsWidget,
  type AssessmentResultsData,
  type ChallengeData,
  type RecommendationData,
  type InsightData
} from './AssessmentWidgets';

// Default export
export { default as WidgetSystem } from './WidgetSystem';
