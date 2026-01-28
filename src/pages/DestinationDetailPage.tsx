import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  MapPin,
  Calendar,
  Globe,
  Clock,
  DollarSign,
  Plane,
  Home,
  Utensils,
  Bus,
  Ticket,
  ArrowLeft,
  Heart,
  Share2,
  CheckCircle,
  AlertCircle,
  Hotel,
  Car,
  Navigation } from
'lucide-react';
import { Button } from '../components/ui/Button';
import { getDestinationById } from '../utils/destinations';
import { searchFlights } from '../utils/amadeus';
import { useAuth } from '../hooks/useAuth';
import { HotelCard } from '../components/HotelCard';
import { FlightCard } from '../components/FlightCard';
import { CarCard } from '../components/CarCard';
import { TransferCard } from '../components/TransferCard';
import { searchHotels, getHotelsByDestination } from '../utils/hotels';
import { searchCars } from '../utils/cars';
import { getTransfersByType } from '../utils/transfers';
import type { Hotel as HotelType, Car as CarType, Transfer as TransferType } from '../types/flight';
export function DestinationDetailPage() {
  const { id } = useParams<{
    id: string;
  }>();
  const { user, isAuthenticated, toggleFavoriteDestination } = useAuth();
  const staticDestination = id ? getDestinationById(id) : undefined;
  const [destination, setDestination] = useState(staticDestination);
  const [isLoadingDestination, setIsLoadingDestination] = useState(false);
  const isFavorite = user?.favoriteDestinations.includes(id || '');

  // Flights preview for this destination
  const [flightsPreview, setFlightsPreview] = useState<any[]>([]);
  const [isLoadingFlightsPreview, setIsLoadingFlightsPreview] = useState(false);
  
  const [activeTab, setActiveTab] = useState<'attractions' | 'hotels' | 'cars' | 'transfers'>('attractions');
  const [hotels, setHotels] = useState<HotelType[]>([]);
  const [cars, setCars] = useState<CarType[]>([]);
  const [transfers, setTransfers] = useState<TransferType[]>([]);
  const [isLoadingHotels, setIsLoadingHotels] = useState(false);
  const [isLoadingCars, setIsLoadingCars] = useState(false);
  const [isLoadingTransfers, setIsLoadingTransfers] = useState(false);
  
  // Load hotels when tab is active
  useEffect(() => {
    if (activeTab === 'hotels' && destination && hotels.length === 0) {
      setIsLoadingHotels(true);
      const defaultCheckIn = new Date();
      defaultCheckIn.setDate(defaultCheckIn.getDate() + 1);
      const defaultCheckOut = new Date();
      defaultCheckOut.setDate(defaultCheckOut.getDate() + 3);
      
      searchHotels({
        destination: destination.city,
        checkIn: defaultCheckIn.toISOString().split('T')[0],
        checkOut: defaultCheckOut.toISOString().split('T')[0],
        guests: 2,
        rooms: 1
      }).then((results) => {
        setHotels(results);
        setIsLoadingHotels(false);
      });
    }
  }, [activeTab, destination, hotels.length]);

  // Load a small flights preview for this destination
  useEffect(() => {
    const loadFlights = async () => {
      if (!destination || !id) return;
      setIsLoadingFlightsPreview(true);

      try {
        // Default origin - you may replace with user's selected origin
        const originAirport = {
          code: 'JFK',
          name: 'John F. Kennedy International Airport',
          city: 'New York',
          country: 'USA'
        };

        const destAirport = {
          code: id.toUpperCase(),
          name: destination.name,
          city: destination.name,
          country: destination.country
        };

        const params = {
          origin: originAirport,
          destination: destAirport,
          departureDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          returnDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          passengers: 1,
          cabinClass: 'economy',
          tripType: 'round-trip'
        };

        const results = await searchFlights(params as any);
        setFlightsPreview(results.slice(0, 6));
      } catch (e) {
        console.warn('Failed loading flights preview', e);
      } finally {
        setIsLoadingFlightsPreview(false);
      }
    };

    loadFlights();
  }, [destination, id]);

  // Load destination details from API when id doesn't match static data
  useEffect(() => {
    const loadDestinationFromApi = async () => {
      if (!id) return;
      if (staticDestination) return; // already have static
      setIsLoadingDestination(true);
      try {
        // Try inspiration endpoint first
        const resp = await fetch(`http://localhost:3001/api/destinations/inspiration?origin=JFK`);
        const data = await resp.json().catch(() => []);
        const found = (data || []).find((d: any) => (d.destination || '').toUpperCase() === id.toUpperCase());
        if (found) {
          const mapped = {
            id: found.destination,
            name: found.city || found.destination,
            country: found.country || 'Unknown',
            region: found.region || 'World',
            image: `https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80&sig=${found.destination}`,
            description: `Discover ${found.city || found.destination} — explore local sights and culture.`,
            averageFlightPrice: parseFloat(found.price?.total || '0'),
            currency: 'USD',
            bestTimeToVisit: 'Year-round',
            visaRequired: false,
            language: 'Local',
            timezone: 'Local',
            attractions: [],
            tips: ['Book in advance', 'Explore local cuisine'],
            averageCosts: {
              accommodation: 120,
              meals: 45,
              transportation: 15,
              activities: 30
            }
          } as any;
          setDestination(mapped);
          setIsLoadingDestination(false);
          return;
        }

        // Fallback: query locations endpoint
        const locs = await fetch(`http://localhost:3001/api/airports/suggestions?keyword=${id}`).then(r => r.json()).catch(() => []);
        const loc = (locs || [])[0];
        if (loc) {
          const mapped = {
            id: id.toUpperCase(),
            name: loc.name || id.toUpperCase(),
            country: loc.address?.countryName || 'Unknown',
            region: loc.address?.regionCode || 'World',
            image: `https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80&sig=${id}`,
            description: `Explore ${loc.name || id}.`,
            averageFlightPrice: 0,
            currency: 'USD',
            bestTimeToVisit: 'Year-round',
            visaRequired: false,
            language: 'Local',
            timezone: 'Local',
            attractions: [],
            tips: [],
            averageCosts: {
              accommodation: 100,
              meals: 35,
              transportation: 10,
              activities: 20
            }
          } as any;
          setDestination(mapped);
        }
      } catch (e) {
        console.warn('Failed to load destination from API', e);
      } finally {
        setIsLoadingDestination(false);
      }
    };

    loadDestinationFromApi();
  }, [id, staticDestination]);
  
  // Load cars when tab is active
  useEffect(() => {
    if (activeTab === 'cars' && destination && cars.length === 0) {
      setIsLoadingCars(true);
      const defaultPickup = new Date();
      defaultPickup.setDate(defaultPickup.getDate() + 1);
      const defaultReturn = new Date();
      defaultReturn.setDate(defaultReturn.getDate() + 3);
      
      searchCars({
        location: destination.city,
        pickupDate: defaultPickup.toISOString().split('T')[0],
        returnDate: defaultReturn.toISOString().split('T')[0],
        pickupTime: '10:00',
        returnTime: '10:00'
      }).then((results) => {
        setCars(results);
        setIsLoadingCars(false);
      });
    }
  }, [activeTab, destination, cars.length]);
  
  // Load transfers when tab is active
  useEffect(() => {
    if (activeTab === 'transfers' && destination && transfers.length === 0) {
      setIsLoadingTransfers(true);
      const airportTransfers = getTransfersByType('airport', destination.city);
      const hotelTransfers = getTransfersByType('hotel', destination.city);
      setTransfers([...airportTransfers, ...hotelTransfers]);
      setIsLoadingTransfers(false);
    }
  }, [activeTab, destination, transfers.length]);
  if (!destination) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Destination Not Found
          </h1>
          <p className="text-muted-foreground mb-6">
            The destination you're looking for doesn't exist.
          </p>
          <Link to="/destinations">
            <Button variant="primary">Browse Destinations</Button>
          </Link>
        </div>
      </div>);

  }
  const dailyCost =
  destination.averageCosts.accommodation +
  destination.averageCosts.meals +
  destination.averageCosts.transportation +
  destination.averageCosts.activities;
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative h-[400px] sm:h-[500px]">
        <img
          src={destination.image}
          alt={destination.name}
          className="w-full h-full object-cover" />

        <div className="absolute inset-0 bg-black/40" />

        <div className="absolute inset-0 flex flex-col justify-between p-6">
          {/* Top Bar */}
          <div className="flex items-center justify-between">
            <Link to="/destinations">
              <Button
                variant="secondary"
                size="sm"
                leftIcon={<ArrowLeft className="w-4 h-4" />}>

                Back
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              {isAuthenticated &&
              <Button
                variant="secondary"
                size="sm"
                onClick={() => toggleFavoriteDestination(destination.id)}
                leftIcon={
                <Heart
                  className={`w-4 h-4 ${isFavorite ? 'fill-destructive text-destructive' : ''}`} />

                }>

                  {isFavorite ? 'Saved' : 'Save'}
                </Button>
              }
              <Button
                variant="secondary"
                size="sm"
                leftIcon={<Share2 className="w-4 h-4" />}>

                Share
              </Button>
            </div>
          </div>

          {/* Title */}
          <div>
            <div className="flex items-center gap-2 text-white/80 mb-2">
              <MapPin className="w-4 h-4" />
              <span>{destination.country}</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              {destination.name}
            </h1>
            <p className="text-lg text-white/90 max-w-2xl">
              {destination.description}
            </p>
          </div>
        </div>
      </section>

      {/* Quick Info */}
      <section className="border-b border-border">
        <div className="page-container py-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Calendar className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Best Time</p>
                <p className="font-medium text-foreground">
                  {destination.bestTimeToVisit}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Globe className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Language</p>
                <p className="font-medium text-foreground">
                  {destination.language}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Clock className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Timezone</p>
                <p className="font-medium text-foreground">
                  {destination.timezone}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                {destination.visaRequired ?
                <AlertCircle className="w-5 h-5 text-warning" /> :

                <CheckCircle className="w-5 h-5 text-success" />
                }
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Visa</p>
                <p className="font-medium text-foreground">
                  {destination.visaRequired ? 'Required' : 'Not Required'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="page-container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Flights Preview */}
            <div className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Popular Flights</h3>
                <Link to={`/search?destination=${destination?.name || ''}`} className="text-sm text-primary hover:underline">View all</Link>
              </div>
              {isLoadingFlightsPreview ? (
                <div className="text-center py-6">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : flightsPreview.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                  {flightsPreview.slice(0, 3).map((f) => (
                    <FlightCard key={f.id} flight={f} onSelect={() => alert('Select flight')} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-muted-foreground">No flights available for preview.</div>
              )}
            </div>

            {/* Tabs */}
            <div className="flex gap-2 border-b border-border">
              <button
                onClick={() => setActiveTab('attractions')}
                className={`px-4 py-2 font-medium transition-colors border-b-2 ${
                  activeTab === 'attractions'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                Attractions
              </button>
              <button
                onClick={() => setActiveTab('hotels')}
                className={`px-4 py-2 font-medium transition-colors border-b-2 ${
                  activeTab === 'hotels'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Hotel className="w-4 h-4" />
                  Hotels
                </div>
              </button>
              <button
                onClick={() => setActiveTab('cars')}
                className={`px-4 py-2 font-medium transition-colors border-b-2 ${
                  activeTab === 'cars'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Car className="w-4 h-4" />
                  Car Rentals
                </div>
              </button>
              <button
                onClick={() => setActiveTab('transfers')}
                className={`px-4 py-2 font-medium transition-colors border-b-2 ${
                  activeTab === 'transfers'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Navigation className="w-4 h-4" />
                  Transfers
                </div>
              </button>
            </div>

            {/* Tab Content */}
            {activeTab === 'attractions' && (
              <>
                {/* Attractions */}
                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-6">
                    Top Attractions
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {destination.attractions.map((attraction) =>
                    <div
                      key={attraction.id}
                      className="bg-card border border-border rounded-xl overflow-hidden card-hover">

                        <img
                        src={attraction.image}
                        alt={attraction.name}
                        className="w-full h-40 object-cover" />

                        <div className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-semibold text-foreground">
                              {attraction.name}
                            </h3>
                            <span className="px-2 py-1 text-xs bg-muted text-muted-foreground rounded-full">
                              {attraction.category}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                            {attraction.description}
                          </p>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">
                              {attraction.duration}
                            </span>
                            <span className="font-medium text-foreground">
                              {attraction.estimatedCost === 0 ?
                            'Free' :
                            `$${attraction.estimatedCost}`}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </section>

                {/* Travel Tips */}
                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-6">
                    Travel Tips
                  </h2>
                  <div className="bg-card border border-border rounded-xl p-6">
                    <ul className="space-y-4">
                      {destination.tips.map((tip, index) =>
                      <li key={index} className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                          <span className="text-foreground">{tip}</span>
                        </li>
                      )}
                    </ul>
                  </div>
                </section>
              </>
            )}

            {activeTab === 'hotels' && (
              <section>
                <h2 className="text-2xl font-bold text-foreground mb-6">
                  Hotels in {destination.name}
                </h2>
                {isLoadingHotels ? (
                  <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    <p className="mt-4 text-muted-foreground">Loading hotels...</p>
                  </div>
                ) : hotels.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {hotels.map((hotel) => (
                      <HotelCard
                        key={hotel.id}
                        hotel={hotel}
                        onSelect={(hotel) => console.log('Selected hotel:', hotel)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Hotel className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No hotels found for this destination.</p>
                  </div>
                )}
              </section>
            )}

            {activeTab === 'cars' && (
              <section>
                <h2 className="text-2xl font-bold text-foreground mb-6">
                  Car Rentals in {destination.name}
                </h2>
                {isLoadingCars ? (
                  <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    <p className="mt-4 text-muted-foreground">Loading cars...</p>
                  </div>
                ) : cars.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {cars.map((car) => (
                      <CarCard
                        key={car.id}
                        car={car}
                        onSelect={(car) => console.log('Selected car:', car)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Car className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No cars available for this destination.</p>
                  </div>
                )}
              </section>
            )}

            {activeTab === 'transfers' && (
              <section>
                <h2 className="text-2xl font-bold text-foreground mb-6">
                  Transfers in {destination.name}
                </h2>
                {isLoadingTransfers ? (
                  <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    <p className="mt-4 text-muted-foreground">Loading transfers...</p>
                  </div>
                ) : transfers.length > 0 ? (
                  <div className="space-y-4">
                    {transfers.map((transfer) => (
                      <TransferCard
                        key={transfer.id}
                        transfer={transfer}
                        onSelect={(transfer) => console.log('Selected transfer:', transfer)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Navigation className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No transfers available for this destination.</p>
                  </div>
                )}
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Flight CTA */}
            <div className="bg-primary text-primary-foreground rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Plane className="w-6 h-6" />
                <div>
                  <p className="text-sm opacity-80">Flights from</p>
                  <p className="text-2xl font-bold">
                    ${destination.averageFlightPrice}
                  </p>
                </div>
              </div>
              <Link to={`/search?destination=${destination.name}`}>
                <Button
                  variant="secondary"
                  size="lg"
                  className="w-full bg-white text-primary hover:bg-white/90">

                  Search Flights
                </Button>
              </Link>
            </div>

            {/* Daily Costs */}
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="font-semibold text-foreground mb-4">
                Average Daily Costs
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Home className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Accommodation</span>
                  </div>
                  <span className="font-medium text-foreground">
                    ${destination.averageCosts.accommodation}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Utensils className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Meals</span>
                  </div>
                  <span className="font-medium text-foreground">
                    ${destination.averageCosts.meals}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bus className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      Transportation
                    </span>
                  </div>
                  <span className="font-medium text-foreground">
                    ${destination.averageCosts.transportation}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Ticket className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Activities</span>
                  </div>
                  <span className="font-medium text-foreground">
                    ${destination.averageCosts.activities}
                  </span>
                </div>
                <div className="pt-4 border-t border-border flex items-center justify-between">
                  <span className="font-semibold text-foreground">
                    Total per day
                  </span>
                  <span className="text-xl font-bold text-primary">
                    ${dailyCost}
                  </span>
                </div>
              </div>
            </div>

            {/* Budget Planner CTA */}
            <Link to={`/budget?destination=${destination.name}`}>
              <Button variant="outline" size="lg" className="w-full">
                Plan Your Budget
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>);

}