import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PromotionBanner = () => {
    const [currentPromotions, setCurrentPromotions] = useState([]);

    useEffect(() => {
        fetchCurrentPromotions();
    }, []);

    const fetchCurrentPromotions = async () => {
        try {
            const response = await axios.get('http://localhost:8080/promotions/current');
            if (Array.isArray(response.data)) {
                setCurrentPromotions(response.data);  
                console.log(response.data);
                console.log(currentPromotions);
            } else {
                console.error('Expected an array of promotions, but got:', response.data);
            }
        } catch (error) {
            console.error('Error fetching current promotions:', error);
        }
    };

    return (
        <div className="promotion-banner">
            {currentPromotions.length > 0 ? (
                <>
                    <h2>Current Promotions</h2>
                    <div className="promotion-details">
                        {currentPromotions.map(promotion => (
                            <div key={promotion.id} className="promotion-item">
                                <p>Start Date: {new Date(promotion.startDate).toLocaleString()}</p>
                                <p>End Date: {new Date(promotion.endDate).toLocaleString()}</p>
                                <p>Description: {promotion.description}</p>
                                <p>Discount Amount: {promotion.discountAmount}%</p>
                                {promotion.imagePath && (
                                    <img src={`http://localhost:8080${promotion.imagePath}`} alt="Promotion" />
                                )}
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                <p>No current promotions available.</p>
            )}
        </div>
    );
};

export default PromotionBanner;
