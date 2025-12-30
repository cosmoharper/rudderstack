import { useState, useEffect } from 'react';
import { Activity, Zap, Clock, Hash } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface TrackedEvent {
  id: string;
  name: string;
  properties: Record<string, unknown>;
  timestamp: Date;
  type: 'page' | 'track' | 'identify';
}

// Mock events storage for demo purposes
const eventHistory: TrackedEvent[] = [];

export const logEvent = (name: string, properties: Record<string, unknown> = {}, type: 'page' | 'track' | 'identify' = 'track') => {
  const event: TrackedEvent = {
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    name,
    properties,
    timestamp: new Date(),
    type,
  };
  eventHistory.unshift(event);
  if (eventHistory.length > 50) eventHistory.pop();
  
  // Dispatch custom event for real-time updates
  window.dispatchEvent(new CustomEvent('rudderstack-event', { detail: event }));
};

const EventsPanel = () => {
  const [events, setEvents] = useState<TrackedEvent[]>([]);

  useEffect(() => {
    // Initial load
    setEvents([...eventHistory]);

    // Listen for new events
    const handleEvent = (e: CustomEvent<TrackedEvent>) => {
      setEvents((prev) => [e.detail, ...prev].slice(0, 50));
    };

    window.addEventListener('rudderstack-event', handleEvent as EventListener);
    return () => window.removeEventListener('rudderstack-event', handleEvent as EventListener);
  }, []);

  const getEventColor = (type: string) => {
    switch (type) {
      case 'page': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'identify': return 'bg-green-500/10 text-green-500 border-green-500/20';
      default: return 'bg-primary/10 text-primary border-primary/20';
    }
  };

  const formatValue = (value: unknown): string => {
    if (typeof value === 'string') return value.length > 30 ? value.slice(0, 30) + '...' : value;
    if (typeof value === 'number') return value.toString();
    if (typeof value === 'boolean') return value ? 'true' : 'false';
    return JSON.stringify(value);
  };

  return (
    <div className="glass-card rounded-xl shadow-card overflow-hidden">
      <div className="p-4 border-b border-border/50 bg-secondary/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Activity className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">Event Stream</h3>
              <p className="text-xs text-muted-foreground">Real-time RudderStack events</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-accent animate-pulse" />
            <span className="text-xs text-muted-foreground">{events.length} events</span>
          </div>
        </div>
      </div>

      <div className="max-h-[500px] overflow-y-auto">
        {events.length > 0 ? (
          <div className="divide-y divide-border/30">
            {events.map((event) => (
              <div key={event.id} className="p-4 hover:bg-muted/30 transition-colors animate-slide-up">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-primary" />
                    <span className="font-mono text-sm font-medium">{event.name}</span>
                  </div>
                  <Badge variant="outline" className={getEventColor(event.type)}>
                    {event.type}
                  </Badge>
                </div>
                
                {Object.keys(event.properties).length > 0 && (
                  <div className="mt-2 rounded-md bg-muted/50 p-2 overflow-x-auto">
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(event.properties).slice(0, 5).map(([key, value]) => (
                        <div key={key} className="flex items-center gap-1 text-xs">
                          <Hash className="h-3 w-3 text-muted-foreground" />
                          <span className="text-muted-foreground">{key}:</span>
                          <span className="font-mono text-foreground">{formatValue(value)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {event.timestamp.toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center text-muted-foreground">
            <Activity className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No events captured yet</p>
            <p className="text-xs mt-1">Interact with the AI features to see events</p>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-border/50 bg-muted/20">
        <p className="text-xs text-muted-foreground text-center">
          Events are captured in real-time and sent to RudderStack.
          <br />
          Configure your <code className="font-mono text-primary">WRITE_KEY</code> and <code className="font-mono text-primary">DATA_PLANE_URL</code> to enable.
        </p>
      </div>
    </div>
  );
};

export default EventsPanel;
