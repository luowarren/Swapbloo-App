// GenericButton.js
import React, { useState } from "react";
import PropTypes from "prop-types";

var notInverseCSS =
  "text-indigo-800 text-sm border-2 border-indigo-800 rounded-lg px-4 py-1 font-bold ";
var inverseCSS =
  "text-white bg-indigo-800 text-sm border-2 border-indigo-800 rounded-lg px-4 py-1 font-bold ";

const GenericButton = ({ text, inverse=false, click}) => {
  const [isPressed, setIsPressed] = useState(false);

  const handleMouseDown = () => {
    setIsPressed(true);
  };

  const handleMouseUp = () => {
    setIsPressed(false);
  };

  if (inverse) {
    return (
      <button
        className={`${isPressed ? inverseCSS : notInverseCSS}`}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onClick={click}
      >
        {text}
      </button>
    );
  } else {
    return (
      <button
        className={`${isPressed ? notInverseCSS : inverseCSS}`}
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
