import dotenv from "dotenv";
import pkg from "@supabase/supabase-js";
import { getUserProfilePhoto, getUserName } from './users.js'
import { getMostRecentMessage, censorMessage } from './messages.js'

// Load environment variables from .env file
dotenv.config({ path: "../.env" });

const { createClient, SupabaseClient } = pkg;

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Supabase URL and key are required.");
}

/**
 * Get a list of active chats for the current user
 *
 * @param {string} uid - the id of the current user
 * @returns object containing attributes of all chats (all messages with relevant timestamps, sender etc)
 */
export async function getChats(uid) {
    // Fetch Chats where either user1_id or user2_id matches uid
    let { data: Chats, error: chatError } = await supabase
      .from("Chats")
      .select("*")
      .or(`user1_id.eq.${uid},user2_id.eq.${uid}`)
      .eq("status", "Active");

    const promises = Chats.map(async(obj) => {
        let userProfilePic;
        let username;
        if (obj.user1_id == uid) {
            userProfilePic = await getUserProfilePhoto(obj.user2_id);
            username = await getUserName(obj.user2_id);
        } else {
            userProfilePic = await getUserProfilePhoto(obj.user1_id);
            username = await getUserName(obj.user1_id);
        }
        const latestMessage = await getMostRecentMessage(obj.id);
        return {
            ...obj,
            profilePic: userProfilePic.data[0].image,
            username: username.data[0].name,
            latestMessage: latestMessage
        }
    });

    return Promise.all(promises);
}

/**
 * Get 1 current chat
 * 
 * @param {string} chat_id - the id of a chat
 * @returns object contianing chat attributes (all messages with relevant timestamps, sender, profile picture)
 */
export async function getChat(chat_id) {
  // Fetch Chats where either user1_id or user2_id matches uid
  let { data: messages, error: messageError } = await supabase
    .from("Messages")
    .select("*")
    .eq("chat_id", chat_id);
  
  return messages;
}

/**
 * Send a message
 * 
 * @param {string} uid - the id of the current user
 * @param {string} chat_id - the id of current chat
 * @param {string} message - message to send
 * @returns inserts (censored) record into Messages table
 */
export async function sendMessage(uid, chat_id, message) {
  const {data, error} = await supabase
    .from("Messages")
    .insert([{
      chat_id: chat_id,
      sender_id: uid,
      content: censorMessage(message)
    }]);

    if (error) {
      console.log("Error sending message", error.message);
      throw error;
    } else{
      return data;
    }
}

/**
 * Delete a chat
 * 
 * @param {string} chat_id - the id of current chat
 */
export async function deleteChat(chat_id) {
  let {error} = await supabase.from("Chats").delete().eq("id", chat_id);
  return {error};
}

(async () => {
    try {
      const uid = "b484dc52-08ca-4518-8253-0a7cd6bec4e9"
      const chat_id = "1";
      // const chats = await getChats(uid);
      // console.log(chats);
      // const messsages = await getChat(uid, chat_id);
      // console.log(messages);
      const s = await sendMessage(uid, chat_id, "test fuck");

      // const d = await deleteChat('15');
      // console.log(d);

    } catch (error) {
      console.error("Error:", error);
    }
  })();