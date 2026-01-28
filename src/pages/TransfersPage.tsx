import React, { useState } from 'react';
import { Bus, MapPin, MapPinOff, Clock, User, Briefcase, ChevronRight, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/ui/Button';

const MOCK_TRANSFERS = [
    { id: '1', type: 'Private Sedan', price: 45, time: '30-45 min', capacity: '3 Persons', luggage: '2 Pieces', provider: 'Global VIP' },
    { id: '2', type: 'Executive SUV', price: 75, time: '30-45 min', capacity: '6 Persons', luggage: '4 Pieces', provider: 'Black Car Service' },
    { id: '3', type: 'Minibus', price: 120, time: '40-60 min', capacity: '12 Persons', luggage: '10 Pieces', provider: 'City Shuttle' },
    { id: '4', type: 'Standard Van', price: 60, time: '35-50 min', capacity: '8 Persons', luggage: '8 Pieces', provider: 'EasyTransfer' },
];

export function TransfersPage() {
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');
    const [isSearching, setIsSearching] = useState(false);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSearching(true);
        setTimeout(() => setIsSearching(false), 900);
    };

    return (
        <div className="min-h-screen bg-background pb-20">
            <section className="bg-primary/5 py-16 border-b border-border">
                <div className="page-container">
                    <div className="max-w-4xl">
                        <h1 className="text-4xl sm:text-5xl font-extrabold text-foreground mb-6">
                            Seamless Transfers
                        </h1>
                        <p className="text-xl text-muted-foreground mb-10">
                            Personalized airport transfers and city rides. No waiting, no stress.
                        </p>

                        <form onSubmit={handleSearch} className="bg-card p-6 rounded-[2.5rem] border border-border shadow-2xl flex flex-col md:flex-row gap-4">
                            <div className="relative flex-1">
                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
                                <input
                                    type="text"
                                    placeholder="From (Airport or Address)"
                                    value={from}
                                    onChange={(e) => setFrom(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 rounded-3xl bg-muted/30 border-transparent focus:bg-card focus:ring-2 focus:ring-primary outline-none transition-all"
                                />
                            </div>
                            <div className="relative flex-1">
                                <MapPinOff className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
                                <input
                                    type="text"
                                    placeholder="To (Hotel or Address)"
                                    value={to}
                                    onChange={(e) => setTo(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 rounded-3xl bg-muted/30 border-transparent focus:bg-card focus:ring-2 focus:ring-primary outline-none transition-all"
                                />
                            </div>
                            <Button type="submit" size="lg" className="rounded-3xl px-12" loading={isSearching}>
                                Search Rides
                            </Button>
                        </form>
                    </div>
                </div>
            </section>

            <div className="page-container py-12">
                <div className="max-w-4xl mx-auto space-y-6">
                    <h2 className="text-2xl font-bold mb-8">Available Transfers</h2>
                    {MOCK_TRANSFERS.map((ride) => (
                        <div key={ride.id} className="group bg-card border border-border rounded-[2rem] p-6 hover:border-primary/50 hover:shadow-xl transition-all duration-300 flex flex-col sm:flex-row items-center gap-8">
                            <div className="w-24 h-24 bg-primary/10 rounded-3xl flex items-center justify-center shrink-0">
                                <Bus className="w-12 h-12 text-primary" />
                            </div>

                            <div className="flex-1 space-y-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-xl font-bold">{ride.type}</h3>
                                        <p className="text-sm text-muted-foreground">Provided by <span className="text-foreground font-semibold">{ride.provider}</span></p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-3xl font-black text-primary">${ride.price}</p>
                                        <p className="text-xs text-muted-foreground font-bold uppercase">All Incl.</p>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-6 border-t border-border pt-4">
                                    <div className="flex items-center gap-2 text-sm">
                                        <Clock className="w-4 h-4 text-primary" /> {ride.time}
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <User className="w-4 h-4 text-primary" /> {ride.capacity}
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <Briefcase className="w-4 h-4 text-primary" /> {ride.luggage}
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-green-600 font-medium">
                                        <CheckCircle2 className="w-4 h-4" /> Instant Confirmation
                                    </div>
                                </div>
                            </div>

                            <Button className="rounded-2xl px-8 py-6 group-hover:scale-105 transition-transform" variant="outline">
                                Book Now <ChevronRight className="ml-2 w-4 h-4" />
                            </Button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
