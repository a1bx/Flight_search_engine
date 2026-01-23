import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Heart, DollarSign } from 'lucide-react';
import { Destination } from '../types/flight';
interface DestinationCardProps {
  destination: Destination;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}
export function DestinationCard({
  destination,
  isFavorite = false,
  onToggleFavorite
}: DestinationCardProps) {
  return (
    <div className="group bg-card border border-border rounded-xl overflow-hidden card-hover">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={destination.image}
          alt={destination.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />

        {onToggleFavorite &&
        <button
          onClick={(e) => {
            e.preventDefault();
            onToggleFavorite();
          }}
          className={`
              absolute top-3 right-3 p-2 rounded-full transition-colors
              ${isFavorite ? 'bg-destructive text-white' : 'bg-background/80 text-muted-foreground hover:text-destructive'}
            `}>

            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        }
        <div className="absolute bottom-3 left-3 flex items-center gap-1 px-2 py-1 bg-background/90 rounded-full">
          <DollarSign className="w-3 h-3 text-success" />
          <span className="text-xs font-medium text-foreground">
            From ${destination.averageFlightPrice}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="font-semibold text-foreground">
              {destination.name}
            </h3>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="w-3 h-3" />
              {destination.country}
            </div>
          </div>
          <span className="px-2 py-1 text-xs font-medium bg-muted text-muted-foreground rounded-full">
            {destination.region}
          </span>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
          {destination.description}
        </p>

        <Link
          to={`/destinations/${destination.id}`}
          className="inline-flex items-center text-sm font-medium text-primary hover:underline">

          Explore destination →
        </Link>
      </div>
    </div>);

}
export function DestinationCardSkeleton() {
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <div className="h-48 shimmer" />
      <div className="p-4 space-y-3">
        <div className="flex justify-between">
          <div className="space-y-2">
            <div className="h-5 w-24 shimmer rounded" />
            <div className="h-4 w-16 shimmer rounded" />
          </div>
          <div className="h-6 w-16 shimmer rounded-full" />
        </div>
        <div className="h-10 shimmer rounded" />
        <div className="h-4 w-32 shimmer rounded" />
      </div>
    </div>);

}