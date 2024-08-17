import React, { useState } from 'react';
import axios from 'axios';

const AddPriceForm = ({ onClose, onAdd }) => {
  const [type, setType] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');

 
  const token = localStorage.getItem('accessToken');
  console.log(token);

 
  const getHeaders = () => ({
    headers: {
      'Authorization': `${token}`, 
      'Content-Type': 'application/json'
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'http://localhost:8080/prices/api/add',
        {
          type,
          category,
          price: parseFloat(price)
        },
        getHeaders()  // Use getHeaders to pass headers
      );
      console.log('Price added successfully:', response.data);
      onAdd(); 
      onClose();
      setType('');
      setCategory('');
      setPrice('');
    } catch (error) {
      console.error('Error adding price:', error);
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
          <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
        </label>
        <div className="form-buttons">
          <button type="submit">Add Price</button>
          <button type="button" onClick={onClose}>Close</button>
        </div>
      </form>
    </div>
  );
};

export default AddPriceForm;

