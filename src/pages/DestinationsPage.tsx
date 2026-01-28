import React, { useEffect, useMemo, useState } from 'react';
import { Search, MapPin, Zap, ExternalLink } from 'lucide-react';
import {
  DestinationCard,
  DestinationCardSkeleton
} from
  '../components/DestinationCard';
import { Input } from '../components/ui/Input';
import {
  REGIONS
} from
  '../utils/destinations';
import { useAuth } from '../hooks/useAuth';
import { Destination } from '../types/flight';

function TrendingDestinations() {
  const [trending, setTrending] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    fetch('http://localhost:3001/api/destinations/inspiration?origin=JFK')
      .then(res => res.json())
      .then(data => {
        setTrending(data.slice(0, 6));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 animate-pulse">
    {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-40 bg-muted rounded-2xl" />)}
  </div>;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {trending.map((dest, i) => (
        <a
          key={i}
          href={`/search?destination=${dest.destination}`}
          className="group relative h-40 rounded-2xl overflow-hidden bg-card border border-border flex flex-col justify-end p-4 hover:shadow-xl transition-all"
        >
          <img
            src={`https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400&q=80&sig=${i}`}
            className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-500"
            alt={dest.destination}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
          <div className="relative z-10">
            <p className="text-white font-bold text-lg">{dest.destination}</p>
            <p className="text-primary-300 text-xs font-bold flex items-center gap-1">
              From ${dest.price.total} <ExternalLink className="w-3 h-3" />
            </p>
          </div>
        </a>
      ))}
    </div>
  );
}
export function DestinationsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [realDestinations, setRealDestinations] = useState<Destination[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, isAuthenticated, toggleFavoriteDestination } = useAuth();

  useEffect(() => {
    const loadDestinations = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('http://localhost:3001/api/destinations/inspiration');
        const data = await response.json();

        // Map API data to Destination type
        const mapped: Destination[] = data.map((d: any) => ({
          id: d.destination,
          name: d.city || d.destination,
          country: d.country || 'Unknown',
          region: d.region || 'World',
          image: `https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80&sig=${d.destination}`,
          description: `Discover the wonders of ${d.city || d.destination}. Enjoy amazing views and local culture.`,
          averageFlightPrice: parseFloat(d.price?.total || '0'),
          currency: 'USD',
          bestTimeToVisit: 'Year-round',
          visaRequired: false,
          language: 'Local',
          timezone: 'Local Time',
          attractions: [],
          tips: ['Book in advance', 'Explore local cuisine'],
          averageCosts: {
            accommodation: 120,
            meals: 45,
            transportation: 15,
            activities: 30
          }
        }));
        setRealDestinations(mapped);
      } catch (error) {
        console.error('Failed to load real destinations:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadDestinations();
  }, []);

  const filteredDestinations = useMemo(() => {
    let results = realDestinations.length > 0 ? realDestinations : [];
    if (searchQuery.trim()) {
      results = results.filter(
        (d) =>
          d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          d.id.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (selectedRegion !== 'All') {
      results = results.filter(d => d.region === selectedRegion);
    }
    return results;
  }, [searchQuery, selectedRegion, realDestinations]);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="bg-muted/30 py-12">
        <div className="page-container">
          <div className="max-w-2xl">
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Explore Destinations
            </h1>
            <p className="text-lg text-muted-foreground">
              Discover amazing places around the world with real-life flight inspiration and destination details.
            </p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="border-b border-border sticky top-16 bg-background z-20">
        <div className="page-container py-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 max-w-md">
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search destinations (e.g. LON, Paris)..."
                leftIcon={<Search className="w-4 h-4" />} />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
              {REGIONS.map((region) =>
                <button
                  key={region}
                  onClick={() => setSelectedRegion(region)}
                  className={`
                    px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap
                    transition-colors
                    ${selectedRegion === region ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'}
                  `}>
                  {region}
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Trending Section */}
      <section className="py-12 bg-primary/5">
        <div className="page-container">
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
            <Zap className="w-6 h-6 text-primary" /> Discovery Inspiration
          </h2>
          <TrendingDestinations />
        </div>
      </section>

      {/* Destinations Grid */}
      <section className="py-8 text-foreground">
        <div className="page-container">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => <DestinationCardSkeleton key={i} />)}
            </div>
          ) : filteredDestinations.length > 0 ?
            <>
              <p className="text-sm text-muted-foreground mb-6">
                Showing {filteredDestinations.length} real destination
                {filteredDestinations.length !== 1 ? 's' : ''} from Amadeus
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDestinations.map((destination) =>
                  <DestinationCard
                    key={destination.id}
                    destination={destination}
                    isFavorite={user?.favoriteDestinations.includes(
                      destination.id
                    )}
                    onToggleFavorite={
                      isAuthenticated ?
                        () => toggleFavoriteDestination(destination.id) :
                        undefined
                    } />
                )}
              </div>
            </> :

            <div className="text-center py-16">
              <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                <MapPin className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                No destinations found
              </h3>
              <p className="text-muted-foreground">
                Try adjusting your search query.
              </p>
            </div>
          }
        </div>
      </section>
    </div>);
}