// Map.js
import React from "react";

const ItemPreview = ({ text = "", color = "pink" }) => {
  return (
    <div
      style=
      {{
        margin: "10px",
        maxHeight: "5em",
        width: "4em",
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
      }}
      >
      <div
        style={{
          height: "4em",
          width: "4em",
          background: color,
          borderRadius: "10px",
        }}
      ></div>
      {/* <div
        style={{
          color: "black",
          fontSize: "12px",
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
          width: '5em', // Set your desired width
          display: 'block', // Ensures the element takes up the width
        }}
      >
        {text}
      </div> */}
    </div>
  );
};

export default ItemPreview;
