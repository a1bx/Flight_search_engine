import React, { useEffect, useMemo, useState, createElement } from 'react';
import {
  Calculator,
  Plane,
  Home,
  Utensils,
  Bus,
  Ticket,
  Plus,
  Trash2,
  Download,
  Save,
  Lightbulb,
  TrendingUp,
  TrendingDown } from
'lucide-react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Select } from './ui/Select';
import { BudgetItem } from '../types/flight';
import { DESTINATIONS, getDestinationById } from '../utils/destinations';
interface BudgetCalculatorProps {
  destination?: string;
  onSave?: (budget: {items: BudgetItem[];total: number;}) => void;
}
const DEFAULT_CATEGORIES = [
{
  id: 'flights',
  label: 'Flights',
  icon: Plane
},
{
  id: 'accommodation',
  label: 'Accommodation',
  icon: Home
},
{
  id: 'food',
  label: 'Food & Dining',
  icon: Utensils
},
{
  id: 'transportation',
  label: 'Local Transport',
  icon: Bus
},
{
  id: 'activities',
  label: 'Activities',
  icon: Ticket
}];

const BUDGET_LEVELS = [
{
  value: 'budget',
  label: 'Budget',
  multiplier: 0.7
},
{
  value: 'moderate',
  label: 'Moderate',
  multiplier: 1.0
},
{
  value: 'luxury',
  label: 'Luxury',
  multiplier: 1.8
}];

