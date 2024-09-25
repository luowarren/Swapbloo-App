"use client";

import { getActiveListings } from "@/service/items";
import { Shirt } from "lucide-react";
import { useEffect, useState } from "react";
import ListingCard from "./listing-card";

const Listings = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any[] | null>(null);
  useEffect(() => {
    getActiveListings().then((data) => {
      console.log(data);
      setLoading(false);
      setData(data.data);
    });
  }, []);

  if (loading || data == null) {
    return (
      <div className="flex h-[85vh] w-full justify-center items-center">
        <div className="animate-spin">
          <Shirt className="text-indigo-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 h-[85vh] w-full overflow-scroll px-2 mt-4">
      {data.map((item: any, index) => {
        return <ListingCard key={index} data={item} />;
      })}
    </div>
  );
};

export default Listings;
