import React, { useEffect, useState } from 'react';
import axios from 'axios';
// import './PromotionBanner.css';

const PromotionBanner = () => {
    const [currentPromotions, setCurrentPromotions] = useState([]);

    useEffect(() => {
        fetchCurrentPromotions();
    }, []);

    const fetchCurrentPromotions = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/promotions/current');
            setCurrentPromotions(response.data);
        } catch (error) {
            console.error('Błąd podczas pobierania aktualnych promocji:', error);
        }
    };

    return (
        <div className="promotion-banner">
            {currentPromotions.length > 0 && (
                <>
                    <h2>Current Promotions</h2>
                    <div className="promotion-details">
                        {currentPromotions.map(promotion => (
                            <div key={promotion.id} className="promotion-item">
                                <p>Start Date: {new Date(promotion.startDate).toLocaleString()}</p>
                                <p>End Date: {new Date(promotion.endDate).toLocaleString()}</p>
                                <p>Description: {promotion.description}</p>
                                <p>Discount: {promotion.discountAmount}%</p>
                                <img src={promotion.imageUrl} alt="Promotion" />
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default PromotionBanner;
