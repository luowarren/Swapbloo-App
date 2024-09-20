"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Import the `useRouter` hook from next/navigation
import { getActiveListings, getImageFromId } from "../../service/items"; // Import your Supabase function
import ItemImages from "../components/ItemImages";
import ProfileImage from "../components/ProfileImage";
import './page.css';

interface Listing {
  id: number;
  brand: string;
  size: string;
  image?: string; // Image ID from the listing data
  imageUrl?: string; // This will be the actual image URL
  owner_id: string;
}

export default function Home() {
  const [listings, setListings] = useState<Listing[]>([]);

  useEffect(() => {
    async function fetchListingsAndImages() {
      const { data, error } = await getActiveListings();
      if (error) {
        console.error("Error fetching listings:", error);
      } else if (data) {
        const listingsWithImages = await Promise.all(
          data.map(async (listing: Listing) => {
            if (listing.image) {
              const imageBlobOrError = await getImageFromId(
                listing.image,
                "images"
              );

              if (imageBlobOrError instanceof Blob) {
                const imageUrl = URL.createObjectURL(imageBlobOrError);
                return { ...listing, imageUrl };
              } else {
                console.error("Error fetching image:", imageBlobOrError);
                return listing;
              }
            }
            return listing;
          })
        );
        setListings(listingsWithImages);
      }
    }

    fetchListingsAndImages();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Swipe Mode Banner */}
      <section className="bg-blue-500 text-white text-center py-8">
        <h1 className="text-3xl font-bold">Explore!</h1>
        <p className="mt-2">swipe thru stuff to add to ur favourites!</p>
      </section>

      {/* New listings by people you follow */}
      <section className="my-8 mx-4">
        <h2 className="text-xl font-bold text-indigo-900 mb-4 text-center">New listings by people you follow</h2>
        <div className="flex justify-center overflow-x-scroll custom-scrollbar">
          {listings.slice(0, 5).map((listing) => (
            <Card
              key={listing.id}
              itemId={listing.id}
              brand={listing.brand}
              size={listing.size}
              ownerId={listing.owner_id}
            />
          ))}
        </div>
      </section>

      {/* New listings near you */}
      <section className="my-8 mx-4">
        <h2 className="text-xl font-bold text-indigo-900 mb-4 text-center">New listings near you</h2>
        <div className="flex justify-center overflow-x-scroll custom-scrollbar">
          {listings.slice(5, 10).map((listing) => (
            <Card
              key={listing.id}
              itemId={listing.id}
              brand={listing.brand}
              size={listing.size}
              ownerId={listing.owner_id}
            />
          ))}
        </div>
      </section>

      {/* Swap by type */}
      <section className="my-8 mx-4">
        <h2 className="text-xl font-bold text-indigo-900 mb-4 text-center">Swap by type</h2>
        <div className="flex justify-center overflow-x-scroll custom-scrollbar">
          {listings.slice(10, 15).map((listing) => (
            <Card
              key={listing.id}
              itemId={listing.id}
              brand={listing.brand}
              size={listing.size}
              ownerId={listing.owner_id}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

// Card Component
interface CardProps {
  itemId: number;
  brand?: string;
  size?: string;
  ownerId: string;
}
const Card: React.FC<CardProps> = ({ brand, itemId, size, ownerId }) => {
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/item?itemId=${itemId}`);
  };

  return (
    <div>
    <div
      className="relative flex flex-col w-40 h-56 mx-2 rounded-md border shadow-md bg-white overflow-hidden"
      onClick={handleCardClick}
      style={{ cursor: "pointer" }}
    >
      {/* Main image area */}
      <div className="relative w-full h-3/4">  {/* Set height to 75% of the card */}
        {/* Item image */}
        <ItemImages
          itemId={itemId}
          className="w-full h-full object-cover"
        />

        {/* Profile image positioned in the very bottom-right */}
        
      </div>

      <ProfileImage
          userId={ownerId}
          className="absolute bottom-1 right-1 w-8 h-8 rounded-full border-2 border-white"
        />
    </div>
    {/* Text below the image */}
    <div className="mt-2 text-center">
    <p className="text-sm font-semibold text-indigo-900">{brand}</p>
    <p className="text-xs text-gray-600">{size}</p>
  </div>
  </div>
  );
};
