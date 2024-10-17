import React, { useState, useEffect } from "react";
import ItemPreview from "../components/ItemPreview";
import GenericButton from "../components/GenericButton";
import { ArrowRightLeft, ChevronsLeftRight } from "lucide-react";
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
import { Dialog, DialogContent, DialogTrigger } from "@radix-ui/react-dialog";

interface SwapDetailsProps {
  ownerId: string | null;
  requesterId: string | null;
}

const SwapDetails: React.FC<SwapDetailsProps> = ({ ownerId, requesterId }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [succModalOpen, setsuccModalOpen] = useState(false);
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
          setAccepted(false);

          if (status === "Accepted") setAccepted(true);
          else if (status === "Rejected") setRejected(true);
          else if (status === "Withdrawn") setWithdrawn(true);

          if (userId == ownerId) {
            console.log("I am the requester", ownerId, user1Items, user2Items);
            setMyItems(user1Items || []); // Requester's items (myItems)
            setRequestingItems(user2Items || []); // Accepter's items (requestingItems)
          } else {
            setMyItems(user2Items || []); // Accepter's items (myItems)
            setRequestingItems(user1Items || []); // Requester's items (requestingItems)
          }
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

  function closeItUp() {
    setsuccModalOpen(!modalOpen);
    setAccepted(!accepted);
  }

  useEffect(() => {
    if (succModalOpen == false) {
      setAccepted(true);
    }
  }, [succModalOpen]);

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

  console.log("please i have not accepted", accepted);

  return (
    <div className="w-full bg-white text-black p-4 text-2xl font-bold flex flex-col items-center z-500">
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "start",
          alignItems: "center",
          width: "100%",
          flexWrap: "wrap",
        }}
        className="gap-5 ml-4 "
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
            <div
              className={
                "w-14 h-14 overflow-hidden rounded-full bg-gray-200 border-2 border-indigo-500 -mx-4"
              }
            >
              <div className="scale-125">
                <ItemImages key={index} itemId={itemId} className="" />
              </div>
            </div>
          ))}
        </div>
        <ChevronsLeftRight className="text-indigo-500" />
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
            <div
              className={
                "w-14 h-14 overflow-hidden rounded-full bg-gray-200 border-2 -mx-4 border-indigo-500"
              }
            >
              <div className="scale-125">
                <ItemImages key={index} itemId={itemId} className="" />
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-col">
          <div className="text-base font-medium text-gray-500">
            Swap incoming
          </div>
          {accepted ? (
            <div className="font-medium px-3 py-[2px] rounded-full bg-green-200 text-green-800 text-sm">
              Offer withdrawn
            </div>
          ) : rejected ? (
            <div className="font-medium px-3 py-[2px] rounded-full bg-red-200 text-red-800 text-sm">
              Offer rejected
            </div>
          ) : withdrawn ? (
            <div className="font-medium px-3 py-[2px] rounded-full bg-red-200 text-red-800 text-sm">
              Offer withdrawn
            </div>
          ) : isRequester ? (
            <div className="font-medium px-3 py-[2px] rounded-full bg-yellow-200 text-yellow-800 text-sm">
              Pending chat approval
            </div>
          ) : (
            <div className="font-medium px-3 py-[2px] rounded-full bg-gray-200 text-gray-800 text-sm">
              Swap pending
            </div>
          )}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "row",
        }}
        className="w-full gap-2 mt-2"
      >
        {!accepted && !rejected && !withdrawn && (
          <Dialog open={modalOpen} onOpenChange={setModalOpen}>
            <DialogTrigger asChild>
              <div className="cursor-pointer w-full flex justify-center text-gray-600 rounded bg-gray-200 text-base py-1 font-medium hover:bg-gray-300 transition">
                Update Swap
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
                modalOpen={modalOpen}
                setModalOpen={setModalOpen}
              />
            </DialogContent>
          </Dialog>
        )}

        {!isRequester && !accepted && !rejected && !withdrawn && (
          <AcceptOfferModal
            otherUser={requesterId}
            modalOpen={succModalOpen}
            setModalOpen={setsuccModalOpen}
          >
            <div
              className="cursor-pointer w-full flex justify-center text-gray-600 rounded bg-gray-200 text-base py-1 font-medium  hover:bg-gray-300 transition"
              onClick={() => {
                async () => {
                  await acceptSwap(swapId, [...myItems, ...requestingItems]);
                };
              }}
            >
              Accept Offer
            </div>
            {/* <GenericButton
              text="Accept Offer"
              click={async () => {
                await acceptSwap(swapId, [...myItems, ...requestingItems]);
              }}
            /> */}
          </AcceptOfferModal>
        )}

        {isRequester && !accepted && !rejected && !withdrawn && (
          <div
            className="cursor-pointer w-full flex justify-center text-gray-600 rounded bg-gray-200 text-base py-1 font-medium  hover:bg-gray-300 transition"
            onClick={async () => {
              await withdrawOffer(swapId);
            }}
          >
            Withdraw Swap
          </div>
        )}

        {accepted && <GenericButton text="Accepted Offer" noClick={true} />}
      </div>
      {/* <AcceptOfferModal otherUser={ownerId}>
        <GenericButton text="Leave a rating" />
      </AcceptOfferModal> */}
    </div>
  );
};

export default SwapDetails;
