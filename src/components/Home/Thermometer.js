import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Thermometer.css';

const Thermometer = () => {
    const [temperature, setTemperature] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const location = 'Tequisquiapan'; 

    useEffect(() => {
        const fetchTemperature = async () => {
            try {
                console.log(`Fetching temperature from: https://wttr.in/${location}?format=%t`);
                const response = await axios.get(`https://wttr.in/${location}?format=%t`);
                console.log('Temperature data:', response.data);
                setTemperature(response.data); 
            } catch (err) {
                console.error('Error fetching data:', err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchTemperature();
    }, [location]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error fetching data: {error.message}</p>;

    return (
        <div className="thermometer">
            <div className="temperature-section">
                <img src="/assets/images/thermometer/thermometer-svgrepo-com.svg" alt="Air" className="thermometer-icon" />
                <div className="temperature-text">
                    <p>Air {temperature}</p>
                </div>
            </div>
            <div className="temperature-section">
                <img src="/assets/images/thermometer/water-temperature.svg" alt="Water" className="thermometer-icon" />
                <div className="temperature-text">
                    <p>Water +38°C</p>
                </div>
            </div>
        </div>
    );
};

export default Thermometer;