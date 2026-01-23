import React, { useState } from 'react';
import {
  Clock,
  Circle,
  Leaf,
  Briefcase,
  Luggage,
  ChevronDown,
  ChevronUp,
  Plus,
  Check,
  Bell,
  Zap,
  Award
} from
  'lucide-react';
import { Flight } from '../types/flight';
import { Button } from './ui/Button';
interface FlightCardProps {
  flight: Flight;
  onSelect?: (flight: Flight) => void;
  onAddToComparison?: (flight: Flight) => void;
  onTogglePriceAlert?: (flight: Flight) => void;
  isInComparison?: boolean;
  hasPriceAlert?: boolean;
}
export function FlightCard({
  flight,
  onSelect,
  onAddToComparison,
  onTogglePriceAlert,
  isInComparison = false,
  hasPriceAlert = false
}: FlightCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
  };
  const getStopsLabel = (stops: number) => {
    if (stops === 0) return 'Nonstop';
    if (stops === 1) return '1 stop';
    return `${stops} stops`;
  };
  // Generate mock data for enhanced features
  const carbonEmissions =
    flight.carbonEmissions || Math.round(150 + Math.random() * 200);
  const hasCarryOn = flight.baggageAllowance?.carryOn ?? true;
  const checkedBags =
    flight.baggageAllowance?.checked ?? (Math.random() > 0.3 ? 1 : 0);
  return (
    <div
      className={`
        bg-card border rounded-xl overflow-hidden transition-all duration-200
        ${isInComparison ? 'border-primary border-2 shadow-lg shadow-primary/10' : 'border-border shadow-md hover:shadow-lg'}
      `}>

      {/* Badges */}
      {(flight.isBestDeal || flight.isFastest || flight.isLowestEmissions) &&
        <div className="flex gap-2 px-4 sm:px-6 pt-4">
          {flight.isBestDeal &&
            <span className="bg-success text-white text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
              <Award className="w-3 h-3" />
              Best Deal
            </span>
          }
          {flight.isFastest &&
            <span className="bg-primary text-white text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
              <Zap className="w-3 h-3" />
              Fastest
            </span>
          }
          {flight.isLowestEmissions &&
            <span className="bg-emerald-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
              <Leaf className="w-3 h-3" />
              Eco Choice
            </span>
          }
        </div>
      }

      <div className="p-4 sm:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-6">
          {/* Airline Info */}
          <div className="flex items-center gap-3 lg:w-44 flex-shrink-0">
            <div className="relative">
              <img
                src={flight.airline.logo}
                alt={flight.airline.name}
                className="w-12 h-12 rounded-xl object-contain bg-muted p-1.5 shadow-sm"
                onError={(e) => {
                  ; (e.target as HTMLImageElement).src =
                    'https://via.placeholder.com/48?text=' + flight.airline.code;
                }} />

            </div>
            <div className="min-w-0">
              <p className="font-semibold text-foreground truncate">
                {flight.airline.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {flight.segments[0]?.flightNumber}
              </p>
            </div>
          </div>

          {/* Flight Times */}
          <div className="flex-1 flex items-center gap-4">
            {/* Departure */}
            <div className="text-center min-w-[85px]">
              <p className="text-2xl sm:text-3xl font-bold text-foreground">
                {formatTime(flight.departureTime)}
              </p>
              <p className="text-sm text-muted-foreground font-medium">
                {flight.origin}
              </p>
            </div>

            {/* Duration & Stops */}
            <div className="flex-1 flex flex-col items-center px-2">
              <p className="text-xs font-medium text-muted-foreground mb-2">
                {flight.totalDuration}
              </p>
              <div className="w-full flex items-center gap-1">
                <div className="w-2.5 h-2.5 rounded-full bg-gradient-primary" />
                <div className="flex-1 h-0.5 bg-gradient-to-r from-primary via-purple-500 to-primary relative">
                  {flight.stops > 0 &&
                    <div className="absolute inset-0 flex items-center justify-around">
                      {Array.from({
                        length: flight.stops
                      }).map((_, i) =>
                        <div
                          key={i}
                          className="w-2.5 h-2.5 rounded-full bg-white border-2 border-purple-500 shadow-sm" />

                      )}
                    </div>
                  }
                </div>
                <div className="w-2.5 h-2.5 rounded-full bg-gradient-primary" />
              </div>
              <p
                className={`text-xs mt-2 font-medium ${flight.stops === 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-muted-foreground'}`}>

                {getStopsLabel(flight.stops)}
              </p>
            </div>

            {/* Arrival */}
            <div className="text-center min-w-[85px]">
              <p className="text-2xl sm:text-3xl font-bold text-foreground">
                {formatTime(flight.arrivalTime)}
              </p>
              <p className="text-sm text-muted-foreground font-medium">
                {flight.destination}
              </p>
            </div>
          </div>

          {/* Price & Actions */}
          <div className="flex items-center justify-between lg:justify-end gap-4 lg:w-56 flex-shrink-0 pt-4 lg:pt-0 border-t lg:border-t-0 border-border">
            <div className="text-right">
              <p className="text-3xl font-bold text-gradient">
                ${flight.price.amount.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground">per person</p>
            </div>
            <Button
              variant="primary"
              size="md"
              onClick={() => onSelect?.(flight)}
              className="bg-gradient-primary hover:opacity-90 shadow-lg shadow-primary/25">

              Select
            </Button>
          </div>
        </div>

        {/* Quick Info Row */}
        <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t border-border">
          {/* Carbon Emissions */}
          <div className="flex items-center gap-1.5 text-sm">
            <Leaf
              className={`w-4 h-4 ${carbonEmissions < 200 ? 'text-emerald-500' : 'text-muted-foreground'}`} />

            <span className="text-muted-foreground">
              {carbonEmissions} kg CO₂
            </span>
          </div>

          {/* Baggage */}
          <div className="flex items-center gap-3 text-sm">
            {hasCarryOn &&
              <div className="flex items-center gap-1 text-muted-foreground">
                <Briefcase className="w-4 h-4" />
                <span>Carry-on</span>
              </div>
            }
            {checkedBags > 0 &&
              <div className="flex items-center gap-1 text-muted-foreground">
                <Luggage className="w-4 h-4" />
                <span>
                  {checkedBags} bag{checkedBags > 1 ? 's' : ''}
                </span>
              </div>
            }
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={() => onTogglePriceAlert?.(flight)}
              className={`
                p-2 rounded-lg transition-all duration-200
                ${hasPriceAlert ? 'bg-amber-500/10 text-amber-500' : 'hover:bg-muted text-muted-foreground hover:text-foreground'}
              `}
              title={hasPriceAlert ? 'Remove price alert' : 'Set price alert'}>

              <Bell
                className={`w-4 h-4 ${hasPriceAlert ? 'fill-current' : ''}`} />

            </button>

            <button
              onClick={() => onAddToComparison?.(flight)}
              className={`
                p-2 rounded-lg transition-all duration-200
                ${isInComparison ? 'bg-primary/10 text-primary' : 'hover:bg-muted text-muted-foreground hover:text-foreground'}
              `}
              title={
                isInComparison ? 'Remove from comparison' : 'Add to comparison'
              }>

              {isInComparison ?
                <Check className="w-4 h-4" /> :

                <Plus className="w-4 h-4" />
              }
            </button>

            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-all duration-200">

              {isExpanded ?
                <ChevronUp className="w-4 h-4" /> :

                <ChevronDown className="w-4 h-4" />
              }
            </button>
          </div>
        </div>

        {/* Expanded Details */}
        {isExpanded &&
          <div className="mt-4 pt-4 border-t border-border animate-in slide-in-from-top-2 duration-300">
            <h4 className="text-sm font-semibold text-foreground mb-3">
              Flight Details
            </h4>
            <div className="space-y-3">
              {flight.segments.map((segment, index) =>
                <div
                  key={index}
                  className="flex items-start gap-4 p-3 bg-muted/50 rounded-xl">

                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center text-white text-xs font-bold">
                      {index + 1}
                    </div>
                  </div>
                  <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Departure</p>
                      <p className="font-medium text-foreground">
                        {segment.departure.airport} • {segment.departure.time}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Arrival</p>
                      <p className="font-medium text-foreground">
                        {segment.arrival.airport} • {segment.arrival.time}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Duration</p>
                      <p className="font-medium text-foreground">
                        {segment.duration}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Flight</p>
                      <p className="font-medium text-foreground">
                        {segment.flightNumber}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        }
      </div>
    </div>);

}
export function FlightCardSkeleton() {
  return (
    <div className="glass-card rounded-2xl p-4 sm:p-6">
      <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-6">
        {/* Airline skeleton */}
        <div className="flex items-center gap-3 lg:w-44">
          <div className="w-12 h-12 rounded-xl shimmer" />
          <div className="space-y-2">
            <div className="h-4 w-28 rounded-lg shimmer" />
            <div className="h-3 w-20 rounded-lg shimmer" />
          </div>
        </div>

        {/* Times skeleton */}
        <div className="flex-1 flex items-center gap-4">
          <div className="text-center min-w-[85px] space-y-2">
            <div className="h-8 w-20 rounded-lg shimmer mx-auto" />
            <div className="h-4 w-12 rounded-lg shimmer mx-auto" />
          </div>
          <div className="flex-1 flex flex-col items-center">
            <div className="h-3 w-16 rounded-lg shimmer mb-2" />
            <div className="w-full h-1 rounded-full shimmer" />
            <div className="h-3 w-20 rounded-lg shimmer mt-2" />
          </div>
          <div className="text-center min-w-[85px] space-y-2">
            <div className="h-8 w-20 rounded-lg shimmer mx-auto" />
            <div className="h-4 w-12 rounded-lg shimmer mx-auto" />
          </div>
        </div>

        {/* Price skeleton */}
        <div className="flex items-center justify-between lg:justify-end gap-4 lg:w-56 pt-4 lg:pt-0 border-t lg:border-t-0 border-border">
          <div className="space-y-2">
            <div className="h-8 w-24 rounded-lg shimmer" />
            <div className="h-3 w-16 rounded-lg shimmer" />
          </div>
          <div className="h-10 w-24 rounded-lg shimmer" />
        </div>
      </div>

      {/* Quick info skeleton */}
      <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border">
        <div className="h-4 w-24 rounded-lg shimmer" />
        <div className="h-4 w-20 rounded-lg shimmer" />
        <div className="h-4 w-16 rounded-lg shimmer" />
      </div>
    </div>);

}