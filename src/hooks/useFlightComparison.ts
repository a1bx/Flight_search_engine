import { useState, useCallback } from 'react';
import { Flight, ComparisonFlight } from '../types/flight';

interface UseFlightComparisonReturn {
  comparisonFlights: ComparisonFlight[];
  isComparisonOpen: boolean;
  addToComparison: (flight: Flight) => boolean;
  removeFromComparison: (flightId: string) => void;
  clearComparison: () => void;
  openComparison: () => void;
  closeComparison: () => void;
  isInComparison: (flightId: string) => boolean;
  canAddMore: boolean;
}

const MAX_COMPARISON_FLIGHTS = 3;

export function useFlightComparison(): UseFlightComparisonReturn {
  const [comparisonFlights, setComparisonFlights] = useState<
    ComparisonFlight[]>(
    []);
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);

  const addToComparison = useCallback(
    (flight: Flight): boolean => {
      if (comparisonFlights.length >= MAX_COMPARISON_FLIGHTS) {
        return false;
      }

      if (comparisonFlights.some((cf) => cf.flight.id === flight.id)) {
        return false;
      }

      setComparisonFlights((prev) => [...prev, { flight, addedAt: Date.now() }]);
      return true;
    },
    [comparisonFlights]
  );

  const removeFromComparison = useCallback((flightId: string) => {
    setComparisonFlights((prev) =>
    prev.filter((cf) => cf.flight.id !== flightId)
    );
  }, []);

  const clearComparison = useCallback(() => {
    setComparisonFlights([]);
    setIsComparisonOpen(false);
  }, []);

  const openComparison = useCallback(() => {
    if (comparisonFlights.length > 0) {
      setIsComparisonOpen(true);
    }
  }, [comparisonFlights.length]);

  const closeComparison = useCallback(() => {
    setIsComparisonOpen(false);
  }, []);

  const isInComparison = useCallback(
    (flightId: string): boolean => {
      return comparisonFlights.some((cf) => cf.flight.id === flightId);
    },
    [comparisonFlights]
  );

  return {
    comparisonFlights,
    isComparisonOpen,
    addToComparison,
    removeFromComparison,
    clearComparison,
    openComparison,
    closeComparison,
    isInComparison,
    canAddMore: comparisonFlights.length < MAX_COMPARISON_FLIGHTS
  };
}