import React, { useState } from 'react';
import axios from 'axios';
import PromotionForm from './PromotionForm';
import './PromotionManager.css'; // Import your CSS file

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
    const [showTable, setShowTable] = useState(false); // New state for showing table

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
            setShowTable(true); // Show the table when search results are received
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
            // Ensure that the response data is an array
            setPromotions(Array.isArray(response.data) ? response.data : []);
            setShowTable(true); // Show the table when current promotions are fetched
        })
        .catch(error => {
            console.error('Error while fetching current promotions:', error);
            alert('An error occurred while fetching current promotions!');
        });
    };

    const handleOpenAddPromotionForm = () => {
        setShowAddForm(true);
    };

    const handleCloseAddPromotionForm = () => {
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

            {showAddForm && <PromotionForm onClose={handleCloseAddPromotionForm} />}

            {showTable && promotions.length > 0 && (
                <div>
                    <h3>Current Promotions:</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>Start Date</th>
                                <th>End Date</th>
                                <th>Discount Type</th>
                                <th>Discount Amount</th>
                                <th>Description</th>
                                <th>Image</th>
                            </tr>
                        </thead>
                        <tbody>
                            {promotions.map(promotion => (
                                <tr key={promotion.id}>
                                    <td>{promotion.id}</td>
                                    <td>{promotion.startDate}</td>
                                    <td>{promotion.endDate}</td>
                                    <td>{promotion.discountType}</td>
                                    <td>{promotion.discountAmount}</td>
                                    <td>{promotion.description}</td>
                                    <td>{promotion.imagePath}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default PromotionManager;
