import React, { useState } from 'react';
import Calendar from 'react-calendar';
import axios from 'axios';
import RoomCard from './RoomCard';
import './Bookroom.css';

const ReservationForm = () => {
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [guests, setGuests] = useState(1);
    const [availableRooms, setAvailableRooms] = useState([]);
    const [selectedRooms, setSelectedRooms] = useState({});
    const [totalPrice, setTotalPrice] = useState(0);
    const [showUserForm, setShowUserForm] = useState(false);
    const [userInfo, setUserInfo] = useState({
        email: '',
        firstName: '',
        lastName: '',
        phoneNumber: ''
    });

    const handleDateChange = (dates) => {
        const [start, end] = dates;
        setStartDate(start);
        setEndDate(end);
    };

    const handleRoomQuantityChange = (roomType, quantity) => {
        const newSelectedRooms = { ...selectedRooms, [roomType.name]: { ...roomType, quantity } };
        setSelectedRooms(newSelectedRooms);

        let newTotalPrice = 0;
        let totalCapacity = 0;

        Object.values(newSelectedRooms).forEach(room => {
            newTotalPrice += room.price * room.quantity * (Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) - 1);
            totalCapacity += room.capacity * room.quantity;
        });

        if (totalCapacity < guests) {
            alert("Selected rooms do not have enough capacity for the number of guests.");
        }

        setTotalPrice(newTotalPrice);
    };

    const checkAvailableRooms = async () => {
        try {
            const formattedStartDate = startDate.toISOString().split('T')[0];
            const formattedEndDate = endDate.toISOString().split('T')[0];

            const response = await axios.get('http://localhost:8080/api/rooms/available', {
                params: {
                    startDate: formattedStartDate,
                    endDate: formattedEndDate
                }
            });
            setAvailableRooms(response.data);
        } catch (error) {
            console.error('Error fetching available rooms', error);
        }
    };

    const handleSubmit = async () => {
        const selectedRoomTypes = Object.values(selectedRooms).filter(room => room.quantity > 0);

        if (selectedRoomTypes.length === 0) {
            alert("Please select at least one room.");
            return;
        }

        setShowUserForm(true);
    };

    const handleUserFormSubmit = async () => {
        const selectedRoomTypes = Object.values(selectedRooms).filter(room => room.quantity > 0);

        if (!userInfo.email || !userInfo.firstName || !userInfo.lastName || !userInfo.phoneNumber) {
            alert("Please fill out all user information.");
            return;
        }

        try {
            const reservationRequests = selectedRoomTypes.map(room => ({
                roomType: room.name,
                startDate: startDate.toISOString().split('T')[0],
                endDate: endDate.toISOString().split('T')[0],
                numberOfPersons: room.quantity,
                user: {
                    email: userInfo.email,
                    firstName: userInfo.firstName,
                    lastName: userInfo.lastName,
                    phoneNumber: userInfo.phoneNumber
                }
            }));

            await axios.post('http://localhost:8080/api/reservations', reservationRequests);
            alert('Reservation successful!');
        } catch (error) {
            console.error('Error making reservation', error);
        }
    };

    const handleUserInfoChange = (e) => {
        const { name, value } = e.target;
        setUserInfo(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const tileDisabled = ({ date, view }) => {
        // Disable tiles before today's date
        return view === 'month' && date < new Date();
    };

    const tileClassName = ({ date, view }) => {
        if (view === 'month' && date.toDateString() === new Date().toDateString()) {
            return 'react-calendar__tile--today';
        }
        if (view === 'month' && date < new Date()-1) {
            return 'react-calendar__tile--disabled';
        }
        if (view === 'month' && date >= startDate && date <= endDate) {
            return 'react-calendar__tile--selected';
        }

        return null;
    };

    return (
        <div className="create-reservation-container">
            <h1>Book Your Stay</h1>
            <div className="form-field">
                <label>Select Dates:</label>
                <div className="calendar-container">
                    <Calendar
                        selectRange={true}
                        onChange={handleDateChange}
                        value={[startDate, endDate]}
                        tileDisabled={tileDisabled}
                        tileClassName={tileClassName}
                    />
                </div>
            </div>
            <div className="form-field">
                <label>Number of Guests:</label>
                <input
                    type="number"
                    value={guests}
                    onChange={(e) => setGuests(parseInt(e.target.value, 10))}
                    className="form-input"
                />
            </div>
            <button onClick={checkAvailableRooms}>Check Available Rooms</button>

            {availableRooms.length > 0 && (
                <div>
                    <h2>Available Rooms</h2>
                    <div className="room-card-container">
                        {availableRooms.map(room => (
                            <RoomCard
                                key={room.name}
                                roomType={room}
                                handleRoomQuantityChange={handleRoomQuantityChange}
                            />
                        ))}
                    </div>
                    <div>
                        <h3>Total Price: ${totalPrice.toFixed(2)}</h3>
                        <button onClick={handleSubmit}>Book</button>
                    </div>
                </div>
            )}

            {showUserForm && (
                <div>
                    <h2>User Information</h2>
                    <div className="form-field">
                        <label>Email:</label>
                        <input
                            type="email"
                            name="email"
                            value={userInfo.email}
                            onChange={handleUserInfoChange}
                            className="form-input"
                        />
                    </div>
                    <div className="form-field">
                        <label>First Name:</label>
                        <input
                            type="text"
                            name="firstName"
                            value={userInfo.firstName}
                            onChange={handleUserInfoChange}
                            className="form-input"
                        />
                    </div>
                    <div className="form-field">
                        <label>Last Name:</label>
                        <input
                            type="text"
                            name="lastName"
                            value={userInfo.lastName}
                            onChange={handleUserInfoChange}
                            className="form-input"
                        />
                    </div>
                    <div className="form-field">
                        <label>Phone Number:</label>
                        <input
                            type="tel"
                            name="phoneNumber"
                            value={userInfo.phoneNumber}
                            onChange={handleUserInfoChange}
                            className="form-input"
                        />
                    </div>
                    <button onClick={handleUserFormSubmit}>Confirm</button>
                </div>
            )}
        </div>
    );
};

export default ReservationForm;









