import { supabase } from "./supabaseClient.js";

/**
 * NOTE: does not follow function protocals, only used internally
 *
 * @param {Object} swapInfo - json containing item_id, owner_id, swap_id all as
 * numbers
 * @returns
 */
export async function createSwapItem(swapInfo) {

  const { data, error } = await supabase.from("SwapItems").insert([
    {
      swap_id: swapInfo.swap_id,
      item_id: swapInfo.item_id,
      owner_id: swapInfo.owner_id,
    },
  ]);

  return error;
}

/**
 * Creates a new swap record in the 'Swaps' table.
 * 
 * @param {Array<string>} myItems - array of item ids 
 * @param {Array<string>} requestingItems - array of item ids
 * @param {number} ownerId - id of the owner
 * @param {number} requesterId - id of the requester
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
export async function createSwapRequest(
  myItems,
  requestingItems,
  ownerId, // this is me!
  requesterId
) {
  
  const { swapExists, user1Items, user2Items, swapId, status, swap } = await getSwapDetailsBetweenUsers(ownerId, requesterId);
    
  // If a swap already exists, modify the swap instead of creating a new one
  if (swapExists && status != "Accepted") {
        
    // Merge existing items with new items
    const updatedMyItems = [
      ...new Set([...user1Items.map(Number), ...myItems.map(Number)]),
    ];
    
    const updatedRequestingItems = [
      ...new Set([...user2Items.map(Number), ...requestingItems.map(Number)]),
    ];
    
    // Call modifySwapRequest to update the swap
    const { data, error } = await modifySwapRequest(
      swapId,
      updatedMyItems,
      updatedRequestingItems,
      ownerId,
      requesterId
    );

    if (error) {
      console.error("Error modifying swap:", error.message);
      throw error;
    }

    return { data, error };
  } else if (swapExists && status == "Accepted") {
    const updatedMyItems = [
      ...new Set([...myItems.map(Number)]),
    ];
    
    const updatedRequestingItems = [
      ...new Set([...requestingItems.map(Number)]),
    ];
    
    // Call modifySwapRequest to update the swap
    const { data, error } = await modifySwapRequest(
      swapId,
      updatedMyItems,
      updatedRequestingItems,
      ownerId,
      requesterId
    );

  }

  const { data, error } = await supabase
    .from("Swaps")
    .insert([
      {
        requester_id: ownerId,
        accepter_id: requesterId,
        status: "Pending",
      },
    ])
    .select();

  if (error) {
    console.error("Error creating swap:", error.message);
    throw error;
  }

  const createSwapId = data[0].id;

  const { data: MeetUps, meetUpError } = await supabase
    .from("MeetUps")
    .insert([
      {
        swap_id: createSwapId, location: "UQ Union"
      },
    ])
    .select();


  // Insert rows for the owner's items
  const ownerItems = myItems.map((itemId) => ({
    swap_id: createSwapId,
    item_id: itemId,
    owner_id: ownerId,
  }));

  // Insert rows for the requester's items
  const requesterItems = requestingItems.map((itemId) => ({
    swap_id: createSwapId,
    item_id: itemId,
    owner_id: requesterId,
  }));

  // Combine both arrays and insert into SwapItems table
  // Insert each of the owner's items
  for (const item of ownerItems) {
    const error = await createSwapItem(item);
    if (error) return { data, error };
  }

  // Insert each of the requester's items
  for (const item of requesterItems) {
    const error = await createSwapItem(item);
    if (error) return { data, error };
  }

  // return data[0];
  return { data, error };
}

/**
 * User tries to modify their swap request with another user.
 *
 * @param {number} swapId - id of the swap
 * @param {Array<number>} myItems - array of item ids
 * @param {Array<number>} requestingItems - array of item ids
 * @param {number} ownerId - id of the owner
 * @param {number} requesterId - id of the requester
 */
