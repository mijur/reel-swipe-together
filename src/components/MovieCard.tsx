import { useState, useRef } from 'react';
import { Heart, X } from 'lucide-react';

interface Movie {
  id: string;
  title: string;
  year: number;
  poster: string;
  description: string;
  genre: string[];
  rating: number;
}

interface MovieCardProps {
  movie: Movie;
  onSwipe: (direction: 'left' | 'right') => void;
  isTop: boolean;
  zIndex: number;
}

export const MovieCard = ({ movie, onSwipe, isTop, zIndex }: MovieCardProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [showDescription, setShowDescription] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const pressTimer = useRef<NodeJS.Timeout>();

  const handlePointerDown = (e: React.PointerEvent) => {
    if (!isTop || isAnimating) return;
    
    setIsDragging(true);
    
    // Start timer for long press
    pressTimer.current = setTimeout(() => {
      setShowDescription(true);
    }, 500);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !isTop || isAnimating) return;
    
    // Clear long press timer on move
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
    }
    
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const deltaX = e.clientX - centerX;
    const deltaY = e.clientY - centerY;
    
    setDragOffset({ x: deltaX, y: deltaY });
  };

  const handlePointerUp = () => {
    if (!isDragging || !isTop || isAnimating) return;
    
    // Clear long press timer
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
    }
    
    setIsDragging(false);
    
    const threshold = 100;
    
    if (Math.abs(dragOffset.x) > threshold) {
      setIsAnimating(true);
      const direction = dragOffset.x > 0 ? 'right' : 'left';
      onSwipe(direction);
    } else {
      setDragOffset({ x: 0, y: 0 });
    }
  };

  const handleButtonSwipe = (direction: 'left' | 'right') => {
    if (isAnimating) return;
    setIsAnimating(true);
    onSwipe(direction);
  };

  const rotation = isTop ? Math.min(Math.max(dragOffset.x / 10, -15), 15) : 0;
  const opacity = Math.max(1 - Math.abs(dragOffset.x) / 200, 0.5);
  
  const showLeftIndicator = dragOffset.x < -50;
  const showRightIndicator = dragOffset.x > 50;

  return (
    <div 
      className="absolute inset-0 flex items-center justify-center px-4"
      style={{ zIndex }}
    >
      <div
        ref={cardRef}
        className={`
          relative w-full max-w-sm h-[600px] rounded-3xl overflow-hidden
          bg-gradient-card shadow-card cursor-grab active:cursor-grabbing
          ${isDragging ? 'transition-none' : 'transition-all duration-300 ease-out'}
          ${isAnimating ? (dragOffset.x > 0 ? 'animate-swipe-right' : 'animate-swipe-left') : ''}
        `}
        style={{
          transform: isTop 
            ? `translateX(${dragOffset.x}px) translateY(${dragOffset.y * 0.1}px) rotate(${rotation}deg)` 
            : `scale(${0.95 - (zIndex * 0.02)}) translateY(${zIndex * 8}px)`,
          opacity: isTop ? opacity : 1,
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        {/* Movie Poster */}
        <div className="relative h-full">
          <img 
            src={movie.poster} 
            alt={movie.title}
            className="w-full h-full object-cover"
            draggable={false}
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          
          {/* Movie Info */}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <h2 className="text-2xl font-bold text-white mb-2">{movie.title}</h2>
            <p className="text-white/80 text-sm mb-2">{movie.year} • {movie.genre.join(', ')}</p>
            <div className="flex items-center gap-1">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Heart 
                    key={i} 
                    className={`w-4 h-4 ${i < movie.rating ? 'text-accent fill-accent' : 'text-white/30'}`} 
                  />
                ))}
              </div>
              <span className="text-white/60 text-sm ml-2">{movie.rating}/5</span>
            </div>
          </div>
          
          {/* Swipe Indicators */}
          {showLeftIndicator && (
            <div className="absolute top-1/2 left-8 transform -translate-y-1/2 
                          bg-destructive/90 rounded-full p-4 animate-bounce-in">
              <X className="w-8 h-8 text-destructive-foreground" />
            </div>
          )}
          
          {showRightIndicator && (
            <div className="absolute top-1/2 right-8 transform -translate-y-1/2 
                          bg-success/90 rounded-full p-4 animate-bounce-in">
              <Heart className="w-8 h-8 text-success-foreground fill-current" />
            </div>
          )}
        </div>
      </div>
      
      {/* Action Buttons - Only show on top card */}
      {isTop && (
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-6">
          <button
            onClick={() => handleButtonSwipe('left')}
            className="w-14 h-14 rounded-full bg-destructive/20 border-2 border-destructive 
                     flex items-center justify-center hover:bg-destructive/30 transition-colors
                     active:scale-95 transform"
          >
            <X className="w-6 h-6 text-destructive" />
          </button>
          
          <button
            onClick={() => handleButtonSwipe('right')}
            className="w-14 h-14 rounded-full bg-success/20 border-2 border-success 
                     flex items-center justify-center hover:bg-success/30 transition-colors
                     active:scale-95 transform"
          >
            <Heart className="w-6 h-6 text-success" />
          </button>
        </div>
      )}
      
      {/* Description Overlay */}
      {showDescription && (
        <div 
          className="absolute inset-0 bg-black/90 flex items-center justify-center p-6 animate-fade-in z-50"
          onClick={() => setShowDescription(false)}
        >
          <div className="text-center">
            <h3 className="text-xl font-bold text-white mb-4">{movie.title}</h3>
            <p className="text-white/90 leading-relaxed">{movie.description}</p>
            <p className="text-white/60 text-sm mt-4">Tap to close</p>
          </div>
        </div>
      )}
    </div>
  );
};