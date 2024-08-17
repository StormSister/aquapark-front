import React from 'react';
import axios from 'axios';
import './ManagePrices.css'; 


const DeletePriceButton = ({ priceId, onDelete }) => {
  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      console.log(token);

      const response = await axios.delete(`http://localhost:8080/prices/api/delete/${priceId}`, {
        headers: {
          'Authorization': `${token}`,
          'Content-Type': 'application/json'
        }
      });
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