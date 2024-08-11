import React from "react";
import PropTypes from "prop-types";
import "./RoomsSection.css";

const Attraction = ({
  title,
  description,
  imageUrl,
  buttonText,
  buttonLink,
}) => {
  return (
    <div className="attraction-section">
      <div className="attraction-text">
        <h2>{title}</h2>
        <p>{description}</p>
        <a href={buttonLink} className="attraction-button">
          {buttonText}
        </a>
      </div>
      <div className="attraction-image">
        <img src={imageUrl} alt="dfltImage" />
      </div>
    </div>
  );
};

Attraction.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  imageUrl: PropTypes.string.isRequired,
  buttonText: PropTypes.string.isRequired,
  buttonLink: PropTypes.string.isRequired,
};

export default Attraction;
