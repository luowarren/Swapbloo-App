import { useRouter } from "next/navigation";
import ItemImages from "../components/ItemImages";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import ItemModal from "./item-modal";

const ListingCard = ({ data }: { data: any }) => {
  const router = useRouter();
  return (
    <div>
      <ItemModal item={data}>
        <div className="flex flex-col p-2 hover:bg-slate-200 transition rounded-sm cursor-pointer h-fit w-full">
          {/* <ItemImages itemId={data.id} className="" /> */}
          <div className="bg-indigo-500 h-56 rounded-sm" />
          <div className="flex flex-col text-start">
            <span className="text-slate-700 font-bold">{data.title}</span>
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

// brand
// :
// "Brand A"
// caption
// :
// "Casual and comfortable"
// category
// :
// "Shirts"
// condition
// :
// "Used - Good"
// created_at
// :
// "2024-08-19T03:35:46.773213+00:00"
// demographic
// :
// "Womens"
// id
// :
// 54
// owner_id
// :
// "adfc278c-45f1-42a5-be21-857b95bd113a"
// size
// :
// "M"
// swapped
// :
// false
// title
// :
// "Blue Casual Shirt"
