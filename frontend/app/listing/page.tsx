"use client";
import React, { useEffect, useState, useRef } from "react";
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
import QRCode from "qrcode";
import { ChevronLeft, Image, Info, Send, Shirt, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const ListAnItemPage: React.FC = () => {
  const [currUserId, setCurrUserId] = useState<string>("");
  const [demographic, setDemographic] = useState<string[]>([]);
  const [category, setCategory] = useState<string[]>([]);
  const [size, setSize] = useState<string[]>([]);
  const [condition, setCondition] = useState<string[]>([]);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [brand, setBrand] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null); // Reference for canvas
  const [listingId, setListingId] = useState<string>(""); // State for listing ID
  const [loading, setLoading] = useState(true);
  const router = useRouter();

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
    const uid = await getUserId();
    if (uid != null) {
      setCurrUserId(uid);
    } else {
      throw new Error();
    }
  };

  useEffect(() => {
    handleCurrentUser();
  }, []);

  useEffect(() => {
    if (canvasRef.current) {
      const uploadUrl = `https://93c9-61-68-215-159.ngrok-free.app/login`; // Generate unique upload URL
      QRCode.toCanvas(canvasRef.current, uploadUrl, function (error) {
        if (error) console.error(error);
      });
    }
  }, [uploadedImages, listingId]); // Regenerate QR code when images are uploaded or listingId changes

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 250);

    return () => clearTimeout(timer);
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
    event.preventDefault();
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

      // Set the listing ID for QR code
      if (item.data !== null) setListingId(item.data[0].id);
      const uploadPromises = uploadedImages.map(async (image, index) => {
        const fileName = `image_${Date.now()}_${index}.png`;
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
      alert("Listing uploaded successfully!");
      clearAllStates();
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (error) {
      console.error("Error uploading listing:", error);
      alert("Failed to upload listing.");
    }
  };

  // if (loading)
  //   return (
  //     <div className="w-full h-[80vh] bg-white flex items-center justify-center">
  //       <div className="animate-spin">
  //         <Shirt className="text-indigo-600" />
  //       </div>
  //     </div>
  //   );

  return (
    <>
      {/* LOADER */}
      <div
        className={cn(
          "w-full h-[80vh] bg-white flex items-center justify-center",
          !loading && "hidden"
        )}
      >
        <div className="animate-spin [animation-duration:500ms]">
          <Shirt className="text-indigo-600" />
        </div>
      </div>

      {/* MAIN PAGE */}
      <div className={cn("min-h-screen bg-white pt-12", loading && "hidden")}>
        <div
          className="mb-4 text-gray-500 flex gap-1 items-center bg-gray-100 rounded w-fit px-2 py-1 pr-4 hover:bg-gray-200 transition cursor-pointer mx-24"
          onClick={() => {
            router.push("/listings");
          }}
        >
          <ChevronLeft className="h-4 w-4 stroke-[2.5px]" />
          Go back
        </div>
        <h1 className="text-5xl font-bold mb-6 italic text-indigo-700 mx-24">
          List an item swap
        </h1>

        <section className="mb-8 mx-24">
          <h2 className="text-xl font-bold text-gray-500">Photos</h2>
          <p className="text-gray-500 mb-4">
            Add up to four photos in JPEG or PNG format. Try to make your photos
            clear, with any flaws clearly presented.
          </p>

          <div className="grid grid-cols-4 gap-4 mb-4">
            {[...Array(4)].map((_, index) => {
              const imageSrc = uploadedImages[index];
              return (
                <div
                  key={index}
                  className="border-dotted border-2 border-indigo-400 bg-indigo-50 rounded-lg h-60 flex items-center justify-center text-center"
                  draggable={!!imageSrc}
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
                    <span className="flex flex-col gap-2 items-center justify-center h-full text-indigo-400 font-medium">
                      <Image className="h-8 w-8" />
                      {`Photo ${index + 1}`}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          <ImageUpload
            setImages={setUploadedImages}
            currentImages={uploadedImages}
          >
            <label htmlFor="file-upload" className="text-sm cursor-pointer">
              <div className="flex flex-row items-center justify-center gap-1 px-2 py-2 rounded bg-indigo-600 text-white">
                <Upload className="h-4 w-4 stroke-[2.5px]" />
                Add image
              </div>
            </label>
          </ImageUpload>

          <div className="w-full flex items-center justify-center">
            <div className="p-2 bg-gray-100 flex items-center rounded-lg mt-4 w-[70%]">
              <canvas
                ref={canvasRef}
                width={125}
                height={125}
                className="bg-gray-200 rounded border border-gray-300"
              />
              <div className="ml-4 text-gray-600 ">
                <div className="flex flex-row text-gray-500 font-bold gap-1 items-center mb-2">
                  <Info className="h-5 w-5" /> Tip
                </div>
                <p className="font-bold text-2xl italic ">
                  Want to upload from your mobile phone?
                </p>
                <p>
                  Scan this QR code with your phone or tablet to easily add
                  photos from another device.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Title and Description Input */}
        <div className="flex flex-row w-full justify-between bg-indigo-600 px-24 pt-36 -mt-28 text-white">
          <div className="w-[40%]">
            <section className="w-full mt-4 mb-10">
              <h2 className="text-xl font-bold mb-2 italic">Title</h2>
              <input
                type="text"
                placeholder="e.g. Women's Long Sleeve Tee"
                className="w-full border border-gray-300 rounded-lg p-2 text-gray-700"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </section>

            <section className="mb-8 w-full">
              <h2 className="text-xl font-bold mb-2 italic">
                Description<span className="text-rose-400">*</span>
              </h2>
              <textarea
                placeholder="e.g. Stripey tee, only worn a few times."
                className="w-full border border-gray-300 rounded-lg p-2 h-72 text-gray-700"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </section>
          </div>

          <div className="mb-9 w-[58%] flex flex-row justify-between">
            <Category cats={category} setCats={setCategory} light={true} />
            <div className="w-[70%]">
              <Demographic
                demos={demographic}
                setDemos={setDemographic}
                light={true}
              />
              <Size size={size} setSize={setSize} light={true} />
              <div className="flex flex-row space justify-between">
                <Condition
                  cond={condition}
                  setCond={setCondition}
                  light={true}
                />
                <section className="w-[60%] mt-4 mb-10">
                  <h2 className="text-sm font-bold mb-2 text-white italic">
                    Brand<span className="text-rose-400">*</span>
                  </h2>
                  <input
                    type="text"
                    placeholder="e.g. Gucci"
                    className="mt-2 w-full border border-gray-200 rounded-lg p-2 text-gray-700"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                  />
                </section>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-indigo-600 pb-12 px-24">
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
                borderRadius: "5px",
                cursor: "pointer",
              }}
              className="bg-white text-indigo-600 font-semibold text-lg cursor-pointer px-4 py-2"
            >
              <div className="flex gap-2 items-center justify-center">
                <Send className="w-4 h-4 stroke-[2.5px]" />
                Send it!
              </div>
            </button>
          ) : (
            <button
              style={{
                display: "inline-block",
                borderRadius: "5px",
                cursor: "not-allowed",
              }}
              className="bg-indigo-200 text-white font-semibold text-lg cursor-pointer px-4 py-2"
            >
              <div className="flex gap-2 items-center justify-center">
                <Send className="w-4 h-4 stroke-[2.5px]" />
                Send it!
              </div>
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default ListAnItemPage;
