import React, { useCallback, useMemo, useState } from 'react';
import { Plane, Sun, Moon, DollarSign, Clock, Leaf } from 'lucide-react';
import { QuickFilter } from '../types/flight';
interface QuickFiltersProps {
  filters: QuickFilter[];
  onToggle: (filterId: string) => void;
}
const FILTER_ICONS: Record<string, React.ElementType> = {
  direct: Plane,
  morning: Sun,
  evening: Moon,
  budget: DollarSign,
  short: Clock,
  eco: Leaf
};
const FILTER_COLORS: Record<
  string,
  {
    bg: string;
    text: string;
    activeBg: string;
  }> =
{
  direct: {
    bg: 'bg-blue-50 dark:bg-blue-950',
    text: 'text-blue-600 dark:text-blue-400',
    activeBg: 'bg-gradient-primary'
  },
  morning: {
    bg: 'bg-amber-50 dark:bg-amber-950',
    text: 'text-amber-600 dark:text-amber-400',
    activeBg: 'bg-gradient-warning'
  },
  evening: {
    bg: 'bg-purple-50 dark:bg-purple-950',
    text: 'text-purple-600 dark:text-purple-400',
    activeBg: 'bg-gradient-to-r from-purple-500 to-indigo-500'
  },
  budget: {
    bg: 'bg-emerald-50 dark:bg-emerald-950',
    text: 'text-emerald-600 dark:text-emerald-400',
    activeBg: 'bg-gradient-success'
  },
  short: {
    bg: 'bg-cyan-50 dark:bg-cyan-950',
    text: 'text-cyan-600 dark:text-cyan-400',
    activeBg: 'bg-gradient-accent'
  },
  eco: {
    bg: 'bg-green-50 dark:bg-green-950',
    text: 'text-green-600 dark:text-green-400',
    activeBg: 'bg-gradient-to-r from-green-500 to-emerald-500'
  }
};
export function QuickFilters({ filters, onToggle }: QuickFiltersProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((filter) => {
        const Icon = FILTER_ICONS[filter.id] || Plane;
        const colors = FILTER_COLORS[filter.id] || FILTER_COLORS.direct;
        return (
          <button
            key={filter.id}
            onClick={() => onToggle(filter.id)}
            className={`
              group flex items-center gap-2 px-4 py-2 rounded-full
              font-medium text-sm transition-all duration-300
              ${filter.isActive ? `${colors.activeBg} text-white shadow-lg scale-105` : `${colors.bg} ${colors.text} hover:scale-105`}
            `}>

            <Icon
              className={`w-4 h-4 transition-transform duration-300 ${filter.isActive ? 'rotate-12' : 'group-hover:rotate-12'}`} />

            <span>{filter.label}</span>
            {filter.count !== undefined &&
            <span
              className={`
                px-1.5 py-0.5 rounded-full text-xs font-bold
                ${filter.isActive ? 'bg-white/20 text-white' : 'bg-current/10'}
              `}>

                {filter.count}
              </span>
            }
          </button>);

      })}
    </div>);

}
export function useQuickFilters(
flights: {
  stops: number;
  price: {
    amount: number;
  };
  departureTime: string;
  carbonEmissions?: number;
}[])
{
  const [activeFilters, setActiveFilters] = useState<Set<string>>(new Set());
  const quickFilters: QuickFilter[] = useMemo(() => {
    const directCount = flights.filter((f) => f.stops === 0).length;
    const morningCount = flights.filter((f) => {
      const hour = parseInt(f.departureTime.split(':')[0]);
      return hour >= 5 && hour < 12;
    }).length;
    const eveningCount = flights.filter((f) => {
      const hour = parseInt(f.departureTime.split(':')[0]);
      return hour >= 18 || hour < 5;
    }).length;
    const budgetCount = flights.filter((f) => f.price.amount < 300).length;
    const shortCount = flights.filter((f) => f.stops <= 1).length;
    const ecoCount = flights.filter(
      (f) => (f.carbonEmissions || 0) < 200
    ).length;
    return [
    {
      id: 'direct',
      label: 'Direct flights',
      isActive: activeFilters.has('direct'),
      count: directCount
    },
    {
      id: 'morning',
      label: 'Morning',
      isActive: activeFilters.has('morning'),
      count: morningCount
    },
    {
      id: 'evening',
      label: 'Evening',
      isActive: activeFilters.has('evening'),
      count: eveningCount
    },
    {
      id: 'budget',
      label: 'Under $300',
      isActive: activeFilters.has('budget'),
      count: budgetCount
    },
    {
      id: 'short',
      label: 'Short layovers',
      isActive: activeFilters.has('short'),
      count: shortCount
    },
    {
      id: 'eco',
      label: 'Eco-friendly',
      isActive: activeFilters.has('eco'),
      count: ecoCount
    }];

  }, [flights, activeFilters]);
  const toggleFilter = useCallback((filterId: string) => {
    setActiveFilters((prev) => {
      const next = new Set(prev);
      if (next.has(filterId)) {
        next.delete(filterId);
      } else {
        next.add(filterId);
      }
      return next;
    });
  }, []);
  const applyQuickFilters = useCallback(
    <
      T extends {
        stops: number;
        price: {
          amount: number;
        };
        departureTime: string;
        carbonEmissions?: number;
      },>(

    flightsToFilter: T[])
    : T[] => {
      if (activeFilters.size === 0) return flightsToFilter;
      return flightsToFilter.filter((flight) => {
        if (activeFilters.has('direct') && flight.stops !== 0) return false;
        if (activeFilters.has('morning')) {
          const hour = parseInt(flight.departureTime.split(':')[0]);
          if (hour < 5 || hour >= 12) return false;
        }
        if (activeFilters.has('evening')) {
          const hour = parseInt(flight.departureTime.split(':')[0]);
          if (hour >= 5 && hour < 18) return false;
        }
        if (activeFilters.has('budget') && flight.price.amount >= 300)
        return false;
        if (activeFilters.has('short') && flight.stops > 1) return false;
        if (activeFilters.has('eco') && (flight.carbonEmissions || 999) >= 200)
        return false;
        return true;
      });
    },
    [activeFilters]
  );
  return {
    quickFilters,
    toggleFilter,
    applyQuickFilters,
    activeFilterCount: activeFilters.size
  };
}