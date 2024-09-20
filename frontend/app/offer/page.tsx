// pages/make-offer.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { getListingsByUsers } from '../../service/items'; // Function to get user's items
import { createSwapRequest } from '../../service/swaps';
import { ItemData } from '../item/page';
import { getUserId } from '../../service/users';
import { useRouter } from 'next/navigation';


const MakeOffer = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const itemId = searchParams.get('itemId'); // Get the itemId of the item the user is making an offer on
  const ownerId = searchParams.get('ownerId');

  const [userItems, setUserItems] = useState<Array<ItemData>>([]); // To store the user's own listed items
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [message, setMessage] = useState<string>("");
  const [isPopupVisible, setIsPopupVisible] = useState(false); // For popup visibility
  const requestingUserId = '59cdfdd4-b276-4821-ac28-03b4a23acbd3'; // getUserId()

  useEffect(() => {
    // Fetch the user's items they can offer
    async function fetchUserItems() {
      const { data, error } = await getListingsByUsers([requestingUserId]); // Fetch the user's listed items
      
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

    try {
      // Here you would submit the offer to the backend
      // Send offer details including `itemId`, `selectedItemId`, and `message`
      console.log('Submitting offer');
      const result = await createSwapRequest([selectedItemId], [itemId], ownerId, requestingUserId);
      console.log("Offer Submitted:", result);

      // If the result is successful, show the popup
      setIsPopupVisible(true);

    } catch (error) {
      console.error("Error submitting offer:", error);
    }
  };

  const handlePopupClose = () => {
    setIsPopupVisible(false);
    // Redirect to the marketplace
    router.push('/marketplace');
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

      {/* Popup Modal */}
      {isPopupVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded-md shadow-md text-center">
            <h2 className="text-xl font-bold mb-4">Offer Submitted!</h2>
            <p>Your offer has been successfully submitted.</p>
            <button
              onClick={handlePopupClose}
              className="mt-4 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MakeOffer;