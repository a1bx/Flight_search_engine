import { Airport, Flight, SearchParams } from '../types/flight';

// Mock airline data
const AIRLINES: Record<string, { name: string; logo: string; }> = {
  AA: {
    name: 'American Airlines',
    logo: 'https://images.kiwi.com/airlines/64/AA.png'
  },
  UA: {
    name: 'United Airlines',
    logo: 'https://images.kiwi.com/airlines/64/UA.png'
  },
  DL: {
    name: 'Delta Air Lines',
    logo: 'https://images.kiwi.com/airlines/64/DL.png'
  },
  WN: {
    name: 'Southwest Airlines',
    logo: 'https://images.kiwi.com/airlines/64/WN.png'
  },
  B6: {
    name: 'JetBlue Airways',
    logo: 'https://images.kiwi.com/airlines/64/B6.png'
  },
  AS: {
    name: 'Alaska Airlines',
    logo: 'https://images.kiwi.com/airlines/64/AS.png'
  },
  NK: {
    name: 'Spirit Airlines',
    logo: 'https://images.kiwi.com/airlines/64/NK.png'
  },
  F9: {
    name: 'Frontier Airlines',
    logo: 'https://images.kiwi.com/airlines/64/F9.png'
  },
  BA: {
    name: 'British Airways',
    logo: 'https://images.kiwi.com/airlines/64/BA.png'
  },
  LH: { name: 'Lufthansa', logo: 'https://images.kiwi.com/airlines/64/LH.png' },
  AF: {
    name: 'Air France',
    logo: 'https://images.kiwi.com/airlines/64/AF.png'
  },
  EK: { name: 'Emirates', logo: 'https://images.kiwi.com/airlines/64/EK.png' }
};

// Mock airports for autocomplete
const AIRPORTS: Airport[] = [
  {
    code: 'JFK',
    name: 'John F. Kennedy International Airport',
    city: 'New York',
    country: 'USA'
  },
  {
    code: 'LAX',
    name: 'Los Angeles International Airport',
    city: 'Los Angeles',
    country: 'USA'
  },
  {
    code: 'ORD',
    name: "O'Hare International Airport",
    city: 'Chicago',
    country: 'USA'
  },
  {
    code: 'DFW',
    name: 'Dallas/Fort Worth International Airport',
    city: 'Dallas',
    country: 'USA'
  },
  {
    code: 'DEN',
    name: 'Denver International Airport',
    city: 'Denver',
    country: 'USA'
  },
  {
    code: 'SFO',
    name: 'San Francisco International Airport',
    city: 'San Francisco',
    country: 'USA'
  },
  {
    code: 'SEA',
    name: 'Seattle-Tacoma International Airport',
    city: 'Seattle',
    country: 'USA'
  },
  {
    code: 'ATL',
    name: 'Hartsfield-Jackson Atlanta International Airport',
    city: 'Atlanta',
    country: 'USA'
  },
  {
    code: 'BOS',
    name: 'Boston Logan International Airport',
    city: 'Boston',
    country: 'USA'
  },
  {
    code: 'MIA',
    name: 'Miami International Airport',
    city: 'Miami',
    country: 'USA'
  },
  {
    code: 'LHR',
    name: 'London Heathrow Airport',
    city: 'London',
    country: 'UK'
  },
  {
    code: 'CDG',
    name: 'Charles de Gaulle Airport',
    city: 'Paris',
    country: 'France'
  },
  {
    code: 'FRA',
    name: 'Frankfurt Airport',
    city: 'Frankfurt',
    country: 'Germany'
  },
  {
    code: 'AMS',
    name: 'Amsterdam Schiphol Airport',
    city: 'Amsterdam',
    country: 'Netherlands'
  },
  {
    code: 'DXB',
    name: 'Dubai International Airport',
    city: 'Dubai',
    country: 'UAE'
  },
  {
    code: 'SIN',
    name: 'Singapore Changi Airport',
    city: 'Singapore',
    country: 'Singapore'
  },
  {
    code: 'HND',
    name: 'Tokyo Haneda Airport',
    city: 'Tokyo',
    country: 'Japan'
  },
  {
    code: 'SYD',
    name: 'Sydney Kingsford Smith Airport',
    city: 'Sydney',
    country: 'Australia'
  }];


export async function searchAirports(query: string): Promise<Airport[]> {
  if (!query || query.length < 2) return [];

  // Try real API first
  try {
    const { getAirportSuggestions } = await import('./amadeusApi');
    const realSuggestions = await getAirportSuggestions(query);
    if (realSuggestions && realSuggestions.length > 0) {
      return realSuggestions;
    }
  } catch (error) {
    console.warn('Amadeus airport search failed, falling back to local data');
  }

  const lowerQuery = query.toLowerCase();
  return AIRPORTS.filter(
    (airport) =>
      airport.code.toLowerCase().includes(lowerQuery) ||
      airport.name.toLowerCase().includes(lowerQuery) ||
      airport.city.toLowerCase().includes(lowerQuery)
  ).slice(0, 8);
}

function generateRandomTime(): string {
  const hours = Math.floor(Math.random() * 24);
  const minutes = Math.floor(Math.random() * 12) * 5;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

function addMinutesToTime(time: string, minutes: number): string {
  const [h, m] = time.split(':').map(Number);
  const totalMinutes = h * 60 + m + minutes;
  const newHours = Math.floor(totalMinutes / 60) % 24;
  const newMinutes = totalMinutes % 60;
  return `${newHours.toString().padStart(2, '0')}:${newMinutes.toString().padStart(2, '0')}`;
}

function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
}

