import { Destination } from '../types/flight';

export const DESTINATIONS: Destination[] = [
{
  id: 'japan',
  name: 'Tokyo',
  country: 'Japan',
  region: 'Asia',
  image:
  'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&h=600&fit=crop',
  description:
  "Experience the perfect blend of ancient traditions and cutting-edge technology in Japan's vibrant capital.",
  averageFlightPrice: 1200,
  currency: 'JPY',
  bestTimeToVisit: 'March-May, September-November',
  visaRequired: false,
  language: 'Japanese',
  timezone: 'JST (UTC+9)',
  attractions: [
  {
    id: '1',
    name: 'Senso-ji Temple',
    description: "Tokyo's oldest and most significant Buddhist temple.",
    image:
    'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=400&h=300&fit=crop',
    category: 'Culture',
    estimatedCost: 0,
    duration: '2-3 hours'
  },
  {
    id: '2',
    name: 'Shibuya Crossing',
    description: "The world's busiest pedestrian crossing.",
    image:
    'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=400&h=300&fit=crop',
    category: 'Landmark',
    estimatedCost: 0,
    duration: '1 hour'
  },
  {
    id: '3',
    name: 'teamLab Borderless',
    description: 'Immersive digital art museum experience.',
    image:
    'https://images.unsplash.com/photo-1549490349-8643362247b5?w=400&h=300&fit=crop',
    category: 'Entertainment',
    estimatedCost: 30,
    duration: '3-4 hours'
  }],

  tips: [
  'Get a Suica or Pasmo card for easy transportation',
  'Learn basic Japanese phrases - locals appreciate the effort',
  "Carry cash - many places don't accept cards",
  'Visit convenience stores for affordable, quality food'],

  averageCosts: {
    accommodation: 100,
    meals: 40,
    transportation: 15,
    activities: 30
  }
},
{
  id: 'france',
  name: 'Paris',
  country: 'France',
  region: 'Europe',
  image:
  'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&h=600&fit=crop',
  description:
  'The City of Light awaits with world-class art, cuisine, and timeless romance.',
  averageFlightPrice: 800,
  currency: 'EUR',
  bestTimeToVisit: 'April-June, September-October',
  visaRequired: false,
  language: 'French',
  timezone: 'CET (UTC+1)',
  attractions: [
  {
    id: '1',
    name: 'Eiffel Tower',
    description: 'Iconic iron lattice tower and symbol of Paris.',
    image:
    'https://images.unsplash.com/photo-1511739001486-6bfe10ce65f4?w=400&h=300&fit=crop',
    category: 'Landmark',
    estimatedCost: 25,
    duration: '2-3 hours'
  },
  {
    id: '2',
    name: 'Louvre Museum',
    description: "World's largest art museum, home to the Mona Lisa.",
    image:
    'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=400&h=300&fit=crop',
    category: 'Culture',
    estimatedCost: 17,
    duration: '4-6 hours'
  },
  {
    id: '3',
    name: 'Montmartre',
    description: 'Charming hilltop neighborhood with Sacré-Cœur.',
    image:
    'https://images.unsplash.com/photo-1550340499-a6c60fc8287c?w=400&h=300&fit=crop',
    category: 'Neighborhood',
    estimatedCost: 0,
    duration: '3-4 hours'
  }],

  tips: [
  'Book museum tickets online to skip lines',
  'Learn basic French greetings',
  'Metro is the fastest way to get around',
  'Tipping is not expected but appreciated'],

  averageCosts: {
    accommodation: 150,
    meals: 50,
    transportation: 10,
    activities: 25
  }
},
{
  id: 'italy',
  name: 'Rome',
  country: 'Italy',
  region: 'Europe',
  image:
  'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&h=600&fit=crop',
  description: 'Walk through millennia of history in the Eternal City.',
  averageFlightPrice: 750,
  currency: 'EUR',
  bestTimeToVisit: 'April-June, September-October',
  visaRequired: false,
  language: 'Italian',
  timezone: 'CET (UTC+1)',
  attractions: [
  {
    id: '1',
    name: 'Colosseum',
    description: 'Ancient amphitheater and iconic symbol of Rome.',
    image:
    'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400&h=300&fit=crop',
    category: 'History',
    estimatedCost: 16,
    duration: '2-3 hours'
  },
  {
    id: '2',
    name: 'Vatican Museums',
    description:
    'World-renowned art collection including the Sistine Chapel.',
    image:
    'https://images.unsplash.com/photo-1531572753322-ad063cecc140?w=400&h=300&fit=crop',
    category: 'Culture',
    estimatedCost: 20,
    duration: '4-5 hours'
  },
  {
    id: '3',
    name: 'Trevi Fountain',
    description: "Baroque masterpiece and Rome's largest fountain.",
    image:
    'https://images.unsplash.com/photo-1525874684015-58379d421a52?w=400&h=300&fit=crop',
    category: 'Landmark',
    estimatedCost: 0,
    duration: '30 minutes'
  }],

  tips: [
  "Wear comfortable shoes - you'll walk a lot",
  'Book Vatican tickets well in advance',
  'Avoid tourist trap restaurants near attractions',
  'Validate your bus/metro tickets before boarding'],

  averageCosts: {
    accommodation: 120,
    meals: 45,
    transportation: 8,
    activities: 20
  }
},
{
  id: 'thailand',
  name: 'Bangkok',
  country: 'Thailand',
  region: 'Asia',
  image:
  'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=800&h=600&fit=crop',
  description:
  'Discover ornate temples, vibrant street life, and incredible cuisine.',
  averageFlightPrice: 900,
  currency: 'THB',
  bestTimeToVisit: 'November-February',
  visaRequired: false,
  language: 'Thai',
  timezone: 'ICT (UTC+7)',
  attractions: [
  {
    id: '1',
    name: 'Grand Palace',
    description: 'Stunning royal complex with the Emerald Buddha.',
    image:
    'https://images.unsplash.com/photo-1563492065599-3520f775eeed?w=400&h=300&fit=crop',
    category: 'Culture',
    estimatedCost: 15,
    duration: '3-4 hours'
  },
  {
    id: '2',
    name: 'Chatuchak Market',
    description: "One of the world's largest weekend markets.",
    image:
    'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=400&h=300&fit=crop',
    category: 'Shopping',
    estimatedCost: 0,
    duration: '4-6 hours'
  },
  {
    id: '3',
    name: 'Wat Arun',
    description: 'Temple of Dawn with stunning riverside views.',
    image:
    'https://images.unsplash.com/photo-1528181304800-259b08848526?w=400&h=300&fit=crop',
    category: 'Culture',
    estimatedCost: 3,
    duration: '1-2 hours'
  }],

  tips: [
  'Dress modestly when visiting temples',
  'Use the BTS Skytrain to avoid traffic',
  'Negotiate prices at markets',
  "Stay hydrated - it's hot and humid"],

  averageCosts: {
    accommodation: 50,
    meals: 15,
    transportation: 5,
    activities: 10
  }
},
{
  id: 'spain',
  name: 'Barcelona',
  country: 'Spain',
  region: 'Europe',
  image:
  'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800&h=600&fit=crop',
  description:
  "Gaudí's masterpieces, Mediterranean beaches, and vibrant nightlife.",
  averageFlightPrice: 700,
  currency: 'EUR',
  bestTimeToVisit: 'May-June, September-October',
  visaRequired: false,
  language: 'Spanish, Catalan',
  timezone: 'CET (UTC+1)',
  attractions: [
  {
    id: '1',
    name: 'Sagrada Familia',
    description: "Gaudí's unfinished masterpiece basilica.",
    image:
    'https://images.unsplash.com/photo-1583779457094-ab6f77f7bf57?w=400&h=300&fit=crop',
    category: 'Architecture',
    estimatedCost: 26,
    duration: '2-3 hours'
  },
  {
    id: '2',
    name: 'Park Güell',
    description: "Whimsical park with Gaudí's colorful mosaics.",
    image:
    'https://images.unsplash.com/photo-1583779457094-ab6f77f7bf57?w=400&h=300&fit=crop',
    category: 'Park',
    estimatedCost: 10,
    duration: '2-3 hours'
  },
  {
    id: '3',
    name: 'La Boqueria Market',
    description: 'Famous food market on Las Ramblas.',
    image:
    'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400&h=300&fit=crop',
    category: 'Food',
    estimatedCost: 0,
    duration: '1-2 hours'
  }],

  tips: [
  'Book Sagrada Familia tickets months in advance',
  'Siesta time (2-5pm) - many shops close',
  'Dinner starts late - around 9pm',
  'Watch out for pickpockets on Las Ramblas'],

  averageCosts: {
    accommodation: 100,
    meals: 35,
    transportation: 8,
    activities: 20
  }
},
{
  id: 'australia',
  name: 'Sydney',
  country: 'Australia',
  region: 'Oceania',
  image:
  'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800&h=600&fit=crop',
  description: 'Stunning harbor, iconic landmarks, and beautiful beaches.',
  averageFlightPrice: 1500,
  currency: 'AUD',
  bestTimeToVisit: 'September-November, March-May',
  visaRequired: true,
  language: 'English',
  timezone: 'AEST (UTC+10)',
  attractions: [
  {
    id: '1',
    name: 'Sydney Opera House',
    description: 'Iconic performing arts venue on the harbor.',
    image:
    'https://images.unsplash.com/photo-1523059623039-a9ed027e7fad?w=400&h=300&fit=crop',
    category: 'Landmark',
    estimatedCost: 40,
    duration: '2-3 hours'
  },
  {
    id: '2',
    name: 'Bondi Beach',
    description: 'Famous beach with great surfing and coastal walks.',
    image:
    'https://images.unsplash.com/photo-1523428096881-5bd79d043006?w=400&h=300&fit=crop',
    category: 'Beach',
    estimatedCost: 0,
    duration: '4-6 hours'
  },
  {
    id: '3',
    name: 'Harbour Bridge Climb',
    description: 'Climb to the top for panoramic views.',
    image:
    'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=400&h=300&fit=crop',
    category: 'Adventure',
    estimatedCost: 200,
    duration: '3-4 hours'
  }],

  tips: [
  'Apply for ETA visa before traveling',
  'Use Opal card for public transport',
  'Slip, slop, slap - sun protection is essential',
  'Tap water is safe to drink'],

  averageCosts: {
    accommodation: 150,
    meals: 50,
    transportation: 15,
    activities: 40
  }
}];


export const REGIONS = [
'All',
'Europe',
'Asia',
'Americas',
'Oceania',
'Africa'];


export function getDestinationById(id: string): Destination | undefined {
  return DESTINATIONS.find((d) => d.id === id);
}

export function getDestinationsByRegion(region: string): Destination[] {
  if (region === 'All') return DESTINATIONS;
  return DESTINATIONS.filter((d) => d.region === region);
}

export function searchDestinations(query: string): Destination[] {
  const lowerQuery = query.toLowerCase();
  return DESTINATIONS.filter(
    (d) =>
    d.name.toLowerCase().includes(lowerQuery) ||
    d.country.toLowerCase().includes(lowerQuery) ||
    d.description.toLowerCase().includes(lowerQuery)
  );
}