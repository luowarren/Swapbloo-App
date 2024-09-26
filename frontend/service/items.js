import dotenv from 'dotenv'; // Import dotenv
import { createClient } from '@supabase/supabase-js'; // Import Supabase client
import { search } from "./listings"

dotenv.config(); // Load environment variables from .env file

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;

// const supabaseUrl = process.env.SUPABASE_URL;
// const supabaseKey = process.env.SUPABASE_KEY;

console.log('sigma rizz', supabaseUrl, supabaseKey)
// Log the environment variables to check their values
console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Key:', supabaseKey);

const supabase = createClient(supabaseUrl, supabaseKey);

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Supabase URL and key are required.");
}

export async function loginUser(email, password) {
  let { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  });
}

/**
 * Retrieves all the active listings (active meaning, they have not yet been
 * swapped, but could be pending).
 *
 * @returns Items is a list of Item types, where swapped = false
 */
export async function getActiveListings() {
  let { data: Items, error } = await supabase
    .from("Items")
    .select("*")
    .eq("swapped", "false");

  console.log('data trip', Items);  
  if (error) {
    console.error("Error Items:", error.message);
    return { data: null, error };;
  }
  return { data: Items, error };
}

async function runTest() {
  (async () => {
    try {
      console.log("attempting search");
      let { data: Items, error } = await search("blue casual shirt");
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
// runTest();

export async function getListingsByUsers(userIds) {
  let { data: Items, error } = await supabase
    .from("Items")
    .select("*")
    .in("owner_id", userIds)
    .eq("swapped", "false");
    
  if (error) {
    console.error("Error fetching listings by users:", error.message);
    return { data: null, error: error };;
  }
  return { data: Items, error };
}

/**
 * Creates an Item type that is inserted into the Items table. Used when user
 * wants to create a new item listing
 *
 * @param {string} uid - the user who is listing this item
 * @param {string} size - the size of the item
 * @param {string} condition - condition the item is in
 * @param {string} category - type of clothing the item is
 * @param {string} demographic - target demographic for this item
 * @param {string} title - listing title
 * @param {Array<string???>} images - images of the item TODO figure out data type
 * @param {Array<string???>} images - images of the item TODO figure out data type
 * @param {string} caption - OPTIONAL listing caption
 * @param {string} brand - OPTIONAL item brand
 * @returns
 */
export async function createItemListing(
  uid,
  size,
  condition,
  category,
  demographic,
  title,
  images = null,
  caption = null,
  brand = null
) {
  let { data: Item, error } = await supabase
    .from("Items")
    .insert([
      {
        owner_id: uid,
        size,
        condition,
        category,
        demographic,
        title,
        caption,
        brand,
        swapped: "false",
      },
    ])
    .select();
  return { data: Item, error };
}

/**
 * Deletes an item from the Items table.
 * Used when user wants to delete a listing. NOT when user has sucessfully made
 * a swap.
 *
 * @param {string} itemId - the itemId of the Item being deleted
 * @returns error | null
 */
export async function deleteItemListing(itemId) {
  let { error } = await supabase.from("Items").delete().eq("itemId", itemId);
  return { error };
}

/**
 * Updates an Item in the Items table to have swapped = true, indicating that
 * the item has been successfully swapped.
 *
 * @param {string} itemId - the itemId of the Item being swapped
 * @returns Item is a list containing the Item we just swapped.
 */
export async function itemSwapped(itemId) {
  let { data: Item, error } = await supabase
    .from("Items")
    .update({ swapped: true })
    .eq("id", itemId)
    .select();
  return { data: Item, error };
}

/**
 * Edit an item listing. Only the title / caption of a listing can be updated.
 *
 * @param {string} itemId - the id of the Item listing you want to edit
 * @param {string} title - the updated title
 * @param {string} caption - the updated caption
 * @returns Item is a list containing the Item we just edited
 */
export async function editItemListing(itemId, title, caption) {
  let { data: Item, error } = await supabase
    .from("Items")
    .update({ title, caption })
    .eq("id", itemId)
    .select();
  return { data: Item, error };
}

/**
 * Fetches the image IDs related to a specific item from the "ItemImages" table.
 * @param {number} itemId - The ID of the item whose images are to be fetched.
 * @returns {Object} - An object containing either the fetched image data or an error.
 */
export async function getItemImageIds(itemId) {
  // Fetch the image paths from the database
  let { data, error } = await supabase
    .from("ItemImages")
    .select("*")
    .eq("item_id", itemId);

  return { data, error };
}

/**
 * Lists all filenames from a specified Supabase storage bucket.
 * @returns {Array<string>|null} - An array of filenames from the bucket, or null if an error occurred.
 */
export async function listFilenamesFromBucket() {
  const { data, error } = await supabase
    .storage
    .from('images') // Replace 'images' with your bucket name
    .list(''); // Provide the path inside the bucket, '' lists all files in the root

  if (error) {
    console.error('Error listing files:', error);
    return null;
  }

  // Map through the data to get an array of filenames
  const filenames = data.map(file => file.name);
  console.log('Filenames:', filenames);

  return filenames;
}

/**
 * Fetches a specific image from the Supabase storage bucket by its ID.
 * @param {string} imageId - The ID of the image to be fetched.
 * @param {string} bucket - The name of the bucket where the image is stored.
 * @returns {Blob|Error} - The image data as a Blob or an error if the operation fails.
 */
export async function getImageFromId(imageId, bucket) {
  console.log("image id and bucket:", bucket, imageId);
  const { data, error } = await supabase
    .storage
    .from(bucket)
    .download(imageId);
  console.log("getting data from buckets", data);

  if (error) {
    return error;
  }

  return data;
}

/**
 * Fetches multiple item images based on the provided image IDs.
 * @param {Array} imageIds - Array of image objects containing the image paths.
 * @returns {Object} - An object containing either the fetched image data or an error.
 */
export async function getItemImages(imageIds) {
  // Assuming `Item` is an array and contains image paths
  const images = [];
  console.log('starting');
  
  for (let item of imageIds) {
    // Get the image path or name from the 'image' column
    const imagePath = item.image;

    // Log the image path to verify it's correct
    console.log('Attempting to download image from path:', imagePath);

    // Download the image from the Supabase storage bucket
    const { data, error } = await supabase
      .storage
      .from('images')
      .download(imagePath);


    console.log(data);
    if (error) {
      console.log("error" + error);
      return { data: null, error: error };
    }
    // Convert the image data to a URL or Blob (if needed)
    images.push(data);
  }

  console.log(images)
  return { data: images, error: null };
}

/**
 * Fetches signed URLs for multiple item images based on the provided image IDs.
 * @param {Array} imageIds - Array of image objects containing the image paths.
 * @returns {Object} - An object containing signed URLs for the images or an error.
 */
export async function getItemImageLinks(imageIds) {
  // Assuming `Item` is an array and contains image paths
  const images = [];
  // Calculate the expiry time in seconds (1 month = 30 days = 2592000 seconds)
  const expiresIn = 30 * 24 * 60 * 60;
  
  for (let item of imageIds) {
    // Get the image path or name from the 'image' column
    const imagePath = item.image;
    console.log('Path:' + imagePath)

    // Log the image path to verify it's correct
    console.log('Attempting to download image from path:', imagePath);

    // Download the image from the Supabase storage bucket
    const { data, error } = await supabase
      .storage
      .from('images')
      .createSignedUrl(imagePath, expiresIn);

    console.log(data);
    if (error) {
      console.log("error" + error);
      return { data: null, error: error };
    }
    // Convert the image data to a URL or Blob (if needed)
    //const imageUrl = URL.createObjectURL(data);
    images.push(data);
  }
  console.log('done')
  console.log(images);

  return { data, error: null };
}

/**
 * Fetches detailed information about a specific item from the "Items" table.
 * @param {number} itemId - The ID of the item to be fetched.
 * @returns {Object} - An object containing either the item data or an error.
 */
export async function getItem(itemId) {
  let { data: Item, error } = await supabase
    .from("Items")
    .select("*")
    .eq("id", itemId)
    .single();
  return { data: Item, error };
}

/**
 * Fetches a user's profile image URL from the "Users" table based on the user ID.
 * @param {string} userId - The ID of the user whose profile image is to be fetched.
 * @returns {Blob|null} - The profile image as a Blob, or null if an error occurred.
 */
export async function getUserProfileImageUrl(userId) {
  let { data, error } = await supabase
    .from("Users")
    .select("image")
    .eq("id", userId)
    .single();

    if (!error) {
      const image = await getImageFromId(data.image, "profilePictures");
      console.log("imagee", image);
      if (image instanceof Blob) {
        return image;
      } else {
        console.error('Element is not a Blob:', error1);
        return null;
      }

    } else {
      console.error('no profile pic:', error); 
    }
    
}


/**
 * Fetches item images by first getting their image IDs and then downloading the images from Supabase storage.
 * @param {number} id - The ID of the item whose images are to be fetched.
 * @returns {Object} - An object containing either the image data or an error.
 */
export async function getImages(id) {
  console.log('itemId is this:', id);
  const imageIds = await getItemImageIds(id);
  console.log(imageIds);
  if (imageIds.error) {
    return {data: null, error: imageIds.error};
  } 
  console.log('ligm')
  const itemImages = await getItemImages(imageIds.data);
  console.log(itemImages);
  console.log('Type of data:', typeof itemImages);

  if (itemImages.error) {
    return {data: null, error: itemImages.error};
  } 
  console.log('sgi')
  return {data: itemImages.data, error: null};
}

/**
 * Gets image links for an item
 * @param {number} id - The ID of the item whose image URLs are to be fetched.
 * @returns {Object} - An object containing either the signed URLs or an error.
 */
export async function getImageLinks(id) {
  console.log('getting image ids');

  // gets the imges for the item
  const imageIds = await getItemImageIds(id);
  console.log(imageIds);
  if (imageIds.error) {
    return {data: null, error: imageIds.error};
  } 
  const itemImages = await getItemImageLinks(imageIds.data);
  if (itemImages.error) {
    return {data: null, error: itemImages.error};
  } 

  return {data: itemImages.data, error: null};
}
//await loginUser("warrenluo14@gmail.com", "Jojoseawaa3.1415");
//let x = await getfilteredItems(["6"], CATEGORIES, CONDITIONS, DEMOGRAPHICS);
//console.log(x["data"]);

async function runTest1() {
  
  (async () => {
    try {
      console.log('attemping');
      //console.log(listFilenamesFromBucket());
      const ims = await getImages('54');
      console.log('wowo')
      console.log(ims);

      console.log("going for number two")

      const imageLinks = await getImageLinks('54');
      console.log(imageLinks);

    } catch {
      //
    }
  })();

}
// runTest()

runTest()

