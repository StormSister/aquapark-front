import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PromotionForm = ({ onClose }) => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [discountAmount, setDiscountAmount] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);

    const [priceTypes, setPriceTypes] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [filteredCategories, setFilteredCategories] = useState([]);

    // Pobieranie typów i kategorii cen z endpointu
    useEffect(() => {
        const fetchPriceTypes = async () => {
            try {
                const response = await axios.get('http://localhost:8080/prices');
                const prices = response.data;

                // Zapisujemy pełną listę cen do priceTypes
                setPriceTypes(prices);
            } catch (error) {
                console.error("Błąd podczas pobierania typów cen:", error);
            }
        };

        fetchPriceTypes();
    }, []);

    // Filtrowanie kategorii na podstawie wybranego typu
    useEffect(() => {
        if (selectedCategory) {
            // Filtrujemy kategorie dla wybranego typu
            const categories = [...new Set(priceTypes
                .filter(price => price.category === selectedCategory)
                .map(price => price.category))];
            setFilteredCategories(categories);
        } else {
            setFilteredCategories([]);
        }
    }, [selectedCategory, priceTypes]);

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (!startDate || !endDate || !selectedCategory) {
            alert('Proszę wypełnić wszystkie wymagane pola.');
            return;
        }
    
        const formData = new FormData();
        formData.append('startDate', new Date(startDate).toISOString());
        formData.append('endDate', new Date(endDate).toISOString());
        formData.append('discountType', selectedCategory); // Przekazywanie category jako discountType
        formData.append('discountAmount', discountAmount);
        formData.append('description', description);
        formData.append('category', selectedCategory);
    
        if (image) {
            formData.append('image', image);
        }
    
        try {
            const token = localStorage.getItem('accessToken');
            const response = await axios.post('http://localhost:8080/api/promotions/add', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data' 
                }
            });
    
            console.log('Response from server:', response.data);
            alert('Promocja została dodana!');
            onClose();
        } catch (error) {
            console.error('Błąd podczas dodawania promocji:', error);
            alert('Wystąpił błąd podczas dodawania promocji!');
        }
    };

    return (
        <div className="promotion-form">
            <h2>Dodaj nową promocję</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Data rozpoczęcia:</label>
                    <input 
                        type="date" 
                        value={startDate} 
                        onChange={e => setStartDate(e.target.value)} 
                        required 
                    />
                </div>
                <div className="form-group">
                    <label>Data zakończenia:</label>
                    <input 
                        type="date" 
                        value={endDate} 
                        onChange={e => setEndDate(e.target.value)} 
                        required 
                    />
                </div>
                <div className="form-group">
                    <label>Kategoria biletu:</label>
                    <select 
                        value={selectedCategory} 
                        onChange={e => setSelectedCategory(e.target.value)}
                        required
                    >
                        <option value="">Wybierz kategorię</option>
                        {[...new Set(priceTypes.map(price => price.category))].map((category, index) => (
                            <option key={index} value={category}>{category}</option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label>Wysokość zniżki (%):</label>
                    <input 
                        type="number" 
                        value={discountAmount} 
                        onChange={e => setDiscountAmount(e.target.value)} 
                        required 
                    />
                </div>
                <div className="form-group">
                    <label>Opis promocji:</label>
                    <textarea
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        rows={4}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Załaduj zdjęcie:</label>
                    <input 
                        type="file" 
                        accept="image/*"
                        onChange={e => setImage(e.target.files[0])} 
                    />
                </div>
                <div className="form-actions">
                    <button type="submit">Dodaj promocję</button>
                    <button type="button" onClick={onClose}>Anuluj</button>
                </div>
            </form>
        </div>
    );
};

export default PromotionForm;
