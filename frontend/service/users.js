//import 'dotenv';
import dotenv from 'dotenv';
import pkg from '@supabase/supabase-js';
const { createClient, SupabaseClient } = pkg;
import twilio from 'twilio';

// Load environment variables from .env file
dotenv.config({ path: '../.env' }); // Optional: specify the path to .env


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
 *            - data: An array containing user data if found, or empty if no user matches the ID.
 *            - error: Error object if the query fails, or null if successful.
 */
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

/**
 * Fetches the listing of items for a specific user from the "Items" table.
 *
 * @async
 * @function getUserListing
 * @param {string} uid - The unique identifier (ID) of the user whose items are to be fetched.
 * @returns {Promise<Object>} - Returns a promise that resolves to an object containing:
 *    @property {Array<Object>} data - An array of items that match the user's ID, if successful.
 *    @property {Object} error - An error object if there was an issue fetching the data.
 * 
 * @example
 * // Example usage:
 * const userId = '12345';
 * const { data, error } = await getUserListing(userId);
 * if (error) {
 *     console.error('Error fetching user items:', error);
 * } else {
 *     console.log('User items:', data);
 * }
 */
async function getUserListing(uid) {
    let { data: Items, error } = await supabase
    .from('Items')
    .select("*")
    // Filters
    .eq('id', uid)
    return { data: Users, error };
}


async function getUserLocation(uid) {
    let { data: Users, error } = await supabase
    .from('Users')
    .select('location')
    .eq('id', uid)
    return { data: Users, error };
}

async function getUserDescription(uid) {
    let { data: Users, error } = await supabase
    .from('Users')
    .select('description')
    .eq('id', uid)
    return { data: Users, error };
}

async function getUserName(uid) {
    let { data: Users, error } = await supabase
    .from('Users')
    .select('name')
    .eq('id', uid)
    return { data: Users, error };
}

/**
 * 
 * @param {*} uid 
 * @returns image
 */
async function getUserProfilePhoto(uid) {
    let { data: Users, error } = await supabase
    .from('Users')
    .select('image')
    .eq('id', uid)
    return { data: Users, error };
}

/**
 * 
 * @param {*} uid 
 * @returns string formatted: timestamp with time zone
 */
async function getUserJoinDate(uid) {
    let { data: Users, error } = await supabase
    .from('Users')
    .select('created_at')
    .eq('id', uid)
    return { data: Users, error };
}

/**
 * This requires the user to be logged in - i dont think will work with this set up
 * THis is like get self, as opposed to get any other user
 * @returns user object
 */
async function getUser() {
    const { data: { user } } = await supabase.auth.getUser()
    return user;
}


function testResult(expected, actual) {
    if (expected != actual) {
        console.log("expected result (" + expected + ") was not actually the result (" + actual + ")" )
    }
}

(async () => {
    try {
        const userId = '29527509-64c9-4798-9144-23773f3ee72c'
        const userDescription = await getUserDescription(userId);
        //console.log(userDescription);
        testResult("I love cheese", userDescription.data[0].description);
        
        const loc = await getUserLocation(userId);
        testResult("Woolloomooloo", loc.data[0].location);

        const joinDate = await getUserJoinDate(userId);
        testResult("2024-08-09T04:54:43.076912+00:00", joinDate.data[0].created_at);

    } catch (error) {
        console.error('Error:', error);
    }
})();