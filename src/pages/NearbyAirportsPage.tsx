import React, { useEffect, useState } from 'react';
import { MapPin, Navigation, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { AirportCard, AirportCardSkeleton } from '../components/AirportCard';
import {
  getNearbyAirports,
  getCurrentLocation,
  formatCoordinates } from
'../utils/geolocation';
import { NearbyAirport } from '../types/flight';
export function NearbyAirportsPage() {
  const [airports, setAirports] = useState<NearbyAirport[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lon: number;
  } | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const fetchNearbyAirports = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const position = await getCurrentLocation();
      const { latitude, longitude } = position.coords;
      setUserLocation({
        lat: latitude,
        lon: longitude
      });
      setHasPermission(true);
      const nearby = getNearbyAirports(latitude, longitude, 150);
      setAirports(nearby);
    } catch (err) {
      setHasPermission(false);
      if (err instanceof GeolocationPositionError) {
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setError(
              'Location permission denied. Please enable location access in your browser settings.'
            );
            break;
          case err.POSITION_UNAVAILABLE:
            setError('Location information is unavailable. Please try again.');
            break;
          case err.TIMEOUT:
            setError('Location request timed out. Please try again.');
            break;
          default:
            setError('An error occurred while getting your location.');
        }
      } else {
        setError('Geolocation is not supported by your browser.');
      }
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="bg-muted/30 py-12">
        <div className="page-container">
          <div className="max-w-2xl">
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Airports Near You
            </h1>
            <p className="text-lg text-muted-foreground">
              Find the closest airports to your current location. Compare
              distances and easily search for flights from any nearby airport.
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-8">
        <div className="page-container">
          {/* Location Request */}
          {hasPermission === null && !isLoading &&
          <div className="max-w-md mx-auto text-center py-16">
              <div className="w-20 h-20 mx-auto mb-6 bg-primary/10 rounded-2xl flex items-center justify-center">
                <Navigation className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-xl font-bold text-foreground mb-3">
                Enable Location Access
              </h2>
              <p className="text-muted-foreground mb-6">
                We need your location to find airports near you. Your location
                data is only used locally and never stored.
              </p>
              <Button
              variant="primary"
              size="lg"
              onClick={fetchNearbyAirports}
              leftIcon={<MapPin className="w-5 h-5" />}>

                Find Nearby Airports
              </Button>
            </div>
          }

          {/* Loading */}
          {isLoading &&
          <div className="max-w-md mx-auto text-center py-16">
              <Loader2 className="w-12 h-12 mx-auto mb-4 text-primary animate-spin" />
              <p className="text-muted-foreground">
                Finding airports near you...
              </p>
            </div>
          }

          {/* Error */}
          {error &&
          <div className="max-w-md mx-auto text-center py-16">
              <div className="w-20 h-20 mx-auto mb-6 bg-destructive/10 rounded-2xl flex items-center justify-center">
                <AlertCircle className="w-10 h-10 text-destructive" />
              </div>
              <h2 className="text-xl font-bold text-foreground mb-3">
                Location Error
              </h2>
              <p className="text-muted-foreground mb-6">{error}</p>
              <Button variant="primary" onClick={fetchNearbyAirports}>
                Try Again
              </Button>
            </div>
          }

          {/* Results */}
          {!isLoading && !error && airports.length > 0 &&
          <>
              {/* User Location */}
              {userLocation &&
            <div className="mb-6 p-4 bg-muted/50 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Your Location
                      </p>
                      <p className="font-medium text-foreground">
                        {formatCoordinates(userLocation.lat, userLocation.lon)}
                      </p>
                    </div>
                  </div>
                  <Button
                variant="outline"
                size="sm"
                onClick={fetchNearbyAirports}>

                    Refresh
                  </Button>
                </div>
            }

              {/* Airport List */}
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Found {airports.length} airport
                  {airports.length !== 1 ? 's' : ''} within 150 miles
                </p>
                {airports.map((airport) =>
              <AirportCard key={airport.code} airport={airport} />
              )}
              </div>
            </>
          }

          {/* No Results */}
          {!isLoading && !error && hasPermission && airports.length === 0 &&
          <div className="max-w-md mx-auto text-center py-16">
              <div className="w-20 h-20 mx-auto mb-6 bg-muted rounded-2xl flex items-center justify-center">
                <MapPin className="w-10 h-10 text-muted-foreground" />
              </div>
              <h2 className="text-xl font-bold text-foreground mb-3">
                No Airports Found
              </h2>
              <p className="text-muted-foreground mb-6">
                We couldn't find any airports within 150 miles of your location.
              </p>
              <Button variant="outline" onClick={fetchNearbyAirports}>
                Try Again
              </Button>
            </div>
          }
        </div>
      </section>
    </div>);

}