import Sidebar from "./sidebar";

const Listings = () => {
  return (
    <div className="flex flex-row">
      <Sidebar filter={null} />
      <div>main area</div>
    </div>
  );
};

export default Listings;
