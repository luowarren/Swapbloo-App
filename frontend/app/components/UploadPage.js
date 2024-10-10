// components/UploadPage.js
import React, { useState } from 'react';
import { uploadImage } from "@/service/items"; // Adjust path if needed

const UploadPage = (files, setFiles) => {
  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    if (selectedFiles.length + files.length > 4) {
      alert("You can only upload up to 4 images.");
      return;
    }
    setFiles((prev) => [...prev, ...selectedFiles]);
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
    <div>
      <h1>Upload Photos</h1>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        id="file-upload"
        multiple
      />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
};

export default UploadPage;
