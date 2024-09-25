import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";
import { CategoryTable } from "./category-table";

const Category = () => {
  const [col, setCol] = useState(true);

  return (
    <div>
      <div
        className="flex flex-row items-center justify-between hover:bg-slate-100 transition cursor-pointer my-2 -mx-1 p-1 rounded-sm text-slate-600"
        onClick={() => {
          setCol((prev) => !prev);
        }}
      >
        <span className="font-bold text-sm my-1">Category</span>
        {col ? (
          <ChevronDown className="h-5 w-4 stroke-[2.5px]" />
        ) : (
          <ChevronRight className="h-5 w-4 stroke-[2.5px]" />
        )}
      </div>
      {col && <CategoryTable />}
    </div>
  );
};

export default Category;
