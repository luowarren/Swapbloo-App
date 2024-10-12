import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ReactNode, useEffect, useState } from "react";
import ItemImages from "../components/ItemImages";
import UserRating from "../components/UserRating";
import { Heart, MoreHorizontal, Share } from "lucide-react";
import { getUser } from "@/service/users";
import { useRouter } from "next/navigation";
import ProfileImage from "../components/ProfileImage";
import VisitShopModal from "../components/VisitShopModal";
import ShowMap from "../components/Map";
import ShopModal from "../components/ShopModal";

const ItemModal = ({ item, children }: { item: any; children: ReactNode }) => {
  const router = useRouter();
  const [userLoading, setUserLoading] = useState(true);
  const [user, setUser] = useState<any>(undefined);
  const [isMyItem, setIsMyItem] = useState(false);
  const [selfUser, setSelfUser] = useState<string>("");
  const [modalOpen, setModalOpen] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false); // State for controlling the success modal

  const handleMakeOffer = () => {
    router.push(`/offer?itemId=${item.id}&ownerId=${item.owner_id}`);
  };
  
  useEffect(() => {
    const fetchUserData = async () => {
      const fetchedUser = await getUser(item.owner_id);
      setUser(fetchedUser.Users?.[0]);
      setUserLoading(false);
    };

    const fetchUserId = async () => {
      const userId = await getUserId();
      setSelfUser(userId); // Set the user ID state

      // Avoid re-rendering by moving this logic into the effect.
      if (userId === item.owner_id) {
        setIsMyItem(true);
      }
    };

    fetchUserData();
    fetchUserId();
  }, [item.owner_id]); // Only run once when item.owner_id changes

  const handleCloseModal = () => {
    setShowSuccessModal(false);
    router.push('/marketplace'); // Redirect to the marketplace after closing the modal
  };

  const handleDelete = async () => {
    const { error } = await deleteItemListing(item.id);
    if (!error) {
      setShowSuccessModal(true); // Show success modal on successful deletion
    }
    setModalOpen(false)
    // TODO neeed to 
  };

  return (
    <Dialog open={modalOpen} onOpenChange={setModalOpen}>
      <DialogTrigger className="w-full">{children}</DialogTrigger>
      <DialogContent className="min-w-[80vw] h-[80vh] overflow-scroll" >
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
              {isMyItem ? (
                <div>
                 <button
                      onClick={handleDelete}
                      className="bg-indigo-700 hover:bg-indigo-800 text-white font-bold py-2 px-4 rounded-sm"
                      >
                        Delete Item
                    </button>
                </div>
              ) : (
                <button
                onClick={handleMakeOffer}
                className="bg-indigo-700 hover:bg-indigo-800 text-white font-bold py-2 px-4 rounded-sm"
                >
                  Make Offer
                </button>
              )
              } 
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

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Item Deleted Successfully!</h2>
            <p>Your item has been deleted.</p>
            <button
              onClick={handleCloseModal}
              className="mt-4 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </Dialog>
  );
};

export default ItemModal;
