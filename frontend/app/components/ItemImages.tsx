import React, { useState, useEffect } from "react";
import { getImages } from "../../service/items"; // Import the getImages function
import ImageDisplay from "./ImageDisplay"; // Import the ImageDisplay component
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const ItemImages = ({
  itemId,
  className,
  buttons = false,
}: {
  itemId: number;
  className?: string;
  buttons?: boolean; // Add buttons prop type
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

    return () => {
      imageUrls.forEach((url) => URL.revokeObjectURL(url)); // Revoke each object URL
    };
  }, [itemId]);

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
        <div className="relative group">
          {" "}
          {/* Group for hover */}
          <ImageDisplay
            imageUrl={imageUrls[currentIndex]}
            className="w-full max-w-[90%] max-h-[600px] h-auto mx-auto object-contain"
          />
          {buttons && ( // Only render buttons if buttons is true
            <>
              <button
                className={`absolute left-11 top-1/2 transform -translate-y-1/2 text-gray-500 text-2xl font-bold opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
                onClick={handlePrevImage}
                style={{
                  width: "50px",
                  height: "50px",
                  backgroundColor: "rgba(255, 255, 255, 0.5)",
                  borderRadius: "50%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                }}
                disabled={currentIndex === 0} // Disable button if no previous image
              >
                <ChevronLeft />
              </button>

              <button
                className={`absolute right-11 top-1/2 transform -translate-y-1/2 text-gray-500 text-2xl font-bold opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
                style={{
                  width: "50px",
                  height: "50px",
                  backgroundColor: "rgba(255, 255, 255, 0.5)",
                  borderRadius: "50%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                }}
                onClick={handleNextImage}
                disabled={currentIndex === imageUrls.length - 1} // Disable button if no next image
              >
                <ChevronRight />
              </button>
            </>
          )}
        </div>
      ) : (
        <Skeleton className="h-[250px] w-[250px] rounded-lg" />
      )}
    </div>
  );
};

export default ItemImages;
