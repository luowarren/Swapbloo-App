import dotenv from "dotenv";
import { createClient } from '@supabase/supabase-js'; // Correct named import
import { networkInterfaces } from "os";

// Load environment variables from .env file
dotenv.config({ path: "../.env" });

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Supabase URL and key are required.");
}

export async function getMeetUp(swap_id) {
    console.log("Allan qawejortfnselkzrgjfbdsborskflgjb")
    const {data: meetUpData, error: meetUpError} = await supabase
        .from('MeetUps')
        .select('*')
        .eq('swap_id', swap_id);
        console.log("Allan qawejortfnselkzrgjfbdsborskflgjb2")
    if (meetUpError) {
        // console.log(`Error getting meet up for ${swap_id}`, error);
        console.log("fucky fucl 2")
        return null;
    } else {
        console.log(`Successfully got meet up data for ${swap_id}`);
        return meetUpData;
    }
}

export async function updateMeetUp(swap_id, new_location, new_date, new_time) {
    // console.log("adding to meetup db: ", new_location, new_date, new_time)
    const {error} = await supabase
        .from('MeetUps')
        .update({location: new_location, date: new_date, time: new_time})
        .eq('swap_id', swap_id);
    if (error) {
        console.log(`Error updating meet up for ${swap_id}`, error);
    } else {
        console.log(`Successfully updated meet up for ${swap_id}`);
    }
}

(async () => {
    const swap_id = "3";
    const location = "new york";
    const new_date = '2024-10-08';
    const new_time = "13:02";
    await updateMeetUp(swap_id, location, new_date, new_time);
})();