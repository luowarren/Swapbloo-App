import dotenv from "dotenv";
import pkg from "@supabase/supabase-js";
const { createClient } = pkg;

// Load environment variables from .env file
dotenv.config({ path: "../.env" });

import { SWAP_STATUS } from "./constants.js";

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Supabase URL and key are required.");
}

export async function createSwapItem(swapInfo) {
  console.log(`Itemid ${swapInfo.item_id} owner ${swapInfo.owner_id} swap ${swapInfo.swap_id}`)
  const { data, error } = await supabase
    .from("SwapItems")
    .insert([{
      swap_id: swapInfo.swap_id,
      item_id: swapInfo.item_id,
      owner_id: swapInfo.ownerId
    }]);

  if (error) {
    console.error("Error adding swap item:", error.message);
    throw error;
  }
  console.log(data);
  return data;
}

/**
 * Creates a new swap record in the 'Swaps' table.
 *
 * @param {number} itemId - The ID of the item being swapped.
 * @param {number} requesterId - The ID of the user requesting the swap.
 * @param {number} accepterId - The ID of the user who owns the item.
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
export async function createSwapRequest(myItems, requestingItems, ownerId, requesterId) {
  // First, add to swaps table with a pending status
  const { data, error } = await supabase
    .from("Swaps")
    .insert([{ 
      requester_id: requesterId, 
      accepter_id: ownerId,
      status: SWAP_STATUS[0] 
    }])
    .select();

  console.log(data)
  if (error) {
    console.error("Error creating swap:", error.message);
    throw error;
  }

  const swapId = data[0].id;

  // Insert rows for the owner's items
  const ownerItems = myItems.map(itemId => ({
    swap_id: swapId,
    item_id: itemId,
    owner_id: ownerId
  }));

  // Insert rows for the requester's items
  const requesterItems = requestingItems.map(itemId => ({
    swap_id: swapId,
    item_id: itemId,
    owner_id: requesterId
  }));

  // Combine both arrays and insert into SwapItems table
  // Insert each of the owner's items
  for (const itemId of ownerItems) {
    await createSwapItem(itemId);
  }

  // Insert each of the requester's items
  for (const itemId of requesterItems) {
    await createSwapItem(itemId);
  }

  return data[0];
}



/**
 * Creates a new swap record in the 'Swaps' table.
 *
 * @param {number} itemId - The ID of the item being swapped.
 * @param {number} requesterId - The ID of the user requesting the swap.
 * @param {number} accepterId - The ID of the user who owns the item.
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

export export async function createSwap(requesterId, accepterId) {
  // default insert as pending swap
  const { data: Swap, error } = await supabase
    .from("Swaps")
    .insert([
      {
        requester_id: requesterId,
        accepter_id: accepterId,
        status: SWAP_STATUS[0],
      },
    ])
    .select();

  if (error) {
    console.error("Error creating swap:", error.message);
    throw error;
  }
  //console.log(data);
  return { data: Swap, error };
}

export async function createSwapItem(swapId, itemId, uid) {
  const { data: Item, error } = await supabase
    .from("SwapItems")
    .insert([
      {
        swap_id: swapId,
        item_id: itemId,
        owner_id: uid,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Error creating swap item:", error.message);
    throw error;
  }
  //console.log(data);
  return { data: Item, error };
}

 */

/**
 * Retrieves all swap records from the 'Swaps' table.
 *
 * @returns Swaps is a list of all the Swap types
 */
export async function getAllSwaps() {
  const { data: Swaps, error } = await supabase.from("Swaps").select("*");

  if (error) {
    console.error("Error retrieving swaps:", error.message);
    throw error;
  }

  return { data: Swaps, error };
}

/**
 * Retrieves a swap record by its ID from the 'Swaps' table.
 * Throws error if swap cant be found
 *
 * @param {number} swapId - The ID of the swap to retrieve.
 * @returns Swap is a list containing the Swap requested
 */
export async function getSwapById(swapId) {
  const { data: Swap, error } = await supabase
    .from("Swaps")
    .select("*")
    .eq("id", swapId)
    .single();

  // if (error) {
  //   if (error.details == "The result contains 0 rows") {
  //     return null;
  //   }
  //   console.error("Error retrieving swap by ID:", error.message);
  //   throw error;
  // }

  return { data: Swap, error };
}

/**
 * Updates an Item in the Items table to have swapped = true, indicating that
 * the item has been successfully swapped.
 *
 * @param {string} swapId - the id of the Item being swapped
 * @param {string} status - the updated status of the swap
 * @returns Item is a list containing the Item we just swapped.
 */
export async function updateSwapStatus(swapId, status) {
  const { data: Item, error } = await supabase
    .from("Swaps")
    .update({ status })
    .eq("id", swapId)
    .select();

  if (error) {
    console.error("Error updating swap status:", error.message);
    throw error;
  }

  return { data: Item, error };
}

