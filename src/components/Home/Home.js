import React, { useState } from "react";
import Carousel from "./Carousel";
import { data } from "./imgsForCarousel";
import { Link } from "react-router-dom";
import { facilityData } from "../Facilities/FacilityData";
import "./Home.css";
import Navigation from "../Footer/Navigation";
import FacilitySection from "../Facilities/FacilitySection";
import PromotionBanner from "../Promotions/PromotionBanner";
import Footer from "../Footer/Footer";
import NavigationModal from "../Modals/NavigationModal";

const Home = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  return (
    <div className="home-container">
      <div className="hero-section">
        <h1>Balneario El Arenal</h1>
        <h2>Vive la experiencia Arenal!</h2>
        <div className="carousel">
          <Carousel images={data} />
        </div>
        <Link to="/buy-tickets">
          <button className="buy-tickets-button">Buy Tickets</button>
        </Link>
      </div>
      <PromotionBanner />
      <section className="facilities-section">
        {facilityData.map((info, index) => (
          <FacilitySection
            key={index}
            image={info.image}
            title={info.title}
            description={info.description}
            buttonText={info.buttonText}
            link={info.link}
            reverse={info.reverse}
            isModal={info.isModal}
            modalContent={info.modalContent}
          />
        ))}
      </section>
      <NavigationModal isOpen={isModalOpen} onClose={closeModal}>
        <Navigation />
      </NavigationModal>
      <Footer showModal={showModal} closeModal={closeModal} />
    </div>
  );
};

export default Home;
