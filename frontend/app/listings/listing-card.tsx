import { useRouter } from "next/navigation";
import ItemImages from "../components/ItemImages";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import ItemModal from "./item-modal";

const ListingCard = ({ data, size = 56, font=18 }: { data: any; size: number, font: number }) => {
  const router = useRouter();
  const truncateMessage = (msg: string) => {
    return msg.length > 20 ? msg.slice(0, 20) + "..." : msg;
  };
  return (
    <div>
      <ItemModal item={data}>
        <div className="flex flex-col p-4 hover:bg-slate-200 transition rounded-sm cursor-pointer h-fit w-fit">
          <div className={`rounded-sm w-${size} h-${size} overflow-hidden`}>
            <div className="scale-125">
              <ItemImages itemId={data.id} className="" />
            </div>
          </div>
          <div className="flex flex-col text-start mt-1">
            <span
              className="text-slate-700 font-bold text-base"
              style={{ fontSize: font }}
            >
              {truncateMessage(data.title)}
            </span>
            <span className="text-slate-500 text-xs">
              {data.size} - {data.brand}
            </span>
            <span className="text-slate-500 text-xs">{data.category}</span>
          </div>
        </div>
      </ItemModal>
    </div>
  );
};

export default ListingCard;
