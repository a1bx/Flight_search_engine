import React, { useMemo, useState } from 'react';
import { Search, MapPin } from 'lucide-react';
import {
  DestinationCard,
  DestinationCardSkeleton } from
'../components/DestinationCard';
import { Input } from '../components/ui/Input';
import {
  DESTINATIONS,
  REGIONS,
  getDestinationsByRegion,
  searchDestinations } from
'../utils/destinations';
import { useAuth } from '../hooks/useAuth';
export function DestinationsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('All');
  const { user, isAuthenticated, toggleFavoriteDestination } = useAuth();
  const filteredDestinations = useMemo(() => {
    let results = getDestinationsByRegion(selectedRegion);
    if (searchQuery.trim()) {
      results = searchDestinations(searchQuery).filter(
        (d) => selectedRegion === 'All' || d.region === selectedRegion
      );
    }
    return results;
  }, [searchQuery, selectedRegion]);
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
              Discover amazing places around the world. Get travel tips,
              attraction guides, and estimated costs for your next adventure.
            </p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="border-b border-border sticky top-16 bg-background z-20">
        <div className="page-container py-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 max-w-md">
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search destinations..."
                leftIcon={<Search className="w-4 h-4" />} />

            </div>

            {/* Region Filter */}
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

      {/* Destinations Grid */}
      <section className="py-8">
        <div className="page-container">
          {filteredDestinations.length > 0 ?
          <>
              <p className="text-sm text-muted-foreground mb-6">
                Showing {filteredDestinations.length} destination
                {filteredDestinations.length !== 1 ? 's' : ''}
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
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No destinations found
              </h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filter criteria.
              </p>
            </div>
          }
        </div>
      </section>
    </div>);

}