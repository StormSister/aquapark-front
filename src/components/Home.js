import React from "react";
import Carousel from "./Carousel";
import { data } from "./imgsForCarousel";
// import { attraction } from "./AttractionsData";
import "./Home.css";

const Home = ({ attractions }) => {
  return (
    <div>
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
