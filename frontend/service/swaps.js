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

// Now you can use `supabase` and `twilio` in your code
