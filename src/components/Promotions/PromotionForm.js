import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PromotionForm = ({ onClose }) => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [discountAmount, setDiscountAmount] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);

    const [allData, setAllData] = useState([]);
    const [types, setTypes] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedType, setSelectedType] = useState('');
    const [selectedCategories, setSelectedCategories] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:8080/prices');
                setAllData(response.data);

                // Get unique types
                const uniqueTypes = [...new Set(response.data.map(item => item.type))];
                setTypes(uniqueTypes);
                console.log('Fetched all data:', response.data);
                console.log('Unique types:', uniqueTypes);
            } catch (error) {
                console.error("Błąd podczas pobierania danych:", error);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (selectedType) {
            // Filter categories based on selected type
            const filteredCategories = allData
                .filter(item => item.type === selectedType)
                .map(item => item.category);
            const uniqueCategories = [...new Set(filteredCategories)]; // Unique categories
            setCategories(uniqueCategories);
            console.log('Filtered categories:', filteredCategories);
            console.log('Unique categories:', uniqueCategories);
        } else {
            setCategories([]);
        }
    }, [selectedType, allData]);

    const handleTypeChange = (e) => {
        const newType = e.target.value;
        setSelectedType(newType);
        setSelectedCategories([]); // Reset selected categories when type changes
        console.log('Selected type:', newType);
    };

    const handleCategoryChange = (category) => {
        const updatedCategories = selectedCategories.includes(category)
            ? selectedCategories.filter((c) => c !== category)
            : [...selectedCategories, category];
        setSelectedCategories(updatedCategories);
        console.log('Updated selected categories:', updatedCategories);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!startDate || !endDate || selectedCategories.length === 0) {
            alert('Proszę wypełnić wszystkie wymagane pola.');
            return;
        }

        const formData = new FormData();
        formData.append('startDate', new Date(startDate).toISOString());
        formData.append('endDate', new Date(endDate).toISOString());
        formData.append('discountAmount', discountAmount);
        formData.append('description', description);

        // Convert the list of selected categories to a JSON string
        const categoriesJson = JSON.stringify(selectedCategories);
        formData.append('categories', categoriesJson);

        if (image) {
            formData.append('image', image);
        }

        console.log('FormData contents before sending:');
        formData.forEach((value, key) => {
            console.log(key, value);
        });

        try {
            console.log('FormData contents before sending:');
    for (const [key, value] of formData.entries()) {
        if (value instanceof File) {
            console.log(`${key}: [File: ${value.name}, size: ${value.size} bytes]`);
        } else {
            console.log(`${key}: ${value}`);
        }
    }
            const token = localStorage.getItem('accessToken');
            const response = await axios.post('http://localhost:8080/promotions/api/add', formData, {
                headers: {
                    'Authorization': `${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

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
                    <label>Typ:</label>
                    <select value={selectedType} onChange={handleTypeChange} required>
                        <option value="">Wybierz typ</option>
                        {types.map((type, index) => (
                            <option key={index} value={type}>
                                {type}
                            </option>
                        ))}
                    </select>
                </div>
                {selectedType && (
                    <div className="form-group">
                        <label>Kategorie:</label>
                        {categories.map((category, index) => (
                            <div key={index}>
                                <label>
                                    <input
                                        type="checkbox"
                                        value={category}
                                        checked={selectedCategories.includes(category)}
                                        onChange={() => handleCategoryChange(category)}
                                    />
                                    {category}
                                </label>
                            </div>
                        ))}
                    </div>
                )}
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
