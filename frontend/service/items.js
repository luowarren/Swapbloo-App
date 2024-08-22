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
 * @returns Items is a list of Item types, where swapped = false
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

/**
 * Creates an Item type that is inserted into the Items table. Used when user 
 * wants to create a new item listing
 * 
 * @param {string} uid - the user who is listing this item
 * @param {string} size - the size of the item
 * @param {string} condition - condition the item is in
 * @param {string} category - type of clothing the item is
 * @param {string} demographic - target demographic for this item
 * @param {string} title - listing title
 * @param {Array<string???>} images - images of the item
 * @param {string} caption - OPTIONAL listing caption
 * @param {string} brand - OPTIONAL item brand
 * @returns
 */
async function createItemListing(
  uid,
  size,
  condition,
  category,
  demographic,
  title,
  images = null,
  caption = null,
  brand = null
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
        swapped: "false",
      },
    ])
    .select();
  return { data: Item, error };
}

/**
 * Deletes an item from the Items table. 
 * Used when user wants to delete a listing. NOT when user has sucessfully made 
 * a swap.
 * 
 * @param {string} id - the id of the Item being deleted
 * @returns error | null
 */
async function deleteItemListing(id) {
  let { error } = await supabase.from("Items").delete().eq("id", id);
  return { error };
}

/**
 * Updates an Item in the Items table to have swapped = true, indicating that 
 * the item has been successfully swapped.
 * 
 * @param {string} id - the id of the Item being swapped
 * @returns Item is a list containing the Item we just swapped.
 */
async function itemSwapped(id) {
  let { data: Item, error } = await supabase
    .from("Items")
    .update({ swapped: true })
    .eq("id", id)
    .select();
  return { data: Item, error };
}

/**
 * Edit an item listing. Only the title / caption of a listing can be updated.
 * 
 * @param {string} id - the id of the Item listing you want to edit
 * @param {string} title - the updated title
 * @param {string} caption - the updated caption
 * @returns Item is a list containing the Item we just edited
 */
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
