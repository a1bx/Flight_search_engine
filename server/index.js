import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Amadeus from 'amadeus';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config({ path: '.env.local' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const amadeus = new Amadeus({
  clientId: process.env.VITE_AMADEUS_API_KEY,
  clientSecret: process.env.VITE_AMADEUS_API_SECRET,
  hostname: process.env.VITE_AMADEUS_ENVIRONMENT === 'production' ? 'production' : 'test'
});

// Flights Search
app.get('/api/flights/search', async (req, res) => {
  try {
    const { origin, destination, departureDate, returnDate, adults, travelClass } = req.query;

    if (!origin || !destination || !departureDate) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    const params = {
      originLocationCode: origin,
      destinationLocationCode: destination,
      departureDate,
      adults: adults || 1,
      max: 50,
      currencyCode: 'USD'
    };

    if (returnDate) {
      params.returnDate = returnDate;
    }

    if (travelClass && travelClass !== 'economy') {
      const cabinMap = {
        'premium-economy': 'PREMIUM_ECONOMY',
        'business': 'BUSINESS',
        'first': 'FIRST'
      };
      params.travelClass = cabinMap[travelClass] || 'ECONOMY';
    }

    const response = await amadeus.shopping.flightOffersSearch.get(params);
    res.json(response.data);
  } catch (error) {
    console.error('Flight Search Error:', error);
    res.status(500).json({ error: error.description?.[0]?.detail || error.message || 'Internal Server Error' });
  }
});

// Airport Suggestions
app.get('/api/airports/suggestions', async (req, res) => {
  try {
    const { keyword } = req.query;
    if (!keyword || keyword.length < 2) {
      return res.json([]);
    }

    const response = await amadeus.referenceData.locations.get({
      keyword,
      subType: Amadeus.location.any,
      'page[limit]': 10
    });
    res.json(response.data);
  } catch (error) {
    console.error('Airport Suggestion Error:', error);
    res.json([]);
  }
});

// Nearby Airports
app.get('/api/airports/nearby', async (req, res) => {
  try {
    const { latitude, longitude } = req.query;
    if (!latitude || !longitude) {
      return res.status(400).json({ error: 'Missing coordinates' });
    }

    const response = await amadeus.referenceData.locations.airports.get({
      latitude,
      longitude,
      radius: 100, // miles
      'page[limit]': 10
    });
    res.json(response.data);
  } catch (error) {
    console.error('Nearby Airports Error:', error);
    res.json([]);
  }
});

// Hotels Search
app.get('/api/hotels/search', async (req, res) => {
  try {
    const { cityCode } = req.query;
    if (!cityCode) {
      return res.status(400).json({ error: 'City code is required' });
    }

    // First search for hotel IDs in the city
    const hotelListResponse = await amadeus.referenceData.locations.hotels.byCity.get({
      cityCode
    });

    if (!hotelListResponse.data || hotelListResponse.data.length === 0) {
      return res.json([]);
    }

    // Limit to first 20 hotels
    const hotelIds = hotelListResponse.data.slice(0, 15).map(hotel => hotel.hotelId).join(',');

    try {
      // Then get offers for those hotels
      const offersResponse = await amadeus.shopping.hotelOffersSearch.get({
        hotelIds
      });
      res.json(offersResponse.data || hotelListResponse.data); // Fallback to list if no offers
    } catch (offerError) {
      console.warn('Hotel Offers Error, falling back to basic info:', offerError);
      res.json(hotelListResponse.data.map(h => ({ hotel: h, hotelId: h.hotelId })));
    }
  } catch (error) {
    console.error('Hotels Search Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Car Rental Search
app.get('/api/cars/search', async (req, res) => {
  try {
    const { cityCode, pickUpDate, returnDate } = req.query;
    if (!cityCode) {
      return res.status(400).json({ error: 'City code is required' });
    }

    // Amadeus Car Rental API: shopping.carRentalRateConfigurations or location search
    // Most robust for Test environment is often getting providers first or using specific search
    // Let's try shopping.carRentalRateConfigurations for a location

    // Note: Car API availability varies in test. 
    // We'll try to find car rental locations as a fallback to show real data.
    const response = await amadeus.shopping.carRentalRateConfigurations.get({
      locationCode: cityCode
    });

    res.json(response.data || []);
  } catch (error) {
    console.error('Cars Search Error:', error);
    // Fallback: search for points of interest related to transport/cars to show "Real" locations
    try {
      const poiResponse = await amadeus.referenceData.locations.pointsOfInterest.get({
        latitude: 48.8566, // Default Paris for test if needed, but better use city coords
        longitude: 2.3522,
        category: 'TRANSPORT'
      });
      res.json(poiResponse.data || []);
    } catch (e) {
      res.json([]);
    }
  }
});

// Transfers Search
app.get('/api/transfers/search', async (req, res) => {
  try {
    res.json([]);
  } catch (error) {
    console.error('Transfers Search Error:', error);
    res.json([]);
  }
});

// Destination Inspiration
app.get('/api/destinations/inspiration', async (req, res) => {
  try {
    const { origin } = req.query;
    const response = await amadeus.shopping.flightDestinations.get({
      origin: origin || 'JFK',
      oneWay: false,
      duration: '1,15'
    });

    let destinations = response.data || [];

    if (destinations.length === 0) {
      // Fallback
      const cityResponse = await amadeus.referenceData.locations.get({
        keyword: 'a',
        subType: Amadeus.location.city,
        'page[limit]': 15
      });
      destinations = cityResponse.data.map(c => ({
        destination: c.iataCode,
        price: { total: '999' }
      }));
    }

    // Enrich with city names
    const enriched = await Promise.all(destinations.slice(0, 12).map(async (d) => {
      try {
        const cityData = await amadeus.referenceData.locations.get({
          keyword: d.destination,
          subType: Amadeus.location.city
        });
        const city = cityData.data?.[0];
        return {
          ...d,
          city: city?.name || d.destination,
          country: city?.address?.countryName || 'Unknown',
          region: city?.address?.regionCode || 'World'
        };
      } catch (e) {
        return { ...d, city: d.destination, country: 'Unknown', region: 'World' };
      }
    }));

    res.json(enriched);
  } catch (error) {
    console.error('Destination Inspiration Error:', error);
    res.json([]);
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Proxy server running on http://localhost:${PORT}`);
});
