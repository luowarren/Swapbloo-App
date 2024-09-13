"use client";

import React, { useState, useEffect } from 'react';
import { getImages } from '../../service/items'; // Import the getImages function

const ImageDisplay = ({ itemId }) => {
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const blob = await getImages(itemId);
        const data = blob.data;

        console.log('Received Blob:', data);
        console.log('Type of received data:', typeof data);
        console.log('Instance of Blob:', data instanceof Blob);
        console.log('Instance of Blob (first element):', data[0] instanceof Blob); // If data is an array

        if (data && Array.isArray(data) && data.length > 0) {
          const firstBlob = data[0];
          console.log('First element type:', typeof firstBlob);
          console.log('First element instanceof Blob:', firstBlob instanceof Blob);
        
          if (firstBlob instanceof Blob) {
            const url = URL.createObjectURL(firstBlob);
            setImageUrl(url);
            console.log('Generated URL:', url);
          } else {
            console.error('The first element is not a Blob:', firstBlob);
          }
        } else {
          console.error('Expected an array of Blob objects, but got:', data);
        }
      } catch (error) {
        console.error(error.message);
      }
    };

    fetchImage();

    // Cleanup the object URL when the component unmounts
    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [itemId]);

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