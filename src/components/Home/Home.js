import React from "react";
import Carousel from "./Carousel";
import { data } from "./imgsForCarousel";
import { Link } from "react-router-dom";
import { facilityData } from "../Facilities/FacilityData";
import "./Home.css";
import Contact from "./Contact";
import FacilitySection from "../Facilities/FacilitySection";
import PromotionBanner from "../Promotions/PromotionBanner"
import Thermometer from './Thermometer';

const Home = ({ attractions }) => {
  return (
    <div>
         <div>
      <div className="hero-section">
        <h1>Balneario El Arenal</h1>
        <h2>Vive la experiencia Arenal!</h2>
        <Link to="/buy-tickets">
          <button className="buy-tickets-button">Buy Tickets</button>
        </Link>
      </div>
    </div>
      <div className="header-section">
        <h1>Balnearo El Arenal: a world of entertainment!</h1>
      </div>
      <div className="carousel">
        <Carousel images={data} />
      </div>
      <section className="facilities-section">
        <div>
          {facilityData.map((info, index) => (
            <FacilitySection
              key={index}
              image={info.image}
              title={info.title}
              description={info.description}
              buttonText={info.buttonText}
              link={info.link}
              reverse={info.reverse}
            />
          ))}
        </div>
      </section>
      <Contact/>
      <PromotionBanner/>
      <Thermometer/>
    </div>
  );
};

export default Home;