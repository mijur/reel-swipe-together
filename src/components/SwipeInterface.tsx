import { useState, useEffect } from 'react';
import { MovieCard } from './MovieCard';
import { ServiceSelector } from './ServiceSelector';
import { Users, Share2, RotateCcw } from 'lucide-react';
import { Button } from './ui/button';
import { streamingService, type Movie } from '../services/streamingService';

interface SwipeInterfaceProps {
  roomId?: string;
  userCount: number;
}

export const SwipeInterface = ({ roomId, userCount = 1 }: SwipeInterfaceProps) => {
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const [isLoadingMovies, setIsLoadingMovies] = useState(false);
  const [allMovies, setAllMovies] = useState<Movie[]>([]);
  const [currentMovies, setCurrentMovies] = useState<Movie[]>([]);
  const [movieIndex, setMovieIndex] = useState(0);
  const [swipedMovies, setSwipedMovies] = useState<{[key: string]: 'like' | 'pass'}>({});
  const [matches, setMatches] = useState<Movie[]>([]);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<string>('');

  const handleServiceSelection = async (services: string[], region: string) => {
    setIsLoadingMovies(true);
    setSelectedServices(services);
    setSelectedRegion(region);
    
    try {
      const movies = await streamingService.fetchMoviesFromServices(services, region, 50);
      setAllMovies(movies);
      setCurrentMovies(movies.slice(0, 3));
      setMovieIndex(0);
      setSwipedMovies({});
      setMatches([]);
      setIsSetupComplete(true);
    } catch (error) {
      console.error('Failed to load movies:', error);
      // Fallback to empty state or show error
    } finally {
      setIsLoadingMovies(false);
    }
  };

  const handleSwipe = (direction: 'left' | 'right') => {
    const currentMovie = currentMovies[0];
    if (!currentMovie) return;

    // Record the swipe
    const action = direction === 'right' ? 'like' : 'pass';
    setSwipedMovies(prev => ({ ...prev, [currentMovie.id]: action }));

    // Remove the swiped card and add a new one if available
    setTimeout(() => {
      setCurrentMovies(prev => {
        const newMovies = prev.slice(1);
        const nextIndex = movieIndex + 3;
        
        if (nextIndex < allMovies.length) {
          newMovies.push(allMovies[nextIndex]);
        }
        
        return newMovies;
      });
      
      setMovieIndex(prev => prev + 1);
    }, 300);

    // Simulate match notification (in real app, this would be handled by backend)
    if (action === 'like') {
      setTimeout(() => {
        // Mock: assume 50% chance of match for demo
        if (Math.random() > 0.5) {
          setMatches(prev => [...prev, currentMovie]);
          // Show match notification
          alert(`🎉 It's a match! Everyone liked "${currentMovie.title}"`);
        }
      }, 500);
    }
  };

  const resetCards = () => {
    setCurrentMovies(allMovies.slice(0, 3));
    setMovieIndex(0);
    setSwipedMovies({});
    setMatches([]);
  };

  const goBackToSetup = () => {
    setIsSetupComplete(false);
    setAllMovies([]);
    setCurrentMovies([]);
    setMovieIndex(0);
    setSwipedMovies({});
    setMatches([]);
  };

  const shareRoom = () => {
    const url = `${window.location.origin}/room/${roomId || 'demo'}`;
    if (navigator.share) {
      navigator.share({
        title: 'Join our movie selection session!',
        text: 'Help us choose what to watch tonight',
        url: url
      });
    } else {
      navigator.clipboard.writeText(url);
      alert('Room link copied to clipboard!');
    }
  };

  // Show setup screen if not completed
  if (!isSetupComplete) {
    return (
      <ServiceSelector 
        onSelectionComplete={handleServiceSelection}
        isLoading={isLoadingMovies}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 z-10">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center">
            <Users className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-foreground font-medium">{userCount} viewer{userCount !== 1 ? 's' : ''}</span>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={goBackToSetup}
            className="border-border"
          >
            ⚙️
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={resetCards}
            className="border-border"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={shareRoom}
            className="border-border"
          >
            <Share2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Card Stack */}
      <div className="flex-1 relative overflow-hidden">
        {currentMovies.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center px-6">
              <h2 className="text-2xl font-bold text-foreground mb-4">No more movies!</h2>
              <p className="text-muted-foreground mb-6">You've gone through all available movies in your region.</p>
              <Button onClick={resetCards} className="bg-gradient-primary hover:opacity-90">
                Start Over
              </Button>
            </div>
          </div>
        ) : (
          currentMovies.map((movie, index) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onSwipe={handleSwipe}
              isTop={index === 0}
              zIndex={currentMovies.length - index}
            />
          ))
        )}
      </div>

      {/* Progress Indicator */}
      <div className="p-4">
        <div className="w-full bg-muted rounded-full h-2">
          <div 
            className="bg-gradient-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${((movieIndex) / allMovies.length) * 100}%` }}
          />
        </div>
        <p className="text-center text-muted-foreground text-sm mt-2">
          {movieIndex} of {allMovies.length} movies
        </p>
      </div>

      {/* Matches Count */}
      {matches.length > 0 && (
        <div className="px-4 pb-4">
          <div className="bg-gradient-accent rounded-lg p-4 text-center">
            <h3 className="text-accent-foreground font-semibold">
              🎬 {matches.length} Match{matches.length !== 1 ? 'es' : ''} Found!
            </h3>
          </div>
        </div>
      )}
    </div>
  );
};