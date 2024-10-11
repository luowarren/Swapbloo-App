// MessageBubble.js
import React from "react";

const VisitShopModal = ({closeModal}) => {
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
        overflow: "auto",
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
          width: "80%",
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
        <h2>Modal Title</h2>
        <p>This is the modal content.</p>
      </div>
    </div>
  );
};

export default VisitShopModal;