export function BudgetCalculator({
  destination: initialDestination,
  onSave
}: BudgetCalculatorProps) {
  const [selectedDestinationId, setSelectedDestinationId] = useState<string>('');
  const [tripDays, setTripDays] = useState<number>(7);
  const [budgetLevel, setBudgetLevel] = useState<string>('moderate');
  const [items, setItems] = useState<BudgetItem[]>(
    DEFAULT_CATEGORIES.map((cat) => ({
      category: cat.label,
      amount: 0,
      notes: ''
    }))
  );
  const [customItems, setCustomItems] = useState<BudgetItem[]>([]);
  const [newCategory, setNewCategory] = useState('');
  // Get selected destination data
  const selectedDestination = useMemo(() => {
    if (selectedDestinationId) {
      return getDestinationById(selectedDestinationId);
    }
    // Try to match initial destination by name
    if (initialDestination) {
      const found = DESTINATIONS.find(
        (d) =>
        d.name.toLowerCase() === initialDestination.toLowerCase() ||
        d.country.toLowerCase() === initialDestination.toLowerCase()
      );
      // Auto-select if found
      if (found && !selectedDestinationId) {
        setSelectedDestinationId(found.id);
      }
      return found;
    }
    return null;
  }, [selectedDestinationId, initialDestination]);
  // Auto-populate costs when destination or settings change
  useEffect(() => {
    if (selectedDestination) {
      const level = BUDGET_LEVELS.find((l) => l.value === budgetLevel);
      const multiplier = level?.multiplier || 1.0;
      setItems((prev) =>
      prev.map((item) => {
        const category = DEFAULT_CATEGORIES.find(
          (c) => c.label === item.category
        );
        let baseAmount = 0;
        switch (category?.id) {
          case 'flights':
            baseAmount = selectedDestination.averageFlightPrice * multiplier;
            break;
          case 'accommodation':
            baseAmount =
            selectedDestination.averageCosts.accommodation *
            tripDays *
            multiplier;
            break;
          case 'food':
            baseAmount =
            selectedDestination.averageCosts.meals * tripDays * multiplier;
            break;
          case 'transportation':
            baseAmount =
            selectedDestination.averageCosts.transportation *
            tripDays *
            multiplier;
            break;
          case 'activities':
            baseAmount =
            selectedDestination.averageCosts.activities *
            tripDays *
            multiplier;
            break;
        }
        return {
          ...item,
          amount: Math.round(baseAmount)
        };
      })
      );
    }
  }, [selectedDestination, tripDays, budgetLevel]);
  const total = useMemo(() => {
    const itemsTotal = items.reduce((sum, item) => sum + item.amount, 0);
    const customTotal = customItems.reduce((sum, item) => sum + item.amount, 0);
    return itemsTotal + customTotal;
  }, [items, customItems]);
  const dailyAverage = useMemo(() => {
    if (tripDays === 0) return 0;
    // Exclude flights from daily average
    const flightItem = items.find((i) => i.category === 'Flights');
    const flightCost = flightItem?.amount || 0;
    return Math.round((total - flightCost) / tripDays);
  }, [total, tripDays, items]);
  const updateItem = (
  index: number,
  field: keyof BudgetItem,
  value: string | number) =>
  {
    setItems((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        [field]: value
      };
      return updated;
    });
  };
  const updateCustomItem = (
  index: number,
  field: keyof BudgetItem,
  value: string | number) =>
  {
    setCustomItems((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        [field]: value
      };
      return updated;
    });
  };
  const addCustomItem = () => {
    if (newCategory.trim()) {
      setCustomItems((prev) => [
      ...prev,
      {
        category: newCategory,
        amount: 0,
        notes: ''
      }]
      );
      setNewCategory('');
    }
  };
  const removeCustomItem = (index: number) => {
    setCustomItems((prev) => prev.filter((_, i) => i !== index));
  };
  const handleSave = () => {
    onSave?.({
      items: [...items, ...customItems],
      total
    });
  };
  const handleExport = () => {
    const data = {
      destination: selectedDestination?.name || initialDestination,
      tripDays,
      budgetLevel,
      date: new Date().toISOString(),
      items: [...items, ...customItems],
      total,
      dailyAverage
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `budget-${selectedDestination?.name || 'trip'}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };
  return (
    <div className="space-y-6">
      {/* Settings Card */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Calculator className="w-5 h-5 text-primary" />
          </div>
          <h2 className="text-lg font-semibold text-foreground">
            Trip Settings
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Destination Selector */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Destination
            </label>
            <select
              value={selectedDestinationId}
              onChange={(e) => setSelectedDestinationId(e.target.value)}
              className="w-full h-10 px-3 bg-background border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring">

              <option value="">Select destination...</option>
              {DESTINATIONS.map((dest) =>
              <option key={dest.id} value={dest.id}>
                  {dest.name}, {dest.country}
                </option>
              )}
            </select>
          </div>

          {/* Trip Duration */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Trip Duration
            </label>
            <div className="relative">
              <input
                type="number"
                min="1"
                max="365"
                value={tripDays}
                onChange={(e) =>
                setTripDays(Math.max(1, Number(e.target.value)))
                }
                className="w-full h-10 px-3 pr-12 bg-background border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring" />

              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                days
              </span>
            </div>
          </div>

          {/* Budget Level */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Budget Level
            </label>
            <select
              value={budgetLevel}
              onChange={(e) => setBudgetLevel(e.target.value)}
              className="w-full h-10 px-3 bg-background border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring">

              {BUDGET_LEVELS.map((level) =>
              <option key={level.value} value={level.value}>
                  {level.label}
                </option>
              )}
            </select>
          </div>
        </div>

        {/* No destination selected message */}
        {!selectedDestination &&
        <div className="mt-4 p-4 bg-muted/50 border border-border rounded-lg">
            <div className="flex items-start gap-3">
              <Lightbulb className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground mb-1">
                  Select a destination for smart estimates
                </p>
                <p className="text-xs text-muted-foreground">
                  Choose a destination above to automatically populate estimated
                  costs based on real travel data.
                </p>
              </div>
            </div>
          </div>
        }

        {/* Suggestions Banner */}
        {selectedDestination &&
        <div className="mt-4 p-4 bg-primary/5 border border-primary/20 rounded-lg">
            <div className="flex items-start gap-3">
              <Lightbulb className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground mb-1">
                  Estimated costs for {selectedDestination.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  Based on {budgetLevel} travel style for {tripDays} days.
                  Adjust amounts below to match your preferences.
                </p>
              </div>
            </div>
          </div>
        }
      </div>

      {/* Budget Breakdown */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-foreground">
            Budget Breakdown
          </h3>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Total Budget</p>
            <p className="text-2xl font-bold text-foreground">
              ${total.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              ${dailyAverage}/day average
            </p>
          </div>
        </div>

        {/* Default Categories */}
        <div className="space-y-4 mb-6">
          {items.map((item, index) => {
            const category = DEFAULT_CATEGORIES.find(
              (c) => c.label === item.category
            );
            const Icon = category?.icon || Ticket;
            const percentage =
            total > 0 ? (item.amount / total * 100).toFixed(0) : 0;
            return (
              <div key={item.category} className="space-y-2">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-muted rounded-lg">
                    <Icon className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-1 flex items-center justify-between sm:block">
                      <p className="text-sm font-medium text-foreground">
                        {item.category}
                      </p>
                      <span className="text-xs text-muted-foreground sm:hidden">
                        {percentage}%
                      </span>
                    </div>
                    <div className="sm:col-span-1">
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                          $
                        </span>
                        <input
                          type="number"
                          value={item.amount || ''}
                          onChange={(e) =>
                          updateItem(index, 'amount', Number(e.target.value))
                          }
                          placeholder="0"
                          className="w-full h-10 pl-7 pr-3 bg-background border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring" />

                      </div>
                    </div>
                    <div className="sm:col-span-1">
                      <input
                        type="text"
                        value={item.notes || ''}
                        onChange={(e) =>
                        updateItem(index, 'notes', e.target.value)
                        }
                        placeholder="Notes (optional)"
                        className="w-full h-10 px-3 bg-background border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring" />

                    </div>
                  </div>
                  <span className="hidden sm:block text-xs text-muted-foreground w-12 text-right">
                    {percentage}%
                  </span>
                </div>
                {/* Progress bar */}
                <div className="ml-14 h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-300"
                    style={{
                      width: `${percentage}%`
                    }} />

                </div>
              </div>);

          })}
        </div>

        {/* Custom Items */}
        {customItems.length > 0 &&
        <div className="space-y-4 mb-6 pt-6 border-t border-border">
            <h3 className="text-sm font-medium text-muted-foreground">
              Custom Expenses
            </h3>
            {customItems.map((item, index) =>
          <div key={index} className="flex items-center gap-4">
                <div className="p-2 bg-muted rounded-lg">
                  <Plus className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-1">
                    <input
                  type="text"
                  value={item.category}
                  onChange={(e) =>
                  updateCustomItem(index, 'category', e.target.value)
                  }
                  className="w-full h-10 px-3 bg-background border border-input rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-ring" />

                  </div>
                  <div className="sm:col-span-1">
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        $
                      </span>
                      <input
                    type="number"
                    value={item.amount || ''}
                    onChange={(e) =>
                    updateCustomItem(
                      index,
                      'amount',
                      Number(e.target.value)
                    )
                    }
                    placeholder="0"
                    className="w-full h-10 pl-7 pr-3 bg-background border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring" />

                    </div>
                  </div>
                  <div className="sm:col-span-1 flex gap-2">
                    <input
                  type="text"
                  value={item.notes || ''}
                  onChange={(e) =>
                  updateCustomItem(index, 'notes', e.target.value)
                  }
                  placeholder="Notes"
                  className="flex-1 h-10 px-3 bg-background border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring" />

                    <button
                  onClick={() => removeCustomItem(index)}
                  className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors">

                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
          )}
          </div>
        }

        {/* Add Custom Item */}
        <div className="flex gap-2 mb-6">
          <Input
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="Add custom expense category"
            onKeyDown={(e) => e.key === 'Enter' && addCustomItem()} />

          <Button
            variant="outline"
            onClick={addCustomItem}
            leftIcon={<Plus className="w-4 h-4" />}>

            Add
          </Button>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-border">
          {onSave &&
          <Button
            variant="primary"
            onClick={handleSave}
            leftIcon={<Save className="w-4 h-4" />}>

              Save Budget
            </Button>
          }
          <Button
            variant="outline"
            onClick={handleExport}
            leftIcon={<Download className="w-4 h-4" />}>

            Export
          </Button>
        </div>
      </div>
    </div>);

}