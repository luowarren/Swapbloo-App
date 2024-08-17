//import 'dotenv';
import dotenv from "dotenv";
import pkg from "@supabase/supabase-js";
const { createClient, SupabaseClient } = pkg;
import twilio from "twilio";

// Load environment variables from .env file
dotenv.config({ path: "../.env" }); // Optional: specify the path to .env
import { CONDITIONS, DEMOGRAPHICS, CATEGORIES, SIZES } from "./constants.js";
import { get } from "https";

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Supabase URL and key are required.");
}

async function loginUser(email, password) {
  let { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  });
  //   console.log(data);
}

/**
 * Retrieves user data from the 'Users' table by user ID.
 *
 * @returns {Promise}
 */
async function getActiveListings() {
  let { data: Items, error } = await supabase
    .from("Items")
    .select("*")
    .eq("swapped", "false");
  if (error) {
    console.error("Error Items:", error.message);
    return;
  }

  console.log(Items);
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
    .eq("swapped", "false")
    .in("size", sizes)
    .in("category", categories)
    .in("condition", conditions)
    .in("demographic", demographics);
  console.log(Items);
}

loginUser("warrenluo14@gmail.com", "Jojoseawaa3.1415").then(() => {
  getfilteredItems(["6"], CATEGORIES, CONDITIONS, DEMOGRAPHICS);
});
