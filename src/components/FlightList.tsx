import React, { useMemo } from 'react';
import { ArrowUpDown, Zap, DollarSign, Clock, Award } from 'lucide-react';
import { Flight, SortOption } from '../types/flight';
import { FlightCard, FlightCardSkeleton } from './FlightCard';
interface FlightListProps {
  flights: Flight[];
  isLoading: boolean;
  sortOption: SortOption;
  onSortChange: (option: SortOption) => void;
  onSelectFlight?: (flight: Flight) => void;
  onAddToComparison?: (flight: Flight) => void;
  onTogglePriceAlert?: (flight: Flight) => void;
  isInComparison?: (flightId: string) => boolean;
  hasPriceAlert?: (flightId: string) => boolean;
}
export function FlightList({
  flights,
  isLoading,
  sortOption,
  onSortChange,
  onSelectFlight,
  onAddToComparison,
  onTogglePriceAlert,
  isInComparison,
  hasPriceAlert
}: FlightListProps) {
  const sortOptions: {
    value: SortOption;
    label: string;
    icon: React.ReactNode;
  }[] = [
      {
        value: 'best',
        label: 'Best',
        icon: <Award className="w-4 h-4" />
      },
      {
        value: 'cheapest',
        label: 'Cheapest',
        icon: <DollarSign className="w-4 h-4" />
      },
      {
        value: 'fastest',
        label: 'Fastest',
        icon: <Zap className="w-4 h-4" />
      }];

  const sortedFlights = useMemo(() => {
    const sorted = [...flights];
    switch (sortOption) {
      case 'cheapest':
        return sorted.sort((a, b) => a.price.amount - b.price.amount);
      case 'fastest':
        return sorted.sort((a, b) => {
          const durationA =
            parseInt(a.totalDuration.split('h')[0]) * 60 +
            parseInt(a.totalDuration.split('h')[1]?.replace('m', '') || '0');
          const durationB =
            parseInt(b.totalDuration.split('h')[0]) * 60 +
            parseInt(b.totalDuration.split('h')[1]?.replace('m', '') || '0');
          return durationA - durationB;
        });
      case 'best':
      default:
        return sorted.sort((a, b) => {
          const priceScoreA = a.price.amount / 100;
          const durationA =
            parseInt(a.totalDuration.split('h')[0]) * 60 +
            parseInt(a.totalDuration.split('h')[1]?.replace('m', '') || '0');
          const scoreA = priceScoreA + durationA / 10 + a.stops * 50;
          const priceScoreB = b.price.amount / 100;
          const durationB =
            parseInt(b.totalDuration.split('h')[0]) * 60 +
            parseInt(b.totalDuration.split('h')[1]?.replace('m', '') || '0');
          const scoreB = priceScoreB + durationB / 10 + b.stops * 50;
          return scoreA - scoreB;
        });
    }
  }, [flights, sortOption]);
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <div className="h-5 w-32 rounded-lg shimmer" />
          <div className="flex gap-2">
            {[1, 2, 3].map((i) =>
              <div key={i} className="h-10 w-24 rounded-full shimmer" />
            )}
          </div>
        </div>
        {[1, 2, 3, 4, 5].map((i) =>
          <FlightCardSkeleton key={i} />
        )}
      </div>);

  }
  if (flights.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-muted flex items-center justify-center">
          <ArrowUpDown className="w-10 h-10 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-bold text-foreground mb-2">
          No flights found
        </h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          Try adjusting your filters or search for different dates to find
          available flights.
        </p>
      </div>);

  }
  return (
    <div>
      {/* Header with count and sort */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <p className="text-lg font-semibold text-foreground">
            {flights.length} flight{flights.length !== 1 ? 's' : ''} found
          </p>
          <p className="text-sm text-muted-foreground">
            Prices include taxes and fees
          </p>
        </div>

        <div className="flex items-center gap-2 p-1 bg-muted rounded-full">
          {sortOptions.map((option) =>
            <button
              key={option.value}
              onClick={() => onSortChange(option.value)}
              className={`
                flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full
                transition-all duration-300
                ${sortOption === option.value ? 'bg-gradient-primary text-white shadow-lg' : 'text-muted-foreground hover:text-foreground'}
              `}>

              {option.icon}
              {option.label}
            </button>
          )}
        </div>
      </div>

      {/* Flight Cards */}
      <div className="space-y-4">
        {sortedFlights.map((flight) =>
          <FlightCard
            key={flight.id}
            flight={flight}
            onSelect={onSelectFlight}
            onAddToComparison={onAddToComparison}
            onTogglePriceAlert={onTogglePriceAlert}
            isInComparison={isInComparison?.(flight.id)}
            hasPriceAlert={hasPriceAlert?.(flight.id)} />

        )}
      </div>
    </div>);

}