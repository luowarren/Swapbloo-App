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

const Item = () => {
  return (
    <div className="min-h-screen bg-white flex">
      <div className="w-1/2 flex flex-col items-center justify-center relative my-20 space-y-4">
        <img src={MockData.imageUrl} alt={MockData.title} className="w-3/4 h-3/4" />
        <img src={MockData.imageUrl} alt={MockData.title} className="w-3/4 h-3/4" />
        <img src={MockData.imageUrl} alt={MockData.title} className="w-3/4 h-3/4" />
      </div>

      <div className="p-4 w-1/2 my-20">
        <h1 className="text-3xl font-bold">{MockData.title}</h1>
        <p className="text-m my-2 text-gray-600">{MockData.size} • {MockData.condition} • {MockData.brand}</p>
        <div className="flex space-x-2">
          <button className="bg-indigo-700 hover:bg-indigo-800 text-white font-bold py-2 px-4 rounded-full">
            Make offer
          </button>

          <button className="bg-indigo-700 hover:bg-indigo-800 text-white p-2 rounded-full">
            <img src="flower.png" className="w-6 h-6" ></img>
          </button>

          <button className="bg-indigo-700 hover:bg-indigo-800 text-white p-2 rounded-full">
            <img src="flower.png" className="w-6 h-6" ></img>
          </button>

          <button className="bg-indigo-700 hover:bg-indigo-800 text-white p-2 rounded-full">
            <img src="flower.png" className="w-6 h-6" ></img>
          </button>
        </div>
        <p className="text-gray-800 mt-4">{MockData.description}</p>

        <div className="flex space-x-2 mt-4">
          {MockData.tags.map((tag, index) => (
            <span key={index} className="text-xs bg-gray-200 rounded-full px-2 py-1">{tag}</span>
          ))}
        </div>

        {MockData.damage && (
          <p className="text-red-500 text-sm mt-2">
            <i className="fas fa-exclamation-circle"></i> {MockData.damage}
          </p>
        )}

        <p className="text-xs text-gray-500 mt-2">Listed 1 hour ago</p>

        <div className="flex justify-between items-center mt-4">
          <button className="bg-green-500 text-white px-4 py-2 rounded">Map</button>
          <div className="flex items-center space-x-2">
            <img src="/path/to/owner-avatar.png" alt={MockData.ownerName} className="w-8 h-8 rounded-full" />
            <div>
              <p className="text-sm font-bold">{MockData.ownerName}</p>
              <p className="text-xs text-gray-500">{MockData.ownerRating} ⭐</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Item;

