"use client";

import React, { useState, useEffect } from 'react';
import { getImages } from '../../service/items'; // Import the getImages function
import ImageDisplay from './ImageDisplay'; // Import the ImageDisplay component

const ItemImages = ({ itemId }) => {
  const [imageUrls, setImageUrls] = useState([]); // Use an array to store multiple image URLs

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const blob = await getImages(itemId);
        const data = blob.data;

        if (data && Array.isArray(data) && data.length > 0) {
          const urls = data.map((imageBlob) => {
            if (imageBlob instanceof Blob) {
              return URL.createObjectURL(imageBlob);
            } else {
              console.error('Element is not a Blob:', imageBlob);
              return null;
            }
          }).filter(url => url !== null); // Filter out any null values

          setImageUrls(urls);
        } else {
          console.error('Expected an array of Blob objects, but got:', data);
        }
      } catch (error) {
        console.error(error.message);
      }
    };

    fetchImages();

    // Cleanup the object URLs when the component unmounts
    return () => {
      imageUrls.forEach(url => URL.revokeObjectURL(url)); // Revoke each object URL
    };
  }, [itemId]); // Only depend on itemId

  return (
    <div>
      {imageUrls.length > 0 ? (
        imageUrls.map((url, index) => (
          <div key={index}>
            <ImageDisplay imageUrl={url} />
          </div>
        ))
      ) : (
        <p>Loading images...</p>
      )}
    </div>
  );
};

export default ItemImages;