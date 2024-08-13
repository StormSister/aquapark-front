import React from 'react';
import { Link } from 'react-router-dom';

const AddReservationButton = () => {
    return (
        <div className="add-reservation">
            <Link to="/book-room">
                <button className="btn btn-primary">Add Reservation</button>
            </Link>
        </div>
    );
};

export default AddReservationButton;