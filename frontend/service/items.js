import dotenv from "dotenv";
import { createClient } from '@supabase/supabase-js'; // Correct named import

// Load environment variables from .env file
// dotenv.config({ path: ".env" }); // Optional: specify the path to .env

const SUPABASE_KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51eW5pdmJwbnVsem5qY210dnBxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjMxNTk5MTEsImV4cCI6MjAzODczNTkxMX0.H-2tACfryiR97R5kQjas7RUaTBf2RpdnDgq-OGmfZzU'
const SUPABASE_URL='https://nuynivbpnulznjcmtvpq.supabase.co'
// Initialize Supabase client
const supabaseUrl = SUPABASE_URL;
const supabaseKey = SUPABASE_KEY;

// Log the environment variables to check their values
//console.log('Supabase URL:', supabaseUrl);
//console.log('Supabase Key:', supabaseKey);

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
  if (error) {
    console.error("Error Items:", error.message);
    return;
  }
  return { data: Items, error };
}

/**
 * Filters items by sizes, categories, conditions, demographics. For full
 * list what possible types for these, refer to ./constants.js
 *
 * Example: if sizes = ["XS", "XXS"], this will only return items of size XS and
 * XSS. Essentially, the array must contain the criteria you DONT want filtered
 * out.
 *
 * @param {Array<string>} sizes - the sizes users want to filter by
 * @param {Array<string>} categories - the categories users want to filter by
 * @param {Array<string>} conditions - the conditions users want to filter by
 * @param {Array<string>} demographics - the sizes users want to filter by
 * @returns Items is a list of Item types where the filtered criteria is met
 */
export async function getfilteredItems(sizes, categories, conditions, demographics) {
  let { data: Items, error } = await supabase
    .from("Items")
    .select("*")
    .eq("swapped", "false")
    .in("size", sizes)
    .in("category", categories)
    .in("condition", conditions)
    .in("demographic", demographics);
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

export async function getItemImageIds(itemId) {
  // Fetch the image paths from the database
  let { data, error } = await supabase
    .from("ItemImages")
    .select("*")
    .eq("item_id", itemId);

  return { data, error };
}

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

export async function getImages(id) {
 
  const imageIds = await getItemImageIds(id);
  //console.log(imageIds);
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


export async function getImageLinks(id) {
  console.log('getting image ids');
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

async function runTest() {
  
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

//runTest()