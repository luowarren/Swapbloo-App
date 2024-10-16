import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import ItemModal from "./item-modal";
import ItemImages from "../components/ItemImages";

const ListingCard = ({
  data,
  size = undefined,
  font = undefined,
}: {
  data: any;
  size?: number;
  font?: number;
}) => {
  const router = useRouter();
  const truncateMessage = (msg: string) => {
    return msg.length > 19 ? msg.slice(0, 19) + "..." : msg;
  };
  return (
    <div className="w-full h-full">
      <ItemModal item={data}>
        <div className="relative flex flex-col p-2 transition rounded-sm cursor-pointer h-full w-full group">
          {/* Background square behind the image, same size and position */}

          {/* Image div */}
          <div
            className="bg-indigo-500 rounded group-hover:scale-105 transition"
            style={{ maxWidth: size }}
          >
            <div
              className="relative overflow-hidden rounded-sm bg-gray-200 transition-transform group-hover:rotate-6 z-10 group-hover:border-4 border-indigo-500"
              style={{
                width: "100%",
                height: "100%",
                position: "relative",
                aspectRatio: "1",
              }}
            >
              <div className="w-full h-full scale-125">
                <ItemImages
                  itemId={data.id}
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
          </div>

          {/* Text content */}
          <div className="relative flex flex-col text-start mt-2 z-10">
            <span
              className="text-gray-700 font-bold"
              style={{ fontSize: font }}
            >
              {truncateMessage(data.title)}
            </span>
            <span className="text-gray-500 text-xs">
              {data.size} - {data.brand}
            </span>
            <span className="text-gray-500 text-xs">{data.category}</span>
          </div>
        </div>
      </ItemModal>
    </div>
  );
};

export default ListingCard;
