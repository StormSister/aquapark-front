import React, { useState } from 'react';
import axios from 'axios';

const ReservationsSearch = ({ onSearch }) => {
    const [email, setEmail] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const handleSearchByEmail = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/reservations/user?email=${email}`);
            onSearch(response.data);
        } catch (error) {
            console.error('Error searching reservations by email', error);
        }
    };

    const handleSearchByDates = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/reservations/search?startDate=${startDate}&endDate=${endDate}`);
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

