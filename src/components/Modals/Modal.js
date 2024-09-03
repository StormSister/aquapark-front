import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "./Modal.css";

const Modal = ({ isOpen, onClose, data, itemsPerPage, title }) => {
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEsc);

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [onClose]);

  const handleOverlayClick = (event) => {
    if (event.target.className === "custom-modal-overlay") {
      onClose();
    }
  };
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(data.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = data.slice(startIndex, startIndex + itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="custom-modal-overlay" onClick={handleOverlayClick}>
      <div className="custom-modal-content">
        <div className="modal-header">{title}</div>
        <div className="modal-body">
          {currentItems.map((item, index) => (
            <div key={index} className="modal-item">
              {item}
            </div>
          ))}
        </div>
        <div className="modal-footer">
          <div
            className="modal_arrow_left"
            onClick={handlePrevPage}
            disabled={currentPage === 1}
          >
            &lsaquo;
          </div>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <div
            className="modal_arrow_right"
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            &rsaquo;
          </div>
        </div>
      </div>
    </div>
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  data: PropTypes.array.isRequired,
  itemsPerPage: PropTypes.number,
  title: PropTypes.string,
};

Modal.defaultProps = {
  itemsPerPage: 5,
  title: "",
};

export default Modal;
