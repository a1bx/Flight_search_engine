import { Link } from 'react-router-dom';
import {
  Plane,
  Search,
  MapPin,
  Calculator,
  Shield,
  Clock,
  Star,
  ArrowRight,
  CheckCircle } from
'lucide-react';
import { Button } from '../components/ui/Button';
import { DestinationCard } from '../components/DestinationCard';
import { DESTINATIONS } from '../utils/destinations';
export function LandingPage() {
  const features = [
  {
    icon: Search,
    title: 'Smart Flight Search',
    description:
    'Compare prices across hundreds of airlines to find the best deals.'
  },
  {
    icon: MapPin,
    title: 'Destination Guides',
    description:
    'Explore detailed guides with attractions, tips, and local insights.'
  },
  {
    icon: Calculator,
    title: 'Budget Planning',
    description:
    'Plan your trip budget with our comprehensive cost calculator.'
  },
  {
    icon: Shield,
    title: 'Secure Booking',
    description: 'Book with confidence knowing your data is protected.'
  }];

  const steps = [
  {
    number: '1',
    title: 'Search',
    description: 'Enter your destination and travel dates'
  },
  {
    number: '2',
    title: 'Compare',
    description: 'Browse and filter flight options'
  },
  {
    number: '3',
    title: 'Book',
    description: 'Select your flight and complete booking'
  }];

  const testimonials = [
  {
    name: 'Count Dracula',
    role: 'Frequent Traveler',
    content:
    'SkySearch saved me over $500 on my last international trip. The comparison tools are incredibly helpful!',
    avatar:
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop'
  },
  {
    name: 'Peter Griffin',
    role: 'Business Traveler',
    content:
    'The destination guides helped me discover amazing places I never knew existed. Highly recommend!',
    avatar:
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop'
  },
  {
    name: 'Lois Lane',
    role: 'Adventure Seeker',
    content:
    'Budget planning feature is a game-changer. I can now plan trips without worrying about overspending.',
    avatar:
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop'
  }];

  const popularDestinations = DESTINATIONS.slice(0, 6);
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="page-container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Find Your Perfect Flight,{' '}
              <span className="text-primary">Explore the World</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Search hundreds of airlines, discover amazing destinations, and
              plan your dream trip with our comprehensive travel platform.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/search">
                <Button size="lg" leftIcon={<Search className="w-5 h-5" />}>
                  Search Flights
                </Button>
              </Link>
              <Link to="/destinations">
                <Button
                  variant="outline"
                  size="lg"
                  leftIcon={<MapPin className="w-5 h-5" />}>

                  Explore Destinations
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Background decoration */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl -z-10" />
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="page-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Everything You Need to Travel Smart
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our platform provides all the tools you need to plan, book, and
              enjoy your travels.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) =>
            <div
              key={feature.title}
              className="bg-card border border-border rounded-xl p-6 card-hover">

                <div className="p-3 bg-primary/10 rounded-xl w-fit mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="py-20 bg-muted/30">
        <div className="page-container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">
                Popular Destinations
              </h2>
              <p className="text-muted-foreground">
                Explore trending destinations loved by travelers.
              </p>
            </div>
            <Link to="/destinations">
              <Button
                variant="outline"
                rightIcon={<ArrowRight className="w-4 h-4" />}>

                View All
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularDestinations.map((destination) =>
            <DestinationCard key={destination.id} destination={destination} />
            )}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="page-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              What Travelers Say
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Join thousands of happy travelers who found their perfect flights
              with us.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial) =>
            <div
              key={testimonial.name}
              className="bg-card border border-border rounded-xl p-6">

                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) =>
                <Star
                  key={i}
                  className="w-4 h-4 fill-warning text-warning" />

                )}
                </div>
                <p className="text-foreground mb-4">"{testimonial.content}"</p>
                <div className="flex items-center gap-3">
                  <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-10 h-10 rounded-full object-cover" />

                  <div>
                    <p className="font-medium text-foreground">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>);

}