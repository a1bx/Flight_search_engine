import React, { useState } from 'react';
import { Car as CarIcon, MapPin, Gauge, Fuel, Users, ShieldCheck, Star } from 'lucide-react';
import { Button } from '../components/ui/Button';

const MOCK_CARS = [
    { id: '1', name: 'BMW 5 Series', category: 'Luxury', price: 120, seats: 5, gear: 'Automatic', fuel: 'Petrol', rating: 4.9, image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80' },
    { id: '2', name: 'Tesla Model 3', category: 'Electric', price: 95, seats: 5, gear: 'Automatic', fuel: 'Electric', rating: 4.8, image: 'https://images.unsplash.com/photo-1536700503339-1e4b06520771?w=800&q=80' },
    { id: '3', name: 'Range Rover Sport', category: 'SUV', price: 150, seats: 7, gear: 'Automatic', fuel: 'Diesel', rating: 4.7, image: 'https://images.unsplash.com/photo-1541443131876-44b03de101c5?w=800&q=80' },
    { id: '4', name: 'Volkswagen Golf', category: 'Compact', price: 45, seats: 5, gear: 'Manual', fuel: 'Petrol', rating: 4.5, image: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800&q=80' },
    { id: '5', name: 'Audi A3', category: 'Premium', price: 75, seats: 5, gear: 'Automatic', fuel: 'Petrol', rating: 4.6, image: 'https://images.unsplash.com/photo-1606152421802-db97b9c7a11b?w=800&q=80' },
    { id: '6', name: 'Ford Mustang', category: 'Sports', price: 180, seats: 4, gear: 'Automatic', fuel: 'Petrol', rating: 4.9, image: 'https://images.unsplash.com/photo-1584345604480-8347bb9c5030?w=800&q=80' }
];

export function CarsPage() {
    const [location, setLocation] = useState('');
    const [isSearching, setIsSearching] = useState(false);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSearching(true);
        setTimeout(() => setIsSearching(false), 800);
    };

    return (
        <div className="min-h-screen bg-background pb-20">
            <section className="bg-primary/5 py-16 border-b border-border">
                <div className="page-container">
                    <div className="max-w-3xl">
                        <h1 className="text-4xl sm:text-5xl font-extrabold text-foreground mb-6">
                            Drive Your Adventure
                        </h1>
                        <p className="text-xl text-muted-foreground mb-8">
                            Premium car rentals for every journey. Rent the car of your dreams today.
                        </p>

                        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
                            <div className="relative flex-1">
                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                <input
                                    type="text"
                                    placeholder="Pickup Location"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-card border border-border focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                />
                            </div>
                            <Button type="submit" size="lg" className="rounded-2xl px-10" loading={isSearching}>
                                Search Cars
                            </Button>
                        </form>
                    </div>
                </div>
            </section>

            <div className="page-container py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {MOCK_CARS.map((car) => (
                        <div key={car.id} className="group bg-card border border-border rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 hover:-translate-y-1">
                            <div className="relative h-56">
                                <img src={car.image} alt={car.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                <div className="absolute top-4 left-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                                    {car.category}
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-xl font-bold text-foreground">{car.name}</h3>
                                        <div className="flex items-center gap-1 text-sm text-yellow-500 font-bold mt-1">
                                            <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                                            {car.rating} <span className="text-muted-foreground font-normal ml-1">(24+ reviews)</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-2xl font-black text-primary">${car.price}</p>
                                        <p className="text-xs text-muted-foreground">/ per day</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3 mb-8">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 p-2 rounded-xl">
                                        <Users className="w-4 h-4" /> {car.seats} Seats
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 p-2 rounded-xl">
                                        <Gauge className="w-4 h-4" /> {car.gear}
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 p-2 rounded-xl">
                                        <Fuel className="w-4 h-4" /> {car.fuel}
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 p-2 rounded-xl">
                                        <ShieldCheck className="w-4 h-4" /> Insurance
                                    </div>
                                </div>

                                <Button className="w-full rounded-2xl py-6 font-bold" variant="primary">
                                    Rent This Car
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
