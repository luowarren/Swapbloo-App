import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js"; // Correct named import

// Load environment variables from .env file
dotenv.config({ path: "../.env" }); // Optional: specify the path to .env

// Initialize Supabase client
const SUPABASE_KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51eW5pdmJwbnVsem5qY210dnBxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjMxNTk5MTEsImV4cCI6MjAzODczNTkxMX0.H-2tACfryiR97R5kQjas7RUaTBf2RpdnDgq-OGmfZzU'
const SUPABASE_URL='https://nuynivbpnulznjcmtvpq.supabase.co'
// Initialize Supabase client
const supabaseUrl = SUPABASE_URL;
const supabaseKey = SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Supabase URL and key are required.");
}

/**
 * Searches for matching listing based on key words. Searches through title,
 * caption
 *
 * @param {string} searchString - users words searched
 * @returns Array<Item> list of all items that match this search
 */
export async function search(searchString) {
  var { data: Items, error } = { data: [], error: null };
  const words = searchString.split(/\s+/);
  // convert json to string
  const objectToString = (obj) => JSON.stringify(obj);

  for (let i = 0; i < words.length; i++) {
    var word = words[i];
    let temp = await supabase
      .from("Items")
      .select("*")
      // .ilike('title', `%${word}%`));
      .or(`title.ilike.%${word}%,caption.ilike.%${word}%`);
    if (temp["error"]) {
      return temp;
    }
    Items = Items.concat(temp["data"]);
  }

  // Count frequency of each JSON object
  const frequencyObject = {};
  Items.forEach((obj) => {
    const key = objectToString(obj);
    if (frequencyObject[key]) {
      frequencyObject[key]++;
    } else {
      frequencyObject[key] = 1;
    }
  });

  // we want the best matches to be near the top
  // Convert frequency object to an array of [key, value] and sort by value (desc)
  const sortedArray = Object.entries(frequencyObject).sort(
    (a, b) => b[1] - a[1]
  );

  // Convert sorted array back to JSON objects
  Items = Items.concat(sortedArray.map(([key]) => JSON.parse(key)));

  return { data: Items, error };
}

/**
 * Filters items by sizes, categories, conditions, demographics. For full
 * list what possible types for these, refer to ./constants.js
 *
 * Example: if sizes = ["XS", "XXS"], this will only return items of size XS and
 * XSS. Essentially, the array must contain the criteria you DONT want filtered
 * out.
 *
 * @param {Array<string>} sizes - the sizes users want to filter by
 * @param {Array<string>} categories - the categories users want to filter by
 * @param {Array<string>} conditions - the conditions users want to filter by
 * @param {Array<string>} demographics - the sizes users want to filter by
 * @returns Items is a list of Item types where the filtered criteria is met
 */
export async function getfilteredItems(sizes, categories, conditions, demographics) {
  let { data: Items, error } = await supabase
    .from("Items")
    .select("*")
    .eq("swapped", "false")
    .in("size", sizes)
    .in("category", categories)
    .in("condition", conditions)
    .in("demographic", demographics);
  return { data: Items, error };
}

