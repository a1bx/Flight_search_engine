import { useState, useCallback } from 'react';
import {
  Flight,
  SearchParams,
  SearchState,
  CabinClass,
  TripType,
  Airport } from
'../types/flight';
import { searchFlights } from '../utils/amadeus';

interface UseFlightSearchReturn {
  searchState: SearchState;
  searchParams: SearchParams;
  setOrigin: (airport: Airport | null) => void;
  setDestination: (airport: Airport | null) => void;
  setDepartureDate: (date: string) => void;
  setReturnDate: (date: string) => void;
  setPassengers: (count: number) => void;
  setCabinClass: (cabinClass: CabinClass) => void;
  setTripType: (tripType: TripType) => void;
  swapLocations: () => void;
  executeSearch: () => Promise<void>;
  clearSearch: () => void;
}

const getDefaultDepartureDate = (): string => {
  const date = new Date();
  date.setDate(date.getDate() + 14);
  return date.toISOString().split('T')[0];
};

const getDefaultReturnDate = (): string => {
  const date = new Date();
  date.setDate(date.getDate() + 21);
  return date.toISOString().split('T')[0];
};

const DEFAULT_SEARCH_PARAMS: SearchParams = {
  origin: null,
  destination: null,
  departureDate: getDefaultDepartureDate(),
  returnDate: getDefaultReturnDate(),
  passengers: 1,
  cabinClass: 'economy',
  tripType: 'round-trip'
};

const DEFAULT_SEARCH_STATE: SearchState = {
  flights: [],
  filteredFlights: [],
  isLoading: false,
  error: null,
  hasSearched: false
};

export function useFlightSearch(): UseFlightSearchReturn {
  const [searchParams, setSearchParams] = useState<SearchParams>(
    DEFAULT_SEARCH_PARAMS
  );
  const [searchState, setSearchState] =
  useState<SearchState>(DEFAULT_SEARCH_STATE);

  const setOrigin = useCallback((airport: Airport | null) => {
    setSearchParams((prev) => ({ ...prev, origin: airport }));
  }, []);

  const setDestination = useCallback((airport: Airport | null) => {
    setSearchParams((prev) => ({ ...prev, destination: airport }));
  }, []);

  const setDepartureDate = useCallback((departureDate: string) => {
    setSearchParams((prev) => ({ ...prev, departureDate }));
  }, []);

  const setReturnDate = useCallback((returnDate: string) => {
    setSearchParams((prev) => ({ ...prev, returnDate }));
  }, []);

  const setPassengers = useCallback((passengers: number) => {
    setSearchParams((prev) => ({
      ...prev,
      passengers: Math.max(1, Math.min(9, passengers))
    }));
  }, []);

  const setCabinClass = useCallback((cabinClass: CabinClass) => {
    setSearchParams((prev) => ({ ...prev, cabinClass }));
  }, []);

  const setTripType = useCallback((tripType: TripType) => {
    setSearchParams((prev) => ({ ...prev, tripType }));
  }, []);

  const swapLocations = useCallback(() => {
    setSearchParams((prev) => ({
      ...prev,
      origin: prev.destination,
      destination: prev.origin
    }));
  }, []);

  const executeSearch = useCallback(async () => {
    console.log('🔍 Execute search called with params:', searchParams);

    if (!searchParams.origin || !searchParams.destination) {
      const errorMsg = 'Please select both origin and destination airports';
      console.log('❌ Search validation failed:', errorMsg);
      setSearchState((prev) => ({
        ...prev,
        error: errorMsg,
        hasSearched: true
      }));
      return;
    }

    console.log('✅ Validation passed, starting search...');
    setSearchState((prev) => ({
      ...prev,
      isLoading: true,
      error: null
    }));

    try {
      console.log('📡 Calling searchFlights API...');
      const flights = await searchFlights(searchParams);
      console.log(`✅ Search completed! Found ${flights.length} flights`);

      setSearchState({
        flights,
        filteredFlights: flights,
        isLoading: false,
        error: null,
        hasSearched: true
      });
    } catch (error) {
      console.error('❌ Search failed:', error);
      setSearchState((prev) => ({
        ...prev,
        isLoading: false,
        error: 'Failed to search flights. Please try again.',
        hasSearched: true
      }));
    }
  }, [searchParams]);

  const clearSearch = useCallback(() => {
    setSearchState(DEFAULT_SEARCH_STATE);
    setSearchParams(DEFAULT_SEARCH_PARAMS);
  }, []);

  return {
    searchState,
    searchParams,
    setOrigin,
    setDestination,
    setDepartureDate,
    setReturnDate,
    setPassengers,
    setCabinClass,
    setTripType,
    swapLocations,
    executeSearch,
    clearSearch
  };
}