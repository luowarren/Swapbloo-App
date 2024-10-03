"use client";
import { useState } from "react";
import Listings from "./listings";
import Sidebar from "./sidebar";

export type filterType = {
  size: string[];
  condition: string[];
  category: string[];
  demographic: string[];
};

const ListingsPage = () => {
  const [filter, setFilter] = useState<filterType>({
    size: [],
    condition: [],
    category: [],
    demographic: [],
  });

  return (
    <div className="flex flex-row">
      <Sidebar filter={filter} setFilter={setFilter} />
      <Listings filter={filter} />
    </div>
  );
};

export default ListingsPage;
