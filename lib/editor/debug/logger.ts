/**
 * Debug Logger
 * Enhanced logging utilities for development
 */

const isDevelopment = process.env.NODE_ENV === 'development';

export const debugLog = {
  craft: {
    render: (message: string, data?: any) => {
      if (isDevelopment) {
        console.log(`[Craft.js Render] ${message}`, data);
      }
    },
    state: (message: string, data?: any) => {
      if (isDevelopment) {
        console.log(`[Craft.js State] ${message}`, data);
      }
    },
    error: (message: string, error: any) => {
      console.error(`[Craft.js Error] ${message}`, error);
    },
  },
  reka: {
    state: (message: string, data?: any) => {
      if (isDevelopment) {
        console.log(`[Reka.js State] ${message}`, data);
      }
    },
    error: (message: string, error: any) => {
      console.error(`[Reka.js Error] ${message}`, error);
    },
  },
  editor: {
    info: (message: string, data?: any) => {
      if (isDevelopment) {
        console.log(`[Editor] ${message}`, data);
      }
    },
    warn: (message: string, data?: any) => {
      console.warn(`[Editor] ${message}`, data);
    },
    error: (message: string, error: any) => {
      console.error(`[Editor Error] ${message}`, error);
    },
  },
};

/**
 * Log component resolution issues with full context
 */
export function logComponentResolutionIssue(
  componentName: string,
  availableComponents: string[],
  renderNode?: any
) {
  console.group(`[Component Resolution] Missing component: "${componentName}"`);
  console.log('Available components:', availableComponents);
  console.log('Render node:', renderNode);
  console.log('Suggestion: Check if component is registered in resolvers');
  console.groupEnd();
}

/**
 * Log state validation issues
 */
export function logStateValidationIssue(
  issue: string,
  state: any,
  details?: any
) {
  console.group(`[State Validation] ${issue}`);
  console.log('State:', state);
  if (details) {
    console.log('Details:', details);
  }
  console.groupEnd();
}

