import React, { useState } from 'react';
import axios from 'axios';

const ReservationsSearch = ({ onSearch }) => {
    const [email, setEmail] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const getAuthToken = () => {
        return localStorage.getItem('accessToken'); 
    };

    const handleSearchByEmail = async () => {
        try {
            const token = getAuthToken();
            const response = await axios.get(`http://localhost:8080/reservations/api/user?email=${email}`, {
                headers: {
                    'Authorization': `${token}`,
                    'Content-Type': 'application/json'
                }
            });
            onSearch(response.data);
        } catch (error) {
            console.error('Error searching reservations by email', error);
        }
    };

    const handleSearchByDates = async () => {
        try {
            const token = getAuthToken();
            const response = await axios.get(`http://localhost:8080/reservations/api/search?startDate=${startDate}&endDate=${endDate}`, {
                headers: {
                    'Authorization': `${token}`,
                    'Content-Type': 'application/json'
                }
            });
            onSearch(response.data);
        } catch (error) {
            console.error('Error searching reservations by dates', error);
        }
    };

    return (
        <div>
            <div>
                <input 
                    type="text" 
                    placeholder="User Email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                />
                <button onClick={handleSearchByEmail}>Search by Email</button>
            </div>
            <div>
                <input 
                    type="date" 
                    placeholder="Start Date" 
                    value={startDate} 
                    onChange={(e) => setStartDate(e.target.value)} 
                />
                <input 
                    type="date" 
                    placeholder="End Date" 
                    value={endDate} 
                    onChange={(e) => setEndDate(e.target.value)} 
                />
                <button onClick={handleSearchByDates}>Search by Dates</button>
            </div>
        </div>
    );
};

export default ReservationsSearch;

