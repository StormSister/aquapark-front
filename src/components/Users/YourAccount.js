import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EditUser from './EditUser';
import TicketList from './TicketList';

const YourAccount = () => {
    const [reservations, setReservations] = useState([]);
    const [showReservations, setShowReservations] = useState(false);
    const [tickets, setTickets] = useState([]);
    const [showTickets, setShowTickets] = useState(false);
    const [userData, setUserData] = useState(null);
    const [editFormVisible, setEditFormVisible] = useState(false);
    const userEmail = localStorage.getItem('userEmail');
    const token = localStorage.getItem('accessToken');

    useEffect(() => {
        if (userEmail) {
            fetchUserData();
        }
    }, [userEmail]);

    const getHeaders = () => ({
        headers: {
            'Authorization': token,
            'Content-Type': 'application/json'
        }
    });

    const fetchUserData = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/users/search?email=${encodeURIComponent(userEmail)}`, getHeaders());
            if (response.data) {
                setUserData(response.data);
            } else {
                setUserData(null);
            }
        } catch (error) {
            console.error('Failed to fetch user data:', error);
        }
    };

    const updateUser = async (updatedUser) => {
        try {
            const response = await axios.put(`http://localhost:8080/api/users/${userData.id}`, updatedUser, getHeaders());
            setUserData(response.data);
            setEditFormVisible(false);
        } catch (error) {
            console.error('Failed to update user:', error);
        }
    };

    const deleteUser = async (userId) => {
        try {
            await axios.delete(`http://localhost:8080/api/users/${userId}`, getHeaders());
            localStorage.removeItem('userEmail');
            setUserData(null);
            setEditFormVisible(false);
        } catch (error) {
            console.error('Failed to delete user:', error);
        }
    };

    const toggleReservations = () => {
        if (showReservations) {
            setShowReservations(false);
        } else {
            fetchUserReservations();
        }
    };

    const fetchUserReservations = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/reservations/api/user?email=${encodeURIComponent(userEmail)}`, getHeaders());
            setReservations(response.data);
            setShowReservations(true);
        } catch (error) {
            console.error('Failed to fetch reservations:', error);
        }
    };

    const fetchUserTickets = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/tickets/api/active?email=${encodeURIComponent(userEmail)}`, getHeaders());
            setTickets(response.data);
            console.log("Tickets "+ response.data);
            setShowTickets(true);
        } catch (error) {
            console.error('Failed to fetch tickets:', error);
        }
    };

    const toggleTickets = () => {
        if (showTickets) {
            setShowTickets(false);
        } else {
            fetchUserTickets();
        }
    };

    const handleEditProfile = () => {
        fetchUserData();
        setEditFormVisible(true);
    };

    const cancelEdit = () => {
        setEditFormVisible(false);
    };

    return (
        <div>
            {userData && !editFormVisible && (
                <div>
                    <h2>Your Account</h2>
                    <div style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
                        <p>Email: {userData.email}</p>
                        <p>Username: {userData.username}</p>
                        <p>First Name: {userData.firstName}</p>
                        <p>Last Name: {userData.lastName}</p>
                        <p>Phone Number: {userData.phoneNumber}</p>
                        <p>Role: {userData.role}</p>
                    </div>
                    <button onClick={handleEditProfile}>Edit Profile</button>
                </div>
            )}

            {editFormVisible && userData && (
                <EditUser
                    user={userData}
                    onUpdateUser={updateUser}
                    onDeleteUser={deleteUser}
                    isLoggedIn={!!userData}
                    onCancel={cancelEdit}
                />
            )}

            <h2>Your Reservations</h2>
            <button onClick={toggleReservations}>
                {showReservations ? 'Hide Reservations' : 'Fetch Reservations'}
            </button>
            {showReservations && reservations.length > 0 && (
                <ul>
                    {reservations.map((reservation) => (
                        <li key={reservation.id}>
                            <p>Reservation ID: {reservation.id}</p>
                            <p>Room Type: {reservation.roomType}</p>
                            <p>Start Date: {reservation.startDate}</p>
                            <p>End Date: {reservation.endDate}</p>
                        </li>
                    ))}
                </ul>
            )}
            {showReservations && reservations.length === 0 && (
                <p>No reservations found.</p>
            )}

           
            <div>
            <button onClick={toggleTickets}>
                {showTickets ? 'Hide Tickets' : 'Show Tickets'}
            </button>
            {showTickets && <TicketList tickets={tickets} />}
        </div>
        </div>
    );
};

export default YourAccount;