/**
 * Deletes a swap record from the 'Swaps' table.
 *
 * @param {number} swapId - The ID of the swap to delete.
 * @returns error | null
 */
export async function deleteSwap(swapId) {
  const { error } = await supabase.from("Swaps").delete().eq("id", swapId);

  // if (error) {
  //   console.error("Error deleting swap:", error.message);
  //   throw error;
  // }

  return { error };
}

/**
 * Get a list of items the user has requested in a swap
 * should this be a list of swaps the user has initiated???????
 *
 * @param {string} uid - the id of the requester user
 * @returns Items is a list of all the items a user has wanted to receive as a
 * part of a swap
 */
export async function getRequestedItems(uid) {
  // Fetch item_ids from Swaps where requester_id matches
  let { data: Swaps, swapError } = await getRequestedSwaps(uid);

  if (swapError) {
    return { data: Swaps, swapError };
  }

  // Extract item_ids from the query result
  const itemIds = Swaps.map((swap) => swap.item_id);

  // Fetch items where id is in the list of item_ids
  const { data: Items, itemError } = await supabase
    .from("Items")
    .select("title")
    .in("id", itemIds);

  return { data: Items, itemError };
}

/**
 * Get a list of the users items that other users wish to swap for
 *
 * @param {string} uid - the id of the accepter user
 * @returns Items is a list of all the items a user can choose to agree to swap
 * for
 */
export async function getReceivedRequests(uid) {
  // Fetch item_ids from Swaps where requester_id matches
  let { data: Swaps, swapError } = await getReceivedSwaps(uid);

  if (swapError) {
    return { data: Swaps, swapError };
  }

  // Extract item_ids from the query result
  const itemIds = Swaps.map((swap) => swap.item_id);

  // Fetch items where id is in the list of item_ids
  const { data: Items, itemError } = await supabase
    .from("Items")
    .select("title")
    .in("id", itemIds);

  return { data: Items, itemError };
}

/**
 * Get a list of swaps the user has initiated
 *
 * @param {string} uid - the id of the requester user
 * @returns Swaps is a list of swaps the user has requested
 */
export async function getRequestedSwaps(uid) {
  // Fetch item_ids from Swaps where requester_id matches
  let { data: Swaps, swapError } = await supabase
    .from("Swaps")
    .select("item_id")
    .eq("requester_id", uid)
    .in("status", ["Pending", "Accepted", "Rejected"]);

  return { data: Swaps, swapError };
}

/**
 * Get a list of swaps the user needs to respond to
 *
 * @param {string} uid - the id of the accepter user
 * @returns Swaps is a list of all the swaps the user has received
 */
export async function getReceivedSwaps(uid) {
  // Fetch item_ids from Swaps where requester_id matches
  let { data: Swaps, swapError } = await supabase
    .from("Swaps")
    .select("item_id")
    .eq("accepter_id", uid)
    .in("status", ["Pending", "Accepted", "Rejected"]);

  return { data: Swaps, swapError };
}

// what about when a user wants to edit which items are apart of the swap????

(async () => {
  try {
    const swapId = 78; // Example swap ID
    const itemId = 54; // Example item ID
    const requesterId = "adfc278c-45f1-42a5-be21-857b95bd113a"; // Example requester ID
    const ownerId = "b484dc52-08ca-4518-8253-0a7cd6bec4e9"; // Example owner ID
    const newStatus = "Accepted"; // Example status

    // Create a new swap
    /*
    const newSwap = await createSwap(requesterId, ownerId);
    console.log(newSwap);
    const createdSwapId = newSwap['data'][0].id;
    console.log("swap created: " + createdSwapId);
    */
    // Create a new swap
    const newSwap = await createSwapRequest(['54'], ['55'], ownerId, requesterId);
    console.log(newSwap);
    const createdSwapId = newSwap.id;
    console.log("swapp created: " + createdSwapId);

    //const newSwapItem = await createSwapItem('86', itemId, ownerId);
    // console.log(newSwapItem);
    //const createdSwapItemId = newSwapItem['data'];
    // console.log("swap item created: " + createdSwapItemId); 

    // Get swap by ID
    const swap = await getSwapById(createdSwapId);
    testResult(createdSwapId, swap['data'].id);

    // Update swap status
    const updatedSwap = await updateSwapStatus(createdSwapId, newStatus);
    testResult(updatedSwap['data'][0].status, newStatus);

    // Delete swap
    const deletedSwap = await deleteSwap(createdSwapId);
    console.log(deleteSwap);
    const checkDeleted = await getSwapById(createdSwapId);
    console.log(checkDeleted);
    testResult(checkDeleted['data'], null);
  } catch (error) {
    console.error("Error:", error);
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
