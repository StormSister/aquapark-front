import React, { useState } from 'react';
import axios from 'axios';

const AddPriceForm = ({ onClose, onAdd }) => {
  const [type, setType] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');

 
  const token = localStorage.getItem('accessToken');

 
  const getHeaders = () => ({
    headers: {
      'Authorization': token, // Dodanie tokenu do nagłówka
      'Content-Type': 'application/json'
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'http://localhost:8080/api/prices/add', 
        {
          type,
          category,
          price: parseFloat(price)
        },
        getHeaders() // Dodanie nagłówków do zapytania
      );
      console.log('Price added successfully:', response.data);
      onAdd(); // Wywołanie funkcji onAdd przekazanej jako props po pomyślnym dodaniu ceny
      onClose(); // Zamknięcie formularza
      
      // Opcjonalnie, zresetowanie pól formularza
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

