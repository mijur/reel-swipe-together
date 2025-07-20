import { useState, useEffect } from 'react';
import { MovieCard } from './MovieCard';
import { Users, Share2, RotateCcw } from 'lucide-react';
import { Button } from './ui/button';

interface Movie {
  id: string;
  title: string;
  year: number;
  poster: string;
  description: string;
  genre: string[];
  rating: number;
}

// Mock movie data - in real app this would come from API
const mockMovies: Movie[] = [
  {
    id: '1',
    title: 'The Matrix',
    year: 1999,
    poster: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=600&fit=crop',
    description: 'A computer programmer discovers that reality as he knows it is a simulation and joins a rebellion to free humanity from their digital prison.',
    genre: ['Sci-Fi', 'Action'],
    rating: 5
  },
  {
    id: '2',
    title: 'Ocean Wave',
    year: 2023,
    poster: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=400&h=600&fit=crop',
    description: 'A breathtaking documentary about the power and beauty of ocean waves, exploring their impact on coastal communities around the world.',
    genre: ['Documentary', 'Nature'],
    rating: 4
  },
  {
    id: '3',
    title: 'Forest Light',
    year: 2022,
    poster: 'https://images.unsplash.com/photo-1523712999610-f77fbcfc3843?w=400&h=600&fit=crop',
    description: 'A mystical fantasy adventure following a young explorer who discovers magical creatures living in a forest illuminated by supernatural light.',
    genre: ['Fantasy', 'Adventure'],
    rating: 4
  },
  {
    id: '4',
    title: 'Starry Night',
    year: 2024,
    poster: 'https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?w=400&h=600&fit=crop',
    description: 'An epic space opera about humanity\'s first journey to a distant galaxy, filled with wonder, danger, and the search for a new home.',
    genre: ['Sci-Fi', 'Drama'],
    rating: 5
  }
];

interface SwipeInterfaceProps {
  roomId?: string;
  userCount: number;
}

export const SwipeInterface = ({ roomId, userCount = 1 }: SwipeInterfaceProps) => {
  const [currentMovies, setCurrentMovies] = useState<Movie[]>(mockMovies.slice(0, 3));
  const [movieIndex, setMovieIndex] = useState(0);
  const [swipedMovies, setSwipedMovies] = useState<{[key: string]: 'like' | 'pass'}>({});
  const [matches, setMatches] = useState<Movie[]>([]);

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
        
        if (nextIndex < mockMovies.length) {
          newMovies.push(mockMovies[nextIndex]);
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
    setCurrentMovies(mockMovies.slice(0, 3));
    setMovieIndex(0);
    setSwipedMovies({});
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
            style={{ width: `${((movieIndex) / mockMovies.length) * 100}%` }}
          />
        </div>
        <p className="text-center text-muted-foreground text-sm mt-2">
          {movieIndex} of {mockMovies.length} movies
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