export async function modifySwapRequest(
  swapId,
  myItems,
  requestingItems,
  ownerId,
  requesterId
) {
  let { data, error } = await supabase
    .from("Swaps")
    .select("*")
    .eq("id", `${swapId}`)
  if (error) return { data, error };

  // Check if requester_id is the current user (yourself)
  data = data.length > 0 ? data[0] : data;
  const THE_REQUESTER = data.requester_id;
  const accepter_id = data.accepter_id;

  if (THE_REQUESTER !== ownerId) {
    // Swap the requester and accepter if you are not the current requester
    const { error: updateError } = await supabase
      .from("Swaps")
      .update({
        requester_id: ownerId, // Make the accepter the requester
        accepter_id: THE_REQUESTER,  // Make yourself the accepter
        status: "Pending"
      })
      .eq("id", swapId);

    if (updateError) return { data: null, error: updateError };
  } else {
    const { error: updateError } = await supabase
      .from("Swaps")
      .update({
        status: "Pending"
      })
      .eq("id", swapId);
  }

  // delete all items that are currently associated with this swap
  const deleteStatus = await supabase
    .from("SwapItems")
    .delete()
    .eq("swap_id", `${swapId}`);

  if (deleteStatus.error) return { data: null, error: deleteStatus.error };

  // Insert rows for the owner's items
  const ownerItems = myItems.map((itemId) => ({
    swap_id: swapId,
    item_id: itemId,
    owner_id: ownerId,
  }));

  // Insert rows for the requester's items
  const requesterItems = requestingItems.map((itemId) => ({
    swap_id: swapId,
    item_id: itemId,
    owner_id: requesterId,
  }));

  // Combine both arrays and insert into SwapItems table
  // Insert each of the owner's items
  for (const item of ownerItems) {
    const error = await createSwapItem(item);
    if (error) return { data, error };
  }

  // Insert each of the requester's items
  for (const item of requesterItems) {
    const error = await createSwapItem(item);
    if (error) return { data, error };
  }

  return { data, error };
}

/**
 * Finds the swap between two users if it exists, and returns the items involved for each user.
 *
 * @param {string} userId1 - The ID of the first user. i am user 1
 * @param {string} userId2 - The ID of the second user.
 * @returns {Promise<{swapExists: boolean, user1Items: string[], user2Items: string[],  swapId: number, status: string, swap: Object}>}
 */
export async function getSwapDetailsBetweenUsers(userId1, userId2) {
  // Step 1: Check if there's a swap between these two users
  console.log(userId1, userId2, "sigmas fuck bitches")
  const { data: swap1, error1 } = await supabase
    .from('Swaps')
    .select("*")
    .eq('requester_id', userId2)
    .eq('accepter_id', userId1);

    console.log(error1, swap1, "kys emma1")
  const { data: swap2, error2 } = await supabase
    .from("Swaps")
    .select("*")
    .eq('requester_id', userId1)
    .eq('accepter_id', userId2)
    // Ensures there's only one swa
    console.log(error1, "kys emma2", swap2)
  if (error1 || error2 || ((swap1 != null && swap1.length < 1) && (swap2 != null && swap2.length < 1))) {
    // No swap found between the users
    return {
      swapExists: false,
      user1Items: [],
      user2Items: [],
      swapId: null,
      status: null,
      swap: null
    };
  }

  const swap = (swap1.length > 0) ? swap1[0] : swap2[0];
  console.log(swap, swap1, swap2)
  const swapId = swap.id;
  const swapStatus = swap.status;

  // Step 2: Get items associated with this swap for both users
  const { data: swapItems, error: itemsError } = await supabase
    .from('SwapItems')
    .select("*")
    .eq('swap_id', swapId);

  if (itemsError || !swapItems) {
    return {
      swapExists: true,
      user1Items: [],
      user2Items: [],
      swapId: swapId,
      status: swap.status,
      swap
    };
  }

// Step 2.5: Extract item IDs from swap items
const itemIds = swapItems.map((item) => item.item_id);
// Query the Items table to check their swapped status
const { data: itemsData, error: itemsCheckError } = await supabase
  .from("Items")
  .select("id, owner_id, swapped")
  .in("id", itemIds);

if (itemsCheckError) {
  console.error("Error checking item statuses:", itemsCheckError.message);
  throw itemsCheckError;
}


// TODO there is a bug here, cause i only show if not swapped, byt if accepted then still want to show swapped. 
let user1ItemsNotSwapped, user2ItemsNotSwapped;
if (swapStatus == "Accepted") {
    
  // Step 3: Filter items by user and check for 'swapped = false' status
  user1ItemsNotSwapped = itemsData.filter(
    (item) => item.owner_id === userId1
  );
  user2ItemsNotSwapped = itemsData.filter(
    (item) => item.owner_id === userId2 
  );

} else {
  // Step 3: Filter items by user and check for 'swapped = false' status
  user1ItemsNotSwapped = itemsData.filter(
    (item) => item.owner_id === userId1 && !item.swapped
  );
  user2ItemsNotSwapped = itemsData.filter(
    (item) => item.owner_id === userId2 && !item.swapped
  );
}

// Ensure both users have at least one non-swapped item
if (user1ItemsNotSwapped.length < 1 || user2ItemsNotSwapped.length < 1) {
  console.warn("Both users must have at least one non-swapped item.", itemsData, user1ItemsNotSwapped, user2ItemsNotSwapped);
  return {
    error: "Both users need at least one item that is not swapped.",
    swapExists: false,
  };
}

// Proceed if both users have the required items
return {
  swapExists: true,
  user1Items: user1ItemsNotSwapped.map((item) => item.id),
  user2Items: user2ItemsNotSwapped.map((item) => item.id),
  swapId: swapId,
  status: swap.status,
  swap,
};
}

