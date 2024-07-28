import React from "react";
import "./Home.css";

const Home = ({ image1, attractions }) => {
  return (
    <div>
      <div className="carousel">
        <img src={image1} className="img" alt="Aquapark" />
      </div>
      <section className="attractions-section">
        <div className="attractions">
          <h4>Attractions</h4>
          <ul>
            {attractions.map((attraction) => (
              <li key={attraction.id}>
                <strong>{attraction.name}</strong>: {attraction.description}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
};

export default Home;
