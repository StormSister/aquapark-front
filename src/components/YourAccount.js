import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EditUser from './EditUser'; // Importujemy komponent EditUser

const YourAccount = () => {
    const [reservations, setReservations] = useState([]);
    const [showReservations, setShowReservations] = useState(false);
    const [userData, setUserData] = useState(null); // Stan przechowujący dane użytkownika
    const [editFormVisible, setEditFormVisible] = useState(false); // Stan do śledzenia czy formularz edycji jest widoczny
    const userEmail = localStorage.getItem('userEmail');
    const token = localStorage.getItem('accessToken'); // Pobieramy token z localStorage

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
            console.log(userEmail);
            const response = await axios.get(`http://localhost:8080/api/users/search?email=${encodeURIComponent(userEmail)}`, getHeaders());
            console.log('Received user data:', response.data);
            if (response.data) {
                setUserData(response.data); // Ustawiamy dane użytkownika
            } else {
                setUserData(null); // Jeśli brak danych, ustawiamy na null
            }
        } catch (error) {
            console.error('Failed to fetch user data:', error);
        }
    };

    const updateUser = async (updatedUser) => {
        try {
            const response = await axios.put(`http://localhost:8080/api/users/${userData.id}`, updatedUser, getHeaders());
            console.log('Updated user:', response.data);
            setUserData(response.data); // Aktualizujemy dane użytkownika po udanej aktualizacji
            setEditFormVisible(false); // Ukrywamy formularz po udanej aktualizacji
        } catch (error) {
            console.error('Failed to update user:', error);
        }
    };

    const deleteUser = async (userId) => {
        try {
            await axios.delete(`http://localhost:8080/api/users/${userId}`, getHeaders());
            console.log('Deleted user with ID:', userId);
            localStorage.removeItem('userEmail'); // Usuwamy email użytkownika z localStorage
            setUserData(null); // Czyścimy dane użytkownika w stanie
            setEditFormVisible(false); // Ukrywamy formularz po usunięciu użytkownika
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
            console.log('Received reservations:', response.data);
            setReservations(response.data);
            setShowReservations(true);
        } catch (error) {
            console.error('Failed to fetch reservations:', error);
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
            {/* Renderujemy tylko gdy są dane użytkownika */}
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
                    <button onClick={handleEditProfile}>Edit Profile</button> {/* Guzik "Edit Profile" */}
                </div>
            )}

            {/* Renderujemy formularz edycji gdy widoczny */}
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
        </div>
    );
};

export default YourAccount;
