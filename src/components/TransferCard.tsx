import React from 'react';
import { MapPin, Clock, Users, ArrowRight } from 'lucide-react';
import { Transfer } from '../types/flight';
import { Button } from './ui/Button';

interface TransferCardProps {
  transfer: Transfer;
  onSelect?: (transfer: Transfer) => void;
}

const vehicleLabels: Record<string, string> = {
  sedan: 'Sedan',
  suv: 'SUV',
  van: 'Van',
  bus: 'Bus',
  luxury: 'Luxury'
};

export function TransferCard({ transfer, onSelect }: TransferCardProps) {
  return (
    <div className="bg-card border border-border rounded-xl p-4 hover:shadow-lg transition-shadow">
      <div className="flex items-start gap-4">
        {transfer.image && (
          <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
            <img
              src={transfer.image}
              alt={transfer.type}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="font-semibold text-foreground mb-1">
                {vehicleLabels[transfer.vehicleType] || transfer.vehicleType}
              </h3>
              <div className="text-sm text-muted-foreground capitalize">
                {transfer.type} Transfer
              </div>
            </div>
            <div className="text-right">
              <div className="font-semibold text-foreground text-lg">
                ${transfer.price}
              </div>
              <div className="text-xs text-muted-foreground">
                {transfer.currency}
              </div>
            </div>
          </div>
          
          <div className="space-y-1 mb-3 text-sm">
            <div className="flex items-center gap-2 text-foreground">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <span className="truncate">{transfer.from}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <ArrowRight className="w-4 h-4 ml-1" />
              <span className="truncate">{transfer.to}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{transfer.duration}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              <span>Up to {transfer.capacity} passengers</span>
            </div>
            {transfer.distance && (
              <span>{transfer.distance} km</span>
            )}
          </div>
          
          <div className="text-xs text-muted-foreground mb-3">
            Provider: {transfer.provider}
          </div>
          
          {onSelect && (
            <Button
              variant="primary"
              size="sm"
              className="w-full"
              onClick={() => onSelect(transfer)}
            >
              Book Transfer
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
