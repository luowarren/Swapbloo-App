// Map.js
import React from "react";

const Map = () => {
  return (
    <div 
    style={{ display: 'flex', flexDirection: 'row', fontSize: '0.875rem', margin: '1rem 0', width: '100%' }}>
      <div
        style={{
          backgroundColor: "#68D391", // bg-green-400
          borderRadius: "0.5rem", // rounded-lg
          width: "20rem", // w-[50%]
          height: "6rem", // h-24 (24 * 0.25rem = 6rem)
          fontSize: "0.75rem", // text-xs
          display: "flex", // flex
          alignItems: "center", // items-center
          justifyContent: "center", // justify-center
          marginRight: "1rem", // mr-4 (4 * 0.25rem = 1rem)
        }}
      >
        Map
      </div>
      <div style ={{width: "auto"}}>
        Sunnybank Hills Shoppingtown, 9:00am | 13/12/2024
      </div>
    </div>
  );
};

export default Map;
