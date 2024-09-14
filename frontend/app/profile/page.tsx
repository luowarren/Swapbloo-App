import React from 'react';

interface ItemData {
    id: number;
    created_at: string;
    size: string;
    condition: string;
    category: string;
    swapped: boolean;
    owner_id: string;
    demographic: string;
    brand: string | null;
    caption: string | null;
    title: string;
    description: string;
    tags: string[];
    damage: string | null;
    location: string;
    ownerName: string;
    ownerRating: number;
    imageUrl: string;
}

interface UserData {
    username: string;
    name: string;
    bio: string;
    rating: number;
    numberOfRatings: number;
    location: string;
    profilePic: string;
    following: UserData[];
    followers: UserData[];
    items: ItemData[];
}

const MockUser: UserData = {
    username: "Sohee245",
    name: "Sohee",
    bio: "Welcome to my shop.... Some things are washed.... Others.... Moves like jagger Moves like jagger",
    rating: 4,
    numberOfRatings: 8,
    location: "South Brisbane, QLD",
    profilePic: "jojo.png",
    following: [],
    followers: [],
    items: []
}

const MockData: ItemData = {
    id: 4,
    created_at: "2024-08-09T04:59:51.518525+00:00",
    size: "AU 8",
    condition: "Very Good Condition",
    category: "Shirts",
    swapped: false,
    owner_id: "b484dc52-08ca-4518-8253-0a7cd6bec4e9",
    demographic: "Womens",
    brand: "Uniqlo",
    caption: null,
    title: "Women's Long Sleeve Dinosaur Tee",
    description: "This is a disgusting t-shirt that my Aunt Matilda gave me for Christmas in 2004. I found it so revolting that I threw it in the fireplace immediately, but alas, it did not burn. Every year when I clean out my wardrobe, I am filled with an unbecoming dread while this ghoulish garment taunts me from the shadows with its menacing polyester gaze. Afterward, awful things happen. I fear that my Aunt Matilda's terrible fashion sense continues to curse me even from her sullen grave.",
    tags: ["green", "#cottage-core"],
    damage: "Tomato sauce on left sleeve",
    location: "Nundah, QLD",
    ownerName: "Sohee",
    ownerRating: 4.0,
    imageUrl: "purple.jpg",
};

export default function Login() {
    return (
        <div className="max-w-4xl mx-auto bg-white">
            <div className="flex items-center space-x-4 p-4">
                <img
                    src="jojo.png"
                    alt="Profile"
                    className="w-20 h-20 rounded-full"
                />
                <div>
                    <h2 className="text-xl font-bold">{MockUser.username}</h2>
                    <div className="flex items-center">
                        <UserRating rating={MockUser.rating} />
                        <span className="text-sm ml-2 text-gray-600">({MockUser.numberOfRatings})</span>
                    </div>
                    <p className="text-sm text-gray-500">{MockUser.location}</p>
                </div>
            </div>
            <hr className="border-gray-600 mx-4"></hr>
            <div className="flex space-x-8 mt-5 mx-4">
                <span className="text-sm ">{MockUser.followers.length} Followers</span>
                <span className="text-sm">{MockUser.following.length} Following</span>
                <button className="bg-indigo-800 text-white px-8 font-bold rounded-md">
                    Follow
                </button>
                <button className="border border-indigo-800 px-6 font-bold text-indigo-800 rounded-md">
                    Message
                </button>
            </div>
            <div className="p-4">
                <h3 className="text-xl font-semibold">{MockUser.name}’s Swap Shop</h3>
                <p className="text-gray-700 mt-2 w-3/5"> {MockUser.bio}
                </p>
            </div>
            <div className="flex space-x-4 mt-4 px-4">
                <button className="font-semibold underline pb-2">
                    Listings
                </button>
                <button className="text-gray-500 pb-2">Archive</button>
                <button className="text-gray-500 pb-2">Likes</button>
            </div>
            <div className="flex space-x-4 p-4">
                <ListingCard name="Blue Baggy Jeans" size="S" brand="Cotton On" />
                <ListingCard name="Brown Baggy Jeans" size="6" brand="Glassons" />
                <ListingCard name="Distressed Jeans (Baggy)" size="6" brand="JayJays" />
                <ListingCard name="Old Jumper" size="6" brand="JayJays" />
            </div>
        </div>
    )
}

const ListingCard = ({ name, size, brand }: { name: string, size: string, brand: string }) => {
    return (
        <div className="flex flex-col justify-end p-2 relative">
            <div className="relative">
                <img src="purple.jpg" className="w-48 h-48 rounded-lg" />
                <img src="heart.png" className="absolute bottom-2 right-2 w-5" />
            </div>
            <p className="mt-2 text-sm font-semibold">{name}</p>
            <p className="text-xs text-gray-600">{size} · {brand}</p>
        </div>
    );
};

const UserRating: React.FC<UserData> = ({ rating }) => {
    const filledStars = "✭".repeat(rating);
    const emptyStars = "✩".repeat(5 - rating);

    return (
        <div className="text-xl">
            {filledStars}
            {emptyStars}
        </div>
    );
};