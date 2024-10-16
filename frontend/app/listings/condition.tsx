import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Bold,
  ChevronDown,
  ChevronRight,
  Italic,
  Underline,
} from "lucide-react";
import { useState } from "react";
import { ConditionTable } from "./condition-table";
import { cn } from "@/lib/utils";

const Condition = ({
  cond,
  setCond,
  light = false,
}: {
  cond: string[];
  setCond: (cond: string[]) => void;
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
          Condition
        </span>
        {col ? (
          <ChevronDown
            className={cn(
              "font-bold text-sm my-1 italic",
              light && "text-white"
            )}
          />
        ) : (
          <ChevronRight
            className={cn(
              "font-bold text-sm my-1 italic",
              light && "text-white"
            )}
          />
        )}
      </div>
      {col && <ConditionTable cond={cond} setCond={setCond} />}
    </div>
  );
};

export default Condition;
