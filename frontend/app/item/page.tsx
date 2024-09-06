"use client";

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import ItemImages from '../components/ItemImages';
import { getItem, getUserProfileImageUrl } from '../../service/items';

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

const Item = () => {
  const searchParams = useSearchParams(); // Use useSearchParams to get query params
  const itemId = searchParams.get('itemId'); // Get the itemId from the URL search params
  
  const [itemData, setItemData] = useState<ItemData | null>(null);
  const [profilePic, setProfilePic] = useState<string | null>(null); // State for profile picture
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchItemData = async () => {
      if (!itemId) return;
      setLoading(true);

      // Fetch item data using the itemId
      const { data, error } = await getItem(itemId);

      if (error) {
        console.error('Error fetching item:', error);
      } else {
        setItemData(data);

        // Fetch profile picture using owner_id and handle undefined return values
        const profilePicBlob = await getUserProfileImageUrl(data.owner_id);

        if (profilePicBlob) { // Only create URL if profilePicBlob is not null or undefined
          const profilePicUrl = URL.createObjectURL(profilePicBlob);
          setProfilePic(profilePicUrl); // Set the profile picture URL in the state
        } else {
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
        <p className="text-m my-2 text-gray-600">{itemData.size} • {itemData.condition} • {itemData.brand}</p>
        <div className="flex space-x-2">
          <button className="bg-indigo-700 hover:bg-indigo-800 text-white font-bold py-2 px-4 rounded-full">
            Make offer
          </button>

          <button className="bg-indigo-700 hover:bg-indigo-800 text-white p-2 rounded-full">
            <img src="flower.png" className="w-6 h-6" alt="flower icon" />
          </button>
        </div>

        <p className="text-gray-800 mt-4">{itemData.description}</p>

        {itemData.damage && (
          <p className="text-red-500 text-sm mt-2">
            <i className="fas fa-exclamation-circle"></i> {itemData.damage}
          </p>
        )}

        <p className="text-xs text-gray-500 mt-2">Listed {new Date(itemData.created_at).toLocaleString()}</p>

        <div className="flex justify-between items-center mt-4">
          <button className="bg-green-500 text-white px-4 py-2 rounded">Map</button>
          <div className="flex items-center space-x-2">
            
            {profilePic && <img src={profilePic} alt={itemData.ownerName} className="w-8 h-8 rounded-full" />}
            <div>
              <p className="text-sm font-bold">{itemData.ownerName}</p>
              <p className="text-xs text-gray-500">{itemData.ownerRating} ⭐</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Item;
