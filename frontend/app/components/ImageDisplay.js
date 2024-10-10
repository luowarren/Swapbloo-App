"use client";

import React from 'react';

const ImageDisplay = ({ imageUrl, className }) => {
  if (!imageUrl) {
    // If no imageUrl is provided, show a loading message
    return <p>Loading image...</p>;
  }

  return (
    <div className={`relative ${className}`}>
      {/* Image element with a fallback in case it doesn't load */}
      <img 
        src={imageUrl} 
        alt="Downloaded from Supabase" 
        className="object-contain w-full h-auto" 
        style={{ maxWidth: '100%', height: 'auto' }} // Ensuring the image is responsive
        onError={(e) => {
          // Handle cases where the image fails to load
          e.target.src = "/fallback-image.png"; // Replace with a fallback image if needed
        }} 
      />
    </div>
  );
};

export default ImageDisplay;
