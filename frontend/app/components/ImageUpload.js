"use client"; // This marks the component as a client component

import React, { useState } from "react";

const ImageUpload = ({ setImages, currentImages }) => {
  const handleImageChange = (event) => {
    const files = Array.from(event.target.files);

    // Check for upload limit
    if (currentImages.length + files.length > 4) {
      alert("You can only upload up to 4 images.");
      return;
    }

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages((prevImages) => [...prevImages, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  return (
    <div
      className={`flex flex-col items-center mb-4 ${
        currentImages.length === 0 ? "justify-center min-h-[100px]" : ""
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
      </div>
    </div>
  );
};

export default ImageUpload;
