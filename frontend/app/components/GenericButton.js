// GenericButton.js
import React, { useState } from "react";
import PropTypes from "prop-types";

const notInverseCSS = {
  color: "#4F46E5", // text-indigo-800
  fontSize: "0.875rem", // text-sm
  border: "2px solid #4F46E5", // border-2 border-indigo-800
  borderRadius: "0.5rem", // rounded-lg
  padding: "1.6px 16px", // px-4 py-1
  fontWeight: "bold", // font-bold
};

const inverseCSS = {
  color: "#FFFFFF", // text-white
  backgroundColor: "#4F46E5", // bg-indigo-800
  fontSize: "0.875rem", // text-sm
  border: "2px solid #4F46E5", // border-2 border-indigo-800
  borderRadius: "0.5rem", // rounded-lg
  padding: "1.6px 16px", // px-4 py-1
  fontWeight: "bold", // font-bold
};

const inverseNoClick = {
  color: "#C7D2FE", 
  fontSize: "0.875rem", // text-sm
  border: "2px solid #C7D2FE", 
  borderRadius: "0.5rem", // rounded-lg
  padding: "1.6px 16px", // px-4 py-1
  fontWeight: "bold", // font-bold
};

const notInverseNoClick = {
  color: "#FFFFFF", // text-white
  backgroundColor: "#C7D2FE", 
  fontSize: "0.875rem", // text-sm
  border: "2px solid #C7D2FE", 
  borderRadius: "0.5rem", // rounded-lg
  padding: "1.6px 16px", // px-4 py-1
  fontWeight: "bold", // font-bold
};

const GenericButton = ({ text, inverse = false, noClick = false, click }) => {
  const [isPressed, setIsPressed] = useState(false);

  const handleMouseDown = () => {
    if (!noClick) setIsPressed(true);
  };

  const handleMouseUp = () => {
    if (!noClick) setIsPressed(false);
  };

  if (inverse && !noClick) {
    return (
      <button
        style={isPressed ? inverseCSS : notInverseCSS}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onClick={click}
      >
        {text}
      </button>
    );
  } else if (inverse && noClick) {
    return <button style={inverseNoClick}>{text}</button>;
  } else if (!inverse && noClick) {
    return <button style={notInverseNoClick}>{text}</button>;
  } else {
    return (
      <button
        style={isPressed ? notInverseCSS : inverseCSS}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onClick={click}
      >
        {text}
      </button>
    );
  }
};

GenericButton.propTypes = {
  text: PropTypes.string.isRequired,
  inverse: PropTypes.bool,
  css: PropTypes.string,
  click: PropTypes.func,
};

export default GenericButton;
