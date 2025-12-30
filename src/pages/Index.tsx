import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '@/components/ui/Header';
import HeroSection from '@/components/HeroSection';
import AIChat from '@/components/features/AIChat';
import ContentGenerator from '@/components/features/ContentGenerator';
import ImageGenerator from '@/components/features/ImageGenerator';
import EventsPanel, { logEvent } from '@/components/features/EventsPanel';
import { initRudderStack, trackPage, trackEvent } from '@/lib/rudderstack';

const Index = () => {
  const [activeTab, setActiveTab] = useState('hero');

  useEffect(() => {
    // Initialize RudderStack on mount
    initRudderStack();
    
    // Track initial page view
    trackPage('Home');
    logEvent('Page Viewed', { page: 'Home' }, 'page');
  }, []);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    
    // Track tab navigation
    trackEvent('Tab Changed', { tab, previous_tab: activeTab });
    logEvent('Tab Changed', { tab, from: activeTab });
    
    // Track page view for specific tabs
    if (tab !== 'hero') {
      trackPage(tab.charAt(0).toUpperCase() + tab.slice(1));
      logEvent('Feature Viewed', { feature: tab }, 'page');
    }
  };

  const handleGetStarted = () => {
    setActiveTab('chat');
    trackEvent('CTA Clicked', { cta: 'get_started', location: 'hero' });
    logEvent('CTA Clicked', { cta: 'Get Started', location: 'hero' });
  };

  return (
    <>
      <Helmet>
        <title>RudderStack AI Demo | JavaScript SDK v3 Analytics</title>
        <meta name="description" content="Demo app showcasing RudderStack's JavaScript SDK v3 integration with AI-powered chatbot, content generation, and image creation features." />
        <meta name="keywords" content="RudderStack, analytics, JavaScript SDK, AI, chatbot, event tracking" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header activeTab={activeTab} onTabChange={handleTabChange} />
        
        <main>
          {activeTab === 'hero' && (
            <HeroSection onGetStarted={handleGetStarted} />
          )}

          {activeTab !== 'hero' && (
            <div className="container py-8">
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-2">
                  {activeTab === 'chat' && 'AI Chatbot'}
                  {activeTab === 'content' && 'Content Generator'}
                  {activeTab === 'image' && 'Image Generator'}
                  {activeTab === 'events' && 'Event Stream'}
                </h2>
                <p className="text-muted-foreground">
                  {activeTab === 'chat' && 'Have a conversation with AI while tracking every interaction.'}
                  {activeTab === 'content' && 'Generate blog posts, social media content, and more.'}
                  {activeTab === 'image' && 'Create stunning images from text prompts.'}
                  {activeTab === 'events' && 'View all tracked events in real-time.'}
                </p>
              </div>

              {activeTab === 'chat' && <AIChat />}
              {activeTab === 'content' && <ContentGenerator />}
              {activeTab === 'image' && <ImageGenerator />}
              {activeTab === 'events' && <EventsPanel />}
            </div>
          )}
        </main>

        <footer className="border-t border-border/50 mt-20">
          <div className="container py-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-muted-foreground">
                Built with RudderStack JS SDK v3 • Powered by Lovable
              </p>
              <div className="flex gap-4">
                <a 
                  href="https://www.rudderstack.com/docs/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Docs
                </a>
                <a 
                  href="https://github.com/rudderlabs/rudder-sdk-js" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  GitHub
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Index;
