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

const timeAgo = (dateString: string) => {
  const now = new Date();
  const itemDate = new Date(dateString);
  const differenceInMilliseconds = now.getTime() - itemDate.getTime();

  const minutes = Math.floor(differenceInMilliseconds / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `Listed ${days} day${days > 1 ? 's' : ''} ago`;
  if (hours > 0) return `Listed ${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (minutes > 0) return `Listed ${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  return `Listed just now`;
};

const UserRating: React.FC<ItemData> = ({ ownerRating }) => {
  const filledStars = "✭".repeat(ownerRating);
  const emptyStars = "✩".repeat(5 - ownerRating);

  return (
    <div className="text-xl">
      {filledStars}
      {emptyStars}
    </div>
  );
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
        <div className="flex space-x-2 my-6">
          <button className="bg-indigo-700 hover:bg-indigo-800 text-white font-bold py-2 px-10 rounded-lg">
            Make offer
          </button>

          <button className="bg-indigo-700 hover:bg-indigo-800 text-white p-2 rounded-lg">
            <img src="flower.png" className="w-6 h-6" ></img>
          </button>

          <button className="bg-indigo-700 hover:bg-indigo-800 text-white p-2 rounded-lg">
            <img src="flower.png" className="w-6 h-6" ></img>
          </button>

          <button className="bg-indigo-700 hover:bg-indigo-800 text-white p-2 rounded-lg">
            <img src="flower.png" className="w-6 h-6" ></img>
          </button>
        </div>
        <hr className="border-gray-600 w-3/4"></hr>
        <p className="text-gray-800 mt-4 w-3/4">{MockData.description}</p>

        <div className="flex space-x-2 my-4">
          {MockData.tags.map((tag, index) => (
            <span key={index} className="text-xs bg-gray-200 rounded-full px-2 py-1">{tag}</span>
          ))}
        </div>

        <div className="flex items-center text-sm text-gray-800 mt-2">
          <img src="exclamation-mark.png" className="w-6 h-6 mr-3" ></img>
          <span>Damage: {MockData.damage}</span>
        </div>

        <p className="text-xs text-gray-500 mt-3">{timeAgo(MockData.created_at)}</p>

        <div className="mt-4">
          <div className="bg-green-300 rounded-lg w-3/4 h-24 flex items-center justify-center text-center mb-2">
            <span className="text-black font-bold">Map</span>
          </div>
          <p className="text-sm text-gray-700 mb-2">{MockData.location}</p>
          <hr className="border-gray-600 w-3/4"></hr>

          <div className="flex items-center my-4">
            <img
              src="jojo.png"
              alt="Owner Avatar"
              className="w-12 h-12 rounded-full mr-4"
            />
            <div>
              <p className="text-black font-semibold">{MockData.ownerName}</p>
              <div className="flex items-center text-sm text-gray-700">
                <UserRating ownerRating={MockData.ownerRating} />
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
  );
};

export default Item;

