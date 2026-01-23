import React from 'react';
import { Link } from 'react-router-dom';
import { Plane, Car, MapPin, ArrowRight } from 'lucide-react';
import { NearbyAirport } from '../types/flight';
import { Button } from './ui/Button';
interface AirportCardProps {
  airport: NearbyAirport;
}
export function AirportCard({ airport }: AirportCardProps) {
  return (
    <div className="bg-card border border-border rounded-xl p-5 card-hover">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-primary/10 rounded-xl flex-shrink-0">
          <Plane className="w-6 h-6 text-primary" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="font-semibold text-foreground">{airport.name}</h3>
              <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                <MapPin className="w-3 h-3" />
                {airport.city}, {airport.country}
              </div>
            </div>
            <span className="px-3 py-1 text-sm font-bold bg-muted text-foreground rounded-lg">
              {airport.code}
            </span>
          </div>

          <div className="flex items-center gap-6 mt-4">
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <span className="text-foreground font-medium">
                {airport.distance} miles
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Car className="w-4 h-4 text-muted-foreground" />
              <span className="text-foreground font-medium">
                {airport.drivingTime}
              </span>
            </div>
          </div>

          <div className="mt-4">
            <Link to={`/search?origin=${airport.code}`}>
              <Button
                variant="outline"
                size="sm"
                rightIcon={<ArrowRight className="w-4 h-4" />}>

                Search flights from {airport.code}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>);

}
export function AirportCardSkeleton() {
  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 shimmer rounded-xl" />
        <div className="flex-1 space-y-3">
          <div className="flex justify-between">
            <div className="space-y-2">
              <div className="h-5 w-48 shimmer rounded" />
              <div className="h-4 w-32 shimmer rounded" />
            </div>
            <div className="h-8 w-16 shimmer rounded-lg" />
          </div>
          <div className="flex gap-6">
            <div className="h-4 w-24 shimmer rounded" />
            <div className="h-4 w-20 shimmer rounded" />
          </div>
          <div className="h-9 w-48 shimmer rounded-lg" />
        </div>
      </div>
    </div>);

}