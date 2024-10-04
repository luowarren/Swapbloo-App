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

const Condition = ({
  cond,
  setCond,
}: {
  cond: string[];
  setCond: (cond: string[]) => void;
}) => {
  const [col, setCol] = useState(true);

  return (
    <div>
      <div
        className="flex flex-row items-center justify-between hover:bg-slate-100 transition cursor-pointer my-2 -mx-1 p-1 rounded-sm text-slate-600"
        onClick={() => {
          setCol((prev) => !prev);
        }}
      >
        <span className="font-bold text-sm my-1">Condition</span>
        {col ? (
          <ChevronDown className="h-5 w-4 stroke-[2.5px]" />
        ) : (
          <ChevronRight className="h-5 w-4 stroke-[2.5px]" />
        )}
      </div>
      {col && <ConditionTable cond={cond} setCond={setCond} />}
    </div>
  );
};

export default Condition;
