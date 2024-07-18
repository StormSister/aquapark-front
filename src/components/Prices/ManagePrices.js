import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EditPriceForm from './EditPriceForm';
import DeletePriceButton from './DeletePriceButton';
import AddPriceForm from './AddPriceForm';
import './ManagePrices.css'; // Import CSS file for styling

const ManagePrices = () => {
  const [prices, setPrices] = useState([]);
  const [selectedPrice, setSelectedPrice] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const fetchPrices = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/prices');
      setPrices(response.data);
    } catch (error) {
      console.error('Error fetching prices:', error);
    }
  };

  useEffect(() => {
    fetchPrices();
  }, []);

  const handleEditPrice = (price) => {
    setSelectedPrice(price);
  };

  const handleDeletePrice = async (priceId) => {
    try {
      await axios.delete(`http://localhost:8080/api/prices/${priceId}`);
      fetchPrices();
    } catch (error) {
      console.error('Error deleting price:', error);
    }
  };

  const handleAddPrice = () => {
    setShowAddForm(true);
  };

  const handleCloseForm = () => {
    setSelectedPrice(null);
    setShowAddForm(false);
    fetchPrices();
  };

  return (
    <div>
      <h2>Manage Prices</h2>

      <h3>All Prices</h3>
      <table className="prices-table">
        <thead>
          <tr>
            <th>Type</th>
            <th>Category</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {prices.map((price) => (
            <tr key={price.id}>
              <td>{price.type}</td>
              <td>{price.category}</td>
              <td>{price.price}</td>
              <td>
                <div className="button-container">
                  <button className="edit-button" onClick={() => handleEditPrice(price)}>
                    Edit
                  </button>
                  <DeletePriceButton priceId={price.id} onDelete={() => handleDeletePrice(price.id)} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedPrice && <EditPriceForm price={selectedPrice} onClose={handleCloseForm} />}

      {showAddForm && <AddPriceForm onClose={handleCloseForm} />}

      <button onClick={handleAddPrice}>Add New Price</button>
    </div>
  );
};

export default ManagePrices;







