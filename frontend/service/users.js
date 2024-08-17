import 'dotenv';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import twilio from 'twilio';

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase URL and key are required.');
}

/**
 * Retrieves user data from the 'Users' table by user ID.
 *
 * @param {string} uid - The ID of the user to fetch.
 * @returns {Promise<{data: Array<Object>, error: Error|null}>} 
 *          - Resolves to an object with:
 *            - `data`: An array containing user data if found, or empty if no user matches the ID.
 *            - `error`: Error object if the query fails, or null if successful.
 */
async function viewUser(uid) {
    let { data: Users, error } = await supabase
    .from('Users')
    .select("*")
    // Filters
    .eq('id', uid)
}