import { RudderAnalytics } from '@rudderstack/analytics-js';

// Initialize RudderStack Analytics
const rudderAnalytics = new RudderAnalytics();

// Track if already loaded
let isLoaded = false;

export const initRudderStack = () => {
  const writeKey = localStorage.getItem('RS_writeKey') || '';
  const dataPlane = localStorage.getItem('RS_dataplane') || '';
  
  if (isLoaded) return;
  
  if (!writeKey || !dataPlane) {
    console.warn('RudderStack: Missing writeKey or dataPlane in localStorage.');
    return;
  }
  
  rudderAnalytics.load(writeKey, dataPlane, {});
  
  isLoaded = true;
  console.log('RudderStack: Initialized successfully');
};

export { rudderAnalytics };
