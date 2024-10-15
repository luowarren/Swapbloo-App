"use client";

import { getActiveListings } from "@/service/items";
import {
  getfilteredItems,
  searchAndFilter,
  searchFilter,
} from "@/service/listings";
import { Shirt } from "lucide-react";
import { useEffect, useState } from "react";
import ListingCard from "./listing-card";
import { filterType } from "./page";
import {
  CATEGORIES,
  CONDITIONS,
  DEMOGRAPHICS,
  SIZES,
} from "@/service/constants";

const Listings = ({
  filter,
  search,
}: {
  filter: filterType;
  search?: string;
}) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any[] | null>(null);
  useEffect(() => {
    getActiveListings().then((data) => {
      setLoading(false);
      setData(data.data);
    });
  }, []);

  useEffect(() => {
    setLoading(true);

    const sizes = filter.size.length == 0 ? SIZES : filter.size;
    const category = filter.category.length == 0 ? CATEGORIES : filter.category;
    const condition =
      filter.condition.length == 0 ? CONDITIONS : filter.condition;
    const demographic =
      filter.demographic.length == 0 ? DEMOGRAPHICS : filter.demographic;

    if (search) {
      searchAndFilter(search, sizes, category, condition, demographic).then(
        (data) => {
          setLoading(false);
          setData(data.data);
        }
      );
    } else {
      getfilteredItems(sizes, category, condition, demographic).then((data) => {
        setLoading(false);
        setData(data.data);
      });
    }
  }, [filter]);

  if (loading || data == null) {
    return (
      <div className="flex h-[85] w-full justify-center items-center">
        <div className="animate-spin [animation-duration:500ms]">
          <Shirt className="text-indigo-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-[100vw] h-[100vh] overflow-scroll">
      <div className="pt-6 pl-6 bg-gray-100 text-xl text-gray-600 italic font-bold">
        Today's picks
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 w-full p-4 pb-52 bg-gray-100">
        {data.map((item: any, index) => {
          return <ListingCard key={index} data={item} />;
        })}
      </div>
    </div>
  );
};

export default Listings;
