import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

export const supabase = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);

/**
 * Database schema:
 *
 * Table: tracker_state
 * - id: uuid (primary key)
 * - morning_completed: boolean
 * - morning_timestamp: timestamp
 * - evening_completed: boolean
 * - evening_timestamp: timestamp
 * - puff_count: integer
 * - last_reset_date: date
 * - updated_at: timestamp
 *
 * Table: extra_puffs
 * - id: uuid (primary key)
 * - timestamp: timestamp
 * - created_at: timestamp
 */

// Get current tracker state
export async function getTrackerState() {
  const { data, error } = await supabase
    .from('tracker_state')
    .select('*')
    .single();

  if (error) {
    console.error('Error fetching tracker state:', error);
    return null;
  }

  return data;
}

// Update tracker state
export async function updateTrackerState(updates) {
  const { data, error } = await supabase
    .from('tracker_state')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', await getStateId())
    .select()
    .single();

  if (error) {
    console.error('Error updating tracker state:', error);
    return null;
  }

  return data;
}

// Get state ID (creates if doesn't exist)
async function getStateId() {
  const { data } = await supabase
    .from('tracker_state')
    .select('id')
    .limit(1)
    .single();

  if (data) {
    return data.id;
  }

  // Create initial state if doesn't exist
  const { data: newData } = await supabase
    .from('tracker_state')
    .insert({
      morning_completed: false,
      evening_completed: false,
      puff_count: 120,
      last_reset_date: new Date().toISOString().split('T')[0]
    })
    .select()
    .single();

  return newData?.id;
}

// Toggle dose completion
export async function toggleDose(doseType) {
  const state = await getTrackerState();
  if (!state) return null;

  const isCompleted = doseType === 'morning' ? state.morning_completed : state.evening_completed;
  const newCompleted = !isCompleted;

  const updates = {
    [`${doseType}_completed`]: newCompleted,
    [`${doseType}_timestamp`]: newCompleted ? new Date().toISOString() : null,
    puff_count: newCompleted ? state.puff_count - 1 : state.puff_count + 1
  };

  return await updateTrackerState(updates);
}

// Get extra puffs
export async function getExtraPuffs() {
  const { data, error } = await supabase
    .from('extra_puffs')
    .select('*')
    .order('timestamp', { ascending: false });

  if (error) {
    console.error('Error fetching extra puffs:', error);
    return [];
  }

  return data;
}

// Add extra puff
export async function addExtraPuff() {
  const state = await getTrackerState();
  if (!state) return null;

  // Insert extra puff
  const { data: puffData, error: puffError } = await supabase
    .from('extra_puffs')
    .insert({ timestamp: new Date().toISOString() })
    .select()
    .single();

  if (puffError) {
    console.error('Error adding extra puff:', puffError);
    return null;
  }

  // Decrement puff count
  await updateTrackerState({ puff_count: state.puff_count - 1 });

  return puffData;
}

// Delete extra puff
export async function deleteExtraPuff(puffId) {
  const state = await getTrackerState();
  if (!state) return null;

  const { error } = await supabase
    .from('extra_puffs')
    .delete()
    .eq('id', puffId);

  if (error) {
    console.error('Error deleting extra puff:', error);
    return null;
  }

  // Increment puff count
  await updateTrackerState({ puff_count: state.puff_count + 1 });

  return true;
}

// Reset daily doses
export async function resetDay() {
  return await updateTrackerState({
    morning_completed: false,
    morning_timestamp: null,
    evening_completed: false,
    evening_timestamp: null
  });
}

// Refill inhaler
export async function refillInhaler(newCount) {
  return await updateTrackerState({
    puff_count: newCount
  });
}

// Check if day needs reset (midnight passed)
export async function checkDailyReset() {
  const state = await getTrackerState();
  if (!state) return;

  const today = new Date().toISOString().split('T')[0];

  if (state.last_reset_date !== today) {
    await updateTrackerState({
      morning_completed: false,
      morning_timestamp: null,
      evening_completed: false,
      evening_timestamp: null,
      last_reset_date: today
    });
  }
}

// Subscribe to tracker state changes
export function subscribeToTrackerState(callback) {
  return supabase
    .channel('tracker_state_changes')
    .on('postgres_changes',
      { event: '*', schema: 'public', table: 'tracker_state' },
      callback
    )
    .subscribe();
}

// Subscribe to extra puffs changes
export function subscribeToExtraPuffs(callback) {
  return supabase
    .channel('extra_puffs_changes')
    .on('postgres_changes',
      { event: '*', schema: 'public', table: 'extra_puffs' },
      callback
    )
    .subscribe();
}
