"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../service/supabaseClient";
import { Cake, CakeSlice, MapPin, Shirt } from "lucide-react";
import ImageUpload from "../components/ImageUpload";
import ShowMap from "../components/Map";
import { uploadImage } from "@/service/items";
import { createUser, getUser } from "@/service/users";
import { locations } from "../profile/locations";

const Onboard: React.FC = () => {
  const router = useRouter();
  const [userId, setUserId] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [imageName, setImageName] = useState<string>("");
  const [dob, setDob] = useState<string>("");
  const [storeDescription, setStoreDescription] = useState<string>("");
  const [location, setLocation] = useState<string>("UQ Union");
  const [error, setError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const { data, error } = await supabase.auth.getUser();

      if (error || !data?.user) {
        window.location.href = "/";
        return;
      }

      const userId = data.user.id;
      setUserId(userId);

      const { Users, error: userError } = await getUser(userId);
      if (userError) {
        console.error("Error fetching user:", userError);
        window.location.href = "/";
        return;
      }

      if (Users && Users.length > 0) {
        window.location.href = "/listings";
      }

      setPageLoading(false);
    };
    checkUser(); // Run the check on component mount
  }, [router]);

  if (pageLoading) {
    return (
      <div className="flex w-[100vw] h-[100vh] justify-center items-center">
        <div className="animate-spin">
          <Shirt className="text-white" />
        </div>
      </div>
    );
  }

  const handleOnboard = async () => {
    // return;
    try {
      // Ensure all required fields are filled out
      if (name == "" || uploadedImages.length === 0 || dob == "") {
        setError(true);
        setLoading(false);
        console.log("Validation error: One or more fields are missing.");
        return;
      }

      // Upload images
      await handleUpload();

      // Create user with the uploaded data
      const userResponse = await createUser(
        userId,
        name,
        dob,
        storeDescription,
        location,
        imageName
      );

      if (userResponse.error) {
        throw new Error(userResponse.error);
      }

      console.log("User successfully onboarded.");
      window.location.href = "/listings";
    } catch (error: any) {
      console.error("Error during onboarding:", error.message);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async () => {
    try {
      const uploadPromises = uploadedImages.map(async (image, index) => {
        const fileName = `image_${Date.now()}_${index}.png`;
        setImageName(fileName);
        let uploadedImage = await uploadImage(image, fileName);
        if (uploadedImage.error) throw uploadedImage.error;
      });

      await Promise.all(uploadPromises);
    } catch (error) {
      console.error("Error uploading listing:", error);
      alert("Failed to upload listing.");
    }
  };

  return (
    <div
      className="flex justify-center items-center h-[100vh] bg-indigo-700"
      style={{
        backgroundImage:
          "url(https://img.freepik.com/free-vector/seamless-woman-s-stylish-bags-sketch_98292-4347.jpg?t=st=1728605120~exp=1728608720~hmac=61089c7da794f909b80d339eb78cab0540624f18bb6216f2955b7946ddb9e25f&w=1380)",
        backgroundSize: "800px", // Adjust the size of the image
        backgroundRepeat: "repeat", // Set the background to repeat
        backgroundPosition: "top left", // Set the starting point of the image
      }}
    >
      {/* <h1 className="text-5xl font-bold mb-6 italic text-indigo-700 text-center">
        Finish signing up
      </h1> */}

      <div className="flex flex-row gap-0 bg-white border border-gray-300 rounded-lg min-w-[70vw] justify-center shadow-md h-[80vh] overflow-hidden">
        <div className="flex max-h-[80vh] overflow-scroll w-full p-8 pb-10">
          {error && (
            <p className="text-red-500">Please fill in all the fields!!</p>
          )}

          <div className="space-y-4">
            <h1 className="text-5xl font-bold mb-6 italic text-indigo-700 text-center">
              Finish signing up
            </h1>
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
              onClick={() => handleOnboard()}
              className="w-full bg-indigo-500 text-white p-2 rounded-t-md hover:bg-indigo-800 transition"
            >
              {loading ? (
                <div className="flex w-full justify-center items-center">
                  <div className="animate-spin">
                    <Shirt className="text-white" />
                  </div>
                </div>
              ) : (
                "Finish registration!"
              )}
            </button>
          </div>
        </div>

        {/* PREVIEW */}
        <div className="h-full flex bg-indigo-500 border-l-2 border-l-indigo-800 w-[80%] items-center justify-center">
          <div className="max-w-[80%] w-[80%] border-2 border-gray-200 bg-white rounded-lg h-fit p-5">
            <div className="my-1 text-sm text-gray-500 font-bold mb-4">
              PREVIEW
            </div>
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

            <div className="p-2 bg-gray-100 w-full flex flex-col text-gray-600 rounded my-2">
              <div className="text-sm text-gray-500">Preferred location:</div>
              <div className="font-semibold flex gap-1 items-center mb-2">
                <MapPin className="w-5 h-5" />
                {location}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboard;
