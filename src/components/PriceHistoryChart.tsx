import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceDot
} from
  'recharts';
import { TrendingDown, Calendar, Sparkles } from 'lucide-react';
import { PriceHistoryPoint } from '../types/flight';
interface PriceHistoryChartProps {
  data: PriceHistoryPoint[];
  isLoading?: boolean;
}
interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: PriceHistoryPoint;
    value: number;
  }>;
}
// Generate mock 7-day price history
export function generatePriceHistory(basePrice: number): PriceHistoryPoint[] {
  const history: PriceHistoryPoint[] = [];
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    // Random price variation (-15% to +10%)
    const variation = Math.random() * 0.25 - 0.15;
    const price = Math.round(basePrice * (1 + variation));
    history.push({
      date: date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      }),
      price
    });
  }
  // Mark the lowest price
  const minPrice = Math.min(...history.map((h) => h.price));
  return history.map((h) => ({
    ...h,
    isLowest: h.price === minPrice
  }));
}
function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload || !payload.length) return null;
  const data = payload[0].payload;
  return (
    <div className="glass-card rounded-xl p-3 shadow-xl border border-white/20">
      <div className="flex items-center gap-2 mb-1">
        <Calendar className="w-4 h-4 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">{data.date}</p>
      </div>
      <p className="text-xl font-bold text-gradient">
        ${data.price.toLocaleString()}
      </p>
      {data.isLowest &&
        <div className="flex items-center gap-1 mt-1 text-emerald-500">
          <Sparkles className="w-3 h-3" />
          <span className="text-xs font-medium">Lowest price!</span>
        </div>
      }
    </div>);

}
export function PriceHistoryChart({ data, isLoading }: PriceHistoryChartProps) {
  if (isLoading) {
    return (
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-xl shimmer" />
          <div className="space-y-2">
            <div className="h-5 w-40 rounded-lg shimmer" />
            <div className="h-4 w-32 rounded-lg shimmer" />
          </div>
        </div>
        <div className="h-48 rounded-xl shimmer" />
      </div>);

  }
  if (data.length === 0) {
    return null;
  }
  const minPrice = Math.min(...data.map((d) => d.price));
  const maxPrice = Math.max(...data.map((d) => d.price));
  const currentPrice = data[data.length - 1]?.price || 0;
  const lowestPoint = data.find((d) => d.isLowest);
  const priceDiff = currentPrice - minPrice;
  const percentDiff = (priceDiff / minPrice * 100).toFixed(1);
  return (
    <div className="glass-card rounded-2xl p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-accent rounded-xl shadow-lg shadow-cyan-500/25">
            <TrendingDown className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              7-Day Price Trend
            </h3>
            <p className="text-sm text-muted-foreground">
              Track price changes over time
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Current</p>
            <p className="text-lg font-bold text-foreground">
              ${currentPrice.toLocaleString()}
            </p>
          </div>
          <div className="h-10 w-px bg-border" />
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Lowest</p>
            <p className="text-lg font-bold text-emerald-500">
              ${minPrice.toLocaleString()}
            </p>
          </div>
          {priceDiff > 0 &&
            <>
              <div className="h-10 w-px bg-border" />
              <div className="px-3 py-1.5 bg-amber-500/10 rounded-lg">
                <p className="text-sm font-medium text-amber-600">
                  +{percentDiff}% from low
                </p>
              </div>
            </>
          }
        </div>
      </div>

      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{
              top: 10,
              right: 10,
              left: 0,
              bottom: 0
            }}>

            <defs>
              <linearGradient
                id="priceHistoryGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1">

                <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.4} />
                <stop offset="50%" stopColor="#3b82f6" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
              </linearGradient>
              <linearGradient
                id="priceHistoryStroke"
                x1="0"
                y1="0"
                x2="1"
                y2="0">

                <stop offset="0%" stopColor="#06b6d4" />
                <stop offset="50%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="hsl(var(--border))" />

            <XAxis
              dataKey="date"
              tick={{
                fontSize: 11,
                fill: 'hsl(var(--muted-foreground))'
              }}
              tickLine={false}
              axisLine={false} />

            <YAxis
              tick={{
                fontSize: 11,
                fill: 'hsl(var(--muted-foreground))'
              }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${value}`}
              domain={[minPrice * 0.95, maxPrice * 1.05]}
              width={55} />

            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="price"
              stroke="url(#priceHistoryStroke)"
              strokeWidth={3}
              fill="url(#priceHistoryGradient)"
              dot={(props) => {
                const { cx, cy, payload } = props;
                if (payload.isLowest) {
                  return (
                    <circle
                      cx={cx}
                      cy={cy}
                      r={8}
                      fill="#10b981"
                      stroke="white"
                      strokeWidth={3}
                      className="animate-pulse" />);


                }
                return (
                  <circle
                    cx={cx}
                    cy={cy}
                    r={4}
                    fill="#3b82f6"
                    stroke="white"
                    strokeWidth={2} />);


              }}
              activeDot={{
                r: 6,
                fill: '#8b5cf6',
                stroke: 'white',
                strokeWidth: 2
              }} />

          </AreaChart>
        </ResponsiveContainer>
      </div>

      {lowestPoint &&
        <div className="mt-4 p-3 bg-emerald-500/10 rounded-xl flex items-center gap-3">
          <div className="p-2 bg-emerald-500 rounded-lg">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
              Best time to book was {lowestPoint.date}
            </p>
            <p className="text-xs text-emerald-600 dark:text-emerald-500">
              Price was ${lowestPoint.price.toLocaleString()} — ${priceDiff}{' '}
              less than today
            </p>
          </div>
        </div>
      }
    </div>);

}