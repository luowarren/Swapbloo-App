import Listings from "./listings";
import Sidebar from "./sidebar";

const ListingsPage = () => {
  return (
    <div className="flex flex-row">
      <Sidebar filter={null} />
      <Listings />
    </div>
  );
};

export default ListingsPage;
