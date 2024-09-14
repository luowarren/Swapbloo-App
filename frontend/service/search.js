import dotenv from "dotenv";
import { createClient } from '@supabase/supabase-js'; // Correct named import

// Load environment variables from .env file
dotenv.config({ path: "../.env" }); // Optional: specify the path to .env

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

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
    var { data: Items, error } = {data: [], error: null};
    const words = searchString.split(/\s+/);
    // convert json to string
    const objectToString = obj => JSON.stringify(obj);

    for (let i = 0; i < words.length; i++) {
        var word = words[i];
        var temp = 
        (await supabase
        .from("Items")
        .select("*")
        // .ilike('title', `%${word}%`));
        .or(`title.ilike.%${word}%,caption.ilike.%${word}%`));
        if (temp['error']) {
            return temp
        } 
        Items = Items.concat(temp['data']);
    }

    // Count frequency of each JSON object
    const frequencyObject = {};
    Items.forEach(obj => {
        const key = objectToString(obj);
        if (frequencyObject[key]) {
        frequencyObject[key]++;
        } else {
        frequencyObject[key] = 1;
        }
    });

    // we want the best matches to be near the top
    // Convert frequency object to an array of [key, value] and sort by value (desc)
    const sortedArray = Object.entries(frequencyObject)
    .sort((a, b) => b[1] - a[1]);

    // Convert sorted array back to JSON objects
    Items = sortedArray.map(([key]) => JSON.parse(key));
    return {data: Items, error}
}

async function runTest() {
  
    (async () => {
      try {
        console.log('attempting search');
        let {data: Items, error} = await search("blue casual shirt");
        if (error) {
            console.log(error);
        }
        for (let i = 0; i < Items.length; i++) {
            console.log("title: ", Items[i]["title"]);
            // console.log("caption: ", Items[i]["caption"]);
        } 
        console.log("concluding search");
  
      } catch (error) {
        console.log(error);
      }
    })();
  
}
runTest()