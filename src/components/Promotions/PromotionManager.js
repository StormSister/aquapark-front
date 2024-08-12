import React, { useState } from 'react';
import axios from 'axios';
import PromotionForm from './PromotionForm';

const token = localStorage.getItem('accessToken');

const getHeaders = () => ({
    headers: {
        'Authorization': token,
        'Content-Type': 'application/json'
    }
});

const PromotionManager = () => {
    const [showAddForm, setShowAddForm] = useState(false);
    const [promotions, setPromotions] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [searchType, setSearchType] = useState('');

    const handleSearchPromotions = () => {
        const queryParams = {
            date: startDate,
            type: searchType
        };

        if (endDate) {
            queryParams.endDate = endDate;
        }

        axios.get('http://localhost:8080/api/promotions/search', getHeaders(), { params: queryParams })
        .then(response => {
            console.log(response.data);
            setPromotions(response.data);
        })
        .catch(error => {
            console.error('Error while searching for promotions:', error);
            alert('An error occurred while searching for promotions!');
        });
    };

    const handleShowCurrentPromotions = () => {
        axios.get('http://localhost:8080/promotions/current')
        .then(response => {
            console.log(response.data);
            setPromotions(response.data);
        })
        .catch(error => {
            console.error('Error while fetching current promotions:', error);
            alert('An error occurred while fetching current promotions!');
        });
    };

    const handleOpenAddPromotionForm = () => {
        setShowAddForm(true);
    };

    const handleCloseAddForm = () => {
        setShowAddForm(false);
    };

    return (
        <div className="promotion-manager">
            <h2>Manage Promotions</h2>
            
            
            <form onSubmit={(e) => { e.preventDefault(); handleSearchPromotions(); }}>
                <label>
                    Search by Start Date:
                    <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                </label>
                <label>
                    Search by End Date (optional):
                    <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                </label>
                <label>
                    Search by Type:
                    <input type="text" value={searchType} onChange={(e) => setSearchType(e.target.value)} />
                </label>
                <button type="submit">Search Promotions</button>
            </form>

            
            <button onClick={handleShowCurrentPromotions}>Show Current Promotions</button>
            <button onClick={handleOpenAddPromotionForm}>Add Promotion</button>

            {showAddForm && <PromotionForm onClose={handleCloseAddForm} />}

          
            {promotions.length > 0 && (
                <div>
                    <h3>Current Promotions:</h3>
                    <ul>
                        {promotions.map(promotion => (
                            <li key={promotion.id}>
                                <p>Id: {promotion.id}</p>
                                <p>Start Date: {promotion.startDate}</p>
                                <p>End Date: {promotion.endDate}</p>
                                <p>Discount Type: {promotion.discountType}</p>
                                <p>Discount Amount: {promotion.discountAmount}</p>
                                <p>Description: {promotion.description}</p>
                               
                                {promotion.image && (
                                    <img src={`data:image/jpeg;base64,${promotion.image}`} alt="Promotion" />
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default PromotionManager;


