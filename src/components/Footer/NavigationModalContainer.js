import React, { useState } from "react";
import Navigation from "./Navigation";
import Footer from "./Footer";
import NavigationModal from "../Modals/NavigationModal";

const NavigationModalContainer = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");

  const showModal = (content) => {
    console.log("showModal called with content:", content);
    setModalContent(content);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalContent("");
  };

  return (
    <div className="app-container">
      <Navigation />
      <Footer showModal={showModal} />
      <NavigationModal isOpen={isModalOpen} onClose={closeModal}>
        {modalContent === "map" && (
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3736.4509663037843!2d-99.67531481658006!3d20.52872141653917!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x86847621d87aef5d%3A0xe6802262f1a8f8b0!2sBalneario%20El%20Arenal!5e0!3m2!1spl!2spl!4v1723803312236!5m2!1spl!2spl"
            width="100%"
            height="450"
            style={{ border: "0" }}
            allowFullScreen=""
            loading="lazy"
            title="Google Map"
          ></iframe>
        )}
      </NavigationModal>
    </div>
  );
};

export default NavigationModalContainer;
