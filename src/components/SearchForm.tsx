import React, { useEffect, useState, useRef } from 'react';
import {
  Plane,
  Calendar,
  Users,
  ArrowRightLeft,
  Search,
  MapPin,
  X
} from
  'lucide-react';
import { Button } from './ui/Button';
import { Select } from './ui/Select';
import { SearchParams, Airport, CabinClass, TripType } from '../types/flight';
import { searchAirports } from '../utils/amadeus';
interface SearchFormProps {
  searchParams: SearchParams;
  onOriginChange: (airport: Airport | null) => void;
  onDestinationChange: (airport: Airport | null) => void;
  onDepartureDateChange: (date: string) => void;
  onReturnDateChange: (date: string) => void;
  onPassengersChange: (count: number) => void;
  onCabinClassChange: (cabinClass: CabinClass) => void;
  onTripTypeChange: (tripType: TripType) => void;
  onSwapLocations: () => void;
  onSearch: () => void;
  isLoading: boolean;
}
interface AirportInputProps {
  label: string;
  value: Airport | null;
  onChange: (airport: Airport | null) => void;
  placeholder: string;
  icon: React.ReactNode;
}
function AirportInput({
  label,
  value,
  onChange,
  placeholder,
  icon
}: AirportInputProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Airport[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.length >= 2) {
        const results = await searchAirports(query);
        setSuggestions(results);
        setIsOpen(results.length > 0);
      } else {
        setSuggestions([]);
        setIsOpen(false);
      }
    };
    fetchSuggestions();
  }, [query]);
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  const handleSelect = (airport: Airport) => {
    onChange(airport);
    setQuery('');
    setIsOpen(false);
    setIsFocused(false);
  };
  const handleClear = () => {
    onChange(null);
    setQuery('');
    inputRef.current?.focus();
  };
  return (
    <div ref={containerRef} className="relative flex-1">
      <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wide">
        {label}
      </label>
      <div
        className={`
          relative flex items-center gap-2 h-14 px-4 
          bg-background border rounded-xl transition-all duration-200
          ${isFocused ? 'border-primary ring-2 ring-primary/20' : 'border-input hover:border-primary/50'}
        `}>

        <span className="text-muted-foreground">{icon}</span>
        {value ?
          <div className="flex-1 flex items-center justify-between">
            <div>
              <span className="font-semibold text-foreground">
                {value.code}
              </span>
              <span className="text-sm text-muted-foreground ml-2">
                {value.city}
              </span>
            </div>
            <button
              type="button"
              onClick={handleClear}
              className="p-1 hover:bg-muted rounded-full transition-colors">

              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div> :

          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            placeholder={placeholder}
            className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground" />

        }
      </div>

      {isOpen &&
        <div className="absolute z-50 w-full mt-2 bg-card border border-border rounded-xl shadow-lg overflow-hidden">
          {suggestions.map((airport) =>
            <button
              key={airport.code}
              type="button"
              onClick={() => handleSelect(airport)}
              className="w-full px-4 py-3 flex items-start gap-3 hover:bg-muted transition-colors text-left">

              <MapPin className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-medium text-foreground">
                  {airport.city} ({airport.code})
                </div>
                <div className="text-sm text-muted-foreground">
                  {airport.name}
                </div>
              </div>
            </button>
          )}
        </div>
      }
    </div>);

}
export function SearchForm({
  searchParams,
  onOriginChange,
  onDestinationChange,
  onDepartureDateChange,
  onReturnDateChange,
  onPassengersChange,
  onCabinClassChange,
  onTripTypeChange,
  onSwapLocations,
  onSearch,
  isLoading
}: SearchFormProps) {
  const cabinOptions = [
    {
      value: 'economy',
      label: 'Economy'
    },
    {
      value: 'premium_economy',
      label: 'Premium Economy'
    },
    {
      value: 'business',
      label: 'Business'
    },
    {
      value: 'first',
      label: 'First Class'
    }];

  const passengerOptions = Array.from(
    {
      length: 9
    },
    (_, i) => ({
      value: String(i + 1),
      label: `${i + 1} ${i === 0 ? 'Passenger' : 'Passengers'}`
    })
  );
  return (
    <div className="bg-card border border-border rounded-xl p-6">
      {/* Trip Type Toggle */}
      <div className="flex gap-2 mb-6">
        <button
          type="button"
          onClick={() => onTripTypeChange('round-trip')}
          className={`
            px-4 py-2 text-sm font-medium rounded-full transition-all duration-200
            ${searchParams.tripType === 'round-trip' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'}
          `}>

          Round Trip
        </button>
        <button
          type="button"
          onClick={() => onTripTypeChange('one-way')}
          className={`
            px-4 py-2 text-sm font-medium rounded-full transition-all duration-200
            ${searchParams.tripType === 'one-way' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'}
          `}>

          One Way
        </button>
      </div>

      {/* Location Inputs */}
      <div className="flex flex-col lg:flex-row gap-4 mb-4">
        <div className="flex flex-col sm:flex-row flex-1 gap-4 items-center">
          <AirportInput
            label="From"
            value={searchParams.origin}
            onChange={onOriginChange}
            placeholder="City or airport"
            icon={<Plane className="w-5 h-5 -rotate-45" />} />


          <button
            type="button"
            onClick={onSwapLocations}
            className="p-3 rounded-full border border-input hover:bg-muted transition-colors flex-shrink-0 mt-6 sm:mt-0"
            aria-label="Swap origin and destination">

            <ArrowRightLeft className="w-5 h-5 text-muted-foreground" />
          </button>

          <AirportInput
            label="To"
            value={searchParams.destination}
            onChange={onDestinationChange}
            placeholder="City or airport"
            icon={<MapPin className="w-5 h-5" />} />

        </div>
      </div>

      {/* Date and Passenger Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wide">
            Departure
          </label>
          <div className="relative">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="date"
              value={searchParams.departureDate}
              onChange={(e) => onDepartureDateChange(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full h-14 pl-12 pr-4 bg-background border border-input rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" />

          </div>
        </div>

        {searchParams.tripType === 'round-trip' &&
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wide">
              Return
            </label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="date"
                value={searchParams.returnDate}
                onChange={(e) => onReturnDateChange(e.target.value)}
                min={searchParams.departureDate}
                className="w-full h-14 pl-12 pr-4 bg-background border border-input rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" />

            </div>
          </div>
        }

        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wide">
            Passengers
          </label>
          <div className="relative">
            <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground z-10" />
            <select
              value={String(searchParams.passengers)}
              onChange={(e) => onPassengersChange(Number(e.target.value))}
              className="w-full h-14 pl-12 pr-4 bg-background border border-input rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all appearance-none cursor-pointer">

              {passengerOptions.map((opt) =>
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              )}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wide">
            Class
          </label>
          <select
            value={searchParams.cabinClass}
            onChange={(e) => onCabinClassChange(e.target.value as CabinClass)}
            className="w-full h-14 px-4 bg-background border border-input rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all appearance-none cursor-pointer">

            {cabinOptions.map((opt) =>
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            )}
          </select>
        </div>
      </div>

      {/* Search Button */}
      <Button
        onClick={onSearch}
        isLoading={isLoading}
        size="lg"
        className="w-full sm:w-auto min-w-[200px]"
        leftIcon={<Search className="w-5 h-5" />}>

        Search Flights
      </Button>
    </div>);

}