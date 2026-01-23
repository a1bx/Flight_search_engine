import { Transfer, TransferSearchParams } from '../types/flight';

// Mock transfer data
const TRANSFERS: Transfer[] = [
  {
    id: 'transfer-1',
    type: 'airport',
    from: 'Tokyo Haneda Airport (HND)',
    to: 'Shibuya District',
    vehicleType: 'sedan',
    price: 45,
    currency: 'USD',
    duration: '45 minutes',
    distance: 18,
    capacity: 3,
    provider: 'Tokyo Taxi',
    image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop'
  },
  {
    id: 'transfer-2',
    type: 'airport',
    from: 'Tokyo Haneda Airport (HND)',
    to: 'Shibuya District',
    vehicleType: 'suv',
    price: 65,
    currency: 'USD',
    duration: '45 minutes',
    distance: 18,
    capacity: 6,
    provider: 'Tokyo Taxi',
    image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop'
  },
  {
    id: 'transfer-3',
    type: 'airport',
    from: 'Charles de Gaulle Airport (CDG)',
    to: 'Paris City Center',
    vehicleType: 'sedan',
    price: 55,
    currency: 'USD',
    duration: '50 minutes',
    distance: 25,
    capacity: 3,
    provider: 'Paris Transfer',
    image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop'
  },
  {
    id: 'transfer-4',
    type: 'airport',
    from: 'Charles de Gaulle Airport (CDG)',
    to: 'Paris City Center',
    vehicleType: 'luxury',
    price: 120,
    currency: 'USD',
    duration: '50 minutes',
    distance: 25,
    capacity: 3,
    provider: 'Luxury Paris',
    image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop'
  },
  {
    id: 'transfer-5',
    type: 'airport',
    from: 'Fiumicino Airport (FCO)',
    to: 'Rome City Center',
    vehicleType: 'sedan',
    price: 50,
    currency: 'USD',
    duration: '40 minutes',
    distance: 30,
    capacity: 3,
    provider: 'Rome Shuttle',
    image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop'
  },
  {
    id: 'transfer-6',
    type: 'airport',
    from: 'Fiumicino Airport (FCO)',
    to: 'Rome City Center',
    vehicleType: 'van',
    price: 85,
    currency: 'USD',
    duration: '40 minutes',
    distance: 30,
    capacity: 8,
    provider: 'Rome Shuttle',
    image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop'
  },
  {
    id: 'transfer-7',
    type: 'hotel',
    from: 'Grand Tokyo Hotel',
    to: 'Tokyo Station',
    vehicleType: 'sedan',
    price: 25,
    currency: 'USD',
    duration: '20 minutes',
    distance: 8,
    capacity: 3,
    provider: 'Tokyo Taxi'
  },
  {
    id: 'transfer-8',
    type: 'hotel',
    from: 'Eiffel View Hotel',
    to: 'Louvre Museum',
    vehicleType: 'sedan',
    price: 20,
    currency: 'USD',
    duration: '15 minutes',
    distance: 5,
    capacity: 3,
    provider: 'Paris Transfer'
  }
];

export function searchTransfers(params: TransferSearchParams): Promise<Transfer[]> {
  return new Promise((resolve) => {
    // Simulate API delay
    setTimeout(() => {
      const filtered = TRANSFERS.filter(
        (transfer) =>
          (transfer.from.toLowerCase().includes(params.from.toLowerCase()) ||
            transfer.to.toLowerCase().includes(params.to.toLowerCase())) &&
          transfer.type === params.type &&
          transfer.capacity >= params.passengers
      );
      
      resolve(filtered);
    }, 600 + Math.random() * 600);
  });
}

export function getTransfersByType(type: Transfer['type'], location?: string): Transfer[] {
  let filtered = TRANSFERS.filter((transfer) => transfer.type === type);
  
  if (location) {
    filtered = filtered.filter(
      (transfer) =>
        transfer.from.toLowerCase().includes(location.toLowerCase()) ||
        transfer.to.toLowerCase().includes(location.toLowerCase())
    );
  }
  
  return filtered;
}
