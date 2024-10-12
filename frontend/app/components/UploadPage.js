// components/UploadPage.js
import React, { useState } from "react";
import { uploadImage } from "@/service/items"; // Adjust path if needed

const UploadPage = (currentImages, setImages) => {
  const handleImageChange = (event) => {
    const files = Array.from(event.target.files);

    // Check for upload limit
    if (currentImages + files.length > 1) {
      alert("You can only upload up to 1 images.");
      return;
    }

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages(reader.result);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleUpload = async () => {
    const uploadPromises = files.map(async (file, index) => {
      const fileName = `image_${Date.now()}_${index}.png`;
      //   const { data, error } = await uploadImage(URL.createObjectURL(file), fileName);
      if (error) {
        alert("Upload failed.");
        console.error(error);
      }
    });

    await Promise.all(uploadPromises);
    alert("Upload successful!");
  };

  return (
    <div
      className={`flex flex-col items-center mb-4 ${
        currentImages ? "justify-center min-h-[100px]" : ""
      }`}
    >
      <input
        type="file"
        accept="image/jpeg, image/png"
        onChange={handleImageChange}
        id="file-upload"
        multiple // Allow multiple file uploads
        style={{ display: "none" }}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-evenly", // Center items horizontally
          width: "30%",
          margin: "20px",
        }}
      >
        <label
          htmlFor="file-upload"
          className="text-blue-500 text-sm cursor-pointer"
          style={{
            display: "inline-block",
            padding: "10px 20px",
            borderRadius: "5px",
            cursor: "pointer",
            border: "1px solid #007bff", // Optional border for better visibility
            // height: "40px"
          }}
        >
          + Add photos
        </label>
        <button onClick={handleUpload}>Upload</button>
      </div>
    </div>
  );
};

export default UploadPage;
