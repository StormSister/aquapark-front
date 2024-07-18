import React, { useState } from 'react';
import axios from 'axios';

const EditPriceForm = ({ price, onClose }) => {
  const [type, setType] = useState(price.type);
  const [category, setCategory] = useState(price.category);
  const [editedPrice, setEditedPrice] = useState(price.price);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedData = {
        type,
        category,
        price: parseFloat(editedPrice) 
      };

      const response = await axios.put(`http://localhost:8080/api/prices/update/${price.id}`, updatedData);
      console.log('Price updated successfully:', response.data);
      
      onClose(); // Zamknięcie formularza po pomyślnym zaktualizowaniu ceny
    } catch (error) {
      console.error('Error updating price:', error);
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <label>
          Type:
          <input type="text" value={type} onChange={(e) => setType(e.target.value)} required />
        </label>
        <label>
          Category:
          <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} required />
        </label>
        <label>
          Price:
          <input type="number" value={editedPrice} onChange={(e) => setEditedPrice(e.target.value)} required />
        </label>
        <div className="form-buttons">
          <button type="submit">Update Price</button>
          <button type="button" onClick={onClose}>Close</button>
        </div>
      </form>
    </div>
  );
};

export default EditPriceForm;

