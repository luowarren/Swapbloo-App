import dotenv from 'dotenv'; // Import dotenv
import { createClient } from '@supabase/supabase-js'; // Import Supabase client

dotenv.config(); // Load environment variables from .env file

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;

// const supabaseUrl = process.env.SUPABASE_URL;
// const supabaseKey = process.env.SUPABASE_KEY;

console.log('sigma rizz', supabaseUrl, supabaseKey)
// Log the environment variables to check their values
console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Key:', supabaseKey);

export const supabase = createClient(supabaseUrl, supabaseKey);
