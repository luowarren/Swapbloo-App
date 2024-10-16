"use client";

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { getListingsByUsers } from '../../service/items'; // Function to get user's items
import { createSwapRequest } from '../../service/swaps';
import { ItemData } from '../item/page';
import { getUserId } from '../../service/auth';
import { useRouter } from 'next/navigation';
import { getChatBetweenUsers, getOrCreateChatBetweenUsers } from '@/service/chat';
import ItemImages from "../components/ItemImages";

const MakeOffer = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const itemId = searchParams.get('itemId'); // Get the itemId of the item the user is making an offer on
  const ownerId = searchParams.get('ownerId');

  const [userItems, setUserItems] = useState<Array<ItemData>>([]); // To store the user's own listed items
  const [selectedItemIds, setSelectedItemIds] = useState<number[]>([]); // Store selected items for the offer
  const [userId, setUserId] = useState<string | null>(null);
  const [isPopupVisible, setIsPopupVisible] = useState(false); // For popup visibility
  const [chatId, setChatId] = useState<string | null>(null); // Store chatId
  
  // Fetch the user ID
  useEffect(() => {
    async function fetchUser() {
      const id = await getUserId();
      if (id != null) {
        setUserId(id); // Set userId state once it is fetched
      }
    }
    fetchUser();
  }, []);

  // Fetch user's listed items once userId is available
  useEffect(() => {
    if (!userId) return; // Only fetch items when userId is available

    async function fetchUserItems() {
      const { data, error } = await getListingsByUsers([userId], false);
      console.log(data, "88888")
      if (error || data == null) {
        console.error("Error fetching user items:", error);
      } else {
        setUserItems(data); // Set userItems state
      }
    }

    fetchUserItems();
  }, [userId]);

  // Handle adding an item to the offer
  const handleAddItem = (itemId: number) => {
    if (!selectedItemIds.includes(itemId)) {
      setSelectedItemIds([...selectedItemIds, itemId]); // Add item to selected list
    }
  };

  // Handle removing an item from the offer
  const handleRemoveItem = (itemId: number) => {
    setSelectedItemIds(selectedItemIds.filter(id => id !== itemId)); // Remove item from selected list
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedItemIds.length === 0) {
      alert("Please select at least one item to offer.");
      return;
    }

    try {
      // Submit the offer
      const requestingUserId = userId;
      if (!requestingUserId) {
        alert("Unable to retrieve your user information.");
        return;
      }

      // Create the swap request
      let { data: Swap, error} = await createSwapRequest(selectedItemIds, [itemId], requestingUserId, ownerId);
      console.log("swap requester", Swap)

      Swap = (Swap && Swap.length > 0) ? Swap[0] : Swap;
      // If successful, show the popup
      setIsPopupVisible(true);

      if (ownerId && userId) {
        fetchChatId(ownerId, userId, Swap.id); // Fetch chatId when ownerId and userId are available
      }
    } catch (error) {
      console.error("Error submitting offer:", error);
    }
  };

  const fetchChatId = async (ownerId: string, userId: string, swap_id: number) => {
    try {
      console.log(ownerId, userId, "9999")
      const { chatId, chatError } = await getOrCreateChatBetweenUsers(ownerId, userId, swap_id); // Fetch the chat
      if (chatId) {
        setChatId(chatId); // Store the chatId in state
      } else {
        setChatId(swap_id)
        console.error("No chat found between the users9999", chatError);
      }
    } catch (error) {
      console.error("Error fetching chat:9999", error);
    } 
  };

  console.log(chatId, "chatting like alphas together 222222222")
  const handlePopupClose = () => {
    setIsPopupVisible(false);
    fetchChatId(ownerId, userId);
    router.push(`/chats?chatId=${chatId}`); // Redirect to the chat page with the chat ID
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mb-4">Make an Offer</h1>
      <form className="w-1/2 bg-gray-100 p-4 rounded-lg shadow" onSubmit={handleSubmit}>
        {/* Your Items Section */}
        <div className="mb-6">
          <h3 className="font-bold text-lg mb-2">Your Items</h3>
          <div className="flex flex-wrap gap-4">
            {selectedItemIds.length > 0 ? (
              selectedItemIds.map((itemId, index) => (
                <div key={index} className="relative w-32 h-40">
                  <ItemImages itemId={itemId} className="w-full h-full" />
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(itemId)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                  >
                    &times;
                  </button>
                </div>
              ))
            ) : (
              <p>No items selected for offer.</p>
            )}
          </div>
        </div>

        {/* Add More of Your Items Section */}
        <div className="mb-6">
          <h3 className="font-bold text-lg mb-2">Add More of Your Items</h3>
          <div className="flex flex-wrap gap-4">
            {userItems.length > 0 ? (
              userItems
                .filter(item => !selectedItemIds.includes(item.id))
                .map((item) => (
                  <div key={item.id} className="relative w-32 h-40">
                    <ItemImages itemId={item.id} className="w-full h-full" />
                    <button
                      type="button"
                      onClick={() => handleAddItem(item.id)}
                      className="absolute bottom-2 right-2 bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                ))
            ) : (
              <p>No items available to add.</p>
            )}
          </div>
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
