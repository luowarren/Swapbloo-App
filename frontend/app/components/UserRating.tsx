import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faStarHalfAlt } from "@fortawesome/free-solid-svg-icons";
import { faStar as farStar } from "@fortawesome/free-regular-svg-icons"; // Regular star
import GenericButton from "./GenericButton";

const UserRating = ({
  rating = 0,
  num = -1,
  size = "text-sm",
  reviewButton = true,
}: {
  rating?: number;
  num?: number;
  size?: string;
  reviewButton?: boolean;
}) => {
  const [currentRating, setCurrentRating] = useState(rating);
  const clampedRating = Math.min(Math.max(currentRating, 0), 5);

  // Update currentRating when rating prop changes
  useEffect(() => {
    setCurrentRating(rating);
  }, [rating]);

  const handleStarClick = (index: number) => {
    if (num === -1) {
      // Update to the clicked star's whole number rating (1-5)
      setCurrentRating(index);
    }
  };

  const submitReview = (rating: number) => {
    alert(`Thank you for you ${rating} star review!`);
  };

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
        <div key={i} style={{ cursor: num === -1 ? "pointer" : "default" }}>
          <FontAwesomeIcon
            onClick={() => handleStarClick(i)}
            icon={starIcon}
            className={size}
            color="#eab308"
          />
        </div>
      );
    }

    return stars;
  };

  return (
    <div
      style={{ textAlign: "center", padding: num == -1 ? "10px" : undefined }}
      className="text-sm"
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          textAlign: "center",
          justifyContent: "center",
          marginBottom: num === -1 ? "10px" : undefined,
        }}
      >
        {renderStars()}
        {num === -1 ? null : <div className="text-gray-500">({num})</div>}
      </div>
      {reviewButton && (
        <>
          {num === -1 && currentRating !== 0 ? (
            <GenericButton
              text="Leave a review"
              click={() => submitReview(currentRating)}
            />
          ) : null}
          {num === -1 && currentRating === 0 ? (
            <GenericButton
              text="Leave a review"
              inverse={true}
              noClick={true}
            />
          ) : null}
        </>
      )}
    </div>
  );
};

export default UserRating;
