import { RudderAnalytics } from '@rudderstack/analytics-js';

// Initialize RudderStack Analytics
const rudderAnalytics = new RudderAnalytics();

// Configuration - these will need to be set by the user
const WRITE_KEY = import.meta.env.VITE_RUDDERSTACK_WRITE_KEY || '';
const DATA_PLANE_URL = import.meta.env.VITE_RUDDERSTACK_DATA_PLANE_URL || '';

// Track if already loaded
let isLoaded = false;

export const initRudderStack = () => {
  if (isLoaded || !WRITE_KEY || !DATA_PLANE_URL) {
    if (!WRITE_KEY || !DATA_PLANE_URL) {
      console.warn('RudderStack: Missing WRITE_KEY or DATA_PLANE_URL. Analytics disabled.');
    }
    return;
  }
  
  rudderAnalytics.load(WRITE_KEY, DATA_PLANE_URL, {});
  
  isLoaded = true;
  console.log('RudderStack: Initialized successfully');
};

// Page view tracking
export const trackPage = (pageName?: string, properties?: Record<string, unknown>) => {
  if (!isLoaded) return;
  (rudderAnalytics as any).page(pageName, properties);
};

// Event tracking
export const trackEvent = (eventName: string, properties?: Record<string, unknown>) => {
  if (!isLoaded) return;
  (rudderAnalytics as any).track(eventName, properties);
};

// User identification
export const identifyUser = (userId: string, traits?: Record<string, unknown>) => {
  if (!isLoaded) return;
  (rudderAnalytics as any).identify(userId, traits);
};

// AI Feature specific tracking
export const trackAIEvent = (
  featureType: 'chatbot' | 'content_generator' | 'image_generator',
  action: string,
  properties?: Record<string, unknown>
) => {
  trackEvent(`AI_${featureType}_${action}`, {
    feature_type: featureType,
    action,
    timestamp: new Date().toISOString(),
    ...properties,
  });
};

export { rudderAnalytics };
