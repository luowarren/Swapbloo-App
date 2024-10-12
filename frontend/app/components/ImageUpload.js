"use client"; // This marks the component as a client component

import React, { useState } from "react";

const ImageUpload = ({
  setImages,
  currentImages,
  max = 4,
  children = (
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
        className="text-sm cursor-pointer border-2 border-indigo-500 text-indigo-500"
        style={{
          display: "inline-block",
          padding: "10px 20px",
          borderRadius: "5px",
          cursor: "pointer",
          // height: "40px"
        }}
      >
        + Add photos
      </label>
    </div>
  ),
}) => {
  const handleImageChange = (event) => {
    const files = Array.from(event.target.files);

    if (files.length === 1) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Replace the images array with the new single image
        setImages([reader.result]);
      };
      reader.readAsDataURL(files[0]);
      return;
    }

    // Check for upload limit
    if (currentImages.length + files.length > max) {
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
      className={`flex flex-col items-center ${
        currentImages.length === 0 ? "justify-center" : ""
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
      {children}
    </div>
  );
};

export default ImageUpload;
