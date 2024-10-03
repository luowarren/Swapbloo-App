import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { DEMOGRAPHICS } from "@/service/constants";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";

const Demographic = ({
  demos,
  setDemos,
}: {
  demos: string[];
  setDemos: (demos: string[]) => void;
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
        className="flex flex-row items-center justify-between hover:bg-slate-100 transition cursor-pointer my-2 -mx-1 p-1 rounded-sm text-slate-600"
        onClick={() => {
          setCol((prev) => !prev);
        }}
      >
        <span className="font-bold text-sm my-1">Demographic</span>
        {col ? (
          <ChevronDown className="h-5 w-4 stroke-[2.5px]" />
        ) : (
          <ChevronRight className="h-5 w-4 stroke-[2.5px]" />
        )}
      </div>

      {col && (
        <div>
          <ToggleGroup type="multiple" className="justify-start flex-wrap">
            {DEMOGRAPHICS.map((demo) => {
              const isActive = demos.includes(demo);

              return (
                <ToggleGroupItem
                  className={`border border-slate-200 text-slate-500 ${
                    isActive ? "bg-blue-500 text-white" : ""
                  }`}
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
