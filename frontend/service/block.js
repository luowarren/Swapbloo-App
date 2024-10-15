import dotenv from "dotenv";
// import pkg from "@supabase/supabase-js";
import { Filter } from 'bad-words'
import { createClient } from '@supabase/supabase-js';

// Load environment variables from .env file
dotenv.config({ path: "../.env" });

// const { createClient, SupabaseClient } = pkg;

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Supabase URL and key are required.");
}

export async function addNewBlockRecord(blockerId, blockeeId) {
    const {data, error} = await supabase
        .from("Blocked")
        .insert([{blocker: blockerId, blockee: blockeeId}]);
    
    if (error) {
        console.log("Error adding new block record", error);
    } else {
        console.log("added new blocked record!", data);
        return data;
    }
}

export async function getAllBlocked(blockerId) {
    const {data, error} = await supabase
        .from("Blocked")
        .select("blockee")
        .eq("blocker", blockerId);
    if (error) {
        console.log("Error getting blocked users for uid: ", blockerId, error);
    } else {
        console.log("successfully got blocked users!", data);
        return data;
    }
}