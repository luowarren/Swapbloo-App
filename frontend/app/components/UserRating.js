import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faStarHalfAlt } from "@fortawesome/free-solid-svg-icons";
import { faStar as farStar } from "@fortawesome/free-regular-svg-icons"; // Regular star

const UserRating = ({ rating }) => {
  // Clamp the rating value to be between 0 and 5
  const clampedRating = Math.min(Math.max(rating, 0), 5);

  const renderStars = () => {
    const stars = [];
    const totalStars = 5;

    for (let i = 1; i <= totalStars; i++) {
      let starIcon;
      if (i <= clampedRating) {
        starIcon = faStar;
      } else if (i - clampedRating <= 0.5) {
        starIcon = faStarHalfAlt;
      } else {
        starIcon = farStar; // Use FontAwesome's outline star icon
      }

      stars.push(
        <FontAwesomeIcon
          key={i} // Assign a unique key
          icon={starIcon}
          className="text-sm"
          color="#eab308"
        />
      );
    }

    return stars;
  };

  return (
    <div style={{ textAlign: "center" }} className="my-3">
      <div style={{ display: "flex", justifyContent: "center" }}>
        {renderStars()}
      </div>
    </div>
  );
};

export default UserRating;
