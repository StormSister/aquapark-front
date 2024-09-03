import React, { useEffect } from "react";
import "./NavigationModal.css";

const NavigationModal = ({ isOpen, onClose, children }) => {
  useEffect(() => {
    console.log("Modal component: isOpen state is", isOpen);
    const handleEsc = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose, isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="map-modal-overlay"
      onClick={(event) => {
        if (event.target.className === "map-modal-overlay") {
          onClose();
        }
      }}
    >
      <div className="map-modal-content">{children}</div>
    </div>
  );
};

export default NavigationModal;
