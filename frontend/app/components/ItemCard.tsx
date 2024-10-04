import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Import the `useRouter` hook from next/navigation
import { getActiveListings, getImageFromId } from "../../service/items"; // Import your Supabase function
import ItemImages from "../components/ItemImages";
import ProfileImage from "../components/ProfileImage";
import './page.css';

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