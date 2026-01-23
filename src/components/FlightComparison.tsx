import React from 'react';
import {
  X,
  Award,
  Zap,
  Clock,
  DollarSign,
  Leaf,
  Plane,
  Check
} from
  'lucide-react';
import { Flight, ComparisonFlight } from '../types/flight';
import { Button } from './ui/Button';
interface FlightComparisonProps {
  flights: ComparisonFlight[];
  isOpen: boolean;
  onClose: () => void;
  onRemove: (flightId: string) => void;
  onSelect: (flight: Flight) => void;
}
interface ComparisonCategory {
  label: string;
  icon: React.ElementType;
  getValue: (flight: Flight) => string | number;
  getBestValue: (flights: Flight[]) => string | number;
  isBetter: (value: string | number, best: string | number) => boolean;
}
const COMPARISON_CATEGORIES: ComparisonCategory[] = [
  {
    label: 'Price',
    icon: DollarSign,
    getValue: (f) => f.price.amount,
    getBestValue: (flights) => Math.min(...flights.map((f) => f.price.amount)),
    isBetter: (value, best) => value === best
  },
  {
    label: 'Duration',
    icon: Clock,
    getValue: (f) => f.totalDuration,
    getBestValue: (flights) => {
      const durations = flights.map((f) => {
        const match = f.totalDuration.match(/(\d+)h\s*(\d+)?m?/);
        if (match) {
          return parseInt(match[1]) * 60 + (parseInt(match[2]) || 0);
        }
        return 9999;
      });
      const minIndex = durations.indexOf(Math.min(...durations));
      return flights[minIndex]?.totalDuration || '';
    },
    isBetter: (value, best) => value === best
  },
  {
    label: 'Stops',
    icon: Plane,
    getValue: (f) => f.stops,
    getBestValue: (flights) => Math.min(...flights.map((f) => f.stops)),
    isBetter: (value, best) => value === best
  },
  {
    label: 'CO₂ Emissions',
    icon: Leaf,
    getValue: (f) => f.carbonEmissions || Math.round(150 + Math.random() * 200),
    getBestValue: (flights) =>
      Math.min(...flights.map((f) => f.carbonEmissions || 200)),
    isBetter: (value, best) => value === best
  }];

export function FlightComparison({
  flights,
  isOpen,
  onClose,
  onRemove,
  onSelect
}: FlightComparisonProps) {
  if (!isOpen || flights.length === 0) return null;
  const flightData = flights.map((cf) => cf.flight);
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
  };
  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={onClose} />


      {/* Modal */}
      <div className="fixed inset-x-4 bottom-4 top-auto md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-4xl z-50">
        <div className="glass-card rounded-2xl shadow-2xl max-h-[85vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-gradient-primary rounded-xl">
                <Award className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">
                  Compare Flights
                </h2>
                <p className="text-sm text-muted-foreground">
                  {flights.length} flight{flights.length !== 1 ? 's' : ''}{' '}
                  selected
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-muted transition-colors">

              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-auto p-6">
            {/* Flight Headers */}
            <div
              className="grid gap-4"
              style={{
                gridTemplateColumns: `200px repeat(${flights.length}, 1fr)`
              }}>

              <div /> {/* Empty cell for labels */}
              {flights.map(({ flight }) =>
                <div key={flight.id} className="relative">
                  <button
                    onClick={() => onRemove(flight.id)}
                    className="absolute -top-2 -right-2 p-1 bg-destructive text-white rounded-full hover:bg-destructive/90 transition-colors z-10">

                    <X className="w-3 h-3" />
                  </button>
                  <div className="p-4 bg-muted/50 rounded-xl text-center">
                    <img
                      src={flight.airline.logo}
                      alt={flight.airline.name}
                      className="w-12 h-12 mx-auto rounded-xl object-contain bg-white p-1 mb-2" />

                    <p className="font-semibold text-foreground">
                      {flight.airline.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {flight.segments[0]?.flightNumber}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Route Info */}
            <div
              className="grid gap-4 mt-4"
              style={{
                gridTemplateColumns: `200px repeat(${flights.length}, 1fr)`
              }}>

              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Plane className="w-4 h-4" />
                Route
              </div>
              {flights.map(({ flight }) =>
                <div key={flight.id} className="text-center">
                  <p className="font-semibold text-foreground">
                    {formatTime(flight.departureTime)} →{' '}
                    {formatTime(flight.arrivalTime)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {flight.origin} → {flight.destination}
                  </p>
                </div>
              )}
            </div>

            {/* Comparison Categories */}
            {COMPARISON_CATEGORIES.map((category) => {
              const bestValue = category.getBestValue(flightData);
              return (
                <div
                  key={category.label}
                  className="grid gap-4 mt-4 py-4 border-t border-border"
                  style={{
                    gridTemplateColumns: `200px repeat(${flights.length}, 1fr)`
                  }}>

                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <category.icon className="w-4 h-4" />
                    {category.label}
                  </div>
                  {flights.map(({ flight }) => {
                    const value = category.getValue(flight);
                    const isBest = category.isBetter(value, bestValue);
                    return (
                      <div
                        key={flight.id}
                        className={`
                          text-center p-3 rounded-xl transition-colors
                          ${isBest ? 'bg-emerald-500/10' : ''}
                        `}>

                        <div className="flex items-center justify-center gap-2">
                          {isBest &&
                            <div className="p-1 bg-emerald-500 rounded-full">
                              <Check className="w-3 h-3 text-white" />
                            </div>
                          }
                          <span
                            className={`font-bold text-lg ${isBest ? 'text-emerald-600 dark:text-emerald-400' : 'text-foreground'}`}>

                            {category.label === 'Price' ?
                              `$${value.toLocaleString()}` :
                              category.label === 'CO₂ Emissions' ?
                                `${value} kg` :
                                category.label === 'Stops' ?
                                  value === 0 ?
                                    'Nonstop' :
                                    `${value} stop${Number(value) !== 1 ? 's' : ''}` :
                                  value}
                          </span>
                        </div>
                        {isBest &&
                          <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">
                            Best option
                          </p>
                        }
                      </div>);

                  })}
                </div>);

            })}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-border bg-muted/30">
            <div
              className="grid gap-4"
              style={{
                gridTemplateColumns: `200px repeat(${flights.length}, 1fr)`
              }}>

              <div />
              {flights.map(({ flight }) =>
                <Button
                  key={flight.id}
                  variant="primary"
                  size="lg"
                  onClick={() => onSelect(flight)}
                  className="w-full bg-gradient-primary">

                  Select ${flight.price.amount.toLocaleString()}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>);

}
export function ComparisonBar({
  count,
  onOpen,
  onClear




}: { count: number; onOpen: () => void; onClear: () => void; }) {
  if (count === 0) return null;
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 animate-in slide-in-from-bottom-4 duration-300">
      <div className="glass-card rounded-full px-6 py-3 shadow-2xl flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold text-sm">
            {count}
          </div>
          <span className="text-sm font-medium text-foreground">
            flight{count !== 1 ? 's' : ''} selected
          </span>
        </div>
        <div className="h-6 w-px bg-border" />
        <Button
          variant="primary"
          size="sm"
          onClick={onOpen}
          className="bg-gradient-primary">

          Compare
        </Button>
        <button
          onClick={onClear}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors">

          Clear
        </button>
      </div>
    </div>);

}