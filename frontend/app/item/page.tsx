const MockData = {
  id: 4,
  created_at: "2024-08-09T04:59:51.518525+00:00",
  size: "6",
  condition: "New",
  category: "Skirts",
  swapped: false,
  owner_id: "b484dc52-08ca-4518-8253-0a7cd6bec4e9",
  demographic: "Womens",
  brand: null,
  caption: null,
  title: "floral maxi skirt",
};

const Item = () => {
  return (
    <div>
      id: {MockData.id}
      size: {MockData.size}
      condition: {MockData.condition}
      category: {MockData.category}
      demographic: {MockData.demographic}
      brand: {MockData.brand}
      title: {MockData.title}
      {/* This only displays captions if it exists inside the object */}
      {MockData.caption && <div>caption: {MockData.id}</div>}
    </div>
  );
};

export default Item;
