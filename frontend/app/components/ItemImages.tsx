import React, { useState, useEffect } from "react";
import { getImages } from "../../service/items"; // Import the getImages function
import ImageDisplay from "./ImageDisplay"; // Import the ImageDisplay component

const ItemImages = ({
  itemId,
  className,
}: {
  itemId: number;
  className?: string;
}) => {
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const blob: any = await getImages(itemId);
        const data = blob.data;

        if (data && Array.isArray(data) && data.length > 0) {
          const urls = data
            .map((imageBlob) => {
              if (imageBlob instanceof Blob) {
                return URL.createObjectURL(imageBlob);
              } else {
                console.error("Element is not a Blob:", imageBlob);
                return null;
              }
            })
            .filter((url): url is string => url !== null);

          setImageUrls(urls);
        } else {
          console.error("Expected an array of Blob objects, but got:", data);
        }
      } catch (error: any) {
        console.error(error.message);
      }
    };

    fetchImages();

    // Cleanup the object URLs when the component unmounts
    return () => {
      imageUrls.forEach((url) => URL.revokeObjectURL(url)); // Revoke each object URL
    };
  }, [itemId]); // Only depend on itemId

  const handlePrevImage = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? imageUrls.length - 1 : prevIndex - 1
    );
  };

  const handleNextImage = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === imageUrls.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className={`relative ${className}`}>
      {imageUrls.length > 0 ? (
        <>
          {/* Display the current image with max width of 90% and max height of 600px */}
          <ImageDisplay
            imageUrl={imageUrls[currentIndex]}
            className="w-full max-w-[90%] max-h-[600px] h-auto mx-auto object-contain"
          />

          {/* Left Arrow (only show if not on the first image) */}
          {currentIndex > 0 && (
            <button
              className="absolute left-2 top-1/2 transform -translate-y-1/2 text-blue-500 text-2xl font-bold"
              onClick={handlePrevImage}
            >
              &lt;
            </button>
          )}

          {/* Right Arrow (only show if not on the last image) */}
          {currentIndex < imageUrls.length - 1 && (
            <button
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-500 text-2xl font-bold"
              onClick={handleNextImage}
            >
              &gt;
            </button>
          )}
        </>
      ) : (
        <p>Loading images...</p>
      )}
    </div>
  );
};

export default ItemImages;
