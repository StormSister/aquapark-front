import React from 'react';

const RoomCard = ({ roomType, handleRoomQuantityChange }) => {
    const { name, price, beds, description, imagePath, availableCount, capacity } = roomType;

    const handleChange = (e) => {
        const quantity = parseInt(e.target.value, 10) || 0;
        handleRoomQuantityChange(roomType, quantity);
    };

    return (
        <div className="room-card">
            <div className="room-card-content">
                <h3>{name}</h3>
                <p>Capacity: {capacity}</p>
                <p>Beds: {beds}</p>
                <p>Description: {description}</p>
                <div className="room-card-image">
                {imagePath && <img src={`/assets/images/rooms/${imagePath}`} alt={name} />}
                </div>
                <p>Price: ${price}</p>
                <p>Available: {availableCount}</p>
                <label>
                    Quantity:
                    <input
                        type="number"
                        min="0"
                        max={availableCount}
                        onChange={handleChange}
                    />
                </label>
            </div>
        </div>
    );
};

export default RoomCard;