import React, { useState, useEffect } from "react";
import ItemPreview from "../components/ItemPreview";
import GenericButton from "../components/GenericButton";
import { ArrowRightLeft } from "lucide-react";
import UpdateSwapModal from "../components/UpdateSwapModal";
import ItemImages from "./ItemImages";
import { getSwapDetailsBetweenUsers, incrementSwapCount, updateSwapStatus, deleteChat } from "@/service/swaps";
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
  const [rejected, setRejected] = useState(false);
  const [withdrawn, setWithdrawn] = useState(false); // Track withdrawal state
  const [myItems, setMyItems] = useState<string[]>([]);
  const [requestingItems, setRequestingItems] = useState<string[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [swapExists, setSwapExists] = useState<boolean>(true);
  const [swapId, setSwapId] = useState<number | null>(null);
  const [isRequester, setIsRequester] = useState<boolean | null>(null);

  const fetchSwapDetails = async () => {
    if (ownerId && requesterId) {
      const userId = await getUserId();
      setCurrentUserId(userId);

      if (userId) {
        const { swapExists, user1Items, user2Items, swapId, status, swap } = await getSwapDetailsBetweenUsers(ownerId, requesterId);
        console.log('sigma 698888', user1Items, ownerId);
        if (swapExists) {
          const realReqId = swap.requester_id;

          setIsRequester(userId === realReqId);
          setSwapExists(true);
          setSwapId(swapId);

          if (status === "Accepted") setAccepted(true);
          else if (status === "Rejected") setRejected(true);
          else if (status === "Withdrawn") setWithdrawn(true);

          setMyItems(user1Items || []);
          setRequestingItems(user2Items || []);
        } else {
          setSwapExists(false);
        }
      }
    }
  };

  useEffect(() => {
    fetchSwapDetails();
  }, [ownerId, requesterId]);

  useEffect(() => {
    console.log("isRequester updated to:", isRequester);
  }, [isRequester]);

  const handleSwapUpdate = async () => {
    await fetchSwapDetails();
    setModalOpen(false);
  };

  async function acceptSwap(swapId: number, itemIds: number[]) {
    await updateSwapStatus(swapId, "Accepted", itemIds);
    await incrementSwapCount(requesterId);
    await incrementSwapCount(ownerId);

    setAccepted(true);
    console.log("Offer accepted");
  }

  async function rejectSwap(swapId: number) {
    try {
      await deleteChat(swapId);
      await updateSwapStatus(swapId, "Rejected", []);
      setRejected(true);
      console.log("Swap rejected");
    } catch (error) {
      console.error("Error rejecting swap:", error);
    }
  }

  async function withdrawOffer(swapId: number) {
    try {
      await deleteChat(swapId);
      await updateSwapStatus(swapId, "Withdrawn", []);
      setWithdrawn(true);
      console.log("Offer withdrawn");
    } catch (error) {
      console.error("Error withdrawing offer:", error);
    }
  }

  if (!swapExists || !ownerId || !requesterId || myItems.length < 1 || requestingItems.length < 1) {
    return null;
  }

  if (isRequester === null || !swapExists) {
    return null;
  }

  console.log("i am ", isRequester, "ly the requester");

  return (
    <div className="w-full bg-white text-black p-4 rounded-lg shadow-lg text-2xl font-bold flex flex-col items-center border mb-4 z-500">
      <div className="font-bold text-2xl mb-4">Swap Details</div>
      {accepted ? (
        <div className="font-bold text-xl mb-4">Offer Accepted!</div>
      ) : rejected ? (
        <div className="font-bold text-xl mb-4">Offer Rejected</div>
      ) : withdrawn ? (
        <div className="font-bold text-xl mb-4">Offer Withdrawn</div>
      ) : isRequester ? (
        <div className="font-bold text-xl mb-4">Waiting for the other person to accept or reject</div>
      ) : (
        <div></div>
      )}
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
          {myItems.map((itemId, index) => (
            <ItemImages key={index} itemId={itemId} className="" />
          ))}
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
          {requestingItems.map((itemId, index) => (
            <ItemImages key={index} itemId={itemId} className="" />
          ))}
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
        {!accepted && !rejected && !withdrawn && (
          <Dialog open={modalOpen} onOpenChange={setModalOpen}>
            <DialogTrigger asChild>
              <div className="text-sm p-2 bg-indigo-700 text-white rounded-md cursor-pointer">
                Update Offer
              </div>
            </DialogTrigger>
            <DialogContent className="min-w-[80%] min-h-[80%]">
              <UpdateSwapModal
                isVisible={true}
                onClose={() => setModalOpen(false)}
                swapId={swapId}
                myItems={myItems}
                requestingItems={requestingItems}
                ownerId={ownerId}
                requesterId={requesterId}
                onUpdate={handleSwapUpdate}
              />
            </DialogContent>
          </Dialog>
        )}

        {!isRequester && !accepted && !rejected && !withdrawn && (
          <GenericButton
            text="Accept Offer"
            click={async () => {
              await acceptSwap(swapId, [...myItems, ...requestingItems]);
            }}
          />
        )}

        {isRequester && !accepted && !rejected && !withdrawn && (
          <GenericButton
            text="Withdraw Offer"
            click={async () => {
              await withdrawOffer(swapId);
            }}
          />
        )}

        {accepted && <GenericButton text="Accepted Offer" noClick={true} />}
      </div>
    </div>
  );
};

export default SwapDetails;
