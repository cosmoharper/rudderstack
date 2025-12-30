import { MessageSquare, Sparkles, Image, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Header = ({ activeTab, onTabChange }: HeaderProps) => {
  const navItems = [
    { id: 'chat', label: 'AI Chat', icon: MessageSquare },
    { id: 'content', label: 'Content Gen', icon: Sparkles },
    { id: 'image', label: 'Image Gen', icon: Image },
    { id: 'events', label: 'Events', icon: BarChart3 },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 glass-card">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center shadow-glow">
            <svg viewBox="0 0 24 24" className="h-5 w-5 text-primary-foreground" fill="currentColor">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight">RudderStack AI Demo</h1>
            <p className="text-xs text-muted-foreground">JS SDK v3 Analytics</p>
          </div>
        </div>
        
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <Button
                key={item.id}
                variant={isActive ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => onTabChange(item.id)}
                className={`gap-2 transition-all ${isActive ? 'shadow-soft' : ''}`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Button>
            );
          })}
        </nav>

        <div className="flex md:hidden items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <Button
                key={item.id}
                variant={isActive ? 'secondary' : 'ghost'}
                size="icon"
                onClick={() => onTabChange(item.id)}
                className={`transition-all ${isActive ? 'shadow-soft' : ''}`}
              >
                <Icon className="h-4 w-4" />
              </Button>
            );
          })}
        </div>
      </div>
    </header>
  );
};

export default Header;