/**
 * Retrieves the user ID based on the username.
 *
 * @param {string} username - The username of the user.
 * @returns {Promise<string | null>} - The user ID if found, or null if not.
 */
export async function getUserIdByUsername(username) {
  let { data: user, error } = await supabase
    .from("Users")
    .select("id")
    .eq("username", username)

    user = user.length > 0 ? user[0] : user;
  if (error || !user) {
    console.error(
      "Error retrieving user ID:",
      error?.message || "User not found"
    );
    return null;
  }

  return user.id;
}

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
  let { data: Swap, error } = await supabase
    .from("Swaps")
    .select("*")
    .eq("id", swapId);
  
    Swap = Swap.length > 0 ? Swap[0] : Swap;
  return { data: Swap, error };
}

export async function incrementSwapCount(userId) {
  // Retrieve the current swapCount for the user
  let { data: userData, error: userError } = await supabase
    .from("Users")
    .select("swap_count")
    .eq("id", userId);

    userData = userData.length > 0 ? userData[0] : userData;
  if (userError) {
    console.error("Error retrieving user data:", userError);
    return { error: userError };
  }

  const newSwapCount = (userData?.swapCount || 0) + 1;

  // Update the swapCount with the incremented value
  const { data: updateData, error: updateError } = await supabase
    .from("Users")
    .update({ swap_count: newSwapCount })
    .eq("id", userId)
    .select();

  if (updateError) {
    console.error("Error updating swap count:", updateError);
    return { error: updateError };
  }

  return { data: updateData };
}

async function withdrawOffer(swapId) {
  try {
    await deleteChat(swapId); // Delete the chat associated with the swap
    await updateSwapStatus(swapId, "Withdrawn", []);
    setWithdrawn(true); // Update state to reflect withdrawal
  } catch (error) {
    console.error("Error withdrawing offer:", error);
  }
}

/**
 * Deletes a chat by the swap ID (or chat ID if you prefer).
 * @param {number} swapId - The swap ID associated with the chat.
 * @returns {Promise<void>}
 */
export async function deleteChat(swapId) {
  try {
    // Assuming the Chats table has a `swap_id` column to identify related chats
    const { error } = await supabase
      .from("Chats")
      .delete()
      .eq("id", swapId); // You can also use chat_id if applicable

    if (error) {
      throw new Error(`Failed to delete chat: ${error.message}`);
    }
  } catch (error) {
    console.error("Error deleting chat:", error);
    throw error; // Re-throw error to handle it in the caller
  }
}

