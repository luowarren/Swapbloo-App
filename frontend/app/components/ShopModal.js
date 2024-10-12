import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import React, { useEffect, useState } from "react";
import UserRating from "./UserRating";
import ShowMap from "./Map";
import ListingCard from "../listings/listing-card";
import ProfileImage from "./ProfileImage";
import { getListingsByUsers } from "@/service/items";

// THIS IS JUST EXAMPLE CODE
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
      <DialogContent className="min-w-[80vw] h-[80vh] overflow-scroll">
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
          </div>
          <div className="w-full">
            <div>Listings</div>
            <div className="flex flex-row w-full overflow-scroll px-2 mt-4 mb-4">
              {listings.length > 0 ? (
                listings.map((item, index) => (
                  <ListingCard key={index} data={item} size={40} font={14}/>
                ))
              ) : (
                <p>No items currently listed</p>
              )}
            </div>
            <ShowMap selectedLocation={otherUser.location}></ShowMap>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShopModal;
