import dotenv from "dotenv";
// import pkg from "@supabase/supabase-js";
import { getUserProfilePhoto, getUserName } from "./users.js";
import { getMostRecentMessage, censorMessage } from "./messages.js";
import { createClient } from "@supabase/supabase-js";
import { getSwapDetailsBetweenUsers } from "./swaps.js";
import { supabase } from "./supabaseClient.js";

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

  const promises = Chats.map(async (obj) => {
    let userProfilePic;
    let username;
    if (obj.user1_id == uid) {
      userProfilePic = await getUserProfilePhoto(obj.user2_id);
      username = await getUserName(obj.user2_id);
    } else {
      userProfilePic = await getUserProfilePhoto(obj.user1_id);
      username = await getUserName(obj.user1_id);
    }
    let latestMessage = await getMostRecentMessage(obj.id);
    if (latestMessage == null) {
      latestMessage = {
        created_at: obj.created_at,
        chat_id: obj.id,
        sender_id: null,
        content: "",
      };
    }
    return {
      ...obj,
      profilePic: userProfilePic.data[0].image,
      username: username.data[0].name,
      latestMessage: latestMessage,
    };
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

  const updatedMessages = messages.map((message) => ({
    ...message,
    type: "text",
  }));

  return updatedMessages;
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
  const { data, error } = await supabase.from("Messages").insert([
    {
      chat_id: chat_id,
      sender_id: uid,
      content: censorMessage(message),
    },
  ]);

    if (error) {
      console.log("Error sending message", error.message);
      throw error;
    } else{
      // update viewed status
      const viewed = await getViewedStatus(chat_id);
      // console.log("message sent, so should update", viewed)
      if (viewed) {
        // console.log("message sent so update viewed")
        await toggleViewed(chat_id);
      }
      return data;
    }
}

/**
 * Delete a chat
 *
 * @param {string} chat_id - the id of current chat
 */
export async function deleteChat(chat_id) {
  let { error } = await supabase.from("Chats").delete().eq("id", chat_id);
  return { error };
}

/**
 * Update chat viewed status
 *
 * @param {string} chat_id - the id of current chat
 */
export async function toggleViewed(chat_id) {
  // get current viewed status
  const viewed = await getViewedStatus(chat_id);

  const { error } = await supabase
    .from("Chats")
    .update({ viewed: !viewed })
    .eq("id", chat_id);

  if (error) {
    console.error(
      `Error updating viewed status for chat_id: ${chat_id}`,
      error
    );
  } else {
    console.log(`Successfully updated viewed status for chat_id: ${chat_id}`);
  }
}

/**
 *
 * @param {string} chat_id - the id of current chat
 * @returns boolean whether latest message in chat has been viewed
 */
async function getViewedStatus(chat_id) {
  let { data: Chats, error: chatError } = await supabase
    .from("Chats")
    .select("*")
    .eq("id", chat_id);

  return Chats[0].viewed;
}

/**
 * Retrieves the user IDs (requester and accepter) from the 'Chats' table using the chat_id.
 *
 * @param {string} chatId - The chat ID.
 * @returns {Promise<{ requesterId: string, accepterId: string } | null>} - The user IDs if found, or null if not.
 */
export async function getUserIdsFromChat(chatId) {
  let { data: chat, error } = await supabase
    .from("Chats")
    .select("user1_id, user2_id")
    .eq("id", chatId);
  
  chat = (chat.length > 0) ? chat[0] : chat;

  if (error || !chat) {
    console.error(
      "Error retrieving chat details:",
      error?.message || "Chat not found"
    );
    return null;
  }

  return {
    requesterId: chat.user1_id,
    accepterId: chat.user2_id,
  };
}
export async function getOrCreateChatBetweenUsers(user1Id, user2Id) {
  try {
    // Step 1: Check if a chat already exists between the two users
    const { data: Items1, error: error1 }  = await supabase
      .from("Chats")
      .select("*")
      .eq("user1_id", user1Id)
      .eq("user2_id", user2Id)
    console.log("data chat 78", Items1)
    
    const { data: Items2, error: error2 } = await supabase
        .from("Chats")
        .select("*")
        .eq("user1_id", user2Id)
        .eq("user2_id", user1Id)

    console.log("data chat 79", Items1, error1, error2, Items2)
    const data = (Items1.length > 0) ? Items1[0] : ((Items2.length > 0) ? Items2[0] : Items2);

    console.log("shut b4 you get cut up 568", error1, Items1, data.id)

    if (data.id != null) {
      console.log("should reutrn here", data)
      // Chat exists, return the existing chat ID
      return { chatId: data.id, chatError: null };
    }
    console.log("needing to check right here");
    const { swapExists, user1Items, user2Items, swapId, status, swap } =
    await getSwapDetailsBetweenUsers(user1Id, user2Id);
    console.log("shut up b4 you get cut up", swapExists, user1Items, swapId, status, swap)
    // Step 2: If no chat exists, create a new one
  
      let { data: newChat, error: createError } = await supabase
      .from("Chats")
      .insert([
        { 
          id: swapId,
          user1_id: user1Id, 
          user2_id: user2Id,
        }
      ]);
      

    newChat = (newChat && newChat.length > 0) ? newChat[0] : newChat;

    if (createError) {
      // If chat creation fails, return the error
      return { chatId: null, chatError: createError };
    }

    return getChatBetweenUsers(user1Id, user2Id);

    
  } catch (error) {
    return { chatId: null, chatError: error };
  }
}

export async function setChatConsented(chatId) {
  let { data, error } = await supabase
    .from("Chats")
    .update({consented: "true"})
    .eq("id", chatId)
    .select();
  console.log("adeline", data[0], error);
  return {data, error}
}

export async function getChatBetweenUsers(user1Id, user2Id) {
  // Check if a chat exists between the users
  let { data, error } = await supabase
    .from("Chats")
    .select("*")
    .or(`user1_id.eq.${user1Id},user2_id.eq.${user1Id}`)
    .or(`user1_id.eq.${user2Id},user2_id.eq.${user2Id}`);

  if (error) return { chatId: null, chatError: error };

  return { chatId: data[0].id, chatError: null };
}
