// MessageBubble.js
import React from "react";
import UserRating from "./UserRating";
import ShowMap from "./Map";

const VisitShopModal = ({ closeModal }) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "fixed",
        zIndex: 11,
        left: 0,
        top: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0,0,0,0.4)",
      }}
      onClick={closeModal} // Close on outside click
    >
      <div
        style={{
          backgroundColor: "#fefefe",
          margin: "15% auto",
          padding: "20px",
          border: "1px solid #888",
          width: "70%",
          borderRadius: "8px",
        }}
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        <span
          onClick={closeModal}
          style={{
            color: "#aaa",
            float: "right",
            fontSize: "28px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          &times;
        </span>

        <div className="w-full bg-white text-black p-4 text-xl flex flex-col">
          <div className="flex flex-row items-center mb-4">
            <div className="w-16 h-16 bg-yellow-500 rounded-full mr-3"></div>
            <div className="flex flex-col items-start align-middle">
              <div className="font-bold overflow-auto text-center">
                Siarra's Swap Shop
              </div>
              <UserRating rating={3.5} num={8} />
            </div>
          </div>
          <div>Listings</div>
          <ShowMap
            selectedLocation={{
              name: "Westfield Chermside",
              latitude: -27.383085,
              longitude: 153.030924,
            }}
          ></ShowMap>
        </div>
      </div>
    </div>
  );
};

export default VisitShopModal;
