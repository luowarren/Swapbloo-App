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
}

/**
 * Retrieves all the active listings (active meaning, they have not yet been
 * swapped, but could be pending).
 *
 * @returns
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
  return { data: Items, error };
}

/**
 * filters items by sizes, categories, conditions, demographics. For full
 * list what possible types for these, refer to ./constants.js
 *
 * if sizes = ["XS", "XXS"], this will only return items of size XS and XSS.
 * Essentially, the array must contain the criteria you DONT want filtered out.
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
  return { data: Items, error };
}

async function createItemListing(
  uid,
  size,
  condition,
  category,
  demographic,
  title,
  caption,
  brand
) {
  let { data: Item, error } = await supabase
    .from("Items")
    .insert([
      {
        owner_id: uid,
        size,
        condition,
        category,
        demographic,
        title,
        caption,
        brand,
        swapped: false,
      },
    ])
    .select();
  return { data: Item, error };
}

async function removeItemListing(id) {
  let { error } = await supabase.from("Items").delete().eq("id", id);
  return { error };
}

async function itemSwapped(id) {
  let { data: Item, error } = await supabase
    .from("Items")
    .update({ swapped: true })
    .eq("id", id)
    .select();
  return { data: Item, error };
}

async function editItemListing(id, title, caption) {
  let { data: Item, error } = await supabase
    .from("Items")
    .update({ title, caption })
    .eq("id", id)
    .select();
  return { data: Item, error };
}

await loginUser("warrenluo14@gmail.com", "Jojoseawaa3.1415");
let x = await getfilteredItems(["6"], CATEGORIES, CONDITIONS, DEMOGRAPHICS);
console.log(x["data"]);
