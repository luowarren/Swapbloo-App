import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ReactNode, useEffect, useState } from "react";
import ItemImages from "../components/ItemImages";
import UserRating from "../components/UserRating";
import { Heart, MoreHorizontal, Share } from "lucide-react";
import { getUser } from "@/service/users";
import ProfileImage from "../components/ProfileImage";
import VisitShopModal from "../components/VisitShopModal";
import ShowMap from "../components/Map";
import ShopModal from "../components/ShopModal";

const ItemModal = ({ item, children }: { item: any; children: ReactNode }) => {
  const handleMakeOffer = () => {};
  const [userLoading, setUserLoading] = useState(true);
  const [user, setUser] = useState<any>(undefined);

  useEffect(() => {
    getUser(item.owner_id).then((user) => {
      console.log(user);
      setUserLoading(false);
      setUser(user.Users?.[0]);
    });
  }, []);

  return (
    <Dialog>
      <DialogTrigger className="w-full">{children}</DialogTrigger>
      <DialogContent className="min-w-[80vw] h-[80vh] overflow-scroll">
        <div className="min-h-screen bg-white flex">
          <div className="w-1/2 flex-col justify-center relative">
            <ItemImages
              buttons={true}
              className="rounded-md"
              itemId={item.id}
            />
          </div>

          <div className="p-4 w-1/2">
            <h1 className="text-3xl font-bold text-gray-700">{item.title}</h1>
            <p className="text-m mb-2 text-gray-500">
              {item.size} - {item.condition} - {item.brand}
            </p>
            <div className="flex space-x-2">
              <button
                onClick={handleMakeOffer}
                className="bg-indigo-700 hover:bg-indigo-800 text-white font-bold py-2 px-4 rounded-sm"
              >
                Make Offer
              </button>

              <button className="text-indigo-800 bg-gray-100 p-2 rounded-sm">
                <Heart />
              </button>

              <button className="text-indigo-800 bg-gray-100 p-2 rounded-sm">
                <Share />
              </button>

              <button className="text-indigo-800 bg-gray-100 p-2 rounded-sm">
                <MoreHorizontal />
              </button>
            </div>

            <hr className="border-gray-300 mt-2"></hr>
            <p className="text-gray-700 mt-2">{item.caption}</p>

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
              <div
                style={{
                  width: "100%",
                  height: "200px",
                  borderRadius: "100px",
                }}
              >
                {!userLoading && (
                  <ShowMap
                    width="100%"
                    height="100%"
                    selectedLocation={user.location}
                  ></ShowMap>
                )}
              </div>
              <p className="text-sm text-gray-700 mb-2">{item.location}</p>

              {!userLoading && (
                <div className="mt-8">
                  <div className="text-gray-500 font-medium">
                    Seller information
                  </div>
                  <div className="flex gap-2 items-center ">
                    <ProfileImage userId={item.owner_id} />
                    <div className="flex flex-col pt-4">
                      <p className="text-gray-700 font-semibold">{user.name}</p>
                      <div className="flex items-center text-sm text-gray-700 mb-5">
                        <UserRating
                          rating={user.rating}
                          num={user.num_of_ratings}
                          reviewButton={false}
                        />
                        {/* <span className="ml-1">(8)</span> */}
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2 text-sm">
                    <ShopModal otherUser={user}>
                      <button className="border bg-white border-indigo-800 text-indigo-800 font-semibold py-1 px-2 rounded-sm mr-2 hover:bg-indigo-50">
                        Visit Shop
                      </button>
                    </ShopModal>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ItemModal;
