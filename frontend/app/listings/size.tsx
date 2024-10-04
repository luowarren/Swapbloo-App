import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { SIZES } from "@/service/constants";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";

const Size = ({
  size,
  setSize,
}: {
  size: string[];
  setSize: (size: string[]) => void;
}) => {
  const [col, setCol] = useState(true);

  // Function to handle toggle click, adding or removing size
  const handleToggle = (selectedSize: string) => {
    if (size.includes(selectedSize)) {
      // Remove the size if already selected
      setSize(size.filter((s) => s !== selectedSize));
    } else {
      // Add the size if not selected
      setSize([...size, selectedSize]);
    }
  };

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
            {SIZES.map((sizeOption) => {
              const isActive = size.includes(sizeOption);

              return (
                <ToggleGroupItem
                  className={`border border-slate-200 text-slate-500 ${
                    isActive ? "bg-blue-500 text-white" : ""
                  }`}
                  value={sizeOption}
                  key={sizeOption}
                  onClick={() => handleToggle(sizeOption)}
                >
                  <div>{sizeOption}</div>
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
