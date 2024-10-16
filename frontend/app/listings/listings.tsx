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
import { getUserId } from "@/service/users";
import { getAllBlocked } from "../../service/block";

const Listings = ({
  filter,
  search,
}: {
  filter: filterType;
  search?: string;
}) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any[] | null>(null);
  const [self, setSelf] = useState<string>("");
  const [blockedUsers, setBlockedUsers] = useState<Array<{
    blockee: string;
  }> | null>(null);
  const [filteringComplete, setFilteringComplete] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const myId = await getUserId();
        setSelf(myId);

        const listings = await getActiveListings();
        const blocked = await getAllBlocked(myId);

        if (Array.isArray(blocked)) {
          setBlockedUsers(blocked);
        } else {
          console.error("Blocked users data is not in expected format");
          setBlockedUsers([]);
        }

        const filteredData =
          listings.data?.filter(
            (item) =>
              item.owner_id !== myId &&
              !blocked?.some((u) => u.blockee === item.owner_id)
          ) || [];
        setData(filteredData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const applyFilters = async () => {
      setLoading(true);
      setFilteringComplete(false); // Reset filtering state

      const sizes = filter.size.length === 0 ? SIZES : filter.size;
      const category =
        filter.category.length === 0 ? CATEGORIES : filter.category;
      const condition =
        filter.condition.length === 0 ? CONDITIONS : filter.condition;
      const demographic =
        filter.demographic.length === 0 ? DEMOGRAPHICS : filter.demographic;

      if (!blockedUsers) return; // Wait until blockedUsers is fetched

      const filterBlockedUsers = (data: any[]) => {
        const blockedIds = blockedUsers.map((user) => user.blockee);
        return data.filter((item) => !blockedIds.includes(item.owner_id));
      };

      try {
        let filteredData;
        if (search) {
          filteredData = await searchAndFilter(
            search,
            sizes,
            category,
            condition,
            demographic
          );
        } else {
          filteredData = await getfilteredItems(
            sizes,
            category,
            condition,
            demographic
          );
        }

        const finalData = filterBlockedUsers(filteredData.data || []);
        setData(finalData);
      } catch (error) {
        console.error("Error applying filters:", error);
      } finally {
        setLoading(false);
        setFilteringComplete(true); // Set filtering complete
      }
    };

    applyFilters();
  }, [filter, blockedUsers]); // Depend on blockedUsers as well

  if (loading || data == null || !filteringComplete) {
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
