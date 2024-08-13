import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ReservationsSearch from './ReservationsSearch';
import { Link } from 'react-router-dom';
import AddReservationButton from './AddReservationButton';
import './ReservationTable.css'; // Import pliku CSS

const ReservationsTable = () => {
    const [reservations, setReservations] = useState([]);
    const [searchPerformed, setSearchPerformed] = useState(false);
    const [notification, setNotification] = useState('');

    useEffect(() => {
        fetchReservations();
    }, []);

    const getAuthToken = () => {
        return localStorage.getItem('accessToken'); 
    };


    const fetchReservations = async () => {
        try {
            const token = getAuthToken();
            console.log("Dodajemy token: "+ token)
            const response = await axios.get('http://localhost:8080/reservations/api/all', {
                headers: {
                    'Authorization': `${token}`,
                    'Content-Type': 'application/json'
                }
            });
            setReservations(response.data);
        } catch (error) {
            console.error('Error fetching reservations', error);
        }
    };

    const handleCancel = async (id) => {
        try {
            const token = getAuthToken();
            await axios.delete(`http://localhost:8080/reservations/api/${id}`, {
                headers: {
                    'Authorization':`${token}`,
                    'Content-Type': 'application/json'
                }
            });
            setNotification('Reservation cancelled successfully');
            fetchReservations();
        } catch (error) {
            console.error('Error cancelling reservation', error);
            setNotification('Error cancelling reservation');
        }
    };

    const handleSearch = (reservations) => {
        setSearchPerformed(true);
        setReservations(reservations);
    };

    return (
        <div>
            <AddReservationButton />
            <ReservationsSearch onSearch={handleSearch} />
            {notification && <p>{notification}</p>}
            {searchPerformed && reservations.length === 0 ? (
                <p>No reservations found.</p>
            ) : (
                <table className="reservations-table">
                    <thead>
                        <tr>
                            <th>Room Type</th>
                            <th>User Email</th>
                            <th>User Name</th>
                            <th>Phone Number</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reservations.map(reservation => (
                            <tr key={reservation.id}>
                                <td>{reservation.roomType}</td>
                                <td>{reservation.userEmail}</td>
                                <td>{reservation.userName}</td>
                                <td>{reservation.phoneNumber}</td>
                                <td>{reservation.startDate}</td>
                                <td>{reservation.endDate}</td>
                                <td>
                                    <button onClick={() => handleCancel(reservation.id)}>Cancel</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default ReservationsTable;





