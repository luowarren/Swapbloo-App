"use client";
import React, { useEffect, useState } from "react";
import { fetchUserData, fetchUserItems } from "../../service/users";
import { getUserId } from "@/service/auth";
import { getUser } from "../../service/users";
import { getListingsByUsers } from "@/service/items";
import {
  getRequestedItems,
  getReceivedRequests,
  getRequestedSwaps,
  getReceivedSwaps,
} from "@/service/swaps"; // Import swap functions
import ProfileImage from "../components/ProfileImage";
import ItemImages from "../components/ItemImages";
import ShowMap from "../components/Map";
import GenericButton from "../components/GenericButton";
import { useRouter } from "next/navigation";
import UserRating from "../components/UserRating";
import { locations } from "./locations";

// Define types for UserData and ItemData
interface UserData {
  id: string;
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
  const [outgoingSwaps, setOutgoingSwaps] = useState<ItemData[]>([]); // State to store requested swaps
  const [incomingSwaps, setIncomingSwaps] = useState<ItemData[]>([]); // State to store incoming swap requests
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "listings"
  >("listings"); // State to manage active tab
  const router = useRouter(); // Move useRouter outside useEffect
  const [uid, setUserId] = useState<UserData | null>(null);
  useEffect(() => {
    const loadUserData = async () => {
      // Fetch user data
      const userId = await getUserId();
      if (userId == null) {
        router.push("/login"); // Redirect if no user
      } else {
        setUserId(userId);

        // Fetch user details using the userId
        const userBlob = await getUser(userId);

        // Safely check if userBlob.Users exists and has items
        if (userBlob?.Users && userBlob.Users.length > 0) {
          const user = userBlob.Users[0];
          setUser(user);

          // Fetch user's items
          const userItemsBlob = await getListingsByUsers([user.id]);
          const userItems = userItemsBlob?.data ?? [];
          setItems(userItems);

          // Fetch requested swaps (outgoing swaps)
          const outgoingSwapsBlob = await getRequestedSwaps(user.id);
          console.log("outgoing swaps:", outgoingSwapsBlob);
          const outgoingSwaps = outgoingSwapsBlob?.data ?? [];
          setOutgoingSwaps(outgoingSwaps);

          // Fetch incoming swap requests
          const incomingSwapsBlob = await getReceivedSwaps(user.id);
          console.log("incoming swaps:", incomingSwapsBlob);
          const incomingSwaps = incomingSwapsBlob?.data ?? [];
          setIncomingSwaps(incomingSwaps);
        } else {
          console.warn("No user data found");
        }
        setLoading(false);
      }
    };

    loadUserData();
  }, [router]); // Include `router` in the dependency array

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!user) {
    return <p>No user found</p>;
  }

  // Function to switch tabs
  const handleTabSwitch = (tab: "listings") => {
    setActiveTab(tab);
  };

  return (
    <div className="max-w-4xl mx-auto bg-white">
      <div className="w-1/2 bg-white text-black p-4 rounded-lg text-xl flex flex-col items-center mt-4 ">
        <div className="flex flex-row items-center justify-evenly w-full mb-4">
          <div className="w-16 h-16 bg-yellow-500 rounded-full"></div>
          <div className="flex flex-col items-start align-middle">
            <div className="font-bold overflow-auto text-center">
              {user.name}'s Swap Shop
            </div>
            <div className="text-sm text-gray-500">
              {user.username}
            </div>
            <UserRating
              rating={Number(user.rating)}
              num={8}
            />
          </div>
        </div>
      </div>
      <hr className="border-gray-600 mx-4" />

      {/* Tab Buttons */}
      <div className="flex space-x-8 mt-5 mx-4">
        <button
          className={`font-semibold px-2 pb-2 ${activeTab === "listings" ? "underline" : ""
            }`}
          onClick={() => handleTabSwitch("listings")}
        >
          Listings
        </button>
      </div>
      <div className="py-6 px-6 ">
        <ShowMap ></ShowMap>
      </div>

      {/* Tab Content */}
      <div className="flex space-x-4 p-4">
        {activeTab === "listings" && (
          <div className="flex flex-row">
            {items.length > 0 ? (
              items.map((item) => (
                <ListingCard
                  key={item.id}
                  name={item.title}
                  size={item.size}
                  brand={item.brand || "Unknown"}
                  id={item.id}
                />
              ))
            ) : (
              <p>No items currently listed</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

interface ListingCardProps {
  id: number; // Add `id` to the props definition
  name: string;
  size: string;
  brand: string | null;
}

const ListingCard: React.FC<ListingCardProps> = ({ name, size, brand, id }) => {
  const router = useRouter(); // Move useRouter to the top of the component

  const handleCardClick = (id: number) => {
    router.push(`/item?itemId=${id}`); // Use router here
  };

  const truncateMessage = (msg: string, maxLength: number) => {
    return msg.length > maxLength ? msg.slice(0, maxLength) + "..." : msg;
  };
  return (
    <div>
      <div
        className="relative flex flex-col w-46 h-46 mx-2 rounded-md  bg-white overflow-hidden"
        onClick={() => handleCardClick(id)} // Wrap the function call in an arrow function
        style={{ cursor: "pointer" }}
      >
        {/* Main image area */}
        <div className="relative w-full rounded-md">
          {" "}
          {/* Set height to 75% of the card */}
          {/* Item image */}
          <ItemImages itemId={id} className="w-full h-full rounded-md object-cover" />
        </div>
      </div>
      {/* Text below the image */}
      <div className="mt-2 text-center">
        <div className="text-sm font-semibold text-indigo-900">
          {truncateMessage(name, 15)}
        </div>
        <p className="text-xs text-gray-600">
          {truncateMessage(`${size} • ${brand}`, 15)}

        </p>
      </div>
    </div>
  );
};

export default Login;
