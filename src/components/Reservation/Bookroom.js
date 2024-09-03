import React, { useState } from "react";
import Calendar from "react-calendar";
import axios from "axios";
import RoomCard from "./RoomCard";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useStripe } from "@stripe/react-stripe-js";
import "./Bookroom.css";

const ReservationForm = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [guests, setGuests] = useState(1);
  const [availableRooms, setAvailableRooms] = useState([]);
  const [selectedRooms, setSelectedRooms] = useState({});
  const [totalPrice, setTotalPrice] = useState(0);
  const [showUserForm, setShowUserForm] = useState(false);
  const navigate = useNavigate();
  const stripe = useStripe();

  const userFormSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Required"),
    firstName: Yup.string().required("Required"),
    lastName: Yup.string().required("Required"),
    phoneNumber: Yup.string().required("Required"),
  });

  const handleDateChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  const handleRoomQuantityChange = (roomType, quantity) => {
    const newSelectedRooms = {
      ...selectedRooms,
      [roomType.name]: { ...roomType, quantity },
    };
    setSelectedRooms(newSelectedRooms);

    let newTotalPrice = 0;
    let totalCapacity = 0;

    Object.values(newSelectedRooms).forEach((room) => {
      const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24) - 1);
      newTotalPrice += room.finalPrice * room.quantity * days;
      totalCapacity += room.capacity * room.quantity;
    });

    if (totalCapacity < guests) {
      alert(
        "Selected rooms do not have enough capacity for the number of guests."
      );
    }

    setTotalPrice(newTotalPrice);
  };

  const checkAvailableRooms = async () => {
    try {
      const formattedStartDate = startDate.toISOString().split("T")[0];
      const formattedEndDate = endDate.toISOString().split("T")[0];

      const response = await axios.get(
        "http://localhost:8080/rooms/available",
        {
          params: {
            startDate: formattedStartDate,
            endDate: formattedEndDate,
          },
        }
      );
      setAvailableRooms(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching available rooms", error);
    }
  };

  const handleSubmit = async () => {
    const selectedRoomTypes = Object.values(selectedRooms).filter(
      (room) => room.quantity > 0
    );

    if (selectedRoomTypes.length === 0) {
      alert("Please select at least one room.");
      return;
    }

    for (const room of selectedRoomTypes) {
      const availableRoom = availableRooms.find((r) => r.name === room.name);
      if (room.quantity > availableRoom.availableQuantity) {
        alert(
          `Cannot select more than ${availableRoom.availableQuantity} ${room.name} rooms.`
        );
        return;
      }
    }

    setShowUserForm(true);
  };

  const handleUserFormSubmit = async (values) => {
    const selectedRoomTypes = Object.values(selectedRooms).filter(
      (room) => room.quantity > 0
    );

    const reservationData = selectedRoomTypes.map((room) => ({
      roomType: room.name,
      startDate: startDate.toISOString().split("T")[0],
      endDate: endDate.toISOString().split("T")[0],
      numberOfPersons: room.quantity,
      user: {
        email: values.email,
        firstName: values.firstName,
        lastName: values.lastName,
        phoneNumber: values.phoneNumber,
      },
    }));

    try {
      localStorage.setItem("reservationData", JSON.stringify(reservationData));
      localStorage.setItem("paymentType", "reservation");

      const response = await fetch(
        "http://localhost:8080/create-checkout-session",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            totalPrice: totalPrice * 100,
            paymentType: "reservation",
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create checkout session");
      }

      const { sessionId } = await response.json();
      localStorage.setItem("sessionId", sessionId);

      const { error } = await stripe.redirectToCheckout({ sessionId });
      if (error) {
        console.error("Error redirecting to checkout:", error);
        alert("An error occurred during payment.");
      }
    } catch (error) {
      console.error("Error making reservation", error);
      alert("An error occurred while making the reservation.");
    }
  };

  const tileDisabled = ({ date, view }) => {
    return view === "month" && date < new Date();
  };

  const tileClassName = ({ date, view }) => {
    if (view === "month" && date.toDateString() === new Date().toDateString()) {
      return "react-calendar__tile--today";
    }
    if (view === "month" && date < new Date() - 1) {
      return "react-calendar__tile--disabled";
    }
    if (view === "month" && date >= startDate && date <= endDate) {
      return "react-calendar__tile--selected";
    }

    return null;
  };

  const userForm = useFormik({
    initialValues: {
      email: "",
      firstName: "",
      lastName: "",
      phoneNumber: "",
    },
    validationSchema: userFormSchema,
    onSubmit: handleUserFormSubmit,
  });

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
            {availableRooms.map((room) => (
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
        <form onSubmit={userForm.handleSubmit}>
          <h2>User Information</h2>
          <div className="form-field">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={userForm.values.email}
              onChange={userForm.handleChange}
              onBlur={userForm.handleBlur}
              className="form-input"
            />
            {userForm.touched.email && userForm.errors.email ? (
              <div className="error">{userForm.errors.email}</div>
            ) : null}
          </div>
          <div className="form-field">
            <label>First Name:</label>
            <input
              type="text"
              name="firstName"
              value={userForm.values.firstName}
              onChange={userForm.handleChange}
              onBlur={userForm.handleBlur}
              className="form-input"
            />
            {userForm.touched.firstName && userForm.errors.firstName ? (
              <div className="error">{userForm.errors.firstName}</div>
            ) : null}
          </div>
          <div className="form-field">
            <label>Last Name:</label>
            <input
              type="text"
              name="lastName"
              value={userForm.values.lastName}
              onChange={userForm.handleChange}
              onBlur={userForm.handleBlur}
              className="form-input"
            />
            {userForm.touched.lastName && userForm.errors.lastName ? (
              <div className="error">{userForm.errors.lastName}</div>
            ) : null}
          </div>
          <div className="form-field">
            <label>Phone Number:</label>
            <input
              type="text"
              name="phoneNumber"
              value={userForm.values.phoneNumber}
              onChange={userForm.handleChange}
              onBlur={userForm.handleBlur}
              className="form-input"
            />
            {userForm.touched.phoneNumber && userForm.errors.phoneNumber ? (
              <div className="error">{userForm.errors.phoneNumber}</div>
            ) : null}
          </div>
          <button type="submit">Proceed to Payment</button>
        </form>
      )}
    </div>
  );
};

export default ReservationForm;
