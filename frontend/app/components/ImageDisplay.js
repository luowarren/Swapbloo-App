"use client";

import React from 'react';

const ImageDisplay = ({ imageUrl }) => {
  return (
    <div>
      {imageUrl ? (
        <img src={imageUrl} alt="Downloaded from Supabase" style={{ maxWidth: '100%' }} />
      ) : (
        <p>Loading image...</p>
      )}
    </div>
  );
};

export default ImageDisplay;
