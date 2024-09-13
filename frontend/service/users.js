// import dotenv from "dotenv";
// import pkg from "@supabase/supabase-js";
// const { createClient, SupabaseClient } = pkg;
// import twilio from "twilio";

// // Load environment variables from .env file
// dotenv.config({ path: "../.env" }); // Optional: specify the path to .env
// import { CONDITIONS, DEMOGRAPHICS, CATEGORIES, SIZES } from "./constants.js";
// import { get } from "https";

// // Initialize Supabase client
// const supabaseUrl = process.env.SUPABASE_URL;
// const supabaseKey = process.env.SUPABASE_KEY;
// const supabase = createClient(supabaseUrl, supabaseKey);

// if (!supabaseUrl || !supabaseKey) {
//   throw new Error("Supabase URL and key are required.");
// }

// async function loginUser(email, password) {
//   let { data, error } = await supabase.auth.signInWithPassword({
//     email: email,
//     password: password,
//   });
// }

// /**
//  * Retrieves user data from the 'Users' table by user ID.
//  *
//  * @returns {Promise}
//  */
// async function getActiveListings() {
//   let { data: Items, error } = await supabase
//     .from("Items")
//     .select("*")
//     .eq("swapped", "false");
//   if (error) {
//     console.error("Error Items:", error.message);
//     return;
//   }
//   return { data: Items, error };
// }

// /**
//  * Retrieves user data from the 'Users' table by user ID.
//  *
//  * @param {Array<string>} sizes - the sizes users want to filter by
//  * @param {Array<string>} categories - the categories users want to filter by
//  * @param {Array<string>} conditions - the conditions users want to filter by
//  * @param {Array<string>} demographics - the sizes users want to filter by
//  * @returns {Promise}
//  */
// async function getfilteredItems(sizes, categories, conditions, demographics) {
//   let { data: Items, error } = await supabase
//     .from("Items")
//     .select("*")
//     .eq("swapped", "false")
//     .in("size", sizes)
//     .in("category", categories)
//     .in("condition", conditions)
//     .in("demographic", demographics);
//   return { data: Items, error };
// }

// /**
//  * Retrieves user data from the 'Users' table by user ID. Used for
//  * viewing a users profile
//  *
//  * @param {string} uid - The ID of the user to fetch.
//  * @returns {Promise<{data: Array<Object>, error: Error|null}>}
//  *          - Resolves to an object with:
//  *            - `data`: An array containing user data if found, or empty if no user matches the ID.
//  *            - `error`: Error object if the query fails, or null if successful.
//  */
// async function viewUser(uid) {
//   let { data: Users, error } = await supabase
//     .from("Swaps")
//     .select("*")
//     // Filters
//     .eq("id", uid);
//   return { data: Users, error };
// }

// /**
//  * Fetches the listing of items for a specific user from the "Items" table.
//  *
//  * @async
//  * @function getUserListing
//  * @param {string} uid - The unique identifier (ID) of the user whose items are to be fetched.
//  * @returns {Promise<Object>} - Returns a promise that resolves to an object containing:
//  *    @property {Array<Object>} data - An array of items that match the user's ID, if successful.
//  *    @property {Object} error - An error object if there was an issue fetching the data.
//  *
//  * @example
//  * // Example usage:
//  * const userId = '12345';
//  * const { data, error } = await getUserListing(userId);
//  * if (error) {
//  *     console.error('Error fetching user items:', error);
//  * } else {
//  *     console.log('User items:', data);
//  * }
//  */
// async function getUserListings(uid) {
//   let { data: Items, error } = await supabase
//     .from("Items")
//     .select("*")
//     // Filters
//     .eq("id", uid);
//   return { data: Users, error };
// }

// async function getUserLocation(uid) {
//   let { data: Users, error } = await supabase
//     .from("Users")
//     .select("location")
//     .eq("id", uid);
//   return { data: Users, error };
// }

// async function getUserDescription(uid) {
//   let { data: Users, error } = await supabase
//     .from("Users")
//     .select("description")
//     .eq("id", uid);
//   return { data: Users, error };
// }

// async function getUserName(uid) {
//   let { data: Users, error } = await supabase
//     .from("Users")
//     .select("name")
//     .eq("id", uid);
//   return { data: Users, error };
// }

// /**
//  *
//  * @param {*} uid
//  * @returns image
//  */
// async function getUserProfilePhoto(uid) {
//   let { data: Users, error } = await supabase
//     .from("Users")
//     .select("image")
//     .eq("id", uid);
//   return { data: Users, error };
// }

// /**
//  *
//  * @param {*} uid
//  * @returns string formatted: timestamp with time zone
//  */
// async function getUserJoinDate(uid) {
//   let { data: Users, error } = await supabase
//     .from("Users")
//     .select("created_at")
//     .eq("id", uid);
//   return { data: Users, error };
// }

// async function getItems() {
//   let { data: Items, error } = await supabase
//     .from("Items")
//     .select("created_at");

//   return { data: Items, error };
// }

// async function runTest() {
//   (async () => {
//     try {
//       // Your async code here
//       const result = await getUserDescription(
//         "29527509-64c9-4798-9144-23773f3ee72c"
//       );

//       // console.log(result);
//       // const loc = await getUserLocation("29527509-64c9-4798-9144-23773f3ee72c");
//       // console.log(loc);

//       // const items = await getItems();
//       // console.log(items);

//       const reqesteditems = await viewUser(

//       );
//       console.log(reqesteditems);
//     } catch (error) {
//       console.error("Error:", error);
//     }
//   })();
// }