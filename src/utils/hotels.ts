import { Hotel, HotelSearchParams } from '../types/flight';

// Mock hotel data
const HOTELS: Hotel[] = [
  {
    id: 'hotel-1',
    name: 'Grand Tokyo Hotel',
    location: 'Shibuya District',
    city: 'Tokyo',
    country: 'Japan',
    rating: 4.5,
    pricePerNight: 150,
    currency: 'USD',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop',
    amenities: ['WiFi', 'Pool', 'Spa', 'Restaurant', 'Gym', 'Parking'],
    description: 'Modern hotel in the heart of Shibuya with excellent transport links.',
    checkIn: '15:00',
    checkOut: '11:00',
    distanceFromAirport: 25,
    distanceFromCityCenter: 2
  },
  {
    id: 'hotel-2',
    name: 'Tokyo Bay Resort',
    location: 'Odaiba',
    city: 'Tokyo',
    country: 'Japan',
    rating: 4.8,
    pricePerNight: 220,
    currency: 'USD',
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop',
    amenities: ['WiFi', 'Pool', 'Spa', 'Restaurant', 'Gym', 'Beach Access'],
    description: 'Luxury resort with stunning bay views and world-class amenities.',
    checkIn: '15:00',
    checkOut: '11:00',
    distanceFromAirport: 15,
    distanceFromCityCenter: 12
  },
  {
    id: 'hotel-3',
    name: 'Eiffel View Hotel',
    location: '7th Arrondissement',
    city: 'Paris',
    country: 'France',
    rating: 4.6,
    pricePerNight: 180,
    currency: 'USD',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop',
    amenities: ['WiFi', 'Restaurant', 'Bar', 'Room Service', 'Concierge'],
    description: 'Boutique hotel with stunning views of the Eiffel Tower.',
    checkIn: '14:00',
    checkOut: '12:00',
    distanceFromAirport: 30,
    distanceFromCityCenter: 1
  },
  {
    id: 'hotel-4',
    name: 'Champs-Élysées Palace',
    location: '8th Arrondissement',
    city: 'Paris',
    country: 'France',
    rating: 4.9,
    pricePerNight: 350,
    currency: 'USD',
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop',
    amenities: ['WiFi', 'Pool', 'Spa', 'Restaurant', 'Gym', 'Concierge', 'Valet'],
    description: 'Luxury hotel on the famous Champs-Élysées avenue.',
    checkIn: '15:00',
    checkOut: '12:00',
    distanceFromAirport: 35,
    distanceFromCityCenter: 0.5
  },
  {
    id: 'hotel-5',
    name: 'Colosseum Grand Hotel',
    location: 'Monti',
    city: 'Rome',
    country: 'Italy',
    rating: 4.4,
    pricePerNight: 120,
    currency: 'USD',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop',
    amenities: ['WiFi', 'Restaurant', 'Bar', 'Room Service'],
    description: 'Historic hotel near the Colosseum with classic Italian charm.',
    checkIn: '14:00',
    checkOut: '11:00',
    distanceFromAirport: 28,
    distanceFromCityCenter: 1.5
  },
  {
    id: 'hotel-6',
    name: 'Vatican View Hotel',
    location: 'Prati',
    city: 'Rome',
    country: 'Italy',
    rating: 4.7,
    pricePerNight: 200,
    currency: 'USD',
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop',
    amenities: ['WiFi', 'Restaurant', 'Spa', 'Gym', 'Concierge'],
    description: 'Elegant hotel with views of St. Peter\'s Basilica.',
    checkIn: '15:00',
    checkOut: '11:00',
    distanceFromAirport: 32,
    distanceFromCityCenter: 2
  }
];

export function searchHotels(params: HotelSearchParams): Promise<Hotel[]> {
  return new Promise((resolve) => {
    // Simulate API delay
    setTimeout(() => {
      const filtered = HOTELS.filter(
        (hotel) =>
          hotel.city.toLowerCase().includes(params.destination.toLowerCase()) ||
          hotel.country.toLowerCase().includes(params.destination.toLowerCase())
      );
      
      // Add some randomization to prices based on dates
      const results = filtered.map((hotel) => ({
        ...hotel,
        pricePerNight: Math.round(
          hotel.pricePerNight * (0.8 + Math.random() * 0.4)
        )
      }));
      
      resolve(results);
    }, 1000 + Math.random() * 1000);
  });
}

export function getHotelsByDestination(destination: string): Hotel[] {
  return HOTELS.filter(
    (hotel) =>
      hotel.city.toLowerCase() === destination.toLowerCase() ||
      hotel.country.toLowerCase() === destination.toLowerCase()
  );
}
