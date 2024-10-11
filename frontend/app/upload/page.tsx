"use client";
import { useState } from "react";
import UploadPage from "../components/UploadPage"; // Adjust the import path if necessary
import ImageUpload from "../components/ImageUpload";
import { UploadIcon } from "lucide-react";
import { uploadImage } from "@/service/items";

const Upload = () => {
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

  const handleUpload = async () => {
    try {
      const uploadPromises = uploadedImages.map(async (image, index) => {
        const fileName = `image_${Date.now()}_${index}.png`;
        let uploadedImage = await uploadImage(image, fileName);
        if (uploadedImage.error) throw uploadedImage.error;
      });

      await Promise.all(uploadPromises);
      alert("Listing uploaded successfully!");
    } catch (error) {
      console.error("Error uploading listing:", error);
      alert("Failed to upload listing.");
    }
  };

  return (
    <div>

   
    <ImageUpload currentImages={uploadedImages} setImages={setUploadedImages} />
    <button onClick={handleUpload}>Upload</button>
    </div>
  );
};

export default Upload;
