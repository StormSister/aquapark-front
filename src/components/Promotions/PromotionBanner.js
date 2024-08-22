import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './PromotionBanner.css'; 

const PromotionBanner = () => {
    const [currentPromotions, setCurrentPromotions] = useState([]);
    const [selectedPromotion, setSelectedPromotion] = useState(null);

    useEffect(() => {
        fetchCurrentPromotions();
    }, []);

    const fetchCurrentPromotions = async () => {
        try {
            const response = await axios.get('http://localhost:8080/promotions/currentDisplay');
            if (Array.isArray(response.data)) {
                setCurrentPromotions(response.data);  
            } else {
                console.error('Expected an array of promotions, but got:', response.data);
            }
        } catch (error) {
            console.error('Error fetching current promotions:', error);
        }
    };

    const handlePromotionClick = (promotion) => {
        setSelectedPromotion(promotion);
    };

    const handleCloseModal = () => {
        setSelectedPromotion(null);
    };

    return (
        <div className="promotion-banner">
            <h2>Current Promotions</h2>
            <div className="promotion-details">
                {currentPromotions.map(promotion => (
                    <div 
                        key={promotion.id} 
                        className="promotion-item" 
                        onClick={() => handlePromotionClick(promotion)}
                    >
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

            {selectedPromotion && (
                <div className="promotion-item-modal">
                    <div className="promotion-item-modal-content">
                        <button className="promotion-item-modal-close" onClick={handleCloseModal}>
                            &times;
                        </button>
                        <h2>Promotion Details</h2>
                        <p>Start Date: {new Date(selectedPromotion.startDate).toLocaleString()}</p>
                        <p>End Date: {new Date(selectedPromotion.endDate).toLocaleString()}</p>
                        <p>Description: {selectedPromotion.description}</p>
                        <p>Discount Amount: {selectedPromotion.discountAmount}%</p>
                        {selectedPromotion.imagePath && (
                            <img src={`http://localhost:8080${selectedPromotion.imagePath}`} alt="Promotion" />
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PromotionBanner;
