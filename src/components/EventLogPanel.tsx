import { useState, useEffect, useRef } from 'react';
import { X, Trash2, ChevronDown, ChevronUp } from 'lucide-react';

export interface EventLogEntry {
  id: string;
  type: 'track' | 'page' | 'identify' | 'reset' | 'info';
  name: string;
  data?: Record<string, unknown>;
  timestamp: Date;
}

// Global event store
let eventListeners: ((events: EventLogEntry[]) => void)[] = [];
let events: EventLogEntry[] = [];

export const logEvent = (entry: Omit<EventLogEntry, 'id' | 'timestamp'>) => {
  const newEvent: EventLogEntry = {
    ...entry,
    id: crypto.randomUUID(),
    timestamp: new Date(),
  };
  events = [newEvent, ...events].slice(0, 100); // Keep last 100 events
  eventListeners.forEach((listener) => listener(events));
};

export const clearEvents = () => {
  events = [];
  eventListeners.forEach((listener) => listener(events));
};

const EventLogPanel = () => {
  const [eventLog, setEventLog] = useState<EventLogEntry[]>(events);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const listener = (newEvents: EventLogEntry[]) => {
      setEventLog([...newEvents]);
    };
    eventListeners.push(listener);
    return () => {
      eventListeners = eventListeners.filter((l) => l !== listener);
    };
  }, []);

  const getTypeColor = (type: EventLogEntry['type']) => {
    switch (type) {
      case 'track':
        return 'bg-primary text-primary-foreground';
      case 'page':
        return 'bg-accent text-accent-foreground';
      case 'identify':
        return 'bg-secondary text-secondary-foreground';
      case 'reset':
        return 'bg-destructive text-destructive-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 z-50 rs-button rs-button-primary shadow-lg"
      >
        Show Event Log
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-96 max-w-[calc(100vw-2rem)] bg-background border border-border rounded-lg shadow-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-secondary/50 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
          <span className="font-medium text-sm text-foreground">Event Log</span>
          <span className="text-xs text-muted-foreground">({eventLog.length})</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={clearEvents}
            className="p-1.5 hover:bg-muted rounded-md transition-colors"
            title="Clear events"
          >
            <Trash2 className="w-4 h-4 text-muted-foreground" />
          </button>
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1.5 hover:bg-muted rounded-md transition-colors"
            title={isMinimized ? 'Expand' : 'Minimize'}
          >
            {isMinimized ? (
              <ChevronUp className="w-4 h-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            )}
          </button>
          <button
            onClick={() => setIsVisible(false)}
            className="p-1.5 hover:bg-muted rounded-md transition-colors"
            title="Close"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Event List */}
      {!isMinimized && (
        <div
          ref={scrollRef}
          className="max-h-80 overflow-y-auto divide-y divide-border"
        >
          {eventLog.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-muted-foreground">
              No events yet. Fire some events to see them here.
            </div>
          ) : (
            eventLog.map((event) => (
              <div
                key={event.id}
                className="px-4 py-3 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded ${getTypeColor(
                      event.type
                    )}`}
                  >
                    {event.type}
                  </span>
                  <span className="font-mono text-sm text-foreground truncate flex-1">
                    {event.name}
                  </span>
                  <span className="text-[10px] text-muted-foreground font-mono">
                    {formatTime(event.timestamp)}
                  </span>
                </div>
                {event.data && Object.keys(event.data).length > 0 && (
                  <pre className="text-[10px] text-muted-foreground font-mono bg-muted/50 rounded px-2 py-1 mt-1 overflow-x-auto">
                    {JSON.stringify(event.data, null, 2)}
                  </pre>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default EventLogPanel;
