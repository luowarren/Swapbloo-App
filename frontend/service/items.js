import "dotenv";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import twilio from "twilio";
import { CONDITIONS, DEMOGRAPHICS, CATEGORIES, SIZES } from './constants.js';

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const SIZES = []

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Supabase URL and key are required.");
}

/**
 * Retrieves user data from the 'Users' table by user ID.
 *
 * @returns {Promise}
 */
async function getActiveListings() {
  let { data: Users, error } = await supabase
    .from("Items")
    .select("*")
    // Filters
    .eq("swapped", "false")
    // pagination
    .range(0, 20);
}

/**
 * Retrieves user data from the 'Users' table by user ID.
 *
 * @param {Array<string>} sizes - the sizes users want to filter by
 * @param {Array<string>} categories - the categories users want to filter by
 * @param {Array<string>} conditions - the conditions users want to filter by
 * @param {Array<string>} demographics - the sizes users want to filter by
 * @returns {Promise}
 */
async function getfilteredItems(sizes, categories, conditions, demographics) {
  let { data: Items, error } = await supabase
    .from("Items")
    .select("*")
    .in("size", sizes)
    .in("category", categories)
    .in("condition", conditions)
    .in("demographic", demographics);
}
