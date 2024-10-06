import React, { useState, useEffect } from "react";
import GenericButton from "../components/GenericButton";
import ItemImages from "../components/ItemImages"; // Import the updated ItemImages component
import { modifySwapRequest } from "../../service/swaps"; // Ensure this path is correct
import { getListingsByUsers } from "@/service/items"; // Function to fetch the user's items
import { getUserId } from "@/service/auth"; // Function to get the current user ID
import SuccessModal from "../components/SuccessModal";

interface UpdateSwapModalProps {
  isVisible: boolean;
  onClose: () => void;
  swapId: number;
  myItems: string[]; // These should be the other user's item IDs (what you are requesting)
  requestingItems: string[]; // These should be your item IDs (what you are offering)
  ownerId: string;
  requesterId: string;
  onUpdate: () => void;
}

const UpdateSwapModal: React.FC<UpdateSwapModalProps> = ({
  isVisible,
  onClose,
  swapId,
  myItems, // Other user's items
  requestingItems, // Your items
  ownerId,
  requesterId,
  onUpdate,
}) => {
  const [updatedMyItems, setUpdatedMyItems] = useState<number[]>([]); // The other user's items
  const [updatedRequestingItems, setUpdatedRequestingItems] = useState<number[]>([]); // Your items
  const [userItems, setUserItems] = useState<any[]>([]); // Store your available items to add
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [currentUserId, setCurrentUserId] = useState<string | null>(null); // Store the current user's ID
  const [showSuccessModal, setShowSuccessModal] = useState(false); // Success modal visibility state

  // Fetch the current user's ID and fetch their listings
  useEffect(() => {
    const fetchUserItems = async () => {
      const userId = await getUserId();
      setCurrentUserId(userId);

      // Fetch the user's listings if the userId is found
      if (userId) {
        const listings = await getListingsByUsers([userId]);
        setUserItems(listings?.data ?? []);
      }
    };

    fetchUserItems();
  }, []);

  // Use useEffect to set initial values of the state based on the passed props
  useEffect(() => {
    // Ensure myItems and requestingItems are treated as numbers
    setUpdatedMyItems(myItems.map(Number)); // Other user's items
    setUpdatedRequestingItems(requestingItems.map(Number)); // Your items
  }, [myItems, requestingItems]); // Run when myItems or requestingItems change

  // Function to handle removing an item from the swap (and add it back to available items)
  const handleRemoveMyItem = (itemId: number) => {
    setUpdatedRequestingItems((prevItems) => prevItems.filter((item) => item !== itemId));

    // Add the item back to the available userItems list
    const removedItem = userItems.find((item) => item.id === itemId);
    if (!removedItem) {
      setUserItems((prevItems) => [
        ...prevItems,
        { id: itemId }, // Add the item back as a new available item
      ]);
    }
  };

  // Function to handle adding an item to the swap (and remove it from available items)
  const handleAddMyItem = (itemId: number) => {
    if (!updatedRequestingItems.includes(itemId)) {
      setUpdatedRequestingItems((prevItems) => [...prevItems, itemId]);

      // Remove the item from the available userItems list
      setUserItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission behavior

    if (updatedRequestingItems.length === 0) {
      setErrorMessage("You cannot submit a swap with no offered items.");
      return;
    }

    const { data, error } = await modifySwapRequest(
      swapId,
      updatedRequestingItems, // Your updated offered items
      updatedMyItems, // The other user's items
      ownerId,
      requesterId
    );
    if (!error) {
      setShowSuccessModal(true); // Show success modal when swap is successful
      onUpdate(); // Call the onUpdate callback for any external updates
    } else {
      console.error(error);
    }
  };

  // Function to close both the success modal and the update modal
  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    onClose(); // Close the Update Swap Modal after closing the success modal
  };

  if (!isVisible) return null;

  return (<div
    className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-100" // Full screen overlay, centered modal
  >
    <div
      className="bg-white rounded-lg shadow-lg p-6 w-full max-w-3xl h-auto overflow-y-auto" // Centered modal with max width and height
      style={{ maxHeight: "90vh", marginTop: "20px", marginBottom: "20px" }} // Ensuring it doesn't go off-screen
    >
      <form 
        className="w-full" 
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Update Your Swap</h2>
  
        {/* Their Items Section */}
        <div className="mb-6">
          <h3 className="font-bold text-lg mb-2">Their Items</h3>
          <div className="flex flex-wrap gap-4">
            {updatedMyItems && updatedMyItems.length > 0 ? (
              updatedMyItems.map((item, index) => (
                <div key={index} className="relative w-32 h-40">
                  <ItemImages itemId={item} className="w-full h-full" />
                </div>
              ))
            ) : (
              <p>No items to display.</p>
            )}
          </div>
        </div>
  
        {/* Your Items Section */}
        <div className="mb-6">
          <h3 className="font-bold text-lg mb-2">Your Items</h3>
          <div className="flex flex-wrap gap-4">
            {updatedRequestingItems && updatedRequestingItems.length > 0 ? (
              updatedRequestingItems.map((item, index) => (
                <div key={index} className="relative w-32 h-40">
                  <ItemImages itemId={item} className="w-full h-full" />
                  <button
                    type="button"
                    onClick={() => handleRemoveMyItem(item)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                  >
                    &times;
                  </button>
                </div>
              ))
            ) : (
              <p>No items to display.</p>
            )}
          </div>
        </div>
  
        {/* Add More of Your Items Section */}
        <div className="mb-6">
          <h3 className="font-bold text-lg mb-2">Add More of Your Items</h3>
          <div className="flex flex-wrap gap-4">
            {userItems && userItems.length > 0 ? (
              (() => {
                const filteredItems = userItems.filter(
                  (item) => !updatedRequestingItems.includes(item.id)
                );
                return filteredItems.length > 0 ? (
                  filteredItems.map((item) => (
                    <div key={item.id} className="relative w-32 h-40">
                      <ItemImages itemId={item.id} className="w-full h-full" />
                      <button
                        type="button"
                        onClick={() => handleAddMyItem(item.id)}
                        className="absolute bottom-2 right-2 bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                      >
                        +
                      </button>
                    </div>
                  ))
                ) : (
                  <p>No items available to add.</p>
                );
              })()
            ) : (
              <p>No items available to add.</p>
            )}
          </div>
        </div>
  
        {/* Error Message */}
        {errorMessage && (
          <p className="text-red-500 mb-6 text-center">{errorMessage}</p>
        )}
  
        {/* Buttons */}
        <div className="flex justify-end space-x-4">
          <GenericButton text="Cancel" click={onClose} inverse={true} />
          <button
            type="submit"
            className="bg-blue-500 text-white rounded-lg px-6 py-2"
            disabled={updatedRequestingItems.length === 0}
          >
            Update Swap
          </button>
        </div>
      </form>
  
      {/* Success Modal */}
      {showSuccessModal && <SuccessModal onClose={handleCloseSuccessModal} />}
    </div>
  </div>
  
  )
};

export default UpdateSwapModal;
