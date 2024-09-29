import React, { useState, useEffect } from "react";
import axios from "axios";
import EditPriceForm from "./EditPriceForm";
import DeletePriceButton from "./DeletePriceButton";
import AddPriceForm from "./AddPriceForm";
import "./ManagePrices.css";

const ManagePrices = () => {
  const [prices, setPrices] = useState([]);
  const [selectedPrice, setSelectedPrice] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const getAuthToken = () => {
    return localStorage.getItem("accessToken"); // Pobieranie tokena z localStorage
  };

  const fetchPrices = async () => {
    try {
      const token = getAuthToken(); // Pobieranie tokena
      const response = await axios.get("http://localhost:8080/prices");
      setPrices(response.data);
    } catch (error) {
      console.error("Error fetching prices:", error);
    }
  };

  useEffect(() => {
    fetchPrices(); // Pobieranie cen przy pierwszym załadowaniu komponentu
  }, []);

  const handleEditPrice = (price) => {
    setSelectedPrice(price); // Ustawienie wybranej ceny do edycji
  };

  const handleAddPrice = () => {
    setShowAddForm(true); // Wyświetlenie formularza dodawania ceny
  };

  const handleCloseForm = () => {
    setSelectedPrice(null); // Czyszczenie wybranej ceny
    setShowAddForm(false); // Ukrycie formularza dodawania ceny
    fetchPrices(); // Odświeżenie listy cen po zamknięciu formularza
  };

  return (
    <div>
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
                  <button
                    className="edit-button"
                    onClick={() => handleEditPrice(price)}
                  >
                    Edit
                  </button>
                  <DeletePriceButton
                    className="delete-button"
                    priceId={price.id}
                    onDelete={fetchPrices}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedPrice && (
        <EditPriceForm price={selectedPrice} onClose={handleCloseForm} />
      )}

      {showAddForm && (
        <AddPriceForm onClose={handleCloseForm} onAdd={fetchPrices} />
      )}

      <button onClick={handleAddPrice}>Add New Price</button>
    </div>
  );
};

export default ManagePrices;
