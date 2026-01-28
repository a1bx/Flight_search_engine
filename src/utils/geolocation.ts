import { Airport, NearbyAirport } from '../types/flight';

// Major airports with coordinates
export const AIRPORTS_WITH_COORDS: (Airport & {
  latitude: number;
  longitude: number;
})[] = [
    {
      code: 'JFK',
      name: 'John F. Kennedy International Airport',
      city: 'New York',
      country: 'USA',
      latitude: 40.6413,
      longitude: -73.7781
    },
    {
      code: 'LAX',
      name: 'Los Angeles International Airport',
      city: 'Los Angeles',
      country: 'USA',
      latitude: 33.9425,
      longitude: -118.4081
    },
    {
      code: 'ORD',
      name: "O'Hare International Airport",
      city: 'Chicago',
      country: 'USA',
      latitude: 41.9742,
      longitude: -87.9073
    },
    {
      code: 'DFW',
      name: 'Dallas/Fort Worth International Airport',
      city: 'Dallas',
      country: 'USA',
      latitude: 32.8998,
      longitude: -97.0403
    },
    {
      code: 'DEN',
      name: 'Denver International Airport',
      city: 'Denver',
      country: 'USA',
      latitude: 39.8561,
      longitude: -104.6737
    },
    {
      code: 'SFO',
      name: 'San Francisco International Airport',
      city: 'San Francisco',
      country: 'USA',
      latitude: 37.6213,
      longitude: -122.379
    },
    {
      code: 'SEA',
      name: 'Seattle-Tacoma International Airport',
      city: 'Seattle',
      country: 'USA',
      latitude: 47.4502,
      longitude: -122.3088
    },
    {
      code: 'ATL',
      name: 'Hartsfield-Jackson Atlanta International Airport',
      city: 'Atlanta',
      country: 'USA',
      latitude: 33.6407,
      longitude: -84.4277
    },
    {
      code: 'BOS',
      name: 'Boston Logan International Airport',
      city: 'Boston',
      country: 'USA',
      latitude: 42.3656,
      longitude: -71.0096
    },
    {
      code: 'MIA',
      name: 'Miami International Airport',
      city: 'Miami',
      country: 'USA',
      latitude: 25.7959,
      longitude: -80.287
    },
    {
      code: 'LGA',
      name: 'LaGuardia Airport',
      city: 'New York',
      country: 'USA',
      latitude: 40.7769,
      longitude: -73.874
    },
    {
      code: 'EWR',
      name: 'Newark Liberty International Airport',
      city: 'Newark',
      country: 'USA',
      latitude: 40.6895,
      longitude: -74.1745
    },
    {
      code: 'PHX',
      name: 'Phoenix Sky Harbor International Airport',
      city: 'Phoenix',
      country: 'USA',
      latitude: 33.4373,
      longitude: -112.0078
    },
    {
      code: 'IAH',
      name: 'George Bush Intercontinental Airport',
      city: 'Houston',
      country: 'USA',
      latitude: 29.9902,
      longitude: -95.3368
    },
    {
      code: 'LAS',
      name: 'Harry Reid International Airport',
      city: 'Las Vegas',
      country: 'USA',
      latitude: 36.084,
      longitude: -115.1537
    },
    {
      code: 'MCO',
      name: 'Orlando International Airport',
      city: 'Orlando',
      country: 'USA',
      latitude: 28.4312,
      longitude: -81.3081
    },
    {
      code: 'MSP',
      name: 'Minneapolis-Saint Paul International Airport',
      city: 'Minneapolis',
      country: 'USA',
      latitude: 44.8848,
      longitude: -93.2223
    },
    {
      code: 'DTW',
      name: 'Detroit Metropolitan Airport',
      city: 'Detroit',
      country: 'USA',
      latitude: 42.2162,
      longitude: -83.3554
    },
    {
      code: 'PHL',
      name: 'Philadelphia International Airport',
      city: 'Philadelphia',
      country: 'USA',
      latitude: 39.8744,
      longitude: -75.2424
    },
    {
      code: 'CLT',
      name: 'Charlotte Douglas International Airport',
      city: 'Charlotte',
      country: 'USA',
      latitude: 35.214,
      longitude: -80.9431
    }];


// Calculate distance between two points using Haversine formula
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number)
  : number {
  const R = 3959; // Earth's radius in miles
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
    Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}

// Estimate driving time based on distance (rough estimate)
export function estimateDrivingTime(distanceMiles: number): string {
  const avgSpeedMph = 45; // Average speed including traffic
  const hours = distanceMiles / avgSpeedMph;

  if (hours < 1) {
    return `${Math.round(hours * 60)} min`;
  } else if (hours < 2) {
    const mins = Math.round(hours % 1 * 60);
    return `1 hr ${mins > 0 ? `${mins} min` : ''}`;
  } else {
    const wholeHours = Math.floor(hours);
    const mins = Math.round(hours % 1 * 60);
    return `${wholeHours} hr ${mins > 0 ? `${mins} min` : ''}`;
  }
}

// Get nearby airports based on user's location
export async function getNearbyAirports(
  userLat: number,
  userLon: number,
  maxDistanceMiles: number = 150
): Promise<NearbyAirport[]> {
  try {
    const response = await fetch(`http://localhost:3001/api/airports/nearby?latitude=${userLat}&longitude=${userLon}`);
    if (response.ok) {
      const data = await response.json();
      if (data && data.length > 0) {
        return data.map((airport: any) => ({
          code: airport.iataCode,
          name: airport.name,
          city: airport.address?.cityName || airport.name,
          country: airport.address?.countryName || '',
          distance: Math.round(airport.distance?.value || 0),
          drivingTime: estimateDrivingTime(airport.distance?.value || 0)
        }));
      }
    }
  } catch (error) {
    console.warn('Real-time nearby airport search failed, falling back to local data');
  }

  const nearbyAirports: NearbyAirport[] = [];

  for (const airport of AIRPORTS_WITH_COORDS) {
    const distance = calculateDistance(
      userLat,
      userLon,
      airport.latitude,
      airport.longitude
    );

    if (distance <= maxDistanceMiles) {
      nearbyAirports.push({
        ...airport,
        distance: Math.round(distance),
        drivingTime: estimateDrivingTime(distance)
      });
    }
  }

  return nearbyAirports.sort((a, b) => a.distance - b.distance);
}

// Get user's current location
export function getCurrentLocation(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 300000 // 5 minutes cache
    });
  });
}

// Format coordinates for display
export function formatCoordinates(lat: number, lon: number): string {
  const latDir = lat >= 0 ? 'N' : 'S';
  const lonDir = lon >= 0 ? 'E' : 'W';
  return `${Math.abs(lat).toFixed(4)}°${latDir}, ${Math.abs(lon).toFixed(4)}°${lonDir}`;
}