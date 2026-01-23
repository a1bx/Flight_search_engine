# Quick Start: Get Real Flight Data Working

## Step 1: Get Amadeus API Credentials (5 minutes)

### Create Account
1. Go to: https://developers.amadeus.com/register
2. Fill in:
   - Email address
   - Password
   - First/Last name
3. Verify your email

### Create App & Get Credentials
1. Log in to: https://developers.amadeus.com/my-apps
2. Click **"Create New App"**
3. Enter app details:
   - **Name**: Flight Search Engine
   - **Description**: Personal flight search app
4. Click **Create**
5. You'll see your credentials:
   - **API Key** (copy this)
   - **API Secret** (copy this)

## Step 2: Add Credentials to .env

Open your `.env` file and paste your credentials:

```env
VITE_AMADEUS_API_KEY=paste_your_api_key_here
VITE_AMADEUS_API_SECRET=paste_your_api_secret_here
VITE_AMADEUS_ENVIRONMENT=test
```

**Important**: Remove the placeholder text and paste your actual keys!

## Step 3: Restart Dev Server

```bash
# In your terminal, stop the server (Ctrl+C)
# Then restart:
npm run dev
```

## Step 4: Test It!

1. Open http://localhost:5173/search
2. Search for flights:
   - **From**: JFK (New York)
   - **To**: LAX (Los Angeles)
   - **Date**: Any future date
3. Click "Search Flights"

### Check Console (F12)
You should see:
- `Amadeus access token obtained`
- `Found X real flights from Amadeus API`

If you see `Using mock flight data` - check your credentials!

## Troubleshooting

**"Amadeus auth failed: 401"**
- Your API Key or Secret is wrong
- Double-check you copied them correctly
- Make sure no extra spaces

**Still seeing mock data?**
- Did you restart the dev server?
- Check `.env` file has the right variable names
- Verify credentials are from "Self-Service" API (not Enterprise)

**No flights found?**
- Use valid IATA codes (JFK, LAX, LHR, etc.)
- Make sure date is in the future
- Try a major route like JFK→LAX

## You're Done!

Once you see real flights, you're all set. The app will automatically:
- Get OAuth tokens
- Search real flight data
- Show actual prices and schedules
- Fall back to mock data if anything fails
