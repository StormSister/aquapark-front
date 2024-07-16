import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EditUser from './EditUser'; // Importujemy komponent EditUser

const YourAccount = () => {
    const [reservations, setReservations] = useState([]);
    const [showReservations, setShowReservations] = useState(false);
    const [userData, setUserData] = useState(null); // Stan przechowujący dane użytkownika
    const [editProfileClicked, setEditProfileClicked] = useState(false); // Stan do śledzenia czy kliknięto "Edit Profile"
    const [editFormVisible, setEditFormVisible] = useState(false); // Stan do śledzenia czy formularz edycji jest widoczny
    const userEmail = localStorage.getItem('userEmail');

    // Efekt do pobrania danych użytkownika po załadowaniu komponentu
    useEffect(() => {
        if (userEmail) {
            fetchUserData();
        }
    }, [userEmail]);

    // Funkcja do pobrania danych użytkownika
    const fetchUserData = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/users/search?email=${encodeURIComponent(userEmail)}`);
            console.log('Received user data:', response.data);
            setUserData(response.data); // Ustawiamy dane użytkownika w stanie
        } catch (error) {
            console.error('Failed to fetch user data:', error);
        }
    };

    // Funkcja do obsługi aktualizacji użytkownika
    const updateUser = async (updatedUser) => {
        try {
            const response = await axios.put(`http://localhost:8080/api/users/${userData.id}`, updatedUser);
            console.log('Updated user:', response.data);
            setUserData(response.data); // Aktualizujemy dane użytkownika po udanej aktualizacji
            setEditFormVisible(false); // Ukrywamy formularz po udanej aktualizacji
        } catch (error) {
            console.error('Failed to update user:', error);
        }
    };

    // Funkcja do obsługi usunięcia użytkownika
    const deleteUser = async (userId) => {
        try {
            await axios.delete(`http://localhost:8080/api/users/${userId}`);
            console.log('Deleted user with ID:', userId);
            localStorage.removeItem('userEmail'); // Usuwamy email użytkownika z localStorage
            setUserData(null); // Czyścimy dane użytkownika w stanie
            setEditFormVisible(false); // Ukrywamy formularz po usunięciu użytkownika
        } catch (error) {
            console.error('Failed to delete user:', error);
        }
    };

    // Funkcja do przełączania widoczności rezerwacji
    const toggleReservations = () => {
        if (showReservations) {
            setShowReservations(false);
        } else {
            fetchUserReservations();
        }
    };

    // Funkcja do pobrania rezerwacji użytkownika
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

    // Funkcja do obsługi kliknięcia guzika "Edit Profile"
    const handleEditProfile = () => {
        fetchUserData(); // Pobieramy dane użytkownika
        setEditProfileClicked(true); // Ustawiamy stan na true, że kliknięto "Edit Profile"
        setEditFormVisible(true); // Pokazujemy formularz edycji
    };

    // Funkcja do obsługi anulowania edycji
    const cancelEdit = () => {
        setEditFormVisible(false); // Ukrywamy formularz edycji
        setEditProfileClicked(false); // Resetujemy stan kliknięcia "Edit Profile"
    };

    return (
        <div>
            {(userData && !editFormVisible) && ( // Renderujemy tylko gdy są dane użytkownika i formularz edycji nie jest widoczny
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
            {editFormVisible && (
            <EditUser
            user={userData}
            onUpdateUser={updateUser}
            onDeleteUser={deleteUser}
            isLoggedIn={userData}
            onCancel={cancelEdit} // Przekazujemy funkcję anulowania edycji do EditUser
  />
)}
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
