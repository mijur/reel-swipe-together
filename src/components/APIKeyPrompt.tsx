import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { ExternalLink } from 'lucide-react';

interface APIKeyPromptProps {
  onApiKeySubmit: (apiKey: string) => void;
  onUseMockData: () => void;
}

export const APIKeyPrompt = ({ onApiKeySubmit, onUseMockData }: APIKeyPromptProps) => {
  const [apiKey, setApiKey] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      onApiKeySubmit(apiKey.trim());
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center px-6 py-8">
      <div className="max-w-md mx-auto w-full space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">MovieMatch</h1>
          <p className="text-muted-foreground">Get real movie data from streaming services</p>
        </div>

        <Card className="p-6 space-y-4">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-foreground mb-2">API Integration</h2>
            <p className="text-sm text-muted-foreground mb-4">
              To get real movies from Netflix, Disney+, Max, and Amazon Prime, you need a RapidAPI key for the Streaming Availability API.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="apiKey" className="block text-sm font-medium text-foreground mb-2">
                RapidAPI Key
              </label>
              <Input
                id="apiKey"
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your RapidAPI key"
                className="w-full"
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-gradient-primary hover:opacity-90"
              disabled={!apiKey.trim()}
            >
              Use Real Movie Data
            </Button>
          </form>

          <div className="text-center">
            <p className="text-xs text-muted-foreground mb-3">
              Don't have an API key? Get one free from RapidAPI
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => window.open('https://rapidapi.com/movie-of-the-night-movie-of-the-night-default/api/streaming-availability', '_blank')}
              className="mb-4"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Get API Key
            </Button>
          </div>

          <div className="border-t border-border pt-4">
            <Button 
              variant="outline" 
              onClick={onUseMockData}
              className="w-full"
            >
              Continue with Demo Data
            </Button>
            <p className="text-xs text-muted-foreground text-center mt-2">
              Use sample movies for testing (not real streaming data)
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};