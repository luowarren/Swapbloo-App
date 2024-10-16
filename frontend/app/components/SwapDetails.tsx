import React, { useState, useEffect } from "react";
import ItemPreview from "../components/ItemPreview";
import GenericButton from "../components/GenericButton";
import { ArrowRightLeft } from "lucide-react";
import UpdateSwapModal from "../components/UpdateSwapModal";
import ItemImages from "./ItemImages";
import AcceptOfferModal from "./AcceptOfferModal";
import {
  getSwapDetailsBetweenUsers,
  incrementSwapCount,
  updateSwapStatus,
  deleteChat,
} from "@/service/swaps";
import { getUserId } from "@/service/auth";

interface SwapDetailsProps {
  ownerId: string | null;
  requesterId: string | null;
}

const SwapDetails: React.FC<SwapDetailsProps> = ({ ownerId, requesterId }) => {
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
        const { swapExists, user1Items, user2Items, swapId, status, swap } =
          await getSwapDetailsBetweenUsers(ownerId, requesterId);
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

  const handleSwapUpdate = async () => {
    await fetchSwapDetails();
  };

  async function acceptSwap(swapId: number, itemIds: number[]) {
    await updateSwapStatus(swapId, "Accepted", itemIds);
    await incrementSwapCount(requesterId);
    await incrementSwapCount(ownerId);

  }

  async function rejectSwap(swapId: number) {
    try {
      await deleteChat(swapId);
      await updateSwapStatus(swapId, "Rejected", []);
      setRejected(true);
    } catch (error) {
      console.error("Error rejecting swap:", error);
    }
  }

  async function withdrawOffer(swapId: number) {
    try {
      await deleteChat(swapId);
      await updateSwapStatus(swapId, "Withdrawn", []);
      setWithdrawn(true);
    } catch (error) {
      console.error("Error withdrawing offer:", error);
    }
  }

  if (
    !swapExists ||
    !ownerId ||
    !requesterId ||
    myItems.length < 1 ||
    requestingItems.length < 1
  ) {
    return null;
  }

  if (isRequester === null || !swapExists) {
    return null;
  }

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
        <div className="font-bold text-xl mb-4">
          Waiting for the other person to accept or reject
        </div>
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
            justifyContent: "center",
            alignItems: "center",
            // maxWidth: "60%",
            width: "fit",
            flexWrap: "wrap",
          }}
        >
          {myItems.map((itemId, index) => (
            <div style={{ width: "100px", margin: "5px 5px", borderRadius: "8px" }}>
              <ItemImages key={index} itemId={itemId} className="" />
            </div>
          ))}
        </div>
        <ArrowRightLeft />
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-evenly",
            alignItems: "center",
            // maxWidth: "60%",
            flexWrap: "wrap",
          }}
        >
          {requestingItems.map((itemId, index) => (
            <div style={{ width: "100px", margin: "5px 5px", borderRadius: "8px" }}>
              <ItemImages key={index} itemId={itemId} className="" />
            </div>
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
          <UpdateSwapModal
            isVisible={true}
            onClose={() => setModalOpen(false)}
            swapId={swapId}
            myItems={requestingItems}
            requestingItems={myItems}
            ownerId={ownerId}
            requesterId={requesterId}
            onUpdate={handleSwapUpdate}
          >
            <GenericButton text="Update Offer"></GenericButton>
          </UpdateSwapModal>
        )}

        {!isRequester && !accepted && !rejected && !withdrawn && (
          <AcceptOfferModal otherUser={requesterId} onClose={() => setAccepted(true)}>
            <GenericButton
              text="Accept Offer"
              click={async () => {
                await acceptSwap(swapId, [...myItems, ...requestingItems]);
              }}
            />
          </AcceptOfferModal>
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
      <AcceptOfferModal otherUser={ownerId}>
        <GenericButton text="Leave a rating" />
      </AcceptOfferModal>
    </div>
  );
};

export default SwapDetails;
