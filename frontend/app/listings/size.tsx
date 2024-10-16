import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";
import { SIZES } from "@/service/constants";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";

const Size = ({
  size,
  setSize,
  light = false,
}: {
  size: string[];
  setSize: (size: string[]) => void;
  light?: boolean;
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
          Size
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

      {col && (
        <div>
          <ToggleGroup type="multiple" className="justify-start flex-wrap">
            {SIZES.map((sizeOption) => {
              const isActive = size.includes(sizeOption);

              return (
                <ToggleGroupItem
                  className={`border border-gray-200 text-gray-500 ${
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
