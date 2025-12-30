import { useState } from 'react';
import { Sparkles, Copy, Check, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { trackAIEvent } from '@/lib/rudderstack';
import { toast } from 'sonner';

const ContentGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [contentType, setContentType] = useState('blog');
  const [tone, setTone] = useState('professional');
  const [generatedContent, setGeneratedContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const generateContent = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt');
      return;
    }

    setIsGenerating(true);
    
    // Track generation started
    trackAIEvent('content_generator', 'generation_started', {
      prompt_length: prompt.length,
      content_type: contentType,
      tone,
    });

    // Simulate AI content generation
    await new Promise((resolve) => setTimeout(resolve, 1500 + Math.random() * 1000));

    const contentTemplates: Record<string, string> = {
      blog: `# ${prompt}\n\nIn today's data-driven landscape, understanding your customers has never been more critical. RudderStack empowers businesses to collect, unify, and activate their customer data with unprecedented precision.\n\n## Key Insights\n\nWhen it comes to ${prompt.toLowerCase()}, companies need a robust data infrastructure that can scale with their growth. Here are some essential considerations:\n\n1. **Real-time Event Streaming** - Capture user interactions as they happen\n2. **Data Warehouse Integration** - Build a single source of truth\n3. **Privacy-First Approach** - Ensure compliance with regulations\n\n## Conclusion\n\nBy leveraging modern data tools, organizations can transform raw data into actionable insights that drive business outcomes.`,
      social: `🚀 Excited to share insights about ${prompt}!\n\nData is the new oil, but only if you know how to refine it. Here's what we've learned:\n\n✨ Event tracking is essential\n📊 Real-time analytics matter\n🔒 Privacy should be built-in\n\n#DataAnalytics #CustomerData #RudderStack`,
      email: `Subject: Transform Your Approach to ${prompt}\n\nDear Reader,\n\nI wanted to reach out about an exciting development in how businesses approach ${prompt.toLowerCase()}.\n\nAt its core, effective data management requires:\n• Unified customer profiles\n• Real-time event processing\n• Seamless integrations\n\nWould you be interested in learning more?\n\nBest regards,\nThe Team`,
      product: `## ${prompt}\n\n**Overview**\nA comprehensive solution designed to address the challenges of modern data infrastructure.\n\n**Key Features**\n- Event Streaming: Capture every user interaction in real-time\n- Data Routing: Send data to 200+ destinations\n- Identity Resolution: Build complete customer profiles\n- Warehouse-First: Your data warehouse is the source of truth\n\n**Benefits**\n✓ Reduce integration time by 80%\n✓ Improve data quality\n✓ Scale with confidence`,
    };

    const content = contentTemplates[contentType] || contentTemplates.blog;
    setGeneratedContent(content);
    setIsGenerating(false);

    // Track generation completed
    trackAIEvent('content_generator', 'generation_completed', {
      content_length: content.length,
      content_type: contentType,
      tone,
    });

    toast.success('Content generated successfully!');
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(generatedContent);
    setCopied(true);
    
    trackAIEvent('content_generator', 'content_copied', {
      content_length: generatedContent.length,
    });
    
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="glass-card rounded-xl p-6 shadow-card">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold">Content Generator</h3>
            <p className="text-sm text-muted-foreground">AI-powered content creation</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Content Type</Label>
              <Select value={contentType} onValueChange={setContentType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="blog">Blog Post</SelectItem>
                  <SelectItem value="social">Social Media</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="product">Product Description</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Tone</Label>
              <Select value={tone} onValueChange={setTone}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="casual">Casual</SelectItem>
                  <SelectItem value="friendly">Friendly</SelectItem>
                  <SelectItem value="persuasive">Persuasive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Your Prompt</Label>
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe what content you want to generate..."
              className="min-h-[120px] resize-none"
            />
          </div>

          <Button 
            onClick={generateContent} 
            disabled={isGenerating || !prompt.trim()}
            className="w-full gap-2"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Generate Content
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="glass-card rounded-xl p-6 shadow-card">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold">Generated Content</h4>
          {generatedContent && (
            <Button variant="ghost" size="sm" onClick={copyToClipboard} className="gap-2">
              {copied ? (
                <>
                  <Check className="h-4 w-4" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copy
                </>
              )}
            </Button>
          )}
        </div>

        <div className="min-h-[300px] rounded-lg bg-muted/50 p-4 overflow-auto">
          {generatedContent ? (
            <pre className="whitespace-pre-wrap text-sm font-mono leading-relaxed">
              {generatedContent}
            </pre>
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              <p className="text-center">
                Generated content will appear here.
                <br />
                <span className="text-xs">Enter a prompt and click generate.</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContentGenerator;
