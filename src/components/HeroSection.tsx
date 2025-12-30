import { ArrowRight, Zap, Database, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeroSectionProps {
  onGetStarted: () => void;
}

const HeroSection = ({ onGetStarted }: HeroSectionProps) => {
  return (
    <section className="relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div 
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full opacity-20"
          style={{ background: 'var(--gradient-primary)', filter: 'blur(120px)' }}
        />
      </div>

      <div className="container py-20 md:py-28">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-border/50 mb-6 animate-slide-up">
            <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
            <span className="text-sm font-medium text-secondary-foreground">JavaScript SDK v3</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Track AI Features with{' '}
            <span className="gradient-text">RudderStack</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '0.2s' }}>
            A demo app showcasing RudderStack's JavaScript SDK v3 integration with AI-powered features. 
            See real-time event tracking in action.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <Button size="lg" onClick={onGetStarted} className="gap-2 shadow-glow">
              Try AI Features
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="https://www.rudderstack.com/docs/sources/event-streams/sdks/rudderstack-javascript-sdk/" target="_blank" rel="noopener noreferrer">
                View SDK Docs
              </a>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '0.4s' }}>
            {[
              { icon: Zap, title: 'Real-time Tracking', desc: 'Events captured instantly' },
              { icon: Database, title: 'Warehouse-First', desc: 'Data warehouse as source of truth' },
              { icon: Shield, title: 'Privacy Ready', desc: 'Built-in consent management' },
            ].map((feature) => (
              <div key={feature.title} className="glass-card rounded-xl p-4 shadow-card">
                <feature.icon className="h-6 w-6 text-primary mb-2 mx-auto" />
                <h3 className="font-semibold text-sm">{feature.title}</h3>
                <p className="text-xs text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
