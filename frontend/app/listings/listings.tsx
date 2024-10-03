"use client";

import { getActiveListings } from "@/service/items";
import { getfilteredItems, searchAndFilter } from "@/service/listings";
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
