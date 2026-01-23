import React from 'react';
import { MapPin, Star, Wifi, Car, Utensils, Dumbbell } from 'lucide-react';
import { Hotel } from '../types/flight';
import { Button } from './ui/Button';

interface HotelCardProps {
  hotel: Hotel;
  onSelect?: (hotel: Hotel) => void;
}

const amenityIcons: Record<string, React.ReactNode> = {
  WiFi: <Wifi className="w-4 h-4" />,
  Parking: <Car className="w-4 h-4" />,
  Restaurant: <Utensils className="w-4 h-4" />,
  Gym: <Dumbbell className="w-4 h-4" />
};

export function HotelCard({ hotel, onSelect }: HotelCardProps) {
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48">
        <img
          src={hotel.image}
          alt={hotel.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 right-3 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold">
          ${hotel.pricePerNight}/night
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h3 className="font-semibold text-foreground text-lg mb-1">
              {hotel.name}
            </h3>
            <div className="flex items-center gap-1 text-muted-foreground text-sm">
              <MapPin className="w-4 h-4" />
              <span>{hotel.location}, {hotel.city}</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="font-medium text-foreground">{hotel.rating}</span>
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {hotel.description}
        </p>
        
        <div className="flex flex-wrap gap-2 mb-3">
          {hotel.amenities.slice(0, 4).map((amenity) => (
            <div
              key={amenity}
              className="flex items-center gap-1 text-xs text-muted-foreground bg-muted px-2 py-1 rounded"
            >
              {amenityIcons[amenity]}
              <span>{amenity}</span>
            </div>
          ))}
          {hotel.amenities.length > 4 && (
            <div className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
              +{hotel.amenities.length - 4} more
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
          <span>Check-in: {hotel.checkIn}</span>
          <span>Check-out: {hotel.checkOut}</span>
        </div>
        
        {hotel.distanceFromCityCenter !== undefined && (
          <div className="text-xs text-muted-foreground mb-3">
            {hotel.distanceFromCityCenter} km from city center
          </div>
        )}
        
        {onSelect && (
          <Button
            variant="primary"
            size="sm"
            className="w-full"
            onClick={() => onSelect(hotel)}
          >
            View Details
          </Button>
        )}
      </div>
    </div>
  );
}
