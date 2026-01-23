import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  ComposedChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
  Legend
} from
  'recharts';
import {
  TrendingUp,
  BarChart3,
  LineChartIcon,
  AreaChartIcon,
  Layers
} from
  'lucide-react';
import { PriceDataPoint, ChartType } from '../types/flight';
interface PriceGraphProps {
  data: PriceDataPoint[];
  isLoading?: boolean;
}
interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: PriceDataPoint;
    value: number;
  }>;
  label?: string;
}
const CHART_COLORS = {
  primary: '#6366f1',
  secondary: '#8b5cf6',
  accent: '#06b6d4',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  gradient: ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444']
};
function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload || !payload.length) return null;
  const data = payload[0].payload;
  return (
    <div className="glass-card rounded-xl p-4 shadow-xl border border-white/20">
      <div className="flex items-center gap-2 mb-2">
        <div
          className="w-3 h-3 rounded-full"
          style={{
            backgroundColor: data.color || CHART_COLORS.primary
          }} />

        <p className="font-semibold text-foreground">{data.label}</p>
      </div>
      <p className="text-2xl font-bold text-gradient">
        ${data.price.toLocaleString()}
      </p>
      <p className="text-sm text-muted-foreground mt-1">
        {data.count} flight{data.count !== 1 ? 's' : ''} available
      </p>
    </div>);

}
function ChartTypeButton({
  type,
  currentType,
  onClick,
  icon: Icon,
  label






}: { type: ChartType; currentType: ChartType; onClick: () => void; icon: React.ElementType; label: string; }) {
  const isActive = type === currentType;
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium
        transition-all duration-200
        ${isActive ? 'bg-primary text-white' : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground'}
      `}
      title={label}>

      <Icon className="w-4 h-4" />
      <span className="hidden sm:inline">{label}</span>
    </button>);

}
export function PriceGraph({ data, isLoading }: PriceGraphProps) {
  const [chartType, setChartType] = useState<ChartType>('bar');
  if (isLoading) {
    return (
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl shimmer" />
            <div className="h-6 w-48 rounded-lg shimmer" />
          </div>
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((i) =>
              <div key={i} className="h-8 w-16 rounded-lg shimmer" />
            )}
          </div>
        </div>
        <div className="h-64 rounded-xl shimmer" />
      </div>);

  }
  if (data.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 bg-gradient-primary rounded-xl">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">
            Price Analysis
          </h3>
        </div>
        <div className="h-64 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <BarChart3 className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">No price data available</p>
          </div>
        </div>
      </div>);

  }
  // Enhance data with colors
  const enhancedData = data.map((item, index) => ({
    ...item,
    color: CHART_COLORS.gradient[index % CHART_COLORS.gradient.length]
  }));
  const minPrice = Math.min(...data.map((d) => d.price));
  const maxPrice = Math.max(...data.map((d) => d.price));
  const avgPrice = Math.round(
    data.reduce((sum, d) => sum + d.price, 0) / data.length
  );
  const getBarColor = (price: number) => {
    const ratio = (price - minPrice) / (maxPrice - minPrice || 1);
    if (ratio < 0.33) return CHART_COLORS.success;
    if (ratio < 0.66) return CHART_COLORS.warning;
    return CHART_COLORS.danger;
  };
  const commonProps = {
    data: enhancedData,
    margin: {
      top: 20,
      right: 20,
      left: 0,
      bottom: 20
    }
  };
  const commonAxisProps = {
    xAxis: {
      dataKey: 'label',
      tick: {
        fontSize: 11,
        fill: 'hsl(var(--muted-foreground))'
      },
      tickLine: false,
      axisLine: false,
      interval: 0,
      angle: -45,
      textAnchor: 'end' as const,
      height: 80
    },
    yAxis: {
      tick: {
        fontSize: 11,
        fill: 'hsl(var(--muted-foreground))'
      },
      tickLine: false,
      axisLine: false,
      tickFormatter: (value: number) => `$${value}`,
      width: 60
    },
    grid: {
      strokeDasharray: '3 3',
      vertical: false,
      stroke: 'hsl(var(--border))'
    }
  };
  const renderChart = () => {
    switch (chartType) {
      case 'line':
        return (
          <LineChart {...commonProps}>
            <defs>
              <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor={CHART_COLORS.primary} />
                <stop offset="100%" stopColor={CHART_COLORS.secondary} />
              </linearGradient>
            </defs>
            <CartesianGrid {...commonAxisProps.grid} />
            <XAxis {...commonAxisProps.xAxis} />
            <YAxis {...commonAxisProps.yAxis} />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine
              y={avgPrice}
              stroke={CHART_COLORS.accent}
              strokeDasharray="5 5"
              label={{
                value: `Avg: $${avgPrice}`,
                fill: CHART_COLORS.accent,
                fontSize: 11
              }} />

            <Line
              type="monotone"
              dataKey="price"
              stroke="url(#lineGradient)"
              strokeWidth={3}
              dot={{
                fill: CHART_COLORS.primary,
                strokeWidth: 2,
                r: 5
              }}
              activeDot={{
                r: 8,
                fill: CHART_COLORS.secondary
              }} />

          </LineChart>);

      case 'area':
        return (
          <AreaChart {...commonProps}>
            <defs>
              <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor={CHART_COLORS.primary}
                  stopOpacity={0.4} />

                <stop
                  offset="50%"
                  stopColor={CHART_COLORS.secondary}
                  stopOpacity={0.2} />

                <stop
                  offset="100%"
                  stopColor={CHART_COLORS.secondary}
                  stopOpacity={0} />

              </linearGradient>
              <linearGradient id="strokeGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor={CHART_COLORS.primary} />
                <stop offset="100%" stopColor={CHART_COLORS.secondary} />
              </linearGradient>
            </defs>
            <CartesianGrid {...commonAxisProps.grid} />
            <XAxis {...commonAxisProps.xAxis} />
            <YAxis {...commonAxisProps.yAxis} />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine
              y={avgPrice}
              stroke={CHART_COLORS.accent}
              strokeDasharray="5 5" />

            <Area
              type="monotone"
              dataKey="price"
              stroke="url(#strokeGradient)"
              strokeWidth={3}
              fill="url(#areaGradient)"
              dot={{
                fill: CHART_COLORS.primary,
                strokeWidth: 2,
                r: 4
              }}
              activeDot={{
                r: 7,
                fill: CHART_COLORS.secondary
              }} />

          </AreaChart>);

      case 'composed':
        return (
          <ComposedChart {...commonProps}>
            <defs>
              <linearGradient id="composedGradient" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor={CHART_COLORS.primary}
                  stopOpacity={0.3} />

                <stop
                  offset="100%"
                  stopColor={CHART_COLORS.primary}
                  stopOpacity={0} />

              </linearGradient>
            </defs>
            <CartesianGrid {...commonAxisProps.grid} />
            <XAxis {...commonAxisProps.xAxis} />
            <YAxis {...commonAxisProps.yAxis} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Area
              type="monotone"
              dataKey="price"
              fill="url(#composedGradient)"
              stroke="none"
              name="Price Range" />

            <Bar
              dataKey="price"
              fill={CHART_COLORS.primary}
              radius={[4, 4, 0, 0]}
              maxBarSize={40}
              name="Price">

              {enhancedData.map((entry, index) =>
                <Cell key={`cell-${index}`} fill={getBarColor(entry.price)} />
              )}
            </Bar>
            <Line
              type="monotone"
              dataKey="count"
              stroke={CHART_COLORS.accent}
              strokeWidth={2}
              dot={false}
              name="Flight Count"
              yAxisId={1} />

            <YAxis
              yAxisId={1}
              orientation="right"
              tick={{
                fontSize: 11,
                fill: 'hsl(var(--muted-foreground))'
              }}
              tickLine={false}
              axisLine={false} />

          </ComposedChart>);

      default:
        // bar
        return (
          <BarChart {...commonProps}>
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={CHART_COLORS.primary} />
                <stop offset="100%" stopColor={CHART_COLORS.secondary} />
              </linearGradient>
            </defs>
            <CartesianGrid {...commonAxisProps.grid} />
            <XAxis {...commonAxisProps.xAxis} />
            <YAxis {...commonAxisProps.yAxis} />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{
                fill: 'hsl(var(--muted) / 0.5)'
              }} />

            <ReferenceLine
              y={avgPrice}
              stroke={CHART_COLORS.accent}
              strokeDasharray="5 5"
              label={{
                value: `Avg: $${avgPrice}`,
                fill: CHART_COLORS.accent,
                fontSize: 11,
                position: 'right'
              }} />

            <Bar dataKey="price" radius={[8, 8, 0, 0]} maxBarSize={50}>
              {enhancedData.map((entry, index) =>
                <Cell
                  key={`cell-${index}`}
                  fill={getBarColor(entry.price)}
                  className="transition-all duration-300 hover:opacity-80" />

              )}
            </Bar>
          </BarChart>);

    }
  };
  return (
    <div className="glass-card rounded-2xl p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-primary rounded-xl shadow-lg shadow-primary/25">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              Price Analysis
            </h3>
            <p className="text-sm text-muted-foreground">
              Average price by airline
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <ChartTypeButton
            type="bar"
            currentType={chartType}
            onClick={() => setChartType('bar')}
            icon={BarChart3}
            label="Bar" />

          <ChartTypeButton
            type="line"
            currentType={chartType}
            onClick={() => setChartType('line')}
            icon={LineChartIcon}
            label="Line" />

          <ChartTypeButton
            type="area"
            currentType={chartType}
            onClick={() => setChartType('area')}
            icon={AreaChartIcon}
            label="Area" />

          <ChartTypeButton
            type="composed"
            currentType={chartType}
            onClick={() => setChartType('composed')}
            icon={Layers}
            label="Combo" />

        </div>
      </div>

      {/* Price Legend */}
      <div className="flex flex-wrap items-center gap-4 mb-4 text-sm">
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{
              backgroundColor: CHART_COLORS.success
            }} />

          <span className="text-muted-foreground">Low</span>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{
              backgroundColor: CHART_COLORS.warning
            }} />

          <span className="text-muted-foreground">Medium</span>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{
              backgroundColor: CHART_COLORS.danger
            }} />

          <span className="text-muted-foreground">High</span>
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <div
            className="w-6 h-0.5"
            style={{
              backgroundColor: CHART_COLORS.accent
            }} />

          <span className="text-muted-foreground">Average: ${avgPrice}</span>
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </div>);

}