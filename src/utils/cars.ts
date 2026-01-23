import { Car, CarSearchParams } from '../types/flight';

// Mock car data
const CARS: Car[] = [
  {
    id: 'car-1',
    name: 'Toyota Corolla',
    category: 'compact',
    image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop',
    pricePerDay: 35,
    currency: 'USD',
    features: ['Bluetooth', 'GPS', 'Air Conditioning', 'USB Ports'],
    seats: 5,
    transmission: 'automatic',
    fuelType: 'gasoline',
    provider: 'Hertz',
    rating: 4.5
  },
  {
    id: 'car-2',
    name: 'Honda Civic',
    category: 'compact',
    image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop',
    pricePerDay: 38,
    currency: 'USD',
    features: ['Bluetooth', 'GPS', 'Air Conditioning', 'USB Ports', 'Backup Camera'],
    seats: 5,
    transmission: 'automatic',
    fuelType: 'hybrid',
    provider: 'Avis',
    rating: 4.6
  },
  {
    id: 'car-3',
    name: 'Nissan Altima',
    category: 'mid-size',
    image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop',
    pricePerDay: 45,
    currency: 'USD',
    features: ['Bluetooth', 'GPS', 'Air Conditioning', 'USB Ports', 'Backup Camera', 'Leather Seats'],
    seats: 5,
    transmission: 'automatic',
    fuelType: 'gasoline',
    provider: 'Enterprise',
    rating: 4.4
  },
  {
    id: 'car-4',
    name: 'Ford Explorer',
    category: 'suv',
    image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop',
    pricePerDay: 75,
    currency: 'USD',
    features: ['Bluetooth', 'GPS', 'Air Conditioning', 'USB Ports', 'Backup Camera', 'Third Row Seating', 'AWD'],
    seats: 7,
    transmission: 'automatic',
    fuelType: 'gasoline',
    provider: 'Budget',
    rating: 4.7
  },
  {
    id: 'car-5',
    name: 'BMW 3 Series',
    category: 'luxury',
    image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop',
    pricePerDay: 120,
    currency: 'USD',
    features: ['Bluetooth', 'GPS', 'Air Conditioning', 'USB Ports', 'Backup Camera', 'Leather Seats', 'Sunroof', 'Premium Sound'],
    seats: 5,
    transmission: 'automatic',
    fuelType: 'gasoline',
    provider: 'Sixt',
    rating: 4.9
  },
  {
    id: 'car-6',
    name: 'Tesla Model 3',
    category: 'luxury',
    image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop',
    pricePerDay: 150,
    currency: 'USD',
    features: ['Bluetooth', 'GPS', 'Air Conditioning', 'USB Ports', 'Backup Camera', 'Autopilot', 'Supercharging'],
    seats: 5,
    transmission: 'automatic',
    fuelType: 'electric',
    provider: 'Hertz',
    rating: 4.8
  }
];

export function searchCars(params: CarSearchParams): Promise<Car[]> {
  return new Promise((resolve) => {
    // Simulate API delay
    setTimeout(() => {
      // Add some price variation based on dates
      const results = CARS.map((car) => ({
        ...car,
        pricePerDay: Math.round(
          car.pricePerDay * (0.9 + Math.random() * 0.3)
        )
      }));
      
      resolve(results);
    }, 800 + Math.random() * 800);
  });
}

export function getCarsByCategory(category?: Car['category']): Car[] {
  if (!category) return CARS;
  return CARS.filter((car) => car.category === category);
}
