import { Filter } from 'bad-words'
import { supabase } from "./supabaseClient.js";
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
      if (messages.length == 0) {
        return null;
      }

      console.log("chat id", messages)

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

/**
 * Censor a message
 *
 * @param {string} message - message to censor
 * @returns returns censored message
 */
export function censorMessage(message) {
  const filter = new Filter();
  return filter.clean(message);
}

(async () => {
    try {
      const chat_id = 16
      const message = await getMostRecentMessage(chat_id);
      console.log(message);
      // const message = "hello blah blah";
      // console.log(censorMessage(message));
    } catch (error) {
      console.error("Error:", error);
    }
  })();