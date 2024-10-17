"use client";

import { ChevronDown, ChevronRight } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import Category from "./category";
import Condition from "./condition";
import Size from "./size";
import Demographic from "./demographic";
import { filterType } from "./page";
// import Demographic from "./demographic";
const Sidebar = ({
  search,
  filter,
  setFilter,
}: {
  search?: string;
  filter: filterType;
  setFilter: Dispatch<SetStateAction<filterType>>;
}) => {
  const [sortColl, setSortColl] = useState(true);

  const setNewConditions = (cond: string[]) => {
    setFilter((prev: any) => ({ ...prev, condition: cond }));
  };
  const setNewSize = (size: string[]) => {
    setFilter((prev: any) => ({ ...prev, size: size }));
  };
  const setNewDemographic = (demo: string[]) => {
    setFilter((prev: any) => ({ ...prev, demographic: demo }));
  };
  const setNewCategory = (categ: string[]) => {
    setFilter((prev: any) => ({ ...prev, category: categ }));
  };

  return (
    <div className="h-screen w-80 border-r border-gray-300 p-5 overflow-y-scroll pb-56">
      <div className="flex flex-col p-4 items-center w-full border-b border-b-gray-300">
        <span className="font-bold text-xl text-gray-600 italic">
          {search ? `"${search}"` : "Everything"}
        </span>
      </div>
      <div className="flex flex-col mt-4">
        <span className="font-bold text italic mt-1 -mb-2 text-indigo-500">
          Filter results
        </span>
        {/* <span className="font-bold text-indigo-600 my-1 text-sm">
          Brisbane, Queensland - Within 5km
        </span> */}

        {/* <div
          className="flex flex-row items-center justify-between hover:bg-gray-100 transition cursor-pointer -m-1 p-1 rounded-sm"
          onClick={() => {
            setSortColl((prev) => !prev);
          }}
        >
          <span className="font-bold text-sm my-1 text-gray-600">Sort by</span>
          {sortColl ? (
            <ChevronDown className="h-5 w-4 stroke-[2.5px]" />
          ) : (
            <ChevronRight className="h-5 w-4 stroke-[2.5px]" />
          )}
        </div>
        {sortColl && (
          <div className="flex flex-col text-sm gap-2 pl-2 mt-2 text-gray-600">
            <div className="hover:bg-gray-100 transition cursor-pointer py-2 p-1 -m-1 rounded-sm">
              Newest
            </div>
            <div className="hover:bg-gray-100 transition cursor-pointer py-2 p-1 -m-1 rounded-sm">
              Oldest
            </div>
            <div className="hover:bg-gray-100 transition cursor-pointer py-2 p-1 -m-1 rounded-sm">
              Alphabetically
            </div>
          </div>
        )} */}
        <Demographic demos={filter.demographic} setDemos={setNewDemographic} />
        <Category cats={filter.category} setCats={setNewCategory} />
        <Size size={filter.size} setSize={setNewSize} />
        <Condition cond={filter.condition} setCond={setNewConditions} />
      </div>
    </div>
  );
};

export default Sidebar;
