'use client';

/**
 * Widget System - TypeScript Migration
 * 
 * Modular widget architecture for displaying assessment results
 * Enhanced with TypeScript type safety and professional development language
 * Migrated from legacy platform with improved error handling and context integration
 */

import React, { useState, useEffect, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ModernCard from '@/components/ui/ModernCard';
import { AssessmentErrorBoundary } from '@/components/ErrorBoundary';
import { useAssessment } from '@/contexts/AssessmentContext';
import {
  AssessmentOverviewWidget,
  AssessmentChallengesWidget,
  AssessmentRecommendationsWidget,
  AssessmentInsightsWidget
} from './AssessmentWidgets';

// TypeScript interfaces for widget system
export interface WidgetData {
  id: string;
  title: string;
  description?: string;
  type: WidgetType;
  priority: number;
  status: 'active' | 'inactive' | 'loading' | 'error';
  data?: any; // Will be typed more specifically per widget type
  lastUpdated?: Date;
  metadata?: Record<string, any>;
}

export type WidgetType = 
  | 'overview'
  | 'challenges'
  | 'recommendations'
  | 'insights'
  | 'progress'
  | 'metrics'
  | 'actions'
  | 'custom';

export interface WidgetConfig {
  id: string;
  type: WidgetType;
  title: string;
  description?: string;
  priority: number;
  enabled: boolean;
  size: 'small' | 'medium' | 'large' | 'full';
  position?: { x: number; y: number };
  refreshInterval?: number; // in milliseconds
  dependencies?: string[]; // widget IDs this widget depends on
}

export interface WidgetProps {
  data: WidgetData;
  config: WidgetConfig;
  onUpdate?: (widgetId: string, data: any) => void;
  onError?: (widgetId: string, error: Error) => void;
  className?: string;
}

export interface WidgetContainerProps {
  widgets: WidgetConfig[];
  onWidgetUpdate?: (widgetId: string, data: any) => void;
  onWidgetError?: (widgetId: string, error: Error) => void;
  className?: string;
  layout?: 'grid' | 'tabs' | 'accordion';
  maxColumns?: number;
}

// Widget base component with error boundary
export const Widget: React.FC<WidgetProps> = ({ 
  data, 
  config, 
  onUpdate, 
  onError, 
  className = '' 
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const handleError = (error: Error) => {
    setError(error);
    onError?.(config.id, error);
  };

  const handleUpdate = (newData: any) => {
    onUpdate?.(config.id, newData);
  };

  const getSizeClasses = () => {
    switch (config.size) {
      case 'small': return 'col-span-1';
      case 'medium': return 'col-span-2';
      case 'large': return 'col-span-3';
      case 'full': return 'col-span-full';
      default: return 'col-span-2';
    }
  };

  if (error) {
    return (
      <div className={`${getSizeClasses()} ${className}`}>
        <ModernCard variant="warning" size="auto" className="h-full">
          <div className="text-center p-4">
            <div className="text-red-400 mb-2">⚠️</div>
            <h3 className="text-lg font-semibold text-white mb-2">Widget Error</h3>
            <p className="text-gray-400 text-sm mb-4">
              {config.title} encountered an error
            </p>
            <button
              onClick={() => setError(null)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors"
            >
              Retry
            </button>
          </div>
        </ModernCard>
      </div>
    );
  }

  return (
    <AssessmentErrorBoundary
      resetOnPropsChange={true}
      resetKeys={[data.id, data.status]}
      onError={handleError}
    >
      <div className={`${getSizeClasses()} ${className}`}>
        <ModernCard 
          variant={data.status === 'error' ? 'warning' : 'default'} 
          size="auto" 
          className="h-full"
        >
          <div className="p-4 h-full flex flex-col">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-lg font-semibold text-white">{config.title}</h3>
                {config.description && (
                  <p className="text-sm text-gray-400 mt-1">{config.description}</p>
                )}
              </div>
              <div className="flex items-center space-x-2">
                {data.status === 'loading' && (
                  <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                )}
                {data.lastUpdated && (
                  <span className="text-xs text-gray-500">
                    {data.lastUpdated.toLocaleTimeString()}
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex-1">
              <WidgetContent 
                data={data} 
                config={config} 
                onUpdate={handleUpdate}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
              />
            </div>
          </div>
        </ModernCard>
      </div>
    </AssessmentErrorBoundary>
  );
};

// Widget content component - to be extended by specific widgets
interface WidgetContentProps {
  data: WidgetData;
  config: WidgetConfig;
  onUpdate: (data: any) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const WidgetContent: React.FC<WidgetContentProps> = ({ 
  data, 
  config, 
  onUpdate, 
  isLoading, 
  setIsLoading 
}) => {
  // Render specific assessment widgets based on type
  switch (config.type) {
    case 'overview':
      return <AssessmentOverviewWidget data={data} config={config} onUpdate={onUpdate} />;
    case 'challenges':
      return <AssessmentChallengesWidget data={data} config={config} onUpdate={onUpdate} />;
    case 'recommendations':
      return <AssessmentRecommendationsWidget data={data} config={config} onUpdate={onUpdate} />;
    case 'insights':
      return <AssessmentInsightsWidget data={data} config={config} onUpdate={onUpdate} />;
    default:
      return (
        <div className="text-center text-gray-400">
          <p>Widget content for {config.type}</p>
          <p className="text-sm mt-2">Status: {data.status}</p>
        </div>
      );
  }
};

// Widget container with layout management
export const WidgetContainer: React.FC<WidgetContainerProps> = ({
  widgets,
  onWidgetUpdate,
  onWidgetError,
  className = '',
  layout = 'grid',
  maxColumns = 3
}) => {
  const [activeTab, setActiveTab] = useState<string>('');
  const [expandedWidgets, setExpandedWidgets] = useState<Set<string>>(new Set());
  const [widgetData, setWidgetData] = useState<Map<string, WidgetData>>(new Map());

  // Initialize widget data
  useEffect(() => {
    const initialData = new Map<string, WidgetData>();
    widgets.forEach(widget => {
      initialData.set(widget.id, {
        id: widget.id,
        title: widget.title,
        description: widget.description,
        type: widget.type,
        priority: widget.priority,
        status: 'active',
        lastUpdated: new Date()
      });
    });
    setWidgetData(initialData);
    
    // Set first tab as active if using tab layout
    if (layout === 'tabs' && widgets.length > 0) {
      setActiveTab(widgets[0].id);
    }
  }, [widgets, layout]);

  const handleWidgetUpdate = (widgetId: string, data: any) => {
    setWidgetData(prev => {
      const newData = new Map(prev);
      const existing = newData.get(widgetId);
      if (existing) {
        newData.set(widgetId, {
          ...existing,
          data,
          lastUpdated: new Date()
        });
      }
      return newData;
    });
    onWidgetUpdate?.(widgetId, data);
  };

  const handleWidgetError = (widgetId: string, error: Error) => {
    setWidgetData(prev => {
      const newData = new Map(prev);
      const existing = newData.get(widgetId);
      if (existing) {
        newData.set(widgetId, {
          ...existing,
          status: 'error'
        });
      }
      return newData;
    });
    onWidgetError?.(widgetId, error);
  };

  const toggleWidgetExpansion = (widgetId: string) => {
    setExpandedWidgets(prev => {
      const newSet = new Set(prev);
      if (newSet.has(widgetId)) {
        newSet.delete(widgetId);
      } else {
        newSet.add(widgetId);
      }
      return newSet;
    });
  };

  const getGridClasses = () => {
    switch (maxColumns) {
      case 1: return 'grid-cols-1';
      case 2: return 'grid-cols-1 md:grid-cols-2';
      case 3: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
      case 4: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
      default: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
    }
  };

  if (layout === 'tabs') {
    return (
      <div className={`${className}`}>
        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-6">
          {widgets.map((widget) => (
            <button
              key={widget.id}
              onClick={() => setActiveTab(widget.id)}
              className={`px-4 py-2 rounded-lg transition-all ${
                activeTab === widget.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              {widget.title}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {widgets.map((widget) => {
            const data = widgetData.get(widget.id);
            if (!data || activeTab !== widget.id) return null;

            return (
              <motion.div
                key={widget.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Widget
                  data={data}
                  config={widget}
                  onUpdate={handleWidgetUpdate}
                  onError={handleWidgetError}
                />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    );
  }

  if (layout === 'accordion') {
    return (
      <div className={`space-y-4 ${className}`}>
        {widgets.map((widget) => {
          const data = widgetData.get(widget.id);
          if (!data) return null;

          const isExpanded = expandedWidgets.has(widget.id);

          return (
            <div key={widget.id} className="border border-gray-700 rounded-lg overflow-hidden">
              <button
                onClick={() => toggleWidgetExpansion(widget.id)}
                className="w-full px-4 py-3 bg-gray-800 hover:bg-gray-700 transition-colors flex justify-between items-center"
              >
                <div className="text-left">
                  <h3 className="text-lg font-semibold text-white">{widget.title}</h3>
                  {widget.description && (
                    <p className="text-sm text-gray-400 mt-1">{widget.description}</p>
                  )}
                </div>
                <div className="text-gray-400">
                  {isExpanded ? '−' : '+'}
                </div>
              </button>
              
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="p-4">
                      <Widget
                        data={data}
                        config={widget}
                        onUpdate={handleWidgetUpdate}
                        onError={handleWidgetError}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    );
  }

  // Default grid layout
  return (
    <div className={`grid ${getGridClasses()} gap-6 ${className}`}>
      {widgets.map((widget) => {
        const data = widgetData.get(widget.id);
        if (!data) return null;

        return (
          <Widget
            key={widget.id}
            data={data}
            config={widget}
            onUpdate={handleWidgetUpdate}
            onError={handleWidgetError}
          />
        );
      })}
    </div>
  );
};

// Widget factory for creating specific widget types
export const createWidget = (
  type: WidgetType,
  config: Omit<WidgetConfig, 'type'>,
  data?: any
): WidgetConfig => ({
  ...config,
  type,
  data
});

// Utility functions for widget management
export const sortWidgetsByPriority = (widgets: WidgetConfig[]): WidgetConfig[] => {
  return [...widgets].sort((a, b) => b.priority - a.priority);
};

export const filterActiveWidgets = (widgets: WidgetConfig[]): WidgetConfig[] => {
  return widgets.filter(widget => widget.enabled);
};

export const getWidgetById = (widgets: WidgetConfig[], id: string): WidgetConfig | undefined => {
  return widgets.find(widget => widget.id === id);
};

// Export default
export default WidgetContainer;
