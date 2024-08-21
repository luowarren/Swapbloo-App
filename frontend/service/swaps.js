import dotenv from "dotenv";
import pkg from "@supabase/supabase-js";
const { createClient } = pkg;

// Load environment variables from .env file
dotenv.config({ path: "../.env" });

import { CONDITIONS, DEMOGRAPHICS, CATEGORIES, SIZES, SWAP_STATUS } from "./constants.js";

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Supabase URL and key are required.");
}

/**
 * Creates a new swap record in the 'Swaps' table.
 *
 * @param {number} itemId - The ID of the item being swapped.
 * @param {number} requesterId - The ID of the user requesting the swap.
 * @param {number} ownerId - The ID of the user who owns the item.
 * @returns {Promise}
 * 
 * Example response:
 *   {
    id: 50,
    created_at: '2024-08-19T04:34:45.143341+00:00',
    status: 'Pending',
    user1_id: 'adfc278c-45f1-42a5-be21-857b95bd113a',
    user2_id: 'b484dc52-08ca-4518-8253-0a7cd6bec4e9',
    item_id: 54
  }
 */
export async function createSwap(itemId, requesterId, ownerId) {
    // default insert as pending swap
    const { data, error } = await supabase
        .from("Swaps")
        .insert([{ 
            item_id: itemId, 
            user1_id: requesterId, 
            user2_id: ownerId,
            status: SWAP_STATUS[0] 
        }])
        .select();

  if (error) {
    console.error("Error creating swap:", error.message);
    throw error;
  }
  //console.log(data);
  return data[0];
}

/**
 * Retrieves all swap records from the 'Swaps' table.
 *
 * @returns {Promise}
 */
export async function getAllSwaps() {
  const { data, error } = await supabase.from("Swaps").select("*");

  if (error) {
    console.error("Error retrieving swaps:", error.message);
    throw error;
  }

  return data;
}

/**
 * Retrieves a swap record by its ID from the 'Swaps' table.
 * Throws error if swap cant be found
 *
 * @param {number} swapId - The ID of the swap to retrieve.
 * @returns {Promise}
 */
export async function getSwapById(swapId) {
  const { data, error } = await supabase
    .from("Swaps")
    .select("*")
    .eq("id", swapId)
    .single();

  if (error) {
    if (error.details == "The result contains 0 rows") {
        return null;
    }
    console.error("Error retrieving swap by ID:", error.message);
    throw error;
  }

  return data;
}

/**
 * Updates the status of a swap record in the 'Swaps' table.
 *
 * @param {number} swapId - The ID of the swap to update.
 * @param {string} status - The new status of the swap (e.g., "pending", "completed", "canceled").
 * @returns {Promise}
 */
export async function updateSwapStatus(swapId, status) {
  const { data, error } = await supabase
    .from("Swaps")
    .update({ status: status })
    .eq("id", swapId)
    .select();

  if (error) {
    console.error("Error updating swap status:", error.message);
    throw error;
  }

  return data[0];
}

/**
 * Deletes a swap record from the 'Swaps' table.
 *
 * @param {number} swapId - The ID of the swap to delete.
 * @returns {Promise}
 */
export async function deleteSwap(swapId) {
  const { data, error } = await supabase.from("Swaps").delete().eq("id", swapId);

  if (error) {
    console.error("Error deleting swap:", error.message);
    throw error;
  }

  return data;
}

async function getRequestedItems(uid) {
  // Fetch item_ids from Swaps where requester_id matches
  let { data: swaps, swapError } = await supabase
    .from("Swaps")
    .select("item_id")
    .eq("requester_id", uid);
  // .in("status", ["PENDING", "ACCEPTED", "REJECTED"]);

  if (swapError) {
    return { data: swaps, swapError };
  }

  // Extract item_ids from the query result
  const itemIds = swaps.map((swap) => swap.item_id);

  // Fetch items where id is in the list of item_ids
  const { data: items, itemError } = await supabase
    .from("Items")
    .select("title")
    .in("id", itemIds);

  return { data: items, itemError };
}

async function getReceivedRequests(uid) {
  // Fetch item_ids from Swaps where requester_id matches
  let { data: swaps, swapError } = await supabase
    .from("Swaps")
    .select("item_id")
    .eq("accepter_id", uid);
  // .in("status", ["PENDING", "ACCEPTED", "REJECTED"]);

  if (swapError) {
    return { data: swaps, swapError };
  }

  // Extract item_ids from the query result
  const itemIds = swaps.map((swap) => swap.item_id);

  // Fetch items where id is in the list of item_ids
  const { data: items, itemError } = await supabase
    .from("Items")
    .select("title")
    .in("id", itemIds);

  return { data: items, itemError };
}

(async () => {
    try {
        const swapId = 1; // Example swap ID
        const itemId = 54; // Example item ID
        const requesterId = 'adfc278c-45f1-42a5-be21-857b95bd113a'; // Example requester ID
        const ownerId = 'b484dc52-08ca-4518-8253-0a7cd6bec4e9'; // Example owner ID
        const newStatus = "Completed"; // Example status

        // Create a new swap
        const newSwap = await createSwap(itemId, requesterId, ownerId);
        console.log(newSwap);
        const createdSwapId = newSwap.id;
        console.log("swapp created: " + createdSwapId);

        // Get swap by ID
        const swap = await getSwapById(createdSwapId);
        testResult(createdSwapId, swap.id);

        // Update swap status
        const updatedSwap = await updateSwapStatus(createdSwapId, newStatus);
        testResult(updatedSwap.status, newStatus);

        // Delete swap
        const deletedSwap = await deleteSwap(createdSwapId);
        console.log(deleteSwap);
        const checkDeleted = await getSwapById(createdSwapId);
        console.log(checkDeleted);
        testResult(checkDeleted, null);

    } catch (error) {
        console.error('Error:', error);
    }
})();

/**
 * Test result helper function
 * @param {string} expected - The expected result
 * @param {string} actual - The actual result from the function
 */
function testResult(expected, actual) {
    if (expected === actual) {
        console.log(`Success: ${expected} === ${actual}`);
    } else {
        console.error(`Fail: ${expected} !== ${actual}`);
    }
}
