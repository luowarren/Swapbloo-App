import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";
import { DEMOGRAPHICS } from "@/service/constants";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";

const Demographic = ({
  demos,
  setDemos,
  light = false,
}: {
  demos: string[];
  setDemos: (demos: string[]) => void;
  light?: boolean;
}) => {
  const [col, setCol] = useState(true);

  // Function to handle toggle click, adding or removing demos
  const handleToggle = (demo: string) => {
    if (demos.includes(demo)) {
      // Remove the demo if already selected
      setDemos(demos.filter((d) => d !== demo));
    } else {
      // Add the demo if not selected
      setDemos([...demos, demo]);
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
          Demographic
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
            {DEMOGRAPHICS.map((demo) => {
              const isActive = demos.includes(demo);

              return (
                <ToggleGroupItem
                  className={cn(
                    "border bg-white border-gray-200 text-gray-500"
                  )}
                  value={demo}
                  key={demo}
                  onClick={() => handleToggle(demo)}
                >
                  <div>{demo}</div>
                </ToggleGroupItem>
              );
            })}
          </ToggleGroup>
        </div>
      )}
    </div>
  );
};

export default Demographic;
