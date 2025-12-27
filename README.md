# 🐱 Brad's Asthma Tracker

A mobile-first web application to track cat inhaler usage between two caregivers. Built with SvelteKit and Supabase for real-time synchronization.

## Features

- **Daily Dose Tracking**: Morning and evening doses with timestamps
- **Real-time Sync**: Updates visible to both users within 1 second
- **Puff Counter**: Accurate tracking with automatic decrements/increments
- **Extra Puff Logging**: Track wasted puffs when Brad doesn't cooperate
- **Low Inhaler Warning**: Alert at ≤20 puffs remaining
- **Refill Confirmation**: Prevents accidental counter resets
- **Auto Daily Reset**: Doses automatically reset at midnight
- **Mobile-First Design**: Optimized for touch interactions on phones

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Project Settings → API
3. Copy your Project URL and Anon/Public Key
4. Create a `.env` file in the project root:

```bash
cp .env.example .env
```

5. Add your Supabase credentials to `.env`:

```env
PUBLIC_SUPABASE_URL=your-project-url.supabase.co
PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Set Up Database

1. Open your Supabase project
2. Go to SQL Editor
3. Copy the contents of `supabase-schema.sql`
4. Run the SQL to create tables and enable real-time

### 4. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:5173` to see the app!

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Add environment variables in Vercel project settings:
   - `PUBLIC_SUPABASE_URL`
   - `PUBLIC_SUPABASE_ANON_KEY`
4. Deploy!

Your app will be available at `https://your-project.vercel.app`

## Usage

### Tracking Doses

- Tap the circular checkbox next to Morning or Evening dose
- The dose will be marked complete with a timestamp
- The puff counter automatically decrements by 1
- Tap again to undo (adds 1 back to counter)

### Logging Extra Puffs

- Click "+ Log Extra Puff" when Brad squirms or a puff is wasted
- Each log decrements the puff counter by 1
- Delete a log entry to add 1 back to the counter

### Refilling the Inhaler

1. Enter the number of puffs in the new inhaler (default: 120)
2. Click "Refill"
3. Confirm in the modal dialog
4. Counter resets to the new amount

### Reset Day

Manually reset both doses for the current day if needed. This does NOT affect the puff counter.

## Database Schema

### `tracker_state` table

- `morning_completed`: boolean
- `morning_timestamp`: timestamp
- `evening_completed`: boolean
- `evening_timestamp`: timestamp
- `puff_count`: integer
- `last_reset_date`: date

### `extra_puffs` table

- `id`: uuid
- `timestamp`: timestamp

## Color Theme

The app uses an Abyssinian-inspired color scheme:

- **Brand Cinnamon** (#BA5B3F): Primary brand color
- **Brand Blue** (#708090): Secondary color
- **Cream** (#F9F7F2): Subtle background

## Mobile-First Design

- Touch targets are minimum 44x44px
- Single column layout for mobile
- Responsive up to tablet/desktop
- Large typography for important numbers
- Color-coded status indicators

## Puff Counter Logic

**CRITICAL**: The puff counter is the most important feature for tracking inhaler effectiveness.

### Decrement (subtract 1):
- Morning dose checked → -1
- Evening dose checked → -1
- Extra puff logged → -1

### Increment (add 1 back):
- Morning dose unchecked → +1
- Evening dose unchecked → +1
- Extra puff deleted → +1

### Example:
```
Start: 120 puffs
Morning dose given → 119 puffs
Evening dose given → 118 puffs
Extra puff logged → 117 puffs
Oops, didn't actually give morning → uncheck → 118 puffs
```

## Tech Stack

- **Framework**: SvelteKit (Svelte 5)
- **Database**: Supabase (PostgreSQL)
- **Real-time**: Supabase Real-time Subscriptions
- **Styling**: CSS Variables (no framework)
- **Hosting**: Vercel

## Future Enhancements

- Upload Brad's photo for the header
- Historical tracking of daily completions
- Export data for vet visits
- Push notifications for dose reminders
- PWA support for "Add to Home Screen"

## License

Private use only.
