"use client";
import { useState } from "react";
import Listings from "../listings";
import Sidebar from "../sidebar";
import { useParams } from "next/navigation";

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

  const search = useParams().search.toString();
  console.log(search);

  return (
    <div className="flex flex-row">
      <Sidebar filter={filter} setFilter={setFilter} search={search} />
      <Listings filter={filter} search={search} />
    </div>
  );
};

export default ListingsPage;
