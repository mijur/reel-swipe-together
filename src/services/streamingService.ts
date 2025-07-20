interface StreamingService {
  id: string;
  name: string;
  logo: string;
}

interface Region {
  code: string;
  name: string;
}

interface Movie {
  id: string;
  title: string;
  year: number;
  poster: string;
  description: string;
  genre: string[];
  rating: number;
  streamingInfo?: {
    [serviceId: string]: {
      link: string;
      available: boolean;
    };
  };
}

export const STREAMING_SERVICES: StreamingService[] = [
  { id: 'netflix', name: 'Netflix', logo: '🎬' },
  { id: 'hbo', name: 'Max (HBO)', logo: '📺' },
  { id: 'disney', name: 'Disney+', logo: '🏰' },
  { id: 'prime', name: 'Amazon Prime', logo: '📦' }
];

export const REGIONS: Region[] = [
  { code: 'us', name: 'United States' },
  { code: 'gb', name: 'United Kingdom' },
  { code: 'ca', name: 'Canada' },
  { code: 'au', name: 'Australia' },
  { code: 'de', name: 'Germany' },
  { code: 'fr', name: 'France' },
  { code: 'es', name: 'Spain' },
  { code: 'it', name: 'Italy' },
  { code: 'jp', name: 'Japan' },
  { code: 'br', name: 'Brazil' },
  { code: 'pl', name: 'Poland' }
];

class StreamingAPIService {
  private readonly baseUrl = 'https://streaming-availability.p.rapidapi.com';
  private readonly apiKey = 'demo-key'; // This should be replaced with a real API key
  
  async fetchMoviesFromServices(
    services: string[], 
    region: string, 
    limit: number = 50
  ): Promise<Movie[]> {
    try {
      // For demo purposes, we'll use mock data that varies by region/services
      // To get real data, you'd need a RapidAPI key for Streaming Availability API
      console.log(`Fetching movies for services: ${services.join(', ')} in region: ${region}`);
      
      const mockMovies = await this.getMockMoviesForRegion(region, services);
      return mockMovies.slice(0, limit);
    } catch (error) {
      console.error('Error fetching movies:', error);
      return this.getFallbackMovies();
    }
  }

  private async getMockMoviesForRegion(region: string, services: string[]): Promise<Movie[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const baseMovies = [
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
      },
      {
        id: '5',
        title: 'Urban Chronicles',
        year: 2023,
        poster: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400&h=600&fit=crop',
        description: 'A gripping drama that follows the interconnected lives of residents in a bustling metropolis as they navigate love, loss, and redemption.',
        genre: ['Drama', 'Romance'],
        rating: 4
      },
      {
        id: '6',
        title: 'Desert Storm',
        year: 2024,
        poster: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=400&h=600&fit=crop',
        description: 'An intense action thriller about a team of specialists who must survive in a hostile desert environment while completing a dangerous mission.',
        genre: ['Action', 'Thriller'],
        rating: 4
      }
    ];

    // Add region-specific and service-specific variations
    return baseMovies.map(movie => ({
      ...movie,
      id: `${movie.id}_${region}`,
      streamingInfo: this.generateStreamingInfo(services)
    }));
  }

  private generateStreamingInfo(services: string[]) {
    const info: { [key: string]: { link: string; available: boolean } } = {};
    
    services.forEach(service => {
      info[service] = {
        link: `https://${service}.com/watch`,
        available: Math.random() > 0.3 // 70% chance available
      };
    });
    
    return info;
  }

  private getFallbackMovies(): Movie[] {
    return [
      {
        id: 'fallback_1',
        title: 'Classic Adventure',
        year: 2020,
        poster: 'https://images.unsplash.com/photo-1489599828873-8ed8a48c0daa?w=400&h=600&fit=crop',
        description: 'A timeless adventure story about courage, friendship, and discovering what truly matters.',
        genre: ['Adventure', 'Family'],
        rating: 4
      }
    ];
  }
}

export const streamingService = new StreamingAPIService();
export type { Movie, StreamingService, Region };