import React, { useState, useEffect } from "react";
import ItemPreview from "../components/ItemPreview";
import GenericButton from "../components/GenericButton";
import { ArrowRightLeft } from "lucide-react";
import UpdateSwapModal from "../components/UpdateSwapModal";
import ItemImages from "./ItemImages";
import { getSwapDetailsBetweenUsers, updateSwapStatus } from "@/service/swaps";
import { getUserId } from "@/service/auth";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

interface SwapDetailsProps {
    ownerId: string | null;
    requesterId: string | null;
}

const SwapDetails: React.FC<SwapDetailsProps> = ({
  ownerId,
  requesterId,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [myItems, setMyItems] = useState<string[]>([]); // Your items
  const [requestingItems, setRequestingItems] = useState<string[]>([]); // Other user's items
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [swapExists, setSwapExists] = useState<boolean>(true); // State to track if the swap exists
  const [swapId, setSwapId] = useState<number | null>(null);
  const [isRequester, setIsRequester] = useState<boolean | null>(null);

  console.log('ownerid sigma 698888', ownerId, requesterId)
  const fetchSwapDetails = async () => {
    if (ownerId && requesterId) {
      const userId = await getUserId();
      setCurrentUserId(userId);

      if (userId) {
        const { swapExists, user1Items, user2Items, swapId, status, swap } = await getSwapDetailsBetweenUsers(ownerId, requesterId);
        console.log('sigma 698888', user1Items, ownerId)
        if (swapExists) {
          const realReqId = swap.requester_id;

          // Check if current user is the requester
          setIsRequester(userId === realReqId);
          
          setSwapExists(true);
          setSwapId(swapId);
          if (status === "Accepted") {
            setAccepted(true);
          }

          setMyItems(user1Items || []); // Requester's items (myItems)
          setRequestingItems(user2Items || []); // Accepter's items (requestingItems)
          // Determine if the logged-in user is the requester or accepter
          // if (userId === realReqId) {
          //   setMyItems(user1Items || []); // Requester's items (myItems)
          //   setRequestingItems(user2Items || []); // Accepter's items (requestingItems)
          // } else if (userId === ownerId) {
          //   setMyItems(user1Items || []); // Accepter's items (myItems)
          //   setRequestingItems(user2Items || []); // Requester's items (requestingItems)
          // }
        } else {
          setSwapExists(false);
        }
      }
    }
  };

  useEffect(() => {
    fetchSwapDetails();
  }, [ownerId, requesterId]); // Re-run when `ownerId` or `requesterId` changes

  // New useEffect hook to log isRequester after it's updated
  useEffect(() => {
    console.log("isRequester updated to:", isRequester);
  }, [isRequester]);

  // Callback function for updating the swap details after a successful update
  const handleSwapUpdate = async () => {
    await fetchSwapDetails(); // Re-fetch the swap details to get updated information
    setModalOpen(false); // Close the modal after the update
  };

  async function acceptSwap(swapId: number, itemIds: number[]) {
    await updateSwapStatus(swapId, "Accepted", itemIds);
    setAccepted(true);
    console.log("Offer accepted");
  }
  

  // If no swap exists, return null
  if (!swapExists || !ownerId || !requesterId || myItems.length < 1 || requestingItems.length < 1) {
    return null;
  }

   // Don't render anything until we know if the current user is the requester
   if (isRequester === null || !swapExists) {
    return null; // Waiting for data, don't render yet
  }

  console.log("i am ", isRequester, "ly the requester")


  return ( 
   <div className="w-full bg-white text-black p-4 rounded-lg shadow-lg text-2xl font-bold flex flex-col items-center border mb-4 z-500">
      <div className="font-bold text-2xl mb-4">Swap Details</div>
      {accepted ? (
          <div className="font-bold text-xl mb-4">Offer Accepted!</div>
        ) : isRequester ? (
          <div className="font-bold text-xl mb-4">Waiting for the other person to accept</div>
        ) : (
          <div></div>
        )
      }
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: "1em",
          width: "100%",
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-evenly",
            alignItems: "center",
            maxWidth: "100px",
            flexWrap: "wrap",
          }}
        >
          {myItems.length > 0 ? (
            myItems.map((itemId, index) => (
              <ItemImages key={index} itemId={itemId} className="" /> // Display each item image for your items
            ))
          ) : (
            <p>No items to display</p>
          )}
          
        </div>
        <ArrowRightLeft />
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-evenly",
            alignItems: "center",
            maxWidth: "100px",
            flexWrap: "wrap",
          }}
        >
          {requestingItems.length > 0 ? (
            requestingItems.map((itemId, index) => (
              <ItemImages key={index} itemId={itemId} className="" /> // Display each item image for the requested items
            ))
          ) : (
            <p>No items to display</p>
          )}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-around",
          width: "50%",
        }}
      >
        {!accepted && (
          
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogTrigger asChild>
          <div className="text-sm p-2 bg-indigo-700 text-white rounded-md cursor-pointer">
            Update Offer
          </div>
        </DialogTrigger>
        <DialogContent className="min-w-[80%] min-h-[80%]">
          <UpdateSwapModal
            isVisible={true} // Modal visibility from parent state
            onClose={() => setModalOpen(false)} // Close modal when done
            swapId={swapId}
            myItems={myItems} // Your items
            requestingItems={requestingItems} // Their items
            ownerId={ownerId}
            requesterId={requesterId}
            onUpdate={handleSwapUpdate} // Handle post-update logic here
          />
        </DialogContent>
      </Dialog>
        )}

        {/* Only show Accept Offer button if the current user is not the requester and the offer isn't already accepted */}
        {!isRequester && !accepted && (
          <GenericButton
            text="Accept Offer"
            click={async () => {
              await acceptSwap(swapId, [...myItems, ...requestingItems]);
              setAccepted(true);
            }}
          />
        )}

        {/* Display the Accepted Offer button if the offer has been accepted */}
        {accepted && <GenericButton text="Accepted Offer" noClick={true} />}
      </div>
    </div>
  );
};

export default SwapDetails;
