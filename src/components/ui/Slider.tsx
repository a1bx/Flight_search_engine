import React, { useCallback, useEffect, useState, useRef } from 'react';
interface SliderProps {
  label?: string;
  min: number;
  max: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  formatValue?: (value: number) => string;
  step?: number;
}
export function Slider({
  label,
  min,
  max,
  value,
  onChange,
  formatValue = (v) => v.toString(),
  step = 1
}: SliderProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState<'min' | 'max' | null>(null);
  const getPercentage = useCallback(
    (val: number) => (val - min) / (max - min) * 100,
    [min, max]
  );
  const getValueFromPosition = useCallback(
    (clientX: number) => {
      if (!trackRef.current) return min;
      const rect = trackRef.current.getBoundingClientRect();
      const percentage = Math.max(
        0,
        Math.min(1, (clientX - rect.left) / rect.width)
      );
      const rawValue = min + percentage * (max - min);
      return Math.round(rawValue / step) * step;
    },
    [min, max, step]
  );
  const handleMouseDown = (thumb: 'min' | 'max') => (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(thumb);
  };
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;
      const newValue = getValueFromPosition(e.clientX);
      if (isDragging === 'min') {
        onChange([Math.min(newValue, value[1] - step), value[1]]);
      } else {
        onChange([value[0], Math.max(newValue, value[0] + step)]);
      }
    },
    [isDragging, getValueFromPosition, onChange, value, step]
  );
  const handleMouseUp = useCallback(() => {
    setIsDragging(null);
  }, []);
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);
  const minPercent = getPercentage(value[0]);
  const maxPercent = getPercentage(value[1]);
  return (
    <div className="w-full">
      {label &&
      <label className="block text-sm font-medium text-foreground mb-3">
          {label}
        </label>
      }
      <div className="flex justify-between text-sm text-muted-foreground mb-2">
        <span>{formatValue(value[0])}</span>
        <span>{formatValue(value[1])}</span>
      </div>
      <div
        ref={trackRef}
        className="relative h-2 bg-muted rounded-full cursor-pointer">

        {/* Active track */}
        <div
          className="absolute h-full bg-primary rounded-full"
          style={{
            left: `${minPercent}%`,
            width: `${maxPercent - minPercent}%`
          }} />


        {/* Min thumb */}
        <button
          type="button"
          className={`
            absolute top-1/2 -translate-y-1/2 -translate-x-1/2
            w-5 h-5 bg-background border-2 border-primary rounded-full
            shadow-md cursor-grab focus:outline-none focus:ring-2 focus:ring-ring
            transition-transform hover:scale-110
            ${isDragging === 'min' ? 'cursor-grabbing scale-110' : ''}
          `}
          style={{
            left: `${minPercent}%`
          }}
          onMouseDown={handleMouseDown('min')}
          aria-label="Minimum value"
          aria-valuemin={min}
          aria-valuemax={value[1]}
          aria-valuenow={value[0]} />


        {/* Max thumb */}
        <button
          type="button"
          className={`
            absolute top-1/2 -translate-y-1/2 -translate-x-1/2
            w-5 h-5 bg-background border-2 border-primary rounded-full
            shadow-md cursor-grab focus:outline-none focus:ring-2 focus:ring-ring
            transition-transform hover:scale-110
            ${isDragging === 'max' ? 'cursor-grabbing scale-110' : ''}
          `}
          style={{
            left: `${maxPercent}%`
          }}
          onMouseDown={handleMouseDown('max')}
          aria-label="Maximum value"
          aria-valuemin={value[0]}
          aria-valuemax={max}
          aria-valuenow={value[1]} />

      </div>
    </div>);

}