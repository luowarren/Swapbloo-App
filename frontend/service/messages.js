import dotenv from "dotenv";
import pkg from "@supabase/supabase-js";

// Load environment variables from .env file
dotenv.config({ path: "../.env" });

const { createClient, SupabaseClient } = pkg;

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Supabase URL and key are required.");
}

/**
 * Get a most recent message for a chat
 *
 * @param {string} chat_id - the id of a chat
 * @returns returns message object for most recent message
 */
export async function getMostRecentMessage(chat_id) {
    // Fetch message where chat_id=chat_id
    let { data: messages, error: messageError } = await supabase
      .from("Messages")
      .select("*")
      .eq("chat_id", chat_id);

      if (messageError) {
        console.log("found error")
        return messageError
      }

      function compareMessageTimestamp(m1, m2) {
        if (m1.created_at < m2.created_at) {
            return -1;
        } else if (m1.created_at > m2.created_at) {
            return 1;
        }
        return 0;
      }
      messages.sort(compareMessageTimestamp)
      return messages[messages.length-1];
}

(async () => {
    try {
      const chat_id = 1
      const message = await getMostRecentMessage(chat_id);
      console.log(message);
    } catch (error) {
      console.error("Error:", error);
    }
  })();