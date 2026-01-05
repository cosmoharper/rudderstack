import { useState, useEffect, useRef } from 'react';
import { rudderAnalytics, initRudderStack } from '@/lib/rudderstack';

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
    <div className="min-h-[300vh] p-8 font-sans">
      <main className="max-w-4xl mx-auto">
        {showKeyEntry && (
          <div className="mb-8 p-6 bg-muted rounded-lg">
            <form onSubmit={addKey} className="flex flex-wrap gap-4 items-center">
              <label className="flex items-center gap-2">
                Dataplane URL:
                <input
                  type="text"
                  value={dataPlane}
                  onChange={(e) => setDataPlane(e.target.value)}
                  className="px-3 py-2 border rounded bg-background"
                />
              </label>
              <label className="flex items-center gap-2">
                Write Key:
                <input
                  type="text"
                  value={writeKey}
                  onChange={(e) => setWriteKey(e.target.value)}
                  className="px-3 py-2 border rounded bg-background"
                />
              </label>
              <button type="submit" className="px-4 py-2 bg-primary text-primary-foreground rounded hover:opacity-90">
                Submit
              </button>
            </form>
          </div>
        )}

        {!showKeyEntry && (
          <div className="space-y-6">
            <h1 className="text-4xl font-bold">RudderStack Testing</h1>
            
            <div className="p-4 bg-muted rounded-lg">
              <span>You're using:</span><br />
              writeKey <span className="font-bold">{writeKey}</span><br />
              dataPlane <span className="font-bold">{dataPlane}</span><br />
              <button onClick={toggleWriteKey} className="text-primary underline mt-2">
                (Click here to change)
              </button>
            </div>

            <div className="flex flex-wrap gap-3">
              <button 
                onClick={() => sendTrackEvent('event_key')} 
                className="px-4 py-2 bg-primary text-primary-foreground rounded hover:opacity-90"
              >
                Track Event
              </button>
              <button 
                onClick={() => sendTrackEvent('purchase')} 
                className="px-4 py-2 bg-primary text-primary-foreground rounded hover:opacity-90"
              >
                Track Event: Purchase
              </button>
            </div>

            <div className="flex flex-wrap gap-3">
              <button 
                onClick={() => sendIdentify(false)} 
                className="px-4 py-2 bg-primary text-primary-foreground rounded hover:opacity-90"
              >
                Identify
              </button>
              <button 
                onClick={() => sendIdentify(true)} 
                className="px-4 py-2 bg-primary text-primary-foreground rounded hover:opacity-90"
              >
                Identify and Form Submit
              </button>
              <button 
                onClick={sendReset} 
                className="px-4 py-2 bg-primary text-primary-foreground rounded hover:opacity-90"
              >
                Reset (logout)
              </button>
            </div>

            <div className="space-y-3">
              <button 
                onClick={sendIdentifyWithTraits} 
                className="px-4 py-2 bg-primary text-primary-foreground rounded hover:opacity-90"
              >
                Identify w/ traits
              </button>
              <div className="flex flex-wrap gap-2">
                <input 
                  placeholder="Key 1" 
                  value={trait1Key}
                  onChange={(e) => setTrait1Key(e.target.value)}
                  className="px-3 py-2 border rounded bg-background"
                />
                <input 
                  placeholder="Value 1" 
                  value={trait1Value}
                  onChange={(e) => setTrait1Value(e.target.value)}
                  className="px-3 py-2 border rounded bg-background"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <input 
                  placeholder="Key 2" 
                  value={trait2Key}
                  onChange={(e) => setTrait2Key(e.target.value)}
                  className="px-3 py-2 border rounded bg-background"
                />
                <input 
                  placeholder="Value 2" 
                  value={trait2Value}
                  onChange={(e) => setTrait2Value(e.target.value)}
                  className="px-3 py-2 border rounded bg-background"
                />
              </div>
            </div>

            <div>
              <button 
                onClick={sendPageView} 
                className="px-4 py-2 bg-primary text-primary-foreground rounded hover:opacity-90"
              >
                Page
              </button>
            </div>

            <div className="flex flex-wrap gap-3 items-center">
              <button 
                onClick={sendCustomEvent} 
                className="px-4 py-2 bg-primary text-primary-foreground rounded hover:opacity-90"
              >
                Send custom event:
              </button>
              <input 
                placeholder="event_name" 
                value={customEvent}
                onChange={(e) => setCustomEvent(e.target.value)}
                className="px-3 py-2 border rounded bg-background"
              />
            </div>

            <div className="flex flex-wrap gap-3 items-center">
              <button 
                onClick={startAutoPlay} 
                disabled={isPlaying}
                className="px-4 py-2 bg-primary text-primary-foreground rounded hover:opacity-90 disabled:opacity-50"
              >
                Start auto send page events
              </button>
              <button 
                onClick={stopAutoPlay} 
                disabled={!isPlaying}
                className="px-4 py-2 bg-primary text-primary-foreground rounded hover:opacity-90 disabled:opacity-50"
              >
                Stop auto send page events
              </button>
              {isPlaying && (
                <div className="flex gap-1">
                  <div className="w-3 h-3 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-3 h-3 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-3 h-3 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              )}
            </div>

            <div className="pt-96 text-muted-foreground">Tracking Scroll...</div>
            <div className="pt-96 text-muted-foreground">Tracking Scroll...</div>
            <div className="pt-96 text-muted-foreground">Tracking Scroll...</div>
            <div className="pt-96 text-muted-foreground">Tracking Scroll...</div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
