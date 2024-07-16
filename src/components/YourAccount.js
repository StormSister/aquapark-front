import React, { useState } from 'react';
import axios from 'axios';

const YourAccount = () => {
    const [reservations, setReservations] = useState([]);
    const [showReservations, setShowReservations] = useState(false);
    const userEmail = localStorage.getItem('userEmail');

    const fetchUserReservations = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/reservations/user?email=${encodeURIComponent(userEmail)}`);
            console.log('Received reservations:', response.data);
            setReservations(response.data);
            setShowReservations(true); 
        } catch (error) {
            console.error('Failed to fetch reservations:', error);
        }
    };

    const toggleReservations = () => {
        if (showReservations) {
            setShowReservations(false); 
        } else {
            fetchUserReservations(); 
        }
    };

    return (
        <div>
            <h2>Your Reservations</h2>
            <button onClick={toggleReservations}>
                {showReservations ? 'Hide Reservations' : 'Fetch Reservations'}
            </button>
            {showReservations && (
                <ul>
                    {reservations.map((reservation) => (
                        <li key={reservation.id}>
                            <p>Reservation ID: {reservation.id}</p>
                            <p>Room Type: {reservation.room.type}</p>
                            <p>Start Date: {reservation.startDate}</p>
                            <p>End Date: {reservation.endDate}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default YourAccount;