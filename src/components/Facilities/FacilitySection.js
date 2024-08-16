import React from "react";
import { Link } from "react-router-dom";
import "./FacilitySection.css";

const FacilitySection = ({
  image,
  title,
  description,
  buttonText,
  link,
  reverse,
}) => {
  return (
    <div className={`facility-section ${reverse ? "reverse" : ""}`}>
      <div className="facility-image">
        <img src={image} alt={title} />
      </div>
      <div className="facility-content">
        <h2>{title}</h2>
        <p>{description}</p>
        <Link to={link}>
          <button className="facility-button">{buttonText}</button>
        </Link>
      </div>
    </div>
  );
};

export default FacilitySection;
