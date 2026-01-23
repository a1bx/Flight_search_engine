import { Airport, Flight, SearchParams } from '../types/flight';

const AMADEUS_API_KEY = import.meta.env.VITE_AMADEUS_API_KEY;
const AMADEUS_API_SECRET = import.meta.env.VITE_AMADEUS_API_SECRET;
const AMADEUS_ENV = import.meta.env.VITE_AMADEUS_ENVIRONMENT || 'test';

const BASE_URL = AMADEUS_ENV === 'production'
    ? 'https://api.amadeus.com'
    : 'https://test.api.amadeus.com';

// Token cache
let accessToken: string | null = null;
let tokenExpiry: number = 0;

/**
 * Get OAuth access token for Amadeus API
 */
async function getAccessToken(): Promise<string> {
    // Return cached token if still valid
    if (accessToken && Date.now() < tokenExpiry) {
        return accessToken;
    }

    if (!AMADEUS_API_KEY || !AMADEUS_API_SECRET ||
        AMADEUS_API_KEY === 'your_amadeus_api_key_here') {
        throw new Error('Amadeus API credentials not configured');
    }

    try {
        const response = await fetch(`${BASE_URL}/v1/security/oauth2/token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                grant_type: 'client_credentials',
                client_id: AMADEUS_API_KEY,
                client_secret: AMADEUS_API_SECRET,
            }),
        });

        if (!response.ok) {
            throw new Error(`Amadeus auth failed: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        accessToken = data.access_token;
        // Set expiry to 5 minutes before actual expiry for safety
        tokenExpiry = Date.now() + (data.expires_in - 300) * 1000;

        console.log('🔑 Amadeus access token obtained');
        return accessToken;
    } catch (error) {
        console.error('Error getting Amadeus access token:', error);
        throw error;
    }
}

/**
 * Search for flights using Amadeus Flight Offers Search API
 */
export async function searchFlightsRealtime(
    params: SearchParams
): Promise<Flight[]> {
    if (!params.origin || !params.destination || !params.departureDate) {
        throw new Error('Origin, destination, and departure date are required');
    }

    try {
        const token = await getAccessToken();

        const url = new URL(`${BASE_URL}/v2/shopping/flight-offers`);
        url.searchParams.append('originLocationCode', params.origin.code);
        url.searchParams.append('destinationLocationCode', params.destination.code);
        url.searchParams.append('departureDate', params.departureDate);
        url.searchParams.append('adults', params.passengers.toString());
        url.searchParams.append('currencyCode', 'USD');
        url.searchParams.append('max', '50'); // Limit results

        if (params.tripType === 'round-trip' && params.returnDate) {
            url.searchParams.append('returnDate', params.returnDate);
        }

        if (params.cabinClass && params.cabinClass !== 'economy') {
            const cabinMap: Record<string, string> = {
                'premium-economy': 'PREMIUM_ECONOMY',
                'business': 'BUSINESS',
                'first': 'FIRST',
            };
            url.searchParams.append('travelClass', cabinMap[params.cabinClass] || 'ECONOMY');
        }

        const response = await fetch(url.toString(), {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Amadeus API error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        if (!data.data || data.data.length === 0) {
            console.warn('No flights found in Amadeus API response');
            return [];
        }

        // Transform Amadeus response to our Flight type
        return data.data.map((offer: any) => transformAmadeusOffer(offer));
    } catch (error) {
        console.error('Error fetching flights from Amadeus API:', error);
        throw error;
    }
}

/**
 * Transform Amadeus flight offer to our Flight type
 */
function transformAmadeusOffer(offer: any): Flight {
    const itinerary = offer.itineraries[0]; // First itinerary (outbound)
    const firstSegment = itinerary.segments[0];
    const lastSegment = itinerary.segments[itinerary.segments.length - 1];

    // Get airline info from validating airline
    const airlineCode = offer.validatingAirlineCodes?.[0] || firstSegment.carrierCode;
    const airlineName = getAirlineName(airlineCode);

    // Extract times (format: 2024-01-15T10:30:00)
    const departureTime = firstSegment.departure.at.split('T')[1].substring(0, 5);
    const arrivalTime = lastSegment.arrival.at.split('T')[1].substring(0, 5);

    // Calculate total duration
    const duration = itinerary.duration.replace('PT', '').toLowerCase();
    const totalDuration = duration.replace('h', 'h ').replace('m', 'm');

    // Transform segments
    const segments = itinerary.segments.map((segment: any) => ({
        departure: {
            airport: segment.departure.iataCode,
            time: segment.departure.at.split('T')[1].substring(0, 5),
        },
        arrival: {
            airport: segment.arrival.iataCode,
            time: segment.arrival.at.split('T')[1].substring(0, 5),
        },
        duration: segment.duration.replace('PT', '').toLowerCase().replace('h', 'h ').replace('m', 'm'),
        carrierCode: segment.carrierCode,
        flightNumber: `${segment.carrierCode}${segment.number}`,
        aircraft: segment.aircraft?.code || 'Unknown',
    }));

    return {
        id: offer.id,
        airline: {
            code: airlineCode,
            name: airlineName,
            logo: `https://images.kiwi.com/airlines/64/${airlineCode}.png`,
        },
        segments,
        totalDuration,
        stops: itinerary.segments.length - 1,
        price: {
            amount: parseFloat(offer.price.total),
            currency: offer.price.currency,
        },
        departureTime,
        arrivalTime,
        origin: firstSegment.departure.iataCode,
        destination: lastSegment.arrival.iataCode,
    };
}

/**
 * Get airline name from code
 */
function getAirlineName(code: string): string {
    const airlines: Record<string, string> = {
        'AA': 'American Airlines',
        'UA': 'United Airlines',
        'DL': 'Delta Air Lines',
        'WN': 'Southwest Airlines',
        'B6': 'JetBlue Airways',
        'AS': 'Alaska Airlines',
        'NK': 'Spirit Airlines',
        'F9': 'Frontier Airlines',
        'BA': 'British Airways',
        'LH': 'Lufthansa',
        'AF': 'Air France',
        'EK': 'Emirates',
        'QF': 'Qantas',
        'SQ': 'Singapore Airlines',
        'CX': 'Cathay Pacific',
        'QR': 'Qatar Airways',
        'TK': 'Turkish Airlines',
        'EY': 'Etihad Airways',
    };

    return airlines[code] || code;
}

/**
 * Search for airports using Amadeus Airport & City Search API
 */
export async function getAirportSuggestions(query: string): Promise<Airport[]> {
    if (!query || query.length < 2) {
        return [];
    }

    try {
        const token = await getAccessToken();

        const url = new URL(`${BASE_URL}/v1/reference-data/locations`);
        url.searchParams.append('subType', 'AIRPORT,CITY');
        url.searchParams.append('keyword', query);
        url.searchParams.append('page[limit]', '10');

        const response = await fetch(url.toString(), {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
            },
        });

        if (!response.ok) {
            console.warn('Amadeus airport search failed');
            return [];
        }

        const data = await response.json();

        if (!data.data || data.data.length === 0) {
            return [];
        }

        // Transform to our Airport type
        return data.data.map((location: any) => ({
            code: location.iataCode,
            name: location.name,
            city: location.address?.cityName || location.name,
            country: location.address?.countryName || '',
        }));
    } catch (error) {
        console.error('Error fetching airport suggestions:', error);
        return [];
    }
}
