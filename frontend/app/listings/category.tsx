import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";
import { CategoryTable } from "./category-table";
import { cn } from "@/lib/utils";

const Category = ({
  cats,
  setCats,
  light = false,
}: {
  cats: string[];
  setCats: (cats: string[]) => void;
  light?: boolean;
}) => {
  const [col, setCol] = useState(true);

  return (
    <div>
      <div
        className={cn(
          "flex flex-row items-center justify-between hover:bg-gray-100 transition cursor-pointer my-2 -mx-1 p-1 rounded-sm text-gray-600",
          light && "hover:bg-indigo-500"
        )}
        onClick={() => {
          setCol((prev) => !prev);
        }}
      >
        <span
          className={cn("font-bold text-sm my-1 italic", light && "text-white")}
        >
          Category
        </span>
        {col ? (
          <ChevronDown
            className={cn("h-5 w-4 stroke-[2.5px]", light && "text-white")}
          />
        ) : (
          <ChevronRight
            className={cn("h-5 w-4 stroke-[2.5px]", light && "text-white")}
          />
        )}
      </div>
      {col && <CategoryTable cats={cats} setCats={setCats} />}
    </div>
  );
};

export default Category;
