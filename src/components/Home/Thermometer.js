import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Thermometer.css';

const Thermometer = () => {
    const [temperature, setTemperature] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const location = 'Tecozautla';
    const apiKey = 'd7330e888bbdbc8992f8472025635c55'; 

    useEffect(() => {
        const fetchTemperature = async () => {
            try {
                console.log(`Fetching temperature for ${location} from OpenWeather`);
                const response = await axios.get(
                    `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${apiKey}`
                );
                console.log('Weather data:', response.data);

                const tempCelsius = Math.round(response.data.main.temp);
                console.log(tempCelsius);
                setTemperature(tempCelsius);
            } catch (err) {
                console.error('Error fetching data:', err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchTemperature();
    }, [location, apiKey]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error fetching data: {error.message}</p>;

    return (
        <div className="thermometer">
            <div className="temperature-section">
                <img src="/assets/images/thermometer/thermometer-svgrepo-com.svg" alt="Air" className="thermometer-icon" />
                <div className="temperature-text">
                    <p>Air  {temperature}°C</p>
                </div>
            </div>
            <div className="temperature-section">
                <img src="/assets/images/thermometer/water-temperature.svg" alt="Water" className="thermometer-icon" />
                <div className="temperature-text">
                    <p>Water  38°C</p>
                </div>
            </div>
        </div>
    );
};

export default Thermometer;