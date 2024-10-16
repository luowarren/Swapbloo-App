"use client";
import React, { useEffect, useState } from "react";
import {
  fetchUserData,
  getUserId,
  getUser,
  setUserLocation,
} from "@/service/users";
import { getListingsByUsers } from "@/service/items";
import { getRequestedSwaps, getReceivedSwaps } from "@/service/swaps";
import ProfileImage from "../components/ProfileImage";
import ShowMap from "../components/Map";
import GenericButton from "../components/GenericButton";
import { useRouter } from "next/navigation";
import UserRating from "../components/UserRating";
import ListingCard from "../listings/listing-card";
import { ChevronLeft, Shirt } from "lucide-react";
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
        setOutgoingSwaps(
          outgoingSwapsBlob?.data?.map((swap) => swap.accepter_id) ?? []
        );

        const incomingSwapsBlob = await getReceivedSwaps(user.id);
        setIncomingSwaps(
          incomingSwapsBlob?.data?.map((swap) => swap.requester_id) ?? []
        );
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

  if (loading) {
    return (
      <div className="flex h-[85vh] w-full justify-center items-center">
        <div className="animate-spin [animation-duration:500ms]">
          <Shirt className="text-indigo-600" />
        </div>
      </div>
    );
  }

  if (!user) {
    return <p>No user found</p>;
  }

  return (
    <div className="mx-auto bg-gray-100 h-[100vh] pb-32 overflow-scroll ">
      <div
        className="mb-4 text-gray-500 flex gap-1 items-center bg-white rounded w-fit px-2 py-1 pr-4 hover:bg-gray-200 transition cursor-pointer mt-10 ml-10 border boder-gray-300"
        onClick={() => {
          router.push("/listings");
        }}
      >
        <ChevronLeft className="h-4 w-4 stroke-[2.5px]" />
        Go back
      </div>
      <div className="m-10 mt-5 flex gap-4">
        <div className="bg-white p-10 w-[35%] shadow-lg rounded-lg border boder-gray-300">
          <ProfileImage userId={user.id} className="w-28 h-28" />
          <div className="flex flex-col items-start align-middle">
            <div className="font-bold overflow-auto text-center text-3xl mt-4 text-gray-700 italic">
              {user.name}'s <span className="mr-2 text-indigo-600">Store</span>
            </div>
            <div className="text-sm text-gray-500">{user.username}</div>
            <UserRating
              rating={Number(user.rating)}
              num={Number(user.num_of_ratings)}
            />
            <div className="mt-2 text-gray-500">{user.description}</div>
            <div className="flex gap-16">
              <div>
                <div className="mt-6 text-gray-500">Active Listings</div>
                <div className="mt-0 text-gray-700 text-2xl font-bold">7</div>
              </div>
              <div>
                <div className="mt-6 text-gray-500">CO2 saved</div>
                <div className="mt-0 text-gray-700 text-2xl font-bold">
                  1600mgs
                </div>
              </div>
            </div>
            <div className="mt-6">
              <div className="mt-6 text-gray-500">{selectedLocation}</div>
              {selectedLocation && (
                <ShowMap
                  setter={setSelectedLocation}
                  selectedLocation={selectedLocation}
                />
              )}
            </div>
          </div>
        </div>
        <div className="bg-white p-8 w-full shadow-lg rounded-lg border boder-gray-300">
          <div className="m-2 text-xl text-gray-600 italic font-bold">
            Listings
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 w-full">
            {items.map((item: any, index) => {
              return <ListingCard key={index} data={item} />;
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
