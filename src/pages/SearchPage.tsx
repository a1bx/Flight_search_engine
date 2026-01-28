import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AlertCircle, RefreshCw, Scale } from 'lucide-react';
import { SearchForm } from '../components/SearchForm';
import { FlightList } from '../components/FlightList';
import { FilterSidebar, FilterButton } from '../components/FilterSidebar';
import { PriceGraph } from '../components/PriceGraph';
import {
  PriceHistoryChart,
  generatePriceHistory
} from
  '../components/PriceHistoryChart';
import { QuickFilters, useQuickFilters } from '../components/QuickFilters';
import { FlightComparison, ComparisonBar } from '../components/FlightComparison';
import { Button } from '../components/ui/Button';
import { useFlightSearch } from '../hooks/useFlightSearch';
import { useFilters } from '../hooks/useFilters';
import { useFlightComparison } from '../hooks/useFlightComparison';
import { useAuth } from '../hooks/useAuth';
import { SortOption, Flight } from '../types/flight';
import { searchAirports } from '../utils/amadeus';
export function SearchPage() {
  const [urlParams] = useSearchParams();
  const { addSavedSearch, isAuthenticated } = useAuth();
  const {
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
    executeSearch
  } = useFlightSearch();
  const navigate = useNavigate();
  const {
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
  } = useFilters(searchState.flights);
  const {
    comparisonFlights,
    isComparisonOpen,
    addToComparison,
    removeFromComparison,
    clearComparison,
    openComparison,
    closeComparison,
    isInComparison
  } = useFlightComparison();
  const [sortOption, setSortOption] = useState<SortOption>('best');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [priceAlerts, setPriceAlerts] = useState<Set<string>>(new Set());
  // Handle URL params for origin airport
  useEffect(() => {
    const originCode = urlParams.get('origin');
    if (originCode) {
      const fetchAirport = async () => {
        const airports = await searchAirports(originCode);
        if (airports.length > 0) {
          setOrigin(airports[0]);
        }
      };
      fetchAirport();
    }
  }, [urlParams, setOrigin]);
  // Apply main filters
  const mainFilteredFlights = useMemo(
    () => applyFilters(searchState.flights),
    [applyFilters, searchState.flights]
  );
  // Quick filters
  const { quickFilters, toggleFilter, applyQuickFilters } =
    useQuickFilters(mainFilteredFlights);
  // Apply quick filters on top of main filters
  const filteredFlights = useMemo(
    () => applyQuickFilters(mainFilteredFlights),
    [applyQuickFilters, mainFilteredFlights]
  );
  // Mark best deals and fastest flights
  const enhancedFlights = useMemo(() => {
    if (filteredFlights.length === 0) return [];
    const minPrice = Math.min(...filteredFlights.map((f) => f.price.amount));
    const minDuration = Math.min(
      ...filteredFlights.map((f) => {
        const match = f.totalDuration.match(/(\d+)h\s*(\d+)?m?/);
        if (match) return parseInt(match[1]) * 60 + (parseInt(match[2]) || 0);
        return 9999;
      })
    );
    const minEmissions = Math.min(
      ...filteredFlights.map((f) => f.carbonEmissions || 200)
    );
    return filteredFlights.map((flight) => {
      const duration = (() => {
        const match = flight.totalDuration.match(/(\d+)h\s*(\d+)?m?/);
        if (match) return parseInt(match[1]) * 60 + (parseInt(match[2]) || 0);
        return 9999;
      })();
      return {
        ...flight,
        isBestDeal: flight.price.amount === minPrice,
        isFastest: duration === minDuration,
        isLowestEmissions: (flight.carbonEmissions || 200) === minEmissions,
        carbonEmissions:
          flight.carbonEmissions || Math.round(150 + Math.random() * 200)
      };
    });
  }, [filteredFlights]);
  // Generate price history for display
  const priceHistory = useMemo(() => {
    if (searchState.flights.length === 0) return [];
    const avgPrice = Math.round(
      searchState.flights.reduce((sum, f) => sum + f.price.amount, 0) /
      searchState.flights.length
    );
    return generatePriceHistory(avgPrice);
  }, [searchState.flights]);
  // Initialize price range when flights load
  useEffect(() => {
    if (searchState.flights.length > 0 && filters.priceRange[1] === 10000) {
      setPriceRange(priceRangeBounds);
    }
  }, [searchState.flights, priceRangeBounds, filters.priceRange, setPriceRange]);
  // Save search when completed (ONLY if authenticated)
  useEffect(() => {
    if (
      searchState.hasSearched &&
      isAuthenticated &&
      searchParams.origin &&
      searchParams.destination) {
      addSavedSearch({
        origin: `${searchParams.origin.city} (${searchParams.origin.code})`,
        destination: `${searchParams.destination.city} (${searchParams.destination.code})`,
        departureDate: searchParams.departureDate,
        returnDate:
          searchParams.tripType === 'round-trip' ?
            searchParams.returnDate :
            undefined
      });
    }
  }, [
    searchState.hasSearched,
    isAuthenticated,
    searchParams.origin,
    searchParams.destination]
  );
  const handleAddToComparison = (flight: Flight) => {
    if (isInComparison(flight.id)) {
      removeFromComparison(flight.id);
    } else {
      addToComparison(flight);
    }
  };
  const handleTogglePriceAlert = (flight: Flight) => {
    setPriceAlerts((prev) => {
      const next = new Set(prev);
      if (next.has(flight.id)) {
        next.delete(flight.id);
      } else {
        next.add(flight.id);
      }
      return next;
    });
  };
  return (
    <div className="min-h-screen bg-background">
      <div className="page-container py-6">
        {/* Search Form */}
        <section className="mb-8">
          <SearchForm
            searchParams={searchParams}
            onOriginChange={setOrigin}
            onDestinationChange={setDestination}
            onDepartureDateChange={setDepartureDate}
            onReturnDateChange={setReturnDate}
            onPassengersChange={setPassengers}
            onCabinClassChange={setCabinClass}
            onTripTypeChange={setTripType}
            onSwapLocations={swapLocations}
            onSearch={executeSearch}
            isLoading={searchState.isLoading} />

        </section>

        {/* Error State */}
        {searchState.error &&
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-xl flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0" />
            <p className="text-sm text-destructive flex-1">
              {searchState.error}
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={executeSearch}
              leftIcon={<RefreshCw className="w-4 h-4" />}>

              Retry
            </Button>
          </div>
        }

        {/* Results Section */}
        {(searchState.hasSearched || searchState.isLoading) &&
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Filters */}
            <FilterSidebar
              filters={filters}
              availableAirlines={availableAirlines}
              priceRangeBounds={priceRangeBounds}
              activeFilterCount={activeFilterCount}
              onStopsChange={setStops}
              onPriceRangeChange={setPriceRange}
              onAirlinesChange={setAirlines}
              onDepartureTimeChange={setDepartureTimeRange}
              onArrivalTimeChange={setArrivalTimeRange}
              onReset={resetFilters}
              isMobileOpen={isMobileFilterOpen}
              onMobileClose={() => setIsMobileFilterOpen(false)} />


            {/* Main Content */}
            <div className="flex-1 min-w-0 space-y-6">
              {/* Mobile Filter Button */}
              <div className="flex items-center justify-between lg:hidden">
                <FilterButton
                  activeCount={activeFilterCount}
                  onClick={() => setIsMobileFilterOpen(true)} />

                {searchState.hasSearched && !searchState.isLoading &&
                  <p className="text-sm text-muted-foreground">
                    {enhancedFlights.length} of {searchState.flights.length}{' '}
                    flights
                  </p>
                }
              </div>

              {/* Quick Filters */}
              {!searchState.isLoading && searchState.flights.length > 0 &&
                <QuickFilters filters={quickFilters} onToggle={toggleFilter} />
              }

              {/* Charts Grid */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <PriceGraph
                  data={priceGraphData}
                  isLoading={searchState.isLoading} />

                <PriceHistoryChart
                  data={priceHistory}
                  isLoading={searchState.isLoading} />

              </div>

              {/* Flight List */}
              <FlightList
                flights={enhancedFlights}
                isLoading={searchState.isLoading}
                sortOption={sortOption}
                onSortChange={setSortOption}
                onSelectFlight={(flight) => {
                  if (!isAuthenticated) {
                    navigate('/login');
                    return;
                  }
                  alert(`Booking flight ${flight.id} for ${flight.airline.name}. This is a real-life result!`);
                }}
                onAddToComparison={handleAddToComparison}
                onTogglePriceAlert={handleTogglePriceAlert}
                isInComparison={isInComparison}
                hasPriceAlert={(id) => priceAlerts.has(id)} />

            </div>
          </div>
        }

        {/* Initial State */}
        {!searchState.hasSearched && !searchState.isLoading &&
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-6 bg-primary/10 rounded-2xl flex items-center justify-center">
              <Scale className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-3">
              Search and Compare Flights
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Enter your travel details above to find the best flight options.
              Compare prices, times, and amenities to make the perfect choice.
            </p>
          </div>
        }
      </div>

      {/* Comparison Bar */}
      <ComparisonBar
        count={comparisonFlights.length}
        onOpen={openComparison}
        onClear={clearComparison} />


      {/* Comparison Modal */}
      <FlightComparison
        flights={comparisonFlights}
        isOpen={isComparisonOpen}
        onClose={closeComparison}
        onRemove={removeFromComparison}
        onSelect={(flight) => {
          if (!isAuthenticated) {
            navigate('/login');
            return;
          }
          alert(`Booking flight ${flight.id} for ${flight.airline.name}. This is a real-life result!`);
          closeComparison();
        }} />

    </div>);

}