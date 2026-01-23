import React from 'react';
import { Users, Gauge, Zap, Fuel } from 'lucide-react';
import { Car } from '../types/flight';
import { Button } from './ui/Button';

interface CarCardProps {
  car: Car;
  onSelect?: (car: Car) => void;
}

const fuelIcons: Record<string, React.ReactNode> = {
  gasoline: <Fuel className="w-4 h-4" />,
  diesel: <Fuel className="w-4 h-4" />,
  electric: <Zap className="w-4 h-4" />,
  hybrid: <Zap className="w-4 h-4" />
};

export function CarCard({ car, onSelect }: CarCardProps) {
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-40 bg-muted">
        <img
          src={car.image}
          alt={car.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 right-3 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold">
          ${car.pricePerDay}/{car.currency === 'USD' ? 'day' : 'day'}
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h3 className="font-semibold text-foreground text-lg mb-1">
              {car.name}
            </h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="capitalize">{car.category}</span>
              <span>•</span>
              <span className="capitalize">{car.transmission}</span>
            </div>
          </div>
          {car.rating && (
            <div className="text-sm font-medium text-foreground">
              ⭐ {car.rating}
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-4 mb-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{car.seats} seats</span>
          </div>
          <div className="flex items-center gap-1">
            {fuelIcons[car.fuelType]}
            <span className="capitalize">{car.fuelType}</span>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-3">
          {car.features.slice(0, 3).map((feature) => (
            <div
              key={feature}
              className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded"
            >
              {feature}
            </div>
          ))}
          {car.features.length > 3 && (
            <div className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
              +{car.features.length - 3} more
            </div>
          )}
        </div>
        
        <div className="text-xs text-muted-foreground mb-3">
          Provider: {car.provider}
        </div>
        
        {onSelect && (
          <Button
            variant="primary"
            size="sm"
            className="w-full"
            onClick={() => onSelect(car)}
          >
            Book Now
          </Button>
        )}
      </div>
    </div>
  );
}
