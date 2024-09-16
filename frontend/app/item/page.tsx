"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import ItemImages from "../components/ItemImages";
import { getItem, getUserProfileImageUrl } from "../../service/items";

interface ItemData {
  id: number;
  created_at: string;
  size: string;
  condition: string;
  category: string;
  swapped: boolean;
  owner_id: string;
  demographic: string;
  brand: string | null;
  caption: string | null;
  title: string;
  description: string;
  damage: string | null;
  location: string;
  ownerName: string;
  ownerRating: number;
  imageUrl: string;
}

interface ItemRatingProps {
  ownerRating: number;
}

const ItemRating: React.FC<ItemRatingProps> = ({ ownerRating }) => {
  // Generate the stars string
  const filledStars = "✭".repeat(ownerRating);
  const emptyStars = "✩".repeat(5 - ownerRating);

  return (
    <div className="text-xl">
      {filledStars}
      {emptyStars}
    </div>
  );
};

const Item = () => {
  const searchParams = useSearchParams(); // Use useSearchParams to get query params
  const itemId = searchParams.get("itemId"); // Get the itemId from the URL search params

  const [itemData, setItemData] = useState<ItemData | null>(null);
  const [profilePic, setProfilePic] = useState<string | null>(null); // State for profile picture
  const [loading, setLoading] = useState<boolean>(true);

  /**
   *  {profilePic && <img src={profilePic} alt={itemData.ownerName} className="w-16 h-16 rounded-full" />}
   */
  useEffect(() => {
    const fetchItemData = async () => {
      if (!itemId) return;
      setLoading(true);

      // Fetch item data using the itemId
      const { data, error } = await getItem(itemId);

      if (error) {
        console.error("Error fetching item:", error);
      } else {
        data.ownerRating = 5;
        setItemData(data);

        // Fetch profile picture using owner_id and handle undefined return values
        const profilePicBlob = await getUserProfileImageUrl(data.owner_id);
        console.log(profilePicBlob);
        console.log("pROFILE PICS ABOVE");
        if (profilePicBlob) {
          // Only create URL if profilePicBlob is not null or undefined
          const profilePicUrl = URL.createObjectURL(profilePicBlob);
          setProfilePic(profilePicUrl); // Set the profile picture URL in the state
        } else {
          console.log("NO PRIFLE PICS !!!!!!!!!");
          setProfilePic(null); // Handle the case where no profile picture is available
        }
      }

      setLoading(false);
    };

    fetchItemData();
  }, [itemId]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!itemData) {
    return <p>Item not found.</p>;
  }

  return (
    <div className="min-h-screen bg-white flex">
      <div className="w-1/2 flex flex-col items-center justify-center relative my-20 space-y-4">
        <ItemImages itemId={itemData.id} />
      </div>

      <div className="p-4 w-1/2 my-20">
        <h1 className="text-3xl font-bold">{itemData.title}</h1>
        <p className="text-m my-2 text-gray-600">
          {itemData.size} • {itemData.condition} • {itemData.brand}
        </p>
        <div className="flex space-x-2">
          <button className="bg-indigo-700 hover:bg-indigo-800 text-white font-bold py-2 px-4 rounded-full">
            Make offer
          </button>

          <button className="bg-indigo-700 hover:bg-indigo-800 text-white p-2 rounded-full">
            <img src="flower.png" className="w-6 h-6" alt="flower icon" />
          </button>

          <button className="bg-indigo-700 hover:bg-indigo-800 text-white p-2 rounded-lg">
            <img src="flower.png" className="w-6 h-6"></img>
          </button>

          <button className="bg-indigo-700 hover:bg-indigo-800 text-white p-2 rounded-lg">
            <img src="flower.png" className="w-6 h-6"></img>
          </button>
        </div>

        <hr className="border-gray-600 w-3/4 mt-2"></hr>
        <p className="text-gray-800 mt-4">{itemData.description}</p>

        {itemData.damage && (
          <div className="flex items-center text-sm text-gray-800 mt-2">
            <img src="exclamation-mark.png" className="w-6 h-6 mr-3"></img>
            <span>Damage: {itemData.damage}</span>
          </div>
        )}
        <p className="text-xs text-gray-500 mt-2">
          Listed {new Date(itemData.created_at).toLocaleString()}
        </p>

        <div className="mt-4">
          <div className="bg-green-300 rounded-lg w-3/4 h-24 flex items-center justify-center text-center mb-2">
            <span className="text-black font-bold">Map</span>
          </div>
          <p className="text-sm text-gray-700 mb-2">{itemData.location}</p>
          <hr className="border-gray-600 w-3/4"></hr>

          <div className="flex items-center my-4">
            {profilePic && (
              <img
                src={profilePic}
                alt="Owner Avatar"
                className="w-12 h-12 rounded-full mr-4"
              />
            )}
            <div>
              <p className="text-black font-semibold">{itemData.ownerName}</p>
              <div className="flex items-center text-sm text-gray-700">
                <ItemRating ownerRating={itemData.ownerRating} />
                <span className="ml-1">(8)</span>
              </div>
            </div>
          </div>

          <div className="flex space-x-2">
            <button className="border border-indigo-800 text-indigo-800 font-semibold px-10 py-2 rounded-lg mr-2 hover:bg-indigo-50">
              Visit Shop
            </button>
            <button className="border border-indigo-800 text-indigo-800 font-semibold px-10 py-2 rounded-lg hover:bg-indigo-50">
              Ask a question
            </button>
          </div>

          <div className="flex space-x-2">
            <button className="border border-indigo-800 text-indigo-800 font-semibold px-10 py-2 rounded-lg mr-2 hover:bg-indigo-50">
              Visit Shop
            </button>
            <button className="border border-indigo-800 text-indigo-800 font-semibold px-10 py-2 rounded-lg hover:bg-indigo-50">
              Ask a question
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Item;
