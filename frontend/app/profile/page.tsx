"use client";
import React, { useEffect, useState } from 'react';
import { fetchUserData, fetchUserItems, } from '../../service/users';
import { getUserId } from '@/service/auth';
import { getUser } from '../../service/users';
import { getListingsByUsers } from '@/service/items';
import ProfileImage from '../components/ProfileImage';
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
      console.log("userrrr", userBlob.Users)
      if (userBlob.Users?.length > 0) {
        const user = userBlob.Users[0];
        setUser(user);
        // Fetch user's items
        const userItemsBlob = await getListingsByUsers([user.id]);
        console.log("iteming", userItemsBlob)
        const userItems = userItemsBlob.data
        setItems(userItems);
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
  name: string;
  size: string;
  brand: string;
}

const ListingCard: React.FC<ListingCardProps> = ({ name, size, brand }) => {
  return (
    <div className="flex flex-col justify-end p-2 relative">
      <div className="relative">
        <img src="purple.jpg" className="w-48 h-48 rounded-lg" />
        <img src="heart.png" className="absolute bottom-2 right-2 w-5" />
      </div>
      <p className="mt-2 text-sm font-semibold">{name}</p>
      <p className="text-xs text-gray-600">
        {size} · {brand}
      </p>
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
