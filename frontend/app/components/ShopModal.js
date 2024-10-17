import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import React, { useEffect, useState } from "react";
import UserRating from "./UserRating";
import ShowMap from "./Map";
import ListingCard from "../listings/listing-card";
import ProfileImage from "./ProfileImage";
import { getListingsByUsers } from "@/service/items";
import GenericButton from "./GenericButton";
import { addNewBlockRecord, getAllBlocked } from "../../service/block";
import { getUserId } from "../../service/users";
import { useRouter } from "next/navigation"; // Next.js router for redirection

const ShopModal = ({ currUser, otherUser, children, origin = "" }) => {
  const [listings, setListings] = useState([]);
  // const [currUid, setCurrUid] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchListings = async () => {
      const userItemsBlob = await getListingsByUsers([otherUser.id], true);
      const userItems = userItemsBlob?.data ?? [];
      setListings(userItems);
    };
    fetchListings();
  }, [otherUser]);

  async function handleBlock() {
    const uid = await getUserId();
    const newBlockRecord = await addNewBlockRecord(uid, otherUser.id);
    // redirect user to homepage?
    // window.location.reload();
    // router.push("/" + origin);
  }

  return (
    <Dialog>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent
        style={{
          minWidth: "80vw",
          height: "80vh",
          overflowY: "scroll",
        }}
      >
        <div
          style={{
            width: "100%",
            backgroundColor: "#ffffff", // bg-white
            color: "#000000", // text-black
            padding: "16px", // p-4
            fontSize: "1.25rem", // text-xl
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                marginBottom: "16px", // mb-4
              }}
            >
              <ProfileImage userId={otherUser.id} />
              <div
                style={{
                  marginLeft: "12px", // ml-3
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                }}
              >
                <div
                  style={{
                    fontWeight: "bold", // font-bold
                    overflow: "auto",
                    textAlign: "center",
                  }}
                >
                  {`${otherUser.name}`}
                </div>
                <UserRating
                  rating={Number(otherUser.rating)}
                  num={Number(otherUser.num_of_ratings)}
                />
              </div>
            </div>
          </div>
          {(currUser !== null && otherUser.id !== currUser) && 
          (
            <GenericButton
              text="Block"
              // inverse={true}
              width="5vw"
              fontSize="0.8rem"
              click={async () => {
                await handleBlock();
                alert("You have blocked " + otherUser.name)
                window.location.reload();
              }}
            />
          )}
          

          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-start",
              padding: "16px 0", // Add padding to the parent to prevent margin collapsing
            }}
          >
            <div
              style={{
                flex: 1,
                marginRight: "16px",
                marginTop: "16px",
                marginBottom: "16px",
              }}
            >
              <div style={{ fontWeight: "bold", fontSize: "28px" }}>
                {`${otherUser.name}'s Shop`}
              </div>
              <div style={{ fontSize: "18px" }}>
                {`${otherUser.description}`}
              </div>
              <div
                style={{
                  marginTop: "16px",
                  marginBottom: "32px",
                  fontWeight: "bold",
                }}
              >
                {`${otherUser.name}'s Preferred Location`}
              </div>
              <ShowMap selectedLocation={otherUser.location} />
            </div>

            <div
              style={{
                marginTop: "16px",
                marginBottom: "16px",
              }}
            >
              <div
                style={{
                  marginLeft: "20px",
                  fontWeight: "bold",
                  marginBottom: "10px",
                }}
              >
                {`${otherUser.name}'s Other Listings`}
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)", // Default for small screens
                  gap: "8px", // Tailwind gap-2
                  width: "100%",
                  padding: "16px", // Tailwind p-4
                  paddingBottom: "208px", // Tailwind pb-52
                  backgroundColor: "#f7fafc", // Tailwind bg-gray-100
                  height: "fit",
                }}
              >
                {listings.length > 0 ? (
                  listings.map((item, index) => (
                    <ListingCard
                      key={index}
                      data={item}
                      size={170}
                      font={14}
                      maxWidth={19}
                    />
                  ))
                ) : (
                  <p>No items currently listed</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShopModal;
