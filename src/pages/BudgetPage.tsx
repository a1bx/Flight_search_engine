import { useSearchParams } from 'react-router-dom';
import {
  Calculator,
  Lightbulb,
  TrendingUp,
  DollarSign,
  PiggyBank } from
'lucide-react';
import { BudgetCalculator } from '../components/BudgetCalculator';
import { useAuth } from '../hooks/useAuth';
export function BudgetPage() {
  const [searchParams] = useSearchParams();
  const destination = searchParams.get('destination') || undefined;
  const { isAuthenticated, addBudgetPlan } = useAuth();
  const handleSave = (budget: {items: any[];total: number;}) => {
    if (isAuthenticated) {
      addBudgetPlan({
        destination: destination || 'Unknown',
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).
        toISOString().
        split('T')[0],
        travelers: 1,
        items: budget.items,
        totalBudget: budget.total
      });
      alert('Budget saved to your profile!');
    } else {
      alert('Please log in to save your budget.');
    }
  };
  const tips = [
  'Book flights 2-3 months in advance for the best prices',
  'Consider staying in hostels or Airbnbs to save on accommodation',
  'Eat where locals eat - street food is often delicious and affordable',
  'Use public transportation instead of taxis',
  'Look for free walking tours and museum free days',
  'Set aside 10-15% of your budget for unexpected expenses'];

  const budgetRanges = [
  {
    level: 'Budget',
    icon: PiggyBank,
    range: '$50-100/day',
    description: 'Hostels, street food, public transport',
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10'
  },
  {
    level: 'Moderate',
    icon: DollarSign,
    range: '$100-200/day',
    description: 'Mid-range hotels, restaurants, occasional taxis',
    color: 'text-primary',
    bg: 'bg-primary/10'
  },
  {
    level: 'Luxury',
    icon: TrendingUp,
    range: '$300+/day',
    description: 'Upscale hotels, fine dining, private tours',
    color: 'text-violet-500',
    bg: 'bg-violet-500/10'
  }];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="bg-muted/30 py-12">
        <div className="page-container">
          <div className="max-w-2xl">
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Trip Budget Planner
            </h1>
            <p className="text-lg text-muted-foreground">
              Get smart cost estimates based on your destination and travel
              style. Plan your expenses and stay within budget.
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-8">
        <div className="page-container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Calculator */}
            <div className="lg:col-span-2">
              <BudgetCalculator destination={destination} onSave={handleSave} />
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Budget Ranges */}
              <div className="bg-card border border-border rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Calculator className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground">
                    Budget Ranges
                  </h3>
                </div>
                <div className="space-y-4">
                  {budgetRanges.map((range) =>
                  <div
                    key={range.level}
                    className={`p-4 ${range.bg} rounded-lg`}>

                      <div className="flex items-center gap-2 mb-2">
                        <range.icon className={`w-5 h-5 ${range.color}`} />
                        <span className="font-semibold text-foreground">
                          {range.level}
                        </span>
                      </div>
                      <p className={`text-lg font-bold ${range.color} mb-1`}>
                        {range.range}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {range.description}
                      </p>
                    </div>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-4">
                  * Costs vary significantly by destination. Use the calculator
                  for accurate estimates.
                </p>
              </div>

              {/* Tips */}
              <div className="bg-card border border-border rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-warning/10 rounded-lg">
                    <Lightbulb className="w-5 h-5 text-warning" />
                  </div>
                  <h3 className="font-semibold text-foreground">
                    Money-Saving Tips
                  </h3>
                </div>
                <ul className="space-y-3">
                  {tips.map((tip, index) =>
                  <li key={index} className="flex items-start gap-2 text-sm">
                      <span className="text-primary font-bold flex-shrink-0">
                        {index + 1}.
                      </span>
                      <span className="text-muted-foreground">{tip}</span>
                    </li>
                  )}
                </ul>
              </div>

              {/* How It Works */}
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-6">
                <h3 className="font-semibold text-foreground mb-3">
                  How It Works
                </h3>
                <ol className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex gap-2">
                    <span className="font-bold text-primary">1.</span>
                    <span>Select your destination from the dropdown</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-bold text-primary">2.</span>
                    <span>Set trip duration and budget level</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-bold text-primary">3.</span>
                    <span>Review auto-calculated estimates</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-bold text-primary">4.</span>
                    <span>Adjust amounts to match your plans</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-bold text-primary">5.</span>
                    <span>Save or export your budget</span>
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>);

}