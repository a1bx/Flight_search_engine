import { Airport, Flight, SearchParams } from '../types/flight';

const PROXY_URL = 'http://localhost:3001/api';

/**
 * Search for flights using the proxy server
 */
export async function searchFlightsRealtime(
    params: SearchParams
): Promise<Flight[]> {
    if (!params.origin || !params.destination || !params.departureDate) {
        throw new Error('Origin, destination, and departure date are required');
    }

    try {
        const url = new URL(`${PROXY_URL}/flights/search`);
        url.searchParams.append('origin', params.origin.code);
        url.searchParams.append('destination', params.destination.code);
        url.searchParams.append('departureDate', params.departureDate);
        url.searchParams.append('adults', params.passengers.toString());

        if (params.tripType === 'round-trip' && params.returnDate) {
            url.searchParams.append('returnDate', params.returnDate);
        }

        if (params.cabinClass) {
            url.searchParams.append('travelClass', params.cabinClass);
        }

        const response = await fetch(url.toString());

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || 'Failed to fetch flights');
        }

        const data = await response.json();

        if (!data || data.length === 0) {
            return [];
        }

        // Transform response to our Flight type
        return data.map((offer: any) => transformAmadeusOffer(offer));
    } catch (error) {
        console.error('Error fetching flights from proxy:', error);
        throw error;
    }
}

/**
 * Transform Amadeus flight offer to our Flight type
 */
function transformAmadeusOffer(offer: any): Flight {
    const itinerary = offer.itineraries[0];
    const firstSegment = itinerary.segments[0];
    const lastSegment = itinerary.segments[itinerary.segments.length - 1];

    const airlineCode = offer.validatingAirlineCodes?.[0] || firstSegment.carrierCode;
    const airlineName = getAirlineName(airlineCode);

    const departureTime = firstSegment.departure.at.split('T')[1].substring(0, 5);
    const arrivalTime = lastSegment.arrival.at.split('T')[1].substring(0, 5);

    const duration = itinerary.duration.replace('PT', '').toLowerCase();
    const totalDuration = duration.replace('h', 'h ').replace('m', 'm');

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
export function getAirlineName(code: string): string {
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
 * Search for airports using the proxy server
 */
export async function getAirportSuggestions(query: string): Promise<Airport[]> {
    if (!query || query.length < 2) {
        return [];
    }

    try {
        const url = new URL(`${PROXY_URL}/airports/suggestions`);
        url.searchParams.append('keyword', query);

        const response = await fetch(url.toString());

        if (!response.ok) {
            return [];
        }

        const data = await response.json();

        if (!data || data.length === 0) {
            return [];
        }

        return data.map((location: any) => ({
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
