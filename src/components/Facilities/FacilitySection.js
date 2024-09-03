import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./FacilitySection.css";
import Modal from "../Modals/Modal";
import { spaData } from "../Modals/spaData";

const FacilitySection = ({
  image,
  title,
  description,
  buttonText,
  link,
  reverse,
  isModal,
  modalContent,
}) => {
  const [showModal, setShowModal] = useState(false);

  const handleButtonClick = () => {
    if (isModal) {
      setShowModal(true);
    }
  };
  const closeModal = () => setShowModal(false);

  return (
    <div className={`facility-section ${reverse ? "reverse" : ""}`}>
      <div className="facility-image">
        <img src={image} alt={title} />
      </div>
      <div className="facility-content">
        <h2>{title}</h2>
        <p>{description}</p>
        {isModal ? (
          <button onClick={handleButtonClick} className="facility-button">
            {buttonText}
          </button>
        ) : (
          <Link to={link}>
            <button className="facility-button">{buttonText}</button>
          </Link>
        )}
      </div>

      <Modal
        isOpen={showModal}
        onClose={closeModal}
        data={spaData}
        itemsPerPage={8}
      ></Modal>
    </div>
  );
};

export default FacilitySection;
