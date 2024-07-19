import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PromotionBanner from './Promotions/PromotionBanner';

const attractions = [
  { id: 1, name: 'Wave Pool', description: 'Enjoy our giant wave pool!' },
  { id: 2, name: 'Water Slides', description: 'Experience thrilling water slides!' },
  { id: 3, name: 'Lazy River', description: 'Relax on our lazy river!' },
];

const Home = () => {
  const [hasCurrentPromotion, setHasCurrentPromotion] = useState(false);

  useEffect(() => {
    checkForCurrentPromotion();
  }, []);

  const checkForCurrentPromotion = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/promotions/current');
      if (response.data) {
        setHasCurrentPromotion(true);
      }
    } catch (error) {
      console.error('Error checking for current promotion:', error);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Welcome to Aquapark</h2>
      <p>Discover our attractions and plan your visit!</p>
      <img src="/assets/images/1.webp" className="img-fluid" alt="Aquapark" />
      <hr />
      <h4>Attractions</h4>
      <ul>
        {attractions.map(attraction => (
          <li key={attraction.id}>
            <strong>{attraction.name}</strong>: {attraction.description}
          </li>
        ))}
      </ul>

      {/* Display PromotionBanner if there is a current promotion */}
      {hasCurrentPromotion && <PromotionBanner />}
    </div>
  );
};

export default Home;

