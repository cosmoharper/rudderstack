import { useState, useEffect, useRef } from 'react';
import { rudderAnalytics, initRudderStack } from '@/lib/rudderstack';
import { ArrowRight, Zap, User, RefreshCw, FileText, Send, Play, Square } from 'lucide-react';
import rudderstackWordmark from '@/assets/rudderstack-wordmark.png';
import rudderstackIcon from '@/assets/rudderstack-icon.png';

const Index = () => {
  const [writeKey, setWriteKey] = useState('');
  const [dataPlane, setDataPlane] = useState('');
  const [showKeyEntry, setShowKeyEntry] = useState(true);
  const [customEvent, setCustomEvent] = useState('');
  const [trait1Key, setTrait1Key] = useState('');
  const [trait1Value, setTrait1Value] = useState('');
  const [trait2Key, setTrait2Key] = useState('');
  const [trait2Value, setTrait2Value] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const playingRef = useRef<NodeJS.Timeout | null>(null);
  const playCountRef = useRef(1);

  const pages = [
    'Home Page',
    'Item - Something cool to buy',
    'Category - Shirts',
    'Landing Page - Competitor Comparison',
    'Video Library',
    'Demo Request',
    'Contact Us'
  ];

  useEffect(() => {
    const storedKey = localStorage.getItem('RS_writeKey');
    const storedDP = localStorage.getItem('RS_dataplane');
    if (storedKey && storedDP) {
      setWriteKey(storedKey);
      setDataPlane(storedDP);
      setShowKeyEntry(false);
    }
  }, []);

  useEffect(() => {
    if (writeKey && dataPlane && !showKeyEntry) {
      initRudderStack();
    }
  }, [writeKey, dataPlane, showKeyEntry]);

  const handleScroll = () => {
    if (!showKeyEntry) {
      (rudderAnalytics as any).track('scroll');
      console.log('RS Event -> track: scroll');
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [showKeyEntry]);

  const addKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (writeKey) localStorage.setItem('RS_writeKey', writeKey);
    if (dataPlane) localStorage.setItem('RS_dataplane', dataPlane);
    setShowKeyEntry(false);
    window.location.reload();
  };

  const sendTrackEvent = (eventName: string) => {
    (rudderAnalytics as any).track(eventName);
    console.log('RS Event -> track:', eventName);
    console.log('RS AnonymousId ->', (rudderAnalytics as any).getAnonymousId?.());
  };

  const sendIdentify = (withFormSubmit = false) => {
    const id = prompt('Enter your identifier');
    if (id) {
      (rudderAnalytics as any).identify(id, { name: "First Name" });
      console.log('RS Event -> identify:', id);
      if (withFormSubmit) {
        (rudderAnalytics as any).track('form_submit', { form_id: "Demo Request" });
        console.log('RS Event -> track: form_submit');
      }
    }
  };

  const sendIdentifyWithTraits = () => {
    const id = prompt('Enter your identifier');
    if (id) {
      const traits: Record<string, string> = {};
      if (trait1Key) traits[trait1Key] = trait1Value;
      if (trait2Key) traits[trait2Key] = trait2Value;
      (rudderAnalytics as any).identify(id, traits);
      console.log('RS Event -> identify with traits:', id, traits);
    }
  };

  const sendReset = () => {
    (rudderAnalytics as any).reset?.();
    console.log('RS User Logout');
    console.log('RS AnonymousId ->', (rudderAnalytics as any).getAnonymousId?.());
  };

  const sendPageView = () => {
    const randomPage = pages[Math.floor(Math.random() * pages.length)];
    (rudderAnalytics as any).page(randomPage);
    console.log('RS Event -> page:', randomPage);
  };

  const sendCustomEvent = () => {
    const eventKey = customEvent || 'custom event key not provided';
    (rudderAnalytics as any).track(eventKey);
    console.log('RS Event -> track:', eventKey);
  };

  const startAutoPlay = () => {
    setIsPlaying(true);
    playCountRef.current = 1;
    const runPlay = () => {
      sendPageView();
      console.log('Sending AutoPlay Event', playCountRef.current);
      playCountRef.current += 1;
      if (playCountRef.current <= 100) {
        playingRef.current = setTimeout(runPlay, 1000);
      } else {
        stopAutoPlay();
      }
    };
    runPlay();
  };

  const stopAutoPlay = () => {
    if (playingRef.current) clearTimeout(playingRef.current);
    setIsPlaying(false);
    playCountRef.current = 1;
  };

  const toggleWriteKey = () => {
    setShowKeyEntry(true);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero gradient background */}
      <div 
        className="fixed inset-0 pointer-events-none"
        style={{ background: 'var(--gradient-hero)' }}
      />
      
      {/* Header */}
      <header className="relative border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <img src={rudderstackWordmark} alt="RudderStack" className="h-6" />
          <span className="text-sm text-muted-foreground">SDK Testing Console</span>
        </div>
      </header>

      <main className="relative max-w-6xl mx-auto px-6 py-12">
        {showKeyEntry ? (
          <div className="max-w-xl mx-auto">
            {/* Setup Card */}
            <div className="text-center mb-8">
              <div className="flex justify-center mb-6">
                <img src={rudderstackIcon} alt="RudderStack" className="w-16 h-16" />
              </div>
              <h1 className="text-4xl font-bold text-foreground mb-4">
                Get started with <span className="text-primary">RudderStack</span>
              </h1>
              <p className="text-lg text-muted-foreground">
                Enter your credentials to start testing SDK events
              </p>
            </div>

            <div className="rs-card">
              <form onSubmit={addKey} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Data Plane URL
                  </label>
                  <input
                    type="text"
                    value={dataPlane}
                    onChange={(e) => setDataPlane(e.target.value)}
                    placeholder="https://your-dataplane.rudderstack.com"
                    className="rs-input w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Write Key
                  </label>
                  <input
                    type="text"
                    value={writeKey}
                    onChange={(e) => setWriteKey(e.target.value)}
                    placeholder="Your source write key"
                    className="rs-input w-full"
                  />
                </div>
                <button type="submit" className="rs-button rs-button-primary w-full">
                  Connect to RudderStack
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Page Header */}
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">SDK Testing Console</h1>
                <p className="text-muted-foreground">Fire events and see them in your live event viewer</p>
              </div>
              <button onClick={toggleWriteKey} className="rs-button rs-button-secondary text-sm">
                Change credentials
              </button>
            </div>

            {/* Current Config */}
            <div className="rs-card bg-secondary/50">
              <div className="flex items-center gap-3 text-sm">
                <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                <span className="text-muted-foreground">Connected:</span>
                <code className="text-foreground font-mono text-xs bg-background px-2 py-1 rounded">
                  {writeKey.slice(0, 20)}...
                </code>
                <span className="text-muted-foreground mx-1">→</span>
                <code className="text-foreground font-mono text-xs bg-background px-2 py-1 rounded">
                  {dataPlane}
                </code>
              </div>
            </div>

            {/* Event Cards Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Track Events */}
              <div className="rs-card">
                <div className="rs-section-label flex items-center gap-2">
                  <Zap className="w-3.5 h-3.5" />
                  Track Events
                </div>
                <div className="flex flex-wrap gap-3">
                  <button 
                    onClick={() => sendTrackEvent('event_key')} 
                    className="rs-button rs-button-primary"
                  >
                    Track Event
                  </button>
                  <button 
                    onClick={() => sendTrackEvent('purchase')} 
                    className="rs-button rs-button-secondary"
                  >
                    Track: Purchase
                  </button>
                </div>
              </div>

              {/* Identify Events */}
              <div className="rs-card">
                <div className="rs-section-label flex items-center gap-2">
                  <User className="w-3.5 h-3.5" />
                  Identify & Reset
                </div>
                <div className="flex flex-wrap gap-3">
                  <button 
                    onClick={() => sendIdentify(false)} 
                    className="rs-button rs-button-primary"
                  >
                    Identify
                  </button>
                  <button 
                    onClick={() => sendIdentify(true)} 
                    className="rs-button rs-button-secondary"
                  >
                    Identify + Form
                  </button>
                  <button 
                    onClick={sendReset} 
                    className="rs-button rs-button-secondary"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Reset
                  </button>
                </div>
              </div>

              {/* Identify with Traits */}
              <div className="rs-card">
                <div className="rs-section-label flex items-center gap-2">
                  <User className="w-3.5 h-3.5" />
                  Identify with Traits
                </div>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <input 
                      placeholder="Trait key" 
                      value={trait1Key}
                      onChange={(e) => setTrait1Key(e.target.value)}
                      className="rs-input text-sm"
                    />
                    <input 
                      placeholder="Value" 
                      value={trait1Value}
                      onChange={(e) => setTrait1Value(e.target.value)}
                      className="rs-input text-sm"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input 
                      placeholder="Trait key" 
                      value={trait2Key}
                      onChange={(e) => setTrait2Key(e.target.value)}
                      className="rs-input text-sm"
                    />
                    <input 
                      placeholder="Value" 
                      value={trait2Value}
                      onChange={(e) => setTrait2Value(e.target.value)}
                      className="rs-input text-sm"
                    />
                  </div>
                  <button 
                    onClick={sendIdentifyWithTraits} 
                    className="rs-button rs-button-primary w-full"
                  >
                    Send Identify with Traits
                  </button>
                </div>
              </div>

              {/* Page Events */}
              <div className="rs-card">
                <div className="rs-section-label flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5" />
                  Page Events
                </div>
                <div className="space-y-3">
                  <button 
                    onClick={sendPageView} 
                    className="rs-button rs-button-primary w-full"
                  >
                    Send Random Page View
                  </button>
                  <div className="flex gap-2">
                    <button 
                      onClick={startAutoPlay} 
                      disabled={isPlaying}
                      className="rs-button rs-button-secondary flex-1 disabled:opacity-50"
                    >
                      <Play className="w-4 h-4" />
                      Auto Play
                    </button>
                    <button 
                      onClick={stopAutoPlay} 
                      disabled={!isPlaying}
                      className="rs-button rs-button-secondary flex-1 disabled:opacity-50"
                    >
                      <Square className="w-4 h-4" />
                      Stop
                    </button>
                  </div>
                  {isPlaying && (
                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                      <div className="flex gap-1">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                      <span>Sending events...</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Custom Event - Full Width */}
            <div className="rs-card">
              <div className="rs-section-label flex items-center gap-2">
                <Send className="w-3.5 h-3.5" />
                Custom Event
              </div>
              <div className="flex gap-3">
                <input 
                  placeholder="Enter custom event name" 
                  value={customEvent}
                  onChange={(e) => setCustomEvent(e.target.value)}
                  className="rs-input flex-1"
                />
                <button 
                  onClick={sendCustomEvent} 
                  className="rs-button rs-button-primary"
                >
                  Send Event
                </button>
              </div>
            </div>

            {/* Scroll tracking section */}
            <div className="space-y-96 pt-24">
              <div className="text-center text-muted-foreground text-sm">
                ↓ Scroll to trigger scroll events
              </div>
              <div className="text-center text-muted-foreground text-sm opacity-50">
                Tracking scroll...
              </div>
              <div className="text-center text-muted-foreground text-sm opacity-50">
                Tracking scroll...
              </div>
              <div className="text-center text-muted-foreground text-sm opacity-50">
                Tracking scroll...
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
