import React from "react";
import Carousel from "./Carousel";
import { data } from "./imgsForCarousel";
import { Link } from "react-router-dom";
// import { attraction } from "./AttractionsData";
import "./Home.css";

const Home = ({ attractions }) => {
  return (
    <div>
      <div className="hero-section">
        <h1>Balneario El Arenal</h1>
        <h2>Vive la experiencia Arenal!</h2>
        <Link to="/buy-tickets">
          <button className="buy-tickets-button">Buy Tickets</button>
        </Link>
      </div>
      <div className="header-section">
        <h1>Balnearo El Arenal: a world of entertainment!</h1>
      </div>
      <div className="carousel">
        <Carousel images={data} />
      </div>
      <section className="attractions-section">
        <div className="attractions">
          <h4>Attractions</h4>
          {/* <ul>
            {attractions.map((attraction) => (
              <li key={attraction.id}>
                <strong>{attraction.name}</strong>: {attraction.description}
              </li>
            ))}
          </ul> */}
        </div>
      </section>
    </div>
  );
};

export default Home;