function generateMockFlights(params: SearchParams): Flight[] {
  const airlineCodes = Object.keys(AIRLINES);
  const flights: Flight[] = [];
  const numFlights = 15 + Math.floor(Math.random() * 10);

  for (let i = 0; i < numFlights; i++) {
    const airlineCode =
      airlineCodes[Math.floor(Math.random() * airlineCodes.length)];
    const airline = AIRLINES[airlineCode];
    const stops = Math.random() < 0.3 ? 0 : Math.random() < 0.7 ? 1 : 2;

    const baseDuration = 120 + Math.floor(Math.random() * 480);
    const stopDuration = stops * (45 + Math.floor(Math.random() * 90));
    const totalDuration = baseDuration + stopDuration;

    const departureTime = generateRandomTime();
    const arrivalTime = addMinutesToTime(departureTime, totalDuration);

    const basePrice = 150 + Math.floor(Math.random() * 800);
    const stopDiscount = stops === 0 ? 1.3 : stops === 1 ? 1 : 0.85;
    const price = Math.round(basePrice * stopDiscount * params.passengers);

    const segments: Flight['segments'] = [];

    if (stops === 0) {
      segments.push({
        departure: {
          airport: params.origin?.code || 'JFK',
          time: departureTime
        },
        arrival: {
          airport: params.destination?.code || 'LAX',
          time: arrivalTime
        },
        duration: formatDuration(totalDuration),
        carrierCode: airlineCode,
        flightNumber: `${airlineCode}${100 + Math.floor(Math.random() * 900)}`,
        aircraft: 'Boeing 737-800'
      });
    } else {
      const connectingAirports = ['ORD', 'DFW', 'DEN', 'ATL'].filter(
        (a) => a !== params.origin?.code && a !== params.destination?.code
      );

      let currentTime = departureTime;
      let currentAirport = params.origin?.code || 'JFK';

      for (let s = 0; s <= stops; s++) {
        const isLast = s === stops;
        const nextAirport = isLast ?
          params.destination?.code || 'LAX' :
          connectingAirports[
          Math.floor(Math.random() * connectingAirports.length)];


        const segmentDuration = Math.floor(baseDuration / (stops + 1));
        const segmentArrival = addMinutesToTime(currentTime, segmentDuration);

        segments.push({
          departure: {
            airport: currentAirport,
            time: currentTime
          },
          arrival: {
            airport: nextAirport,
            time: segmentArrival
          },
          duration: formatDuration(segmentDuration),
          carrierCode: airlineCode,
          flightNumber: `${airlineCode}${100 + Math.floor(Math.random() * 900)}`,
          aircraft: 'Boeing 737-800'
        });

        if (!isLast) {
          const layoverTime = 45 + Math.floor(Math.random() * 90);
          currentTime = addMinutesToTime(segmentArrival, layoverTime);
          currentAirport = nextAirport;
        }
      }
    }

    flights.push({
      id: `flight-${i}-${Date.now()}`,
      airline: {
        code: airlineCode,
        name: airline.name,
        logo: airline.logo
      },
      segments,
      totalDuration: formatDuration(totalDuration),
      stops,
      price: {
        amount: price,
        currency: 'USD'
      },
      departureTime,
      arrivalTime,
      origin: params.origin?.code || 'JFK',
      destination: params.destination?.code || 'LAX'
    });
  }

  return flights.sort((a, b) => a.price.amount - b.price.amount);
}

export async function searchFlights(params: SearchParams): Promise<Flight[]> {
  // Try to use Amadeus API first
  try {
    const { searchFlightsRealtime } = await import('./amadeusApi');
    console.log('📡 Attempting to fetch real flights from Amadeus API...');
    const realFlights = await searchFlightsRealtime(params);

    if (realFlights && realFlights.length > 0) {
      console.log(`✈️ Success! Found ${realFlights.length} real flights from Amadeus API`);
      return realFlights;
    }
  } catch (error) {
    console.warn('⚠️ Amadeus API unavailable, falling back to mock data:', error);
  }

  // Fallback to mock data
  console.log('📝 Using mock flight data (Amadeus API not configured or failed)');

  // Simulate API delay
  await new Promise((resolve) =>
    setTimeout(resolve, 1500 + Math.random() * 1000)
  );

  // In production, this would call the Amadeus API
  // For now, return mock data
  return generateMockFlights(params);
}

export function getUniqueAirlines(
  flights: Flight[])
  : { code: string; name: string; }[] {
  const airlineMap = new Map<string, string>();

  flights.forEach((flight) => {
    if (!airlineMap.has(flight.airline.code)) {
      airlineMap.set(flight.airline.code, flight.airline.name);
    }
  });

  return Array.from(airlineMap.entries()).
    map(([code, name]) => ({ code, name })).
    sort((a, b) => a.name.localeCompare(b.name));
}

export function getPriceRange(flights: Flight[]): [number, number] {
  if (flights.length === 0) return [0, 1000];

  const prices = flights.map((f) => f.price.amount);
  return [Math.min(...prices), Math.max(...prices)];
}

export function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

export function minutesToTimeLabel(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${mins.toString().padStart(2, '0')} ${period}`;
}