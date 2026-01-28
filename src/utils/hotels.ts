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

export async function searchHotels(params: HotelSearchParams): Promise<Hotel[]> {
  try {
    // Try real API via proxy first
    const response = await fetch(`http://localhost:3001/api/hotels/search?cityCode=${params.destination.toUpperCase()}`);
    if (response.ok) {
      const data = await response.json();
      if (data && data.length > 0) {
        return data.map((h: any) => ({
          id: h.hotelId || h.hotel?.hotelId,
          name: h.hotel?.name || 'Unknown Hotel',
          location: h.hotel?.address?.cityName || params.destination,
          city: h.hotel?.address?.cityName || params.destination,
          country: h.hotel?.address?.countryCode || '',
          rating: 4.0,
          pricePerNight: parseFloat(h.offers?.[0]?.price?.total || '150'),
          currency: h.offers?.[0]?.price?.currency || 'USD',
          image: `https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80&sig=${h.hotelId}`,
          amenities: h.hotel?.amenities || ['WiFi', 'Pool'],
          description: 'Experience real-life luxury at this Amadeus-listed property.',
          checkIn: params.checkIn,
          checkOut: params.checkOut
        }));
      }
    }
  } catch (error) {
    console.warn('Real hotel search failed, falling back to local data');
  }

  // Fallback to mock data logic
  const filtered = HOTELS.filter(
    (hotel) =>
      hotel.city.toLowerCase().includes(params.destination.toLowerCase()) ||
      hotel.country.toLowerCase().includes(params.destination.toLowerCase())
  );

  return filtered.map((hotel) => ({
    ...hotel,
    pricePerNight: Math.round(
      hotel.pricePerNight * (0.8 + Math.random() * 0.4)
    )
  }));
}

export function getHotelsByDestination(destination: string): Hotel[] {
  return HOTELS.filter(
    (hotel) =>
      hotel.city.toLowerCase() === destination.toLowerCase() ||
      hotel.country.toLowerCase() === destination.toLowerCase()
  );
}
