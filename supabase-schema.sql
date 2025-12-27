-- Brad's Asthma Tracker Database Schema
-- Run this in your Supabase SQL Editor to set up the database

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tracker State Table
-- This stores the current state of doses and puff count
CREATE TABLE tracker_state (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    morning_completed BOOLEAN DEFAULT false,
    morning_timestamp TIMESTAMPTZ,
    evening_completed BOOLEAN DEFAULT false,
    evening_timestamp TIMESTAMPTZ,
    puff_count INTEGER DEFAULT 120,
    last_reset_date DATE DEFAULT CURRENT_DATE,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Extra Puffs Table
-- This logs wasted puffs (e.g., when Brad squirms)
CREATE TABLE extra_puffs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert initial state
INSERT INTO tracker_state (morning_completed, evening_completed, puff_count, last_reset_date)
VALUES (false, false, 120, CURRENT_DATE);

-- Enable Row Level Security (RLS)
ALTER TABLE tracker_state ENABLE ROW LEVEL SECURITY;
ALTER TABLE extra_puffs ENABLE ROW LEVEL SECURITY;

-- Create policies to allow public access (no auth required as mentioned)
-- WARNING: This makes the data publicly accessible. Use only for personal projects.
CREATE POLICY "Allow all on tracker_state" ON tracker_state
    FOR ALL
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow all on extra_puffs" ON extra_puffs
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Enable real-time updates
ALTER PUBLICATION supabase_realtime ADD TABLE tracker_state;
ALTER PUBLICATION supabase_realtime ADD TABLE extra_puffs;

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger to tracker_state
CREATE TRIGGER update_tracker_state_updated_at
    BEFORE UPDATE ON tracker_state
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
