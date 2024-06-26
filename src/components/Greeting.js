import React, { useState } from 'react';

const GreetingComponent = () => {
  const [greeting, setGreeting] = useState('');

  const fetchGreeting = async () => {
    try {
      const response = await fetch('http://localhost:8080/greeting');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setGreeting(data.content);
    } catch (error) {
      console.error('Error fetching greeting:', error);
      setGreeting('Error fetching greeting');
    }
  };

  return (
    <div>
      <button onClick={fetchGreeting}>Fetch Greeting</button>
      <p>{greeting}</p>
    </div>
  );
};

export default GreetingComponent;