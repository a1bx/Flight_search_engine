import { X, RotateCcw, SlidersHorizontal } from 'lucide-react';
import { Filters } from '../types/flight';
import { Button } from './ui/Button';
import { Checkbox } from './ui/Checkbox';
import { Slider } from './ui/Slider';
import { minutesToTimeLabel } from '../utils/amadeus';
interface FilterSidebarProps {
  filters: Filters;
  availableAirlines: {
    code: string;
    name: string;
  }[];
  priceRangeBounds: [number, number];
  activeFilterCount: number;
  onStopsChange: (stops: number[]) => void;
  onPriceRangeChange: (range: [number, number]) => void;
  onAirlinesChange: (airlines: string[]) => void;
  onDepartureTimeChange: (range: [number, number]) => void;
  onArrivalTimeChange: (range: [number, number]) => void;
  onReset: () => void;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}
export function FilterSidebar({
  filters,
  availableAirlines,
  priceRangeBounds,
  activeFilterCount,
  onStopsChange,
  onPriceRangeChange,
  onAirlinesChange,
  onDepartureTimeChange,
  onArrivalTimeChange,
  onReset,
  isMobileOpen = false,
  onMobileClose
}: FilterSidebarProps) {
  const handleStopToggle = (stop: number) => {
    if (filters.stops.includes(stop)) {
      onStopsChange(filters.stops.filter((s) => s !== stop));
    } else {
      onStopsChange([...filters.stops, stop]);
    }
  };
  const handleAirlineToggle = (code: string) => {
    if (filters.airlines.includes(code)) {
      onAirlinesChange(filters.airlines.filter((a) => a !== code));
    } else {
      onAirlinesChange([...filters.airlines, code]);
    }
  };
  const filterContent =
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-foreground" />
          <h2 className="text-lg font-semibold text-foreground">Filters</h2>
          {activeFilterCount > 0 &&
            <span className="px-2 py-0.5 text-xs font-medium bg-primary text-primary-foreground rounded-full">
              {activeFilterCount}
            </span>
          }
        </div>
        <div className="flex items-center gap-2">
          {activeFilterCount > 0 &&
            <Button
              variant="ghost"
              size="sm"
              onClick={onReset}
              leftIcon={<RotateCcw className="w-4 h-4" />}>

              Reset
            </Button>
          }
          {onMobileClose &&
            <button
              onClick={onMobileClose}
              className="lg:hidden p-2 hover:bg-muted rounded-lg transition-colors">

              <X className="w-5 h-5" />
            </button>
          }
        </div>
      </div>

      {/* Stops */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-foreground mb-3">Stops</h3>
        <div className="space-y-2">
          <Checkbox
            label="Nonstop"
            checked={filters.stops.includes(0)}
            onChange={() => handleStopToggle(0)} />

          <Checkbox
            label="1 stop"
            checked={filters.stops.includes(1)}
            onChange={() => handleStopToggle(1)} />

          <Checkbox
            label="2+ stops"
            checked={filters.stops.includes(2)}
            onChange={() => handleStopToggle(2)} />

        </div>
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <Slider
          label="Price Range"
          min={priceRangeBounds[0]}
          max={priceRangeBounds[1]}
          value={filters.priceRange}
          onChange={onPriceRangeChange}
          formatValue={(v) => `$${v.toLocaleString()}`}
          step={10} />

      </div>

      {/* Departure Time */}
      <div className="mb-6">
        <Slider
          label="Departure Time"
          min={0}
          max={1440}
          value={filters.departureTimeRange}
          onChange={onDepartureTimeChange}
          formatValue={minutesToTimeLabel}
          step={30} />

      </div>

      {/* Arrival Time */}
      <div className="mb-6">
        <Slider
          label="Arrival Time"
          min={0}
          max={1440}
          value={filters.arrivalTimeRange}
          onChange={onArrivalTimeChange}
          formatValue={minutesToTimeLabel}
          step={30} />

      </div>

      {/* Airlines */}
      {availableAirlines.length > 0 &&
        <div>
          <h3 className="text-sm font-medium text-foreground mb-3">Airlines</h3>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
            {availableAirlines.map((airline) =>
              <Checkbox
                key={airline.code}
                label={airline.name}
                checked={filters.airlines.includes(airline.code)}
                onChange={() => handleAirlineToggle(airline.code)} />

            )}
          </div>
        </div>
      }
    </>;

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-72 flex-shrink-0">
        <div className="bg-card border border-border rounded-xl p-5 sticky top-4">
          {filterContent}
        </div>
      </aside>

      {/* Mobile Drawer */}
      {isMobileOpen &&
        <>
          <div
            className="lg:hidden fixed inset-0 bg-black/50 z-40"
            onClick={onMobileClose} />

          <div className="lg:hidden fixed inset-x-0 bottom-0 z-50 bg-card border-t border-border rounded-t-2xl p-5 max-h-[80vh] overflow-y-auto animate-in slide-in-from-bottom duration-300">
            {filterContent}
            <div className="mt-6 pt-4 border-t border-border">
              <Button
                variant="primary"
                size="lg"
                className="w-full"
                onClick={onMobileClose}>

                Show Results
              </Button>
            </div>
          </div>
        </>
      }
    </>);

}
export function FilterButton({
  activeCount,
  onClick



}: { activeCount: number; onClick: () => void; }) {
  return (
    <button
      onClick={onClick}
      className="lg:hidden flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-full hover:bg-muted transition-colors">

      <SlidersHorizontal className="w-4 h-4" />
      <span className="text-sm font-medium">Filters</span>
      {activeCount > 0 &&
        <span className="px-1.5 py-0.5 text-xs font-medium bg-primary text-primary-foreground rounded-full">
          {activeCount}
        </span>
      }
    </button>);

}