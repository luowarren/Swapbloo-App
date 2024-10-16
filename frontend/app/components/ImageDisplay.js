"use client";

import React from "react";

const ImageDisplay = ({ imageUrl, className }) => {
  if (!imageUrl) {
    // If no imageUrl is provided, show a loading message
    return (
      <div>
        <Skeleton className="h-[250px] w-[250px] rounded-lg" />
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {/* Image element with a fallback in case it doesn't load */}
      <img
        src={imageUrl}
        alt="Downloaded from Supabase"
        className="object-contain w-full h-auto"
        style={{ maxWidth: "100%", height: "auto" }} // Ensuring the image is responsive
        onError={(e) => {
          // Handle cases where the image fails to load
          e.target.src =
            "https://cdn.pixabay.com/photo/2017/02/12/21/29/false-2061131_1280.png"; // Replace with a fallback image if needed
        }}
      />
    </div>
  );
};

export default ImageDisplay;
