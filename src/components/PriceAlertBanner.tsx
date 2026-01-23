import React from 'react';
import { TrendingDown, TrendingUp, Bell, X, Sparkles } from 'lucide-react';
interface PriceAlertBannerProps {
  route: string;
  currentPrice: number;
  previousPrice: number;
  onDismiss: () => void;
  onViewDeals: () => void;
}
export function PriceAlertBanner({
  route,
  currentPrice,
  previousPrice,
  onDismiss,
  onViewDeals
}: PriceAlertBannerProps) {
  const priceDiff = previousPrice - currentPrice;
  const percentChange = (priceDiff / previousPrice * 100).toFixed(1);
  const isPriceDropped = priceDiff > 0;
  if (!isPriceDropped) return null;
  return (
    <div className="relative overflow-hidden rounded-2xl mb-6 animate-in slide-in-from-top-4 duration-500">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500" />

      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, white 1px, transparent 1px),
                           radial-gradient(circle at 80% 50%, white 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
            animation: 'pulse 2s ease-in-out infinite'
          }} />

      </div>

      <div className="relative px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
            <TrendingDown className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <span className="text-sm font-medium text-white/90">
                Price Alert
              </span>
            </div>
            <h3 className="text-xl font-bold text-white mb-1">
              Prices dropped ${priceDiff.toLocaleString()} ({percentChange}%)!
            </h3>
            <p className="text-white/80 text-sm">
              {route} flights are now starting at{' '}
              <span className="font-bold">
                ${currentPrice.toLocaleString()}
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={onViewDeals}
            className="flex-1 sm:flex-none px-6 py-2.5 bg-white text-emerald-600 font-semibold rounded-xl hover:bg-white/90 transition-colors shadow-lg">

            View Deals
          </button>
          <button
            onClick={onDismiss}
            className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors">

            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>);

}
export function PriceAlertMini({
  priceChange,
  isIncrease



}: {priceChange: number;isIncrease: boolean;}) {
  return (
    <div
      className={`
      inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium
      ${isIncrease ? 'bg-red-500/10 text-red-600 dark:text-red-400' : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'}
    `}>

      {isIncrease ?
      <TrendingUp className="w-3 h-3" /> :

      <TrendingDown className="w-3 h-3" />
      }
      <span>
        {isIncrease ? '+' : '-'}${Math.abs(priceChange)}
      </span>
    </div>);

}