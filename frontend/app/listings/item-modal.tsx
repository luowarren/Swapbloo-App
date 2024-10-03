import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ReactNode, useState } from "react";
import ItemImages from "../components/ItemImages";
import UserRating from "../components/UserRating";

const ItemModal = ({ item, children }: { item: any; children: ReactNode }) => {
  const handleMakeOffer = () => {};
  const [profilePic, setProfilePic] = useState<string | null>(null); // State for profile picture

  return (
    <Dialog>
      <DialogTrigger className="w-full">{children}</DialogTrigger>
      <DialogContent className="min-w-[80vw] h-[80vh] overflow-scroll">
        <div className="min-h-screen bg-white flex">
          <div className="w-1/2 flex flex-col items-center justify-center relative my-20 space-y-4">
            <ItemImages itemId={item.id} />
          </div>

          <div className="p-4 w-1/2 my-20">
            <h1 className="text-3xl font-bold">{item.title}</h1>
            <p className="text-m my-2 text-gray-600">
              {item.size} • {item.condition} • {item.brand}
            </p>
            <div className="flex space-x-2">
              <button
                onClick={handleMakeOffer}
                className="bg-indigo-700 hover:bg-indigo-800 text-white font-bold py-2 px-4 rounded-full"
              >
                Make Offer
              </button>

              <button className="bg-indigo-700 hover:bg-indigo-800 text-white p-2 rounded-full">
                <img src="flower.png" className="w-6 h-6" alt="flower icon" />
              </button>

              <button className="bg-indigo-700 hover:bg-indigo-800 text-white p-2 rounded-lg">
                <img src="flower.png" className="w-6 h-6"></img>
              </button>

              <button className="bg-indigo-700 hover:bg-indigo-800 text-white p-2 rounded-lg">
                <img src="flower.png" className="w-6 h-6"></img>
              </button>
            </div>

            <hr className="border-gray-600 w-3/4 mt-2"></hr>
            <p className="text-gray-800 mt-4">{item.description}</p>

            {item.damage && (
              <div className="flex items-center text-sm text-gray-800 mt-2">
                <img src="exclamation-mark.png" className="w-6 h-6 mr-3"></img>
                <span>Damage: {item.damage}</span>
              </div>
            )}
            <p className="text-xs text-gray-500 mt-2">
              Listed {new Date(item.created_at).toLocaleString()}
            </p>

            <div className="mt-4">
              <div className="bg-green-300 rounded-lg w-3/4 h-24 flex items-center justify-center text-center mb-2">
                <span className="text-black font-bold">Map</span>
              </div>
              <p className="text-sm text-gray-700 mb-2">{item.location}</p>
              <hr className="border-gray-600 w-3/4"></hr>

              <div className="flex items-center my-4">
                {profilePic && (
                  <img
                    src={profilePic}
                    alt="Owner Avatar"
                    className="w-12 h-12 rounded-full mr-4"
                  />
                )}
                <div>
                  <p className="text-black font-semibold">{item.ownerName}</p>
                  <div className="flex items-center text-sm text-gray-700">
                    <UserRating rating={item.ownerRating} />
                    <span className="ml-1">(8)</span>
                  </div>
                </div>
              </div>

              <div className="flex space-x-2">
                <button className="border border-indigo-800 text-indigo-800 font-semibold px-10 py-2 rounded-lg mr-2 hover:bg-indigo-50">
                  Visit Shop
                </button>
                <button className="border border-indigo-800 text-indigo-800 font-semibold px-10 py-2 rounded-lg hover:bg-indigo-50">
                  Ask a question
                </button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ItemModal;
