import { useState } from 'react';
import { Image as ImageIcon, Download, RefreshCw, Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { trackAIEvent } from '@/lib/rudderstack';
import { toast } from 'sonner';

interface GeneratedImage {
  id: string;
  prompt: string;
  url: string;
  timestamp: Date;
}

const ImageGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('realistic');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);

  // Placeholder images for demo (would be replaced with actual AI generation)
  const placeholderImages = [
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=512&h=512&fit=crop',
    'https://images.unsplash.com/photo-1614850715649-1d0106293bd1?w=512&h=512&fit=crop',
    'https://images.unsplash.com/photo-1617791160505-6f00504e3519?w=512&h=512&fit=crop',
    'https://images.unsplash.com/photo-1634017839464-5c339bbe3c35?w=512&h=512&fit=crop',
  ];

  const generateImage = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt');
      return;
    }

    setIsGenerating(true);

    // Track generation started
    trackAIEvent('image_generator', 'generation_started', {
      prompt_length: prompt.length,
      style,
      aspect_ratio: aspectRatio,
    });

    // Simulate AI image generation
    await new Promise((resolve) => setTimeout(resolve, 2000 + Math.random() * 1500));

    const newImage: GeneratedImage = {
      id: Date.now().toString(),
      prompt: prompt,
      url: placeholderImages[Math.floor(Math.random() * placeholderImages.length)],
      timestamp: new Date(),
    };

    setGeneratedImages((prev) => [newImage, ...prev]);
    setIsGenerating(false);

    // Track generation completed
    trackAIEvent('image_generator', 'generation_completed', {
      image_id: newImage.id,
      prompt: prompt,
      style,
      aspect_ratio: aspectRatio,
    });

    toast.success('Image generated successfully!');
    setPrompt('');
  };

  const downloadImage = async (image: GeneratedImage) => {
    trackAIEvent('image_generator', 'image_downloaded', {
      image_id: image.id,
    });
    
    // In a real app, this would download the actual image
    toast.success('Download started!');
  };

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="glass-card rounded-xl p-6 shadow-card">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Wand2 className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold">Image Generator</h3>
            <p className="text-sm text-muted-foreground">Create with AI</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Prompt</Label>
            <Input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="A futuristic data warehouse..."
              onKeyDown={(e) => e.key === 'Enter' && generateImage()}
            />
          </div>

          <div className="space-y-2">
            <Label>Style</Label>
            <Select value={style} onValueChange={setStyle}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="realistic">Realistic</SelectItem>
                <SelectItem value="artistic">Artistic</SelectItem>
                <SelectItem value="abstract">Abstract</SelectItem>
                <SelectItem value="minimalist">Minimalist</SelectItem>
                <SelectItem value="3d">3D Render</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Aspect Ratio</Label>
            <Select value={aspectRatio} onValueChange={setAspectRatio}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1:1">Square (1:1)</SelectItem>
                <SelectItem value="16:9">Landscape (16:9)</SelectItem>
                <SelectItem value="9:16">Portrait (9:16)</SelectItem>
                <SelectItem value="4:3">Standard (4:3)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button 
            onClick={generateImage} 
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
                <Wand2 className="h-4 w-4" />
                Generate Image
              </>
            )}
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            Demo mode: Using placeholder images.
            <br />
            Connect Lovable Cloud for real AI generation.
          </p>
        </div>
      </div>

      <div className="lg:col-span-2 glass-card rounded-xl p-6 shadow-card">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold">Generated Images</h4>
          <span className="text-sm text-muted-foreground">{generatedImages.length} images</span>
        </div>

        {generatedImages.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {generatedImages.map((image) => (
              <div
                key={image.id}
                className="group relative rounded-lg overflow-hidden border border-border/50 animate-slide-up"
              >
                <img
                  src={image.url}
                  alt={image.prompt}
                  className="w-full aspect-square object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="text-sm font-medium text-foreground truncate mb-2">
                      {image.prompt}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        {image.timestamp.toLocaleTimeString()}
                      </span>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => downloadImage(image)}
                        className="gap-1"
                      >
                        <Download className="h-3 w-3" />
                        Save
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="min-h-[300px] rounded-lg bg-muted/30 flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <ImageIcon className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No images generated yet</p>
              <p className="text-xs mt-1">Enter a prompt and click generate</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageGenerator;
