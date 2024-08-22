import React, { useEffect, useState } from 'react';

const Thermometer = () => {
    const apiKey = "d044afafb157549c64b3bdecb733176ee";  
    const location = '20.2076,-99.9405';
    const [temperature, setTemperature] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTemperature = async () => {
            try {
                const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${location}&aqi=no`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setTemperature(data.current.temp_c);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchTemperature();
    }, [apiKey, location]);

    return (
        <div>
            <h1>Current Temperature</h1>
            <div id="temp">
                {error ? (
                    <span>Error: {error}</span>
                ) : temperature !== null ? (
                    <span>{temperature}°C</span>
                ) : (
                    <span>Loading...</span>
                )}
            </div>
        </div>
    );
};

export default Thermometer;
