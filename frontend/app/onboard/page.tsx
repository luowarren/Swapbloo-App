"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../service/supabaseClient";
import { Cake, CakeSlice, Shirt } from "lucide-react";
import ImageUpload from "../components/ImageUpload";
import ShowMap from "../components/Map";

const Onboard: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [dob, setDob] = useState<string>("");
  const [storeDescription, setStoreDescription] = useState<string>("");
  const [location, setLocation] = useState<string>("UQ Union");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

  const handleOnboard = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    // Handle the submission logic here (e.g., supabase or API calls)
  };

  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setProfilePic(e.target.files[0]);
    }
  };

  return (
    <div className="flex justify-center min-h-screen bg-indigo-500">
      <div className="flex flex-row  gap-10 bg-white p-8 rounded-lg shadow-md min-w-[80vw] justify-center my-20 py-14">
        <div>
          <h1 className="text-4xl font-bold mb-6 italic text-indigo-700">
            Just one more thing...
          </h1>
          {error && <p className="text-red-500">{error}</p>}
          <form onSubmit={handleOnboard} className="space-y-4">
            {/* Name Input */}
            <div>
              <label className="block font-medium text-gray-500">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="Enter your name"
                required
              />
            </div>

            {/* Profile Picture Input */}
            <div className="w-full flex items-center gap-2">
              <label className="block font-medium text-gray-500">
                Profile Picture
              </label>
              <ImageUpload
                currentImages={uploadedImages}
                setImages={setUploadedImages}
                max={1}
              >
                <label
                  htmlFor="file-upload"
                  className="text-sm cursor-pointer border-2 rounded-sm px-2 py-1 border-indigo-500 text-indigo-500"
                >
                  Add image
                </label>
              </ImageUpload>
            </div>

            {/* Date of Birth Input */}
            <div>
              <label className="block font-medium text-gray-500">
                Date of Birth
              </label>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            {/* Store Description Input */}
            <div>
              <label className="block font-medium text-gray-500">
                Store Description
              </label>
              <textarea
                value={storeDescription}
                onChange={(e) => setStoreDescription(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="Describe your store"
                rows={3}
              />
            </div>

            {/* Location Input */}
            <div>
              <label className="block font-medium text-gray-500">
                Location
              </label>
              <label className="block text-sm text-gray-500 ">
                Select your preferred location using the map below
              </label>
            </div>

            <ShowMap setter={setLocation} />

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-indigo-500 text-white p-2 rounded hover:bg-indigo-800 transition"
            >
              {loading ? (
                <div className="flex w-full justify-center items-center">
                  <div className="animate-spin">
                    <Shirt className="text-white" />
                  </div>
                </div>
              ) : (
                "Take me to my store"
              )}
            </button>
          </form>
        </div>

        {/* PREVIEW */}
        <div className="w-[30%] border-2 rounded-lg h-40 p-5">
          <div className="flex flex-row gap-2">
            <div className="h-12 w-12 rounded-full bg-gray-300 overflow-hidden">
              {uploadedImages.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Uploaded Image ${index + 1}`}
                  style={{ width: "48px", height: "48px" }}
                />
              ))}
            </div>
            <div className="flex flex-col">
              <div className="font-medium text-gray-700">
                <span className="font-bold text-indigo-700">
                  {name === "" ? (
                    <span className="text-gray-400">Your name</span>
                  ) : (
                    name
                  )}
                </span>
                's Store
              </div>
              <div className="flex gap-1 items-center text-sm rounded-full bg-indigo-100 text-indigo-700 font-medium w-fit py-1 px-2">
                <Cake className="w-4 h-4" />
                {dob === "" ? "Your birthday" : dob}
              </div>
            </div>
          </div>
          <div className="mt-4 text-gray-700">
            {storeDescription === "" ? (
              <span className="text-gray-400">Your store description...</span>
            ) : (
              storeDescription
            )}
          </div>

          <div>{location}</div>
        </div>
      </div>
    </div>
  );
};

export default Onboard;