/**
 * Updates the status of a swap in the Swaps table and marks the related items as swapped.
 *
 * @param {number} swapId - The ID of the swap being updated.
 * @param {string} status - The updated status of the swap.
 * @param {number[]} itemIds - The IDs of the items to be marked as swapped.
 * @returns {Promise<{data: any, error: any}>} - The updated swap and items data or an error.
 */
export async function updateSwapStatus(swapId, status, itemIds) {
  const { data: swapData, error: swapError } = await supabase
    .from("Swaps")
    .update({ status })
    .eq("id", swapId)
    .select();

  if (swapError) {
    console.error("Error updating swap status:", swapError.message);
    throw swapError;
  }

  const { data: itemsData, error: itemsError } = await supabase
    .from("Items")
    .update({ swapped: true })
    .in("id", itemIds)
    .select();

  if (itemsError) {
    console.error("Error updating item statuses:", itemsError.message);
    throw itemsError;
  }

  return { swapData, itemsData };
}


/**
 * Deletes a swap record from the 'Swaps' table.
 *
 * @param {number} swapId - The ID of the swap to delete.
 * @returns error | null
 */
export async function deleteSwap(swapId) {
  const { error } = await supabase.from("Swaps").delete().eq("id", swapId);

  return error;
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
    .select("*")
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
    .select("*")
    .eq("accepter_id", uid)
    .in("status", ["Pending", "Accepted", "Rejected"]);

  return { data: Swaps, swapError };
}

export async function getLocations() {
  let { data: locations, error } = await supabase.from("Locations").select("*");
  return { data: locations, error };
}

/**
 * get the current location of the swap, can be null
 * @param {string} sid swap id
 */
export async function getSwapLocation(sid) {
  let { data, error } = await supabase
    .from("MeetUps")
    .select("location")
    .eq("swap_id", sid);
  return { data, error };
}

export async function getCoordinates(name) {
  let {data, error} = await supabase
    .from("Locations")
    .select("*")
    .eq("name", name);
  return {data, error};
}

/**
 * set the location of the swap
 * @param {string} sid swap id
 * @param {string} location name of the new location
 */
export async function setSwapLocation(sid, location) {
  const { data, error } = await supabase
  .from('MeetUps')
  .update({ location: location })
  .eq('id', sid)
  .select()
  return { data, error };
}

// what about when a user wants to edit which items are apart of the swap????
async function runTest() {
  (async () => {
    try {
      const swapId = 78; // Example swap ID
      const itemId = 54; // Example item ID
      const requesterId = "adfc278c-45f1-42a5-be21-857b95bd113a"; // Example requester ID
      const ownerId = "b484dc52-08ca-4518-8253-0a7cd6bec4e9"; // Example owner ID
      const newStatus = "Accepted"; // Example status

      // Create a new swap
      let newSwap = await createSwapRequest(
        ["54"],
        ["55"],
        ownerId,
        requesterId
      );
      newSwap = newSwap["data"][0];
      const createdSwapId = newSwap.id;

      let modifiedSwap = await modifySwapRequest(
        createdSwapId,
        ["54", "87"],
        ["88"],
        ownerId,
        requesterId
      );
      // Get swap by ID
      const swap = await getSwapById(createdSwapId);
      testResult(createdSwapId, swap["data"].id);

      // Update swap status
      const updatedSwap = await updateSwapStatus(createdSwapId, newStatus);
      testResult(updatedSwap["data"][0].status, newStatus);

      // // Delete swap
      // const deletedSwap = await deleteSwap(createdSwapId);
      // console.log(deletedSwap);
      const checkDeleted = await getSwapById(createdSwapId);
      testResult(checkDeleted["data"], null);
    } catch (error) {
      console.error("Error:", error);
    }
  })();
}
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

//runTest();
