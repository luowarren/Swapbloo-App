import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import React, { useEffect, useState } from "react";
import UserRating from "./UserRating";
import ShowMap from "./Map";
import ListingCard from "../listings/listing-card";
import ProfileImage from "./ProfileImage";
import { getListingsByUsers } from "@/service/items";

const ShopModal = ({ otherUser, children }) => {
  const [listings, setListings] = useState([]);

  useEffect(() => {
    const fetchListings = async () => {
      const userItemsBlob = await getListingsByUsers([otherUser.id]);
      const userItems = userItemsBlob?.data ?? [];
      setListings(userItems);
    };
    fetchListings();
  }, [otherUser]);

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
  <div style={{ flex: 1, marginRight: "16px", marginTop: "16px", marginBottom: "16px" }}>
    <div style={{ fontWeight: "bold" }}>
      {`${otherUser.name}'s Shop`}
    </div>
    <div style={{ fontSize: "18px" }}>
      {`${otherUser.description}`}
    </div>
    <div style={{ marginTop: "16px", marginBottom: "32px" }}>
      {`${otherUser.name}'s Preferred Location`}
    </div>
    <ShowMap selectedLocation={otherUser.location} />
  </div>

  <div style={{ flex: 1, marginTop: "16px", marginBottom: "16px",  }}>
    <div style={{ marginLeft: "20px" }}>
      {`${otherUser.name}'s Other Listings`}
    </div>
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        width: "100%", // Change to 100% to avoid fixed width issues
        overflow: "auto", // Change to auto for better scroll behavior
        padding: "0 8px",
        marginBottom: "16px",
        width: "37rem"
      }}
    >
      {listings.length > 0 ? (
        listings.map((item, index) => (
          <ListingCard key={index} data={item} size={40} font={13} />
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
