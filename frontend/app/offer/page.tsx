// pages/make-offer.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { getListingsByUsers } from '../../service/items'; // Function to get user's items
import { ItemData } from '../item/page';

const MakeOffer = () => {
  const searchParams = useSearchParams();
  const itemId = searchParams.get('itemId'); // Get the itemId of the item the user is making an offer on

  const [userItems, setUserItems] = useState<Array<ItemData>>([]); // To store the user's own listed items
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    // Fetch the user's items they can offer
    async function fetchUserItems() {
      const { data, error } = await getListingsByUsers(['']); // Fetch the user's listed items
      if (error || data == null) {
        console.error("Error fetching user items:", error);
      } else {
        setUserItems(data);
      }
    }

    fetchUserItems();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedItemId) {
      alert("Please select an item to offer.");
      return;
    }

    // Here you would submit the offer to the backend
    // Send offer details including `itemId`, `selectedItemId`, and `message`

    console.log("Offer Submitted:", { itemId, selectedItemId, message });
    // Redirect or display success message
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mb-4">Make an Offer</h1>
      <form className="w-1/2 bg-gray-100 p-4 rounded-lg shadow" onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Select an Item to Offer</label>
          <select
            value={selectedItemId || ""}
            onChange={(e) => setSelectedItemId(e.target.value)}
            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="">-- Select an Item --</option>
            {userItems.map((item) => (
              <option key={item.id} value={item.id}>
                {item.title} - {item.size} ({item.condition})
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Message</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            rows={3}
            placeholder="Add a message to your offer..."
          />
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md"
          >
            Submit Offer
          </button>
        </div>
      </form>
    </div>
  );
};

export default MakeOffer;
