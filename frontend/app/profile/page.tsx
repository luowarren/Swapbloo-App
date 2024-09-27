"use client";
import React, { useEffect, useState } from 'react';
import { fetchUserData, fetchUserItems } from '../../service/users';
import { getUserId } from '@/service/auth';
import { getUser } from '../../service/users';
import { getListingsByUsers } from '@/service/items';
import ProfileImage from '../components/ProfileImage';
import ItemImages from '../components/ItemImages';
import { useRouter } from 'next/navigation';
// Define types for UserData and ItemData
interface UserData {
  id: string;
  username: string;
  name: string;
  bio: string;
  rating: number;
  num_of_ratings: number;
  location: string;
  image: string;
}

interface ItemData {
  id: number;
  title: string;
  size: string;
  brand: string | null;
}

const Login: React.FC = () => {
  const [user, setUser] = useState<UserData | null>(null);
  const [items, setItems] = useState<ItemData[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadUserData = async () => {
      // Fetch user data
      const uid = await getUserId();

      const userBlob = await getUser(uid);
      console.log("userrrr", userBlob.Users);

      // Safely check if userBlob.Users exists and has items
      if (userBlob?.Users && userBlob.Users.length > 0) {
        const user = userBlob.Users[0];
        setUser(user);

        // Fetch user's items
        const userItemsBlob = await getListingsByUsers([user.id]);
        console.log("iteming", userItemsBlob);

        // Handle the case where userItemsBlob.data might be null
        const userItems = userItemsBlob?.data ?? []; // Default to empty array if null
        setItems(userItems);
      } else {
        console.warn("No user data found");
      }
      setLoading(false);
    };

    loadUserData();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!user) {
    return <p>No user found</p>;
  }

  return (
    <div className="max-w-4xl mx-auto bg-white">
      <div className="flex items-center space-x-4 p-4">
        <ProfileImage userId={user.id}></ProfileImage>
        <div>
          <h2 className="text-xl font-bold">{user.username}</h2>
          <div className="flex items-center">
            <UserRating rating={user.rating} />
            <span className="text-sm ml-2 text-gray-600">
              ({user.num_of_ratings})
            </span>
          </div>
          <p className="text-sm text-gray-500">{user.location}</p>
        </div>
      </div>
      <hr className="border-gray-600 mx-4" />
      <div className="flex space-x-8 mt-5 mx-4">
        <button className="border border-indigo-800 px-6 font-bold text-indigo-800 rounded-md">
          Message
        </button>
      </div>
      <div className="p-4">
        <h3 className="text-xl font-semibold">{user.name}’s Swap Shop</h3>
        <p className="text-gray-700 mt-2 w-3/5">{user.bio}</p>
      </div>
      <div className="flex space-x-4 mt-4 px-4">
        <button className="font-semibold underline pb-2">Listings</button>
      </div>
      <div className="flex space-x-4 p-4">
        {items.length > 0 ? (
          items.map((item) => (
            <ListingCard
              key={item.id}
              name={item.title}
              size={item.size}
              brand={item.brand || 'Unknown'}
              id={item.id}
            />
          ))
        ) : (
          <p>No items currently listed</p>
        )}
      </div>
    </div>
  );
};
interface ListingCardProps {
  id: number; // Add `id` to the props definition
  name: string;
  size: string;
  brand: string | null;
}

const ListingCard: React.FC<ListingCardProps> = ({ name, size, brand, id }) => {
    const router = useRouter(); // Move useRouter to the top of the component

  const handleCardClick = (id: number) => {
    router.push(`/item?itemId=${id}`); // Use router here
  };
  return (
    <div>
      <div
        className="relative flex flex-col w-40 h-56 mx-2 rounded-md border shadow-md bg-white overflow-hidden"
        onClick={() => handleCardClick(id)} // Wrap the function call in an arrow function
        style={{ cursor: "pointer" }}
      >
        {/* Main image area */}
        <div className="relative w-full h-3/4"> {/* Set height to 75% of the card */}
          {/* Item image */}
          <ItemImages
            itemId={id}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      {/* Text below the image */}
      <div className="mt-2 text-center">
        <p className="text-sm font-semibold text-indigo-900">{brand}</p>
        <p className="text-xs text-gray-600">{size}</p>
      </div>
    </div>
  );
};

interface UserRatingProps {
  rating: number;
}

const UserRating: React.FC<UserRatingProps> = ({ rating }) => {
  const filledStars = '✭'.repeat(rating);
  const emptyStars = '✩'.repeat(5 - rating);

  return (
    <div className="text-xl">
      {filledStars}
      {emptyStars}
    </div>
  );
};

export default Login;
