import React, { useState } from 'react';
import { Hotel as HotelIcon, Search, MapPin, Star, Wifi, Coffee, Wind, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/Button';

export function HotelsPage() {
    const [cityCode, setCityCode] = useState('');
    const [hotels, setHotels] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!cityCode || cityCode.length !== 3) {
            setError('Please enter a valid 3-letter city code (e.g., LON, PAR, NYC)');
            return;
        }

        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(`http://localhost:3001/api/hotels/search?cityCode=${cityCode.toUpperCase()}`);
            if (!response.ok) throw new Error('Failed to fetch hotels');
            const data = await response.json();
            setHotels(data);
        } catch (err) {
            setError('Could not find hotels for this city. Please try another one.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background pb-20">
            <section className="bg-primary/5 py-16 border-b border-border">
                <div className="page-container">
                    <div className="max-w-3xl">
                        <h1 className="text-4xl sm:text-5xl font-extrabold text-foreground mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-600">
                            Find Your Perfect Stay
                        </h1>
                        <p className="text-xl text-muted-foreground mb-8">
                            Search world-class hotels and experience real-life luxury at your fingertips.
                        </p>

                        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
                            <div className="relative flex-1">
                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                <input
                                    type="text"
                                    placeholder="Enter City Code (e.g. NYC, PAR, LON)"
                                    value={cityCode}
                                    onChange={(e) => setCityCode(e.target.value)}
                                    maxLength={3}
                                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-card border border-border focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all uppercase font-semibold tracking-widest"
                                />
                            </div>
                            <Button type="submit" size="lg" className="rounded-2xl px-10" loading={isLoading}>
                                Search Hotels
                            </Button>
                        </form>
                    </div>
                </div>
            </section>

            <div className="page-container py-12">
                {error && (
                    <div className="p-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-xl mb-8 flex items-center gap-3">
                        <Star className="w-5 h-5" />
                        <p>{error}</p>
                    </div>
                )}

                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="bg-card border border-border rounded-3xl overflow-hidden animate-pulse">
                                <div className="h-48 bg-muted" />
                                <div className="p-6 space-y-4">
                                    <div className="h-6 bg-muted rounded w-3/4" />
                                    <div className="h-4 bg-muted rounded w-1/2" />
                                    <div className="flex gap-2">
                                        {[1, 2, 3].map(j => <div key={j} className="h-8 w-8 bg-muted rounded-lg" />)}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : hotels.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {hotels.map((hotel) => (
                            <div key={hotel.hotelId} className="group bg-card border border-border rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 hover:-translate-y-1">
                                <div className="relative h-48">
                                    <img
                                        src={`https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80`}
                                        alt={hotel.name}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute top-4 right-4 bg-background/80 backdrop-blur-md px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                        4.5
                                    </div>
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-foreground mb-1 line-clamp-1">{hotel.hotel.name}</h3>
                                    <p className="text-sm text-muted-foreground mb-6 flex items-center gap-1 lowercase first-letter:uppercase">
                                        <MapPin className="w-3 h-3" />
                                        {hotel.hotel.cityCode}
                                    </p>

                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="p-2 bg-muted rounded-xl" title="Free WiFi"><Wifi className="w-4 h-4" /></div>
                                        <div className="p-2 bg-muted rounded-xl" title="Breakfast Includes"><Coffee className="w-4 h-4" /></div>
                                        <div className="p-2 bg-muted rounded-xl" title="AC Available"><Wind className="w-4 h-4" /></div>
                                    </div>

                                    <div className="flex items-center justify-between border-t border-border pt-6">
                                        <div>
                                            <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">Starting at</p>
                                            <p className="text-2xl font-black text-primary">${hotel.offers?.[0]?.price?.total || '199'}</p>
                                        </div>
                                        <Button variant="outline" className="rounded-xl">View Deal</Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : !isLoading && !error && (
                    <div className="text-center py-20">
                        <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                            <HotelIcon className="w-12 h-12 text-muted-foreground" />
                        </div>
                        <h2 className="text-2xl font-bold text-foreground mb-2">No results yet</h2>
                        <p className="text-muted-foreground">Enter a city code above to find real-life hotel results.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
