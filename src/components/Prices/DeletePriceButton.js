import React from 'react';
import axios from 'axios';
import './ManagePrices.css'; 

const DeletePriceButton = ({ priceId, onDelete }) => {
  const handleDelete = async () => {
    try {
      const response = await axios.delete(`http://localhost:8080/api/prices/delete/${priceId}`);
      console.log('Price deleted successfully:', response.data);
      onDelete(); 
    } catch (error) {
      console.error('Error deleting price:', error);
    }
  };

  return (
    <button className="delete-button" onClick={handleDelete}>
      Delete Price
    </button>
  );
};

export default DeletePriceButton;