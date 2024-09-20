"use client";

import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";
import Category from "./category";
import Condition from "./condition";
import Size from "./size";

const Sidebar = ({ filter }: { filter: any }) => {
  const [sortColl, setSortColl] = useState(true);

  return (
    <div className="h-[100vh] w-80 border-r border-r-slate-300 p-5 overflow-y-scroll">
      <div className="flex flex-col p-4 items-center w-full border-b border-b-slate-300">
        <span className="font-bold text-xl text-slate-700">Everything</span>
        <span className="text-slate-500 text-xs">(20 results)</span>
      </div>
      <div className="flex flex-col mt-4">
        <span className="font-bold text-sm my-1 text-slate-500">Filters</span>
        <span className="font-bold text-indigo-600 my-1 text-sm">
          Brisbane, Queensland - Within 5km
        </span>

        <div
          className="flex flex-row items-center justify-between hover:bg-slate-100 transition cursor-pointer -m-1 p-1 rounded-sm"
          onClick={() => {
            setSortColl((prev) => !prev);
          }}
        >
          <span className="font-bold text-sm my-1 text-slate-600">Sort by</span>
          {sortColl ? (
            <ChevronDown className="h-5 w-4 stroke-[2.5px]" />
          ) : (
            <ChevronRight className="h-5 w-4 stroke-[2.5px]" />
          )}
        </div>
        {sortColl && (
          <div className="flex flex-col text-sm gap-2 pl-2 mt-2 text-slate-600">
            <div className="hover:bg-slate-100 transition cursor-pointer py-2 p-1 -m-1 rounded-sm">
              Suggested
            </div>
            <div className="hover:bg-slate-100 transition cursor-pointer py-2 p-1 -m-1 rounded-sm">
              Newest
            </div>
            <div className="hover:bg-slate-100 transition cursor-pointer py-2 p-1 -m-1 rounded-sm">
              Oldest
            </div>
            <div className="hover:bg-slate-100 transition cursor-pointer py-2 p-1 -m-1 rounded-sm">
              Nearest
            </div>
          </div>
        )}
        <Category />
        <Size />
        <Condition />
      </div>
    </div>
  );
};

export default Sidebar;
