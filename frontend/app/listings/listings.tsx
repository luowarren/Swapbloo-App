"use client";

import { getActiveListings } from "@/service/items";
import {
  getfilteredItems,
  searchAndFilter,
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
  const [blockedUsers, setBlockedUsers] = useState<Array<{ blockee: string }> | null>(null);
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
  
        const filteredData = listings.data?.filter((item) => 
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
    setLoading(true);
    setFilteringComplete(false); // Reset filtering state

    const sizes = filter.size.length === 0 ? SIZES : filter.size;
    const category = filter.category.length === 0 ? CATEGORIES : filter.category;
    const condition = filter.condition.length === 0 ? CONDITIONS : filter.condition;
    const demographic = filter.demographic.length === 0 ? DEMOGRAPHICS : filter.demographic;

    const filterBlockedUsers = (data: any[]) => {
      if (!blockedUsers) return data; // If blockedUsers is null, return the original data
    
      const blockedIds = blockedUsers.map(user => user.blockee);
      return data.filter(item => !blockedIds.includes(item.owner_id));
    };
    
    const applyFilters = async () => {
      let filteredData;
      if (search) {
        filteredData = await searchAndFilter(search, sizes, category, condition, demographic);
      } else {
        filteredData = await getfilteredItems(sizes, category, condition, demographic);
      }
      
      const finalData = filterBlockedUsers(filteredData.data || []);
      setData(finalData);
      setFilteringComplete(true); // Set filtering complete
      setLoading(false);
    };

    applyFilters();
  }, [filter]);

  if (loading || data == null || !filteringComplete) {
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
      {data.map((item: any, index) => (
        <ListingCard key={index} data={item} />
      ))}
    </div>
  );
};

export default Listings;
