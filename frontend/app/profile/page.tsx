"use client";
import React, { useEffect, useState } from "react";
import { fetchUserData, getUserId, getUser, setUserLocation } from "@/service/users";
import { getListingsByUsers } from "@/service/items";
import { getRequestedSwaps, getReceivedSwaps } from "@/service/swaps"; 
import ProfileImage from "../components/ProfileImage";
import ItemImages from "../components/ItemImages";
import ShowMap from "../components/Map";
import GenericButton from "../components/GenericButton";
import { useRouter } from "next/navigation";
import UserRating from "../components/UserRating";
import ListingCard from "../listings/listing-card";
import SwapDetails from "../components/SwapDetails";

interface UserData {
  id: string;
  description: string;
  username: string;
  name: string;
  bio: string;
  rating: number;
  num_of_ratings: number;
  location: string;
  image: string;
}

interface ItemData {
  id: number;
  title: string;
  size: string;
  brand: string | null;
}

const Login: React.FC = () => {
  const [user, setUser] = useState<UserData | null>(null);
  const [items, setItems] = useState<ItemData[]>([]);
  const [outgoingSwaps, setOutgoingSwaps] = useState<string[]>([]);
  const [incomingSwaps, setIncomingSwaps] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"listings" | "incoming" | "outgoing">("listings"); // Tab state
  const router = useRouter();
  const [uid, setUserId] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

  useEffect(() => {
    const loadUserData = async () => {
      const userId = await getUserId();
      if (!userId) {
        router.push("/login");
        return;
      }

      setUserId(userId);

      const userBlob = await getUser(userId);
      if (userBlob?.Users?.length) {
        const user = userBlob.Users[0];
        setUser(user);
        setSelectedLocation(user.location);

        const userItemsBlob = await getListingsByUsers([user.id], true);
        setItems(userItemsBlob?.data ?? []);

        const outgoingSwapsBlob = await getRequestedSwaps(user.id);
        setOutgoingSwaps(outgoingSwapsBlob?.data?.map((swap) => swap.accepter_id) ?? []);

        const incomingSwapsBlob = await getReceivedSwaps(user.id);
        setIncomingSwaps(incomingSwapsBlob?.data?.map((swap) => swap.requester_id) ?? []);
      } else {
        console.warn("No user data found");
      }
      setLoading(false);
    };

    loadUserData();
  }, [router]);

  useEffect(() => {
    const changeLocation = async () => {
      if (user?.id && selectedLocation) {
        await setUserLocation(user.id, selectedLocation);
      }
    };
    changeLocation();
  }, [selectedLocation]);

  if (loading) return <p>Loading...</p>;
  if (!user) return <p>No user found</p>;

  // Function to switch tabs
  const handleTabSwitch = (tab: "listings" | "incoming" | "outgoing") => {
    setActiveTab(tab);
  };

  return (
    <div className="max-w-4xl mx-auto bg-white">
      <div className="w-1/2 bg-white text-black p-4 rounded-lg text-xl flex flex-col items-center mt-4">
        <div className="flex flex-row items-center justify-evenly w-full mb-4">
          <ProfileImage userId={user.id} />
          <div className="flex flex-col items-start align-middle">
            <div className="font-bold text-center">{user.name}'s Swap Shop</div>
            <div className="text-sm text-gray-500">{user.username}</div>
            <div className="text-sm text-gray-500">Number of total swaps: {user.swap_count}</div>
            <UserRating rating={Number(user.rating)} num={Number(user.num_of_ratings)} />
          </div>
        </div>
      </div>

      <hr className="border-gray-600 mx-4" />
      <div className="space-x-8 mt-5 mx-4">Description</div>
      <div className="space-x-8 mt-5 mx-4">{user.description}</div>
      <div className="py-6 px-6 ">
        {selectedLocation && (
          <ShowMap
            setter={setSelectedLocation}
            selectedLocation={selectedLocation}
          ></ShowMap>
        )}
      </div>

      {/* Tab Buttons */}
      <div className="flex space-x-4 mt-5 mx-4">
        <button
          className={`px-4 py-2 ${activeTab === "listings" ? "bg-gray-300" : ""}`}
          onClick={() => handleTabSwitch("listings")}
        >
          Listings
        </button>
        <button
          className={`px-4 py-2 ${activeTab === "incoming" ? "bg-gray-300" : ""}`}
          onClick={() => handleTabSwitch("incoming")}
        >
          Incoming Swaps
        </button>
        <button
          className={`px-4 py-2 ${activeTab === "outgoing" ? "bg-gray-300" : ""}`}
          onClick={() => handleTabSwitch("outgoing")}
        >
          Outgoing Swaps
        </button>
      </div>

      {/* Tab Content */}
      <div className="p-4">
        {activeTab === "listings" && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 h-[85vh] overflow-scroll">
            {items.length > 0 ? (
              items.map((item, index) => <ListingCard key={index} data={item} />)
            ) : (
              <p>No items currently listed</p>
            )}
          </div>
        )}

        {activeTab === "incoming" && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 h-[85vh] overflow-scroll">
            {incomingSwaps.length > 0 ? (
              incomingSwaps.map((otherUser, index) => (
                <SwapDetails key={index} ownerId={uid} requesterId={otherUser} />
              ))
            ) : (
              <p>No incoming swaps</p>
            )}
          </div>
        )}

        {activeTab === "outgoing" && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 h-[85vh] overflow-scroll">
            {outgoingSwaps.length > 0 ? (
              outgoingSwaps.map((otherUser, index) => (
                <SwapDetails key={index} ownerId={uid} requesterId={otherUser} />
              ))
            ) : (
              <p>No outgoing swaps</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
