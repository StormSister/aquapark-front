import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';

const token = localStorage.getItem('accessToken');

const getHeaders = () => ({
  headers: {
      'Authorization': token,
      'Content-Type': 'application/json'
  }
});


const BuyTickets = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [adults, setAdults] = useState(0);
    const [children, setChildren] = useState(0);
    const [isGroup, setIsGroup] = useState(false);
    const [prices, setPrices] = useState({});
    const [totalPrice, setTotalPrice] = useState(0);
    const [errors, setErrors] = useState(null);

    
    useEffect(() => {
        const fetchPrices = async () => {
            const response = await fetch('http://localhost:8080/prices');
            const data = await response.json();
            console.log(data);

            const pricesObject = data.reduce((acc, price) => {
              acc[`${price.type}-${price.category}`] = price.price * 100
                return acc;
            }, {});
            console.log(pricesObject);
            setPrices(pricesObject);
        };

        fetchPrices();
    }, []);

    // Przeliczanie całkowitej kwoty
    useEffect(() => {
        const adultPrice = prices['Ticket-Standard'] || 0;
        const childPrice = prices['Ticket-Child'] || 0;
        const total = adults * adultPrice + children * childPrice;
        setTotalPrice(total);
    }, [adults, children, prices]);

    // Schemat walidacji
    const schema = yup.object().shape({
        email: yup.string().email().required(),
        adults: yup.number().min(0).integer(),
        children: yup.number().min(0).integer(),
    }).test('sum-validation', 'Musisz wybrać co najmniej jedną osobę (dorosłego lub dziecko)', function(values) {
        const { adults, children } = values;
        return adults > 0 || children > 0;
    }).required();

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const requestData = { email, adults, children, isGroup, totalPrice };
            await schema.validate(requestData, { abortEarly: false });

            // Przekierowanie do płatności, przekazując dane biletów oraz kwotę
            navigate('/payment', { state: requestData });

        } catch (error) {
            if (error.name === 'ValidationError') {
                const validationErrors = {};
                error.inner.forEach(err => {
                    validationErrors[err.path] = err.message;
                });
                setErrors(validationErrors);
            } else {
                console.error('Error submitting form:', error);
            }
        }
    };

    return (
        <div>
            <h1>Purchase Tickets</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    {errors && errors.email && <p style={{ color: 'red' }}>{errors.email}</p>}
                </div>
                <div>
                    <label>Adults:</label>
                    <input
                        type="number"
                        value={adults.toString()}
                        onChange={(e) => setAdults(Number(e.target.value))}
                        min="0"
                        required
                    />
                    {errors && errors.adults && <p style={{ color: 'red' }}>{errors.adults}</p>}
                </div>
                <div>
                    <label>Children:</label>
                    <input
                        type="number"
                        value={children.toString()}
                        onChange={(e) => setChildren(Number(e.target.value))}
                        min="0"
                        required
                    />
                    {errors && errors.children && <p style={{ color: 'red' }}>{errors.children}</p>}
                </div>
                <div>
                    <label>
                        <input
                            type="checkbox"
                            checked={isGroup}
                            onChange={(e) => setIsGroup(e.target.checked)}
                        />
                        Group Ticket
                    </label>
                </div>
                <div>
                    <h3>Total Price: ${totalPrice / 100}</h3> {/* Konwersja do dolarów */}
                </div>
                <button type="submit">Proceed to Payment</button>
            </form>
        </div>
    );
};

export default BuyTickets;


