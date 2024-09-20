import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { SIZES } from "@/service/constants";
import {
  Bold,
  ChevronDown,
  ChevronRight,
  Italic,
  Underline,
} from "lucide-react";
import { useState } from "react";

const Size = () => {
  const [col, setCol] = useState(true);

  return (
    <div>
      <div
        className="flex flex-row items-center justify-between hover:bg-slate-100 transition cursor-pointer my-2 -mx-1 p-1 rounded-sm text-slate-600"
        onClick={() => {
          setCol((prev) => !prev);
        }}
      >
        <span className="font-bold text-sm my-1">Size</span>
        {col ? (
          <ChevronDown className="h-5 w-4 stroke-[2.5px]" />
        ) : (
          <ChevronRight className="h-5 w-4 stroke-[2.5px]" />
        )}
      </div>

      {col && (
        <div>
          <ToggleGroup type="multiple" className="justify-start flex-wrap">
            {SIZES.map((size) => {
              return (
                <ToggleGroupItem
                  className="border border-slate-200 text-slate-500"
                  value={size}
                >
                  <div>{size}</div>
                </ToggleGroupItem>
              );
            })}
          </ToggleGroup>
        </div>
      )}
    </div>
  );
};

export default Size;
