import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PromotionForm = ({ onClose }) => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [displayStartDate, setDisplayStartDate] = useState('');
    const [displayEndDate, setDisplayEndDate] = useState('');
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
                console.error("Error fetching data:", error);
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
    
        if (!startDate || !endDate || !displayStartDate || !displayEndDate || selectedCategories.length === 0) {
            alert('Please fill in all required fields.');
            return;
        }
    
        const formData = new FormData();
        formData.append('startDate', new Date(startDate).toISOString());
        formData.append('endDate', new Date(endDate).toISOString());
        formData.append('startDisplay', new Date(displayStartDate).toISOString());
        formData.append('endDisplay', new Date(displayEndDate).toISOString());
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
            const token = localStorage.getItem('accessToken');
            const response = await axios.post('http://localhost:8080/promotions/api/add', formData, {
                headers: {
                    'Authorization': `${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
    
            alert('Promotion has been added!');
            onClose();
        } catch (error) {
            console.error('Error adding promotion:', error);
            alert('An error occurred while adding the promotion!');
        }
    };




    return (
        <div className="promotion-form">
            <h2>Add New Promotion</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Start Date:</label>
                    <input 
                        type="date" 
                        value={startDate} 
                        onChange={e => setStartDate(e.target.value)} 
                        required 
                    />
                </div>
                <div className="form-group">
                    <label>End Date:</label>
                    <input 
                        type="date" 
                        value={endDate} 
                        onChange={e => setEndDate(e.target.value)} 
                        required 
                    />
                </div>
                <div className="form-group">
                    <label>Display Start Date:</label>
                    <input 
                        type="date" 
                        value={displayStartDate} 
                        onChange={e => setDisplayStartDate(e.target.value)} 
                        required 
                    />
                </div>
                <div className="form-group">
                    <label>Display End Date:</label>
                    <input 
                        type="date" 
                        value={displayEndDate} 
                        onChange={e => setDisplayEndDate(e.target.value)} 
                        required 
                    />
                </div>
                <div className="form-group">
                    <label>Type:</label>
                    <select value={selectedType} onChange={handleTypeChange} required>
                        <option value="">Select Type</option>
                        {types.map((type, index) => (
                            <option key={index} value={type}>
                                {type}
                            </option>
                        ))}
                    </select>
                </div>
                {selectedType && (
                    <div className="form-group">
                        <label>Categories:</label>
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
                    <label>Discount Amount (%):</label>
                    <input 
                        type="number" 
                        value={discountAmount} 
                        onChange={e => setDiscountAmount(e.target.value)} 
                        required 
                    />
                </div>
                <div className="form-group">
                    <label>Description:</label>
                    <textarea
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        rows={4}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Upload Image:</label>
                    <input 
                        type="file" 
                        accept="image/*"
                        onChange={e => setImage(e.target.files[0])} 
                    />
                </div>
                <div className="form-actions">
                    <button type="submit">Add Promotion</button>
                    <button type="button" onClick={onClose}>Cancel</button>
                </div>
            </form>
        </div>
    );
};

export default PromotionForm;
