import React from "react";
import image1 from "../images/carousel/1.webp";

const attractions = [
  { id: 1, name: "Wave Pool", description: "Enjoy our giant wave pool!" },
  {
    id: 2,
    name: "Water Slides",
    description: "Experience thrilling water slides!",
  },
  { id: 3, name: "Lazy River", description: "Relax on our lazy river!" },
];

const Home = () => {
  return (
    <div className="container mt-4">
      <h2>Welcome to Aquapark</h2>
      <p>Discover our attractions and plan your visit!</p>
      <img src={image1} className="img-fluid" alt="Aquapark" />
      <hr />
      <h4>Attractions</h4>
      <ul>
        {attractions.map((attraction) => (
          <li key={attraction.id}>
            <strong>{attraction.name}</strong>: {attraction.description}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
