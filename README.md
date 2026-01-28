# Flight Search Engine

A modern, full-featured flight search engine built with React, TypeScript, and Vite, powered by the **Amadeus Self-Service API** for real flight data.

## Features

**Real Flight Data** - Live flight searches using Amadeus API
**Smart Filtering** - Filter by price, airline, stops, departure/arrival times
**Price Insights** - Compare prices and view flight history
**Flight Comparison** - Side-by-side flight comparison
**Dark Mode** - Beautiful dark/light theme support
**Responsive Design** - Works seamlessly on all devices
**Fast Search** - Optimized search with caching

## Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn
- Amadeus API credentials (free tier available)

### Installation

```bash
# Install dependencies
npm install

# Copy and configure environment variables
cp .env.example .env.local

# Edit .env.local and add your Amadeus API credentials
# See SETUP_AMADEUS.md for detailed instructions

# Start development server
npm run dev
```

Open `http://localhost:5173` in your browser.

## Setting Up Amadeus API

To use real flight data, you need Amadeus API credentials:

1. **Sign up** for a free account at [Amadeus for Developers](https://developers.amadeus.com/)
2. **Create an app** in your dashboard
3. **Copy your API credentials** (Client ID and Secret)
4. **Configure** in `.env.local`:
   ```
   VITE_AMADEUS_API_KEY=your_client_id
   VITE_AMADEUS_API_SECRET=your_client_secret
   VITE_AMADEUS_ENVIRONMENT=test
   ```

**See [SETUP_AMADEUS.md](./SETUP_AMADEUS.md) for detailed setup instructions.**

## Building for Production

```bash
# Build the project
npm run build

# Preview the production build
npm run preview
```

## Project Structure

```
src/
├── components/         # Reusable React components
├── hooks/             # Custom React hooks (useFlightSearch, useFilters, etc.)
├── pages/             # Page components (SearchPage, LandingPage, etc.)
├── types/             # TypeScript type definitions
└── utils/             # Utility functions
    ├── amadeusApi.ts  # Amadeus API integration
    └── amadeus.ts     # Flight search logic with fallback
```

## API Integration

### Real Data
- **Flight Offers Search**: Get actual flight availability and prices
- **Airport Search**: Search 10,000+ airports worldwide
- **Uses**: OAuth2 authentication with Amadeus servers

### Fallback Mock Data
If Amadeus API is unavailable, the app automatically uses mock data for testing

## Technologies

- **React 18** - UI framework
- **TypeScript** - Type-safe JavaScript
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Icon library
- **Recharts** - Data visualization

## Environment Variables

Required environment variables (in `.env.local`):

```env
# Amadeus API Credentials
VITE_AMADEUS_API_KEY=your_client_id_here
VITE_AMADEUS_API_SECRET=your_client_secret_here

# Environment: 'test' (sandbox) or 'production'
VITE_AMADEUS_ENVIRONMENT=test
```

## Contributing

Feel free to submit issues and enhancement requests!

## License

This project is open source and available under the MIT License.

## Support

- 📚 [Amadeus API Documentation](https://developers.amadeus.com/self-service/apis-docs)
- 💬 [Amadeus Community](https://amadeus4dev.slack.com)
- 🐛 [Report Issues](https://github.com/your-repo/issues)
