import React, { useState, useEffect } from "react";
import ItemPreview from "../components/ItemPreview"; // Ensure this component works to display the images
import GenericButton from "../components/GenericButton";
import { ArrowRightLeft } from "lucide-react"; // Arrow component you are using
import UpdateSwapModal from "../components/UpdateSwapModal"; // Import your modal for updating the swap
import ItemImages from "./ItemImages";
import { getSwapDetailsBetweenUsers, updateSwapStatus } from "@/service/swaps";
import { getUserId } from "@/service/auth";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { faL } from "@fortawesome/free-solid-svg-icons";

interface SwapDetailsProps {
    ownerId: string | null;
    requesterId: string | null;
}
  
function onSwapUpdate() {
  return (
    <DialogContent>
      <div> Successfull swap update</div>
    </DialogContent>
  )
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
  const [swapId, setSwapId] = useState<string | null>(null);
  const [isUpdateSwapModalVisible, setIsUpdateSwapModalVisible] = useState(false); // Modal state here
 
  useEffect(() => {
    setSwapExists(false)
    setAccepted(false)
    // Ensure that ownerId and requesterId are available before running this
    if (ownerId && requesterId) {
      console.log("ownerId:", ownerId, "requesterId:", requesterId);

      // Fetch and set the current user ID and swap details on component mount
      const fetchUserIdAndSwapDetails = async () => {
        const userId = await getUserId();
        setCurrentUserId(userId);

        if (userId) {
          // Fetch the swap details between the two users
          const { swapExists, user1Items, user2Items, swapId, status } = await getSwapDetailsBetweenUsers(requesterId, ownerId);
          
          if (swapExists) {
            setSwapExists(true)
            setSwapId(swapId);
            if (status == "Accepted") {
              setAccepted(true)
            }

            
            // Determine if the logged-in user is the requester or accepter
            if (userId === requesterId) {
              // If the logged-in user is the requester
              setMyItems(user2Items || []); // Your items
              setRequestingItems(user1Items || []); // The other user's items
            } else if (userId === ownerId) {
              // If the logged-in user is the owner/accepter
              setMyItems(user1Items || []); // Your items
              setRequestingItems(user2Items || []); // The other user's items
            }
          } else {
            setSwapExists(false); // Set swapExists to false if no swap exists
          }
        }
      };

      fetchUserIdAndSwapDetails();
    }
  }, [ownerId, requesterId]); // Run when `ownerId` or `requesterId` changes


  async function acceptSwap(swapId: number) {
    updateSwapStatus(swapId, "Accepted");
    onSwapUpdate();
    setAccepted(true);
  }

  console.log("simgrig55555555555555555", swapExists, ownerId, requesterId)
  
  // useEffect(() => {

  // }, [myItems, requestingItems]);

  // Don't render the component if no swap exists or if ownerId/requesterId is null
  if (!swapExists || !ownerId || !requesterId) {
    return null;
  }

  return ( 
   <div className="w-full bg-white text-black p-4 rounded-lg shadow-lg text-2xl font-bold flex flex-col items-center border mb-4 z-500">
      <div className="font-bold text-2xl mb-4">Swap Details</div>
      {accepted ? (
          <div className="font-bold text-xl mb-4">Offer Accepted!</div>
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
              <ItemImages itemId={itemId} className="" /> // Display each item image for your items
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
              <ItemImages itemId={itemId} className="" /> // Display each item image for the requested items
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
        {accepted ? (
          <GenericButton text="Update Offer" noClick={true} />
        ) : (
          <Dialog open={modalOpen} onOpenChange={setModalOpen}>
            <DialogTrigger asChild>
            {/* <GenericButton
            text="Update Offer"
            // click={() => setIsUpdateSwapModalVisible(true)}
            /> */}
            <div className="text-sm p-2 bg-indigo-700 text-white rounded-md cursor-pointer">Update Offer</div>
            </DialogTrigger>
            <DialogContent className="min-w-[80%] min-h-[80%]" >
            <div>  </div>
              <UpdateSwapModal
                  isVisible={true} // Modal visibility from parent state
                  onClose={() => setModalOpen(false)} // Close modal when done
                  swapId={swapId}
                  myItems={myItems} // Your items
                  requestingItems={requestingItems} // Their items
                  ownerId={ownerId}
                  requesterId={requesterId}
                  onUpdate={() => setModalOpen(false)} // Handle post-update logic here
                />
               
            </DialogContent>
          </Dialog>
          
        )}

        {/* Update Swap Modal */}
        {/* <UpdateSwapModal
          isVisible={isUpdateSwapModalVisible} // Modal visibility from parent state
          onClose={() => setIsUpdateSwapModalVisible(false)} // Close modal when done
          swapId={swapId}
          myItems={myItems} // Your items
          requestingItems={requestingItems} // Their items
          ownerId={ownerId}
          requesterId={requesterId}
          onUpdate={() => console.log("Swap updated!")} // Handle post-update logic here
        /> */}

        {accepted ? (
          <GenericButton text="Accepted Offer" noClick={true} />
        ) : (
          <GenericButton
            text="Accept Offer"
            click={async () => {
              await acceptSwap(swapId);
              setAccepted(true);
              // Trigger notification or post-accept logic
              console.log("Offer accepted");
            }}
          />
        )}
      </div>
    </div>
  );
};

export default SwapDetails;
