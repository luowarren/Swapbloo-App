// Sparkle.js
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStarburst } from '@fortawesome/free-solid-svg-icons'; // Import the starburst icon
import './Sparkle.css'; // Ensure the CSS is still referenced

const Sparkle = ({ isVisible, position }) => {
  return (
    <div className={`sparkle ${isVisible ? 'active' : ''}`} style={{ left: position.x, top: position.y }}>
      <FontAwesomeIcon icon={faStarburst} />
    </div>
  );
};

export default Sparkle;
