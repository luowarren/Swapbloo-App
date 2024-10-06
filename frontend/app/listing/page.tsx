"use client";
import React, { useEffect, useState } from "react";
import { supabase } from "../../service/supabaseClient"; // Update the import path
import ImageUpload from "../components/ImageUpload";
import Category from "../listings/category";
import Condition from "../listings/condition";
import Size from "../listings/size";
import Demographic from "../listings/demographic";
import {
  createItemListing,
  createItemImage,
  uploadImage,
} from "@/service/items";
import { getUserId } from "@/service/auth";

const ListAnItemPage: React.FC = () => {
  const [currUserId, setCurrUserId] = useState<string>("");
  const [demographic, setDemographic] = useState<string[]>([]);
  const [category, setCategory] = useState<string[]>([]);
  const [size, setSize] = useState<string[]>([]);
  const [condition, setCondition] = useState<string[]>([]);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [title, setTitle] = useState(""); // State for title
  const [description, setDescription] = useState(""); // State for description
  const [brand, setBrand] = useState(""); // State for description

  const clearAllStates = () => {
    setDemographic([]);
    setCategory([]);
    setSize([]);
    setBrand("");
    setTitle("");
    setDescription("");
    setUploadedImages([]);
    setCondition([]);
  };

  const handleCurrentUser = async () => {
    // get current user
    const uid = await getUserId();
    console.log("current user: ", uid);
    if (uid != null) {
      setCurrUserId(uid);
    } else {
      throw new Error();
    }
  };

  useEffect(() => {
    handleCurrentUser();
  }, []);

  const handleDragStart =
    (index: number) => (event: React.DragEvent<HTMLDivElement>) => {
      event.dataTransfer.setData("text/plain", index.toString());
    };

  const handleDrop = (
    index: number,
    event: React.DragEvent<HTMLDivElement>
  ) => {
    event.preventDefault();
    const draggedIndex = Number(event.dataTransfer.getData("text/plain"));
    const updatedImages = [...uploadedImages];
    const [removed] = updatedImages.splice(draggedIndex, 1);
    updatedImages.splice(index, 0, removed);
    setUploadedImages(updatedImages);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault(); // Allow the drop
  };

  const handleUpload = async () => {
    console.log(category, size, demographic, condition, title, description);

    try {
      let item = await createItemListing(
        currUserId,
        size[0],
        condition[0],
        category[0],
        demographic[0],
        title,
        description,
        brand
      );
      if (item.error) throw item.error;
      const uploadPromises = uploadedImages.map(async (image, index) => {
        console.log(image);
        const fileName = `image_${Date.now()}_${index}.png`; // Create a unique file name
        console.log(fileName);

        let uploadedImage = await uploadImage(image, fileName);
        if (uploadedImage.error) throw uploadedImage.error;
        if (item.data !== null) {
          let itemImage = await createItemImage(
            String(item.data[0].id),
            fileName
          );
          if (itemImage.error) throw itemImage.error;
        }
      });

      await Promise.all(uploadPromises);
      alert("Listing uploaded successfully!"); // Mock success message
      clearAllStates();
      window.scrollTo({
        top: 0,
        behavior: "smooth", // Optional: adds a smooth scrolling effect
      });
    } catch (error) {
      console.error("Error uploading listing:", error);
      alert("Failed to upload listing.");
    }
  };

  return (
    <div className="min-h-screen bg-white px-24 py-12">
      <h1 className="text-3xl font-bold mb-6">List an Item</h1>

      {/* Photos Section */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-2">Photos</h2>
        <p className="text-gray-600 mb-4">
          Add up to four photos in JPEG or PNG format. Try to make your photos
          clear, with any flaws clearly presented.
        </p>

        {/* Photo Upload Grid */}
        <div className="grid grid-cols-4 gap-4 mb-4">
          {[...Array(4)].map((_, index) => {
            const imageSrc = uploadedImages[index];
            return (
              <div
                key={index}
                className="border-dotted border-2 border-gray-300 rounded-lg h-60 flex items-center justify-center text-center"
                draggable={!!imageSrc} // Allow dragging only if there's an image
                onDragStart={handleDragStart(index)}
                onDrop={(event) => handleDrop(index, event)}
                onDragOver={handleDragOver}
              >
                {imageSrc ? (
                  <img
                    src={imageSrc}
                    alt={`Uploaded ${index + 1}`}
                    className="object-cover w-full h-full rounded-lg"
                  />
                ) : (
                  <span className="flex items-center justify-center h-full">
                    {index === 0 ? "Cover Photo" : `Photo ${index + 1}`}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Add photos component */}
        <ImageUpload
          setImages={setUploadedImages}
          currentImages={uploadedImages}
        />

        {/* QR code section */}
        <div className="border border-gray-300 p-4 flex items-center justify-between rounded-lg mt-4">
          <div className="w-24 h-24 bg-gray-200 flex items-center justify-center">
            <img src="qr_code_placeholder.png" alt="QR Code" />
          </div>
          <div className="ml-4">
            <p className="font-bold">Scan the QR code on the left</p>
            <p>
              with your phone or tablet to easily add photos from another
              device.
            </p>
            <button className="bg-gray-100 mt-2 px-4 py-1 rounded-md">
              Scan me!
            </button>
          </div>
        </div>
      </section>

      <div className="flex flex-row w-full justify-between">
        <div className="w-[40%]">
          {/* Title Input */}
          <section className="w-full mt-4 mb-10">
            <h2 className="text-xl font-bold mb-2">Title</h2>
            <input
              type="text"
              placeholder="e.g. Women's Long Sleeve Tee"
              className="w-full border border-gray-300 rounded-lg p-2 text-gray-700"
              value={title} // Bind state to input
              onChange={(e) => setTitle(e.target.value)} // Update state on change
            />
          </section>

          {/* Description Input */}
          <section className="mb-8 w-full">
            <h2 className="text-xl font-bold mb-2">Description*</h2>
            <textarea
              placeholder="e.g. Stripey tee, only worn a few times."
              className="w-full border border-gray-300 rounded-lg p-2 h-72 text-gray-700"
              value={description} // Bind state to textarea
              onChange={(e) => setDescription(e.target.value)} // Update state on change
            />
          </section>
        </div>
        {/* Info Section */}
        <div className="mb-9 w-[58%] flex flex-row justify-between">
          <Category cats={category} setCats={setCategory} />
          <div className="w-[70%]">
            <Demographic demos={demographic} setDemos={setDemographic} />
            <Size size={size} setSize={setSize} />
            <div className="flex flex-row space justify-between">
              <Condition cond={condition} setCond={setCondition} />
              {/* Brand Input */}
              <section className="w-[60%] mt-4 mb-10">
                <h2 className="text-sm font-bold mb-2 text-slate-600">
                  Brand*
                </h2>
                <input
                  type="text"
                  placeholder="e.g. Gucci"
                  className=" mt-2 w-full border border-slate-200 rounded-lg p-2 text-gray-700"
                  value={brand} // Bind state to input
                  onChange={(e) => setBrand(e.target.value)} // Update state on change
                />
              </section>
            </div>
          </div>
        </div>
      </div>

      {/* Upload button */}
      {uploadedImages.length &&
      title.length &&
      category.length &&
      size.length &&
      demographic.length &&
      condition.length ? (
        <button
          onClick={handleUpload}
          style={{
            display: "inline-block",
            padding: "10px 20px",
            borderRadius: "5px",
            cursor: "pointer",
          }}
          className="bg-blue-500 text-white text-sm cursor-pointer"
        >
          List Item
        </button>
      ) : (
        <button
          onClick={() => {
            alert("Something is missing...");
          }}
          style={{
            display: "inline-block",
            padding: "10px 20px",
            borderRadius: "5px",
            cursor: "pointer",
          }}
          className="bg-blue-200 text-white text-sm cursor-pointer"
        >
          List Item
        </button>
      )}
    </div>
  );
};

export default ListAnItemPage;
