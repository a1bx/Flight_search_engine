import { useState, useCallback, useMemo } from 'react';
import { Flight, Filters, PriceDataPoint } from '../types/flight';
import {
  timeToMinutes,
  getPriceRange,
  getUniqueAirlines
} from
  '../utils/amadeus';

interface UseFiltersReturn {
  filters: Filters;
  setStops: (stops: number[]) => void;
  setPriceRange: (range: [number, number]) => void;
  setAirlines: (airlines: string[]) => void;
  setDepartureTimeRange: (range: [number, number]) => void;
  setArrivalTimeRange: (range: [number, number]) => void;
  resetFilters: () => void;
  applyFilters: (flights: Flight[]) => Flight[];
  availableAirlines: { code: string; name: string; }[];
  priceRangeBounds: [number, number];
  priceGraphData: PriceDataPoint[];
  activeFilterCount: number;
}

const DEFAULT_FILTERS: Filters = {
  stops: [],
  priceRange: [0, 10000],
  airlines: [],
  departureTimeRange: [0, 1440],
  arrivalTimeRange: [0, 1440]
};

export function useFilters(allFlights: Flight[]): UseFiltersReturn {
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);

  const availableAirlines = useMemo(
    () => getUniqueAirlines(allFlights),
    [allFlights]
  );

  const priceRangeBounds = useMemo(
    () => getPriceRange(allFlights),
    [allFlights]
  );

  const setStops = useCallback((stops: number[]) => {
    setFilters((prev) => ({ ...prev, stops }));
  }, []);

  const setPriceRange = useCallback((priceRange: [number, number]) => {
    setFilters((prev) => ({ ...prev, priceRange }));
  }, []);

  const setAirlines = useCallback((airlines: string[]) => {
    setFilters((prev) => ({ ...prev, airlines }));
  }, []);

  const setDepartureTimeRange = useCallback(
    (departureTimeRange: [number, number]) => {
      setFilters((prev) => ({ ...prev, departureTimeRange }));
    },
    []
  );

  const setArrivalTimeRange = useCallback(
    (arrivalTimeRange: [number, number]) => {
      setFilters((prev) => ({ ...prev, arrivalTimeRange }));
    },
    []
  );

  const resetFilters = useCallback(() => {
    setFilters({
      ...DEFAULT_FILTERS,
      priceRange: priceRangeBounds
    });
  }, [priceRangeBounds]);

  const applyFilters = useCallback(
    (flights: Flight[]): Flight[] => {
      return flights.filter((flight) => {
        // Filter by stops
        if (filters.stops.length > 0) {
          const stopCategory = flight.stops >= 2 ? 2 : flight.stops;
          if (!filters.stops.includes(stopCategory)) return false;
        }

        // Filter by price
        if (
          flight.price.amount < filters.priceRange[0] ||
          flight.price.amount > filters.priceRange[1]) {
          return false;
        }

        // Filter by airlines
        if (filters.airlines.length > 0) {
          if (!filters.airlines.includes(flight.airline.code)) return false;
        }

        // Filter by departure time
        const departureMinutes = timeToMinutes(flight.departureTime);
        if (
          departureMinutes < filters.departureTimeRange[0] ||
          departureMinutes > filters.departureTimeRange[1]) {
          return false;
        }

        // Filter by arrival time
        const arrivalMinutes = timeToMinutes(flight.arrivalTime);
        if (
          arrivalMinutes < filters.arrivalTimeRange[0] ||
          arrivalMinutes > filters.arrivalTimeRange[1]) {
          return false;
        }

        return true;
      });
    },
    [filters]
  );

  const priceGraphData = useMemo((): PriceDataPoint[] => {
    const filteredFlights = applyFilters(allFlights);

    // Group by airline for the graph
    const airlineData = new Map<string, { total: number; count: number; }>();

    filteredFlights.forEach((flight) => {
      const existing = airlineData.get(flight.airline.name) || {
        total: 0,
        count: 0
      };
      airlineData.set(flight.airline.name, {
        total: existing.total + flight.price.amount,
        count: existing.count + 1
      });
    });

    return Array.from(airlineData.entries()).
      map(([label, data]) => ({
        label,
        price: Math.round(data.total / data.count),
        count: data.count
      })).
      sort((a, b) => a.price - b.price).
      slice(0, 8);
  }, [allFlights, applyFilters]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.stops.length > 0) count++;
    if (filters.airlines.length > 0) count++;
    if (
      filters.priceRange[0] > priceRangeBounds[0] ||
      filters.priceRange[1] < priceRangeBounds[1])

      count++;
    if (
      filters.departureTimeRange[0] > 0 ||
      filters.departureTimeRange[1] < 1440)

      count++;
    if (filters.arrivalTimeRange[0] > 0 || filters.arrivalTimeRange[1] < 1440)
      count++;
    return count;
  }, [filters, priceRangeBounds]);

  return {
    filters,
    setStops,
    setPriceRange,
    setAirlines,
    setDepartureTimeRange,
    setArrivalTimeRange,
    resetFilters,
    applyFilters,
    availableAirlines,
    priceRangeBounds,
    priceGraphData,
    activeFilterCount
  };
}