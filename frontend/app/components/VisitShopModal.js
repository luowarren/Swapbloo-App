// MessageBubble.js
import React, { useEffect, useState } from "react";
import UserRating from "./UserRating";
import ShowMap from "./Map";
import ListingCard from "../listings/listing-card";
import ProfileImage from "./ProfileImage";
import { getListingsByUsers } from "@/service/items";

const VisitShopModal = ({ otherUser, closeModal }) => {
  const [listings, setListings] = useState([]);

  useEffect(() => {
    const fetchListings = async () => {
      // const l = await
      const userItemsBlob = await getListingsByUsers([otherUser.id]);
      const userItems = userItemsBlob?.data ?? [];
      setListings(userItems);
    };
    fetchListings();
  }, []);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "fixed",
        zIndex: 11,
        left: 0,
        top: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0,0,0,0.4)",
      }}
      onClick={closeModal} // Close on outside click
    >
      <div
        style={{
          backgroundColor: "#fefefe",
          margin: "15% auto",
          padding: "20px",
          border: "1px solid #888",
          width: "70%",
          borderRadius: "8px",
        }}
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        <div className="w-full bg-white text-black p-4 text-xl flex flex-col">
          <div className="w-full flex flex-row justify-between">
            <div className="flex flex-row items-center mb-4">
              <ProfileImage userId={otherUser.id}></ProfileImage>
              <div className="ml-3 flex flex-col items-start align-middle">
                <div className="font-bold overflow-auto text-center">
                  {`${otherUser.name}'s Swap Shop`}
                </div>
                <UserRating
                  rating={Number(otherUser.rating)}
                  num={Number(otherUser.num_of_ratings)}
                />
              </div>
            </div>
            <span
              onClick={closeModal}
              style={{
                color: "#aaa",
                float: "right",
                fontSize: "28px",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              &times;
            </span>
          </div>
          <div className="w-full">
            <div>Listings</div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 w-full overflow-scroll px-2 mt-4">
              {listings.length > 0 ? (
                listings.map((item, index) => (
                  <ListingCard key={index} data={item} />
                ))
              ) : (
                <p>No items currently listed</p>
              )}
            </div>
            <ShowMap selectedLocation={"Westfield Chermside"}></ShowMap>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisitShopModal;
