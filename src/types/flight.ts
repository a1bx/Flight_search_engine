export type TripType = 'one-way' | 'round-trip';

export type CabinClass = 'economy' | 'premium_economy' | 'business' | 'first';

export type SortOption = 'best' | 'cheapest' | 'fastest';

export type ChartType = 'bar' | 'line' | 'area' | 'composed';

export interface Airport {
  code: string;
  name: string;
  city: string;
  country: string;
  latitude?: number;
  longitude?: number;
}

export interface SearchParams {
  origin: Airport | null;
  destination: Airport | null;
  departureDate: string;
  returnDate: string;
  passengers: number;
  cabinClass: CabinClass;
  tripType: TripType;
}

export interface FlightSegment {
  departure: {
    airport: string;
    time: string;
    terminal?: string;
  };
  arrival: {
    airport: string;
    time: string;
    terminal?: string;
  };
  duration: string;
  carrierCode: string;
  flightNumber: string;
  aircraft: string;
}

export interface Flight {
  id: string;
  airline: {
    code: string;
    name: string;
    logo: string;
  };
  segments: FlightSegment[];
  totalDuration: string;
  stops: number;
  price: {
    amount: number;
    currency: string;
  };
  departureTime: string;
  arrivalTime: string;
  origin: string;
  destination: string;
  carbonEmissions?: number;
  baggageAllowance?: {
    carryOn: boolean;
    checked: number;
  };
  amenities?: string[];
  priceHistory?: PriceHistoryPoint[];
  isBestDeal?: boolean;
  isFastest?: boolean;
  isLowestEmissions?: boolean;
  isRefundable?: boolean;
  hasWifi?: boolean;
  hasPower?: boolean;
  hasEntertainment?: boolean;
  mealService?: string[];
}

export interface Filters {
  stops: number[];
  priceRange: [number, number];
  airlines: string[];
  departureTimeRange: [number, number];
  arrivalTimeRange: [number, number];
  layoverDuration?: [number, number];
  amenities?: string[];
  ticketType?: string[];
  baggageType?: string[];
  seatPreference?: string[];
  mealService?: string[];
}

export interface PriceDataPoint {
  label: string;
  price: number;
  count: number;
  airline?: string;
  color?: string;
}

export interface PriceHistoryPoint {
  date: string;
  price: number;
  isLowest?: boolean;
}

export interface SearchState {
  flights: Flight[];
  filteredFlights: Flight[];
  isLoading: boolean;
  error: string | null;
  hasSearched: boolean;
}

export interface QuickFilter {
  id: string;
  label: string;
  icon?: string;
  isActive: boolean;
  count?: number;
}

export interface ComparisonFlight {
  flight: Flight;
  addedAt: number;
}

export interface PriceAlert {
  id: string;
  route: string;
  targetPrice: number;
  currentPrice: number;
  priceChange: number;
  lastUpdated: string;
}

// Destination types
export interface Destination {
  id: string;
  name: string;
  country: string;
  region: string;
  image: string;
  description: string;
  averageFlightPrice: number;
  currency: string;
  bestTimeToVisit: string;
  visaRequired: boolean;
  language: string;
  timezone: string;
  attractions: Attraction[];
  tips: string[];
  averageCosts: {
    accommodation: number;
    meals: number;
    transportation: number;
    activities: number;
  };
}

export interface Attraction {
  id: string;
  name: string;
  description: string;
  image: string;
  category: string;
  estimatedCost: number;
  duration: string;
}

// Budget types
export interface BudgetItem {
  category: string;
  amount: number;
  notes?: string;
}

export interface TripBudget {
  id: string;
  destination: string;
  startDate: string;
  endDate: string;
  travelers: number;
  items: BudgetItem[];
  totalBudget: number;
  createdAt: string;
}

// User types
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  savedSearches: SavedSearch[];
  favoriteDestinations: string[];
  tripHistory: TripHistory[];
  budgetPlans: TripBudget[];
}

export interface SavedSearch {
  id: string;
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  createdAt: string;
}

export interface TripHistory {
  id: string;
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  price: number;
  airline: string;
  status: 'upcoming' | 'completed' | 'cancelled';
}

// Nearby airport types
export interface NearbyAirport extends Airport {
  distance: number;
  drivingTime: string;
}

// Hotel types
export interface Hotel {
  id: string;
  name: string;
  location: string;
  city: string;
  country: string;
  rating: number;
  pricePerNight: number;
  currency: string;
  image: string;
  amenities: string[];
  description: string;
  checkIn: string;
  checkOut: string;
  distanceFromAirport?: number;
  distanceFromCityCenter?: number;
}

export interface HotelSearchParams {
  destination: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  rooms: number;
}

// Car rental types
export interface Car {
  id: string;
  name: string;
  category: 'economy' | 'compact' | 'mid-size' | 'full-size' | 'suv' | 'luxury';
  image: string;
  pricePerDay: number;
  currency: string;
  features: string[];
  seats: number;
  transmission: 'automatic' | 'manual';
  fuelType: 'gasoline' | 'diesel' | 'electric' | 'hybrid';
  provider: string;
  rating?: number;
}

export interface CarSearchParams {
  location: string;
  pickupDate: string;
  returnDate: string;
  pickupTime: string;
  returnTime: string;
}

// Transfer types
export interface Transfer {
  id: string;
  type: 'airport' | 'hotel' | 'station' | 'port';
  from: string;
  to: string;
  vehicleType: 'sedan' | 'suv' | 'van' | 'bus' | 'luxury';
  price: number;
  currency: string;
  duration: string;
  distance?: number;
  capacity: number;
  provider: string;
  image?: string;
}

export interface TransferSearchParams {
  from: string;
  to: string;
  date: string;
  time: string;
  passengers: number;
  type: 'airport' | 'hotel' | 'station' | 'port';
}