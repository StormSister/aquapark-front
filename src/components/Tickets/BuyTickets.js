import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';

const BuyTickets = () => {
    const navigate = useNavigate();
    const stripe = useStripe();
    const elements = useElements();

    const schema = yup.object().shape({
        email: yup.string().email().required(),
        adults: yup.number().min(0).integer(),
        children: yup.number().min(0).integer(),
    }).test('sum-validation', 'Musisz wybrać co najmniej jedną osobę (dorosłego lub dziecko)', function(values) {
        const { adults, children } = values;
        return adults > 0 || children > 0;
    }).required();

    const [email, setEmail] = useState('');
    const [adults, setAdults] = useState(0);
    const [children, setChildren] = useState(0);
    const [isGroup, setIsGroup] = useState(false);
    const [message, setMessage] = useState('');
    const [errors, setErrors] = useState(null);

   
    const [adultPrice, setAdultPrice] = useState(0);
    const [childPrice, setChildPrice] = useState(0);

  
    const [totalPrice, setTotalPrice] = useState(0);

    
    const calculateTotalPrice = (adults, children, adultPrice, childPrice) => {
        return (adults * adultPrice) + (children * childPrice);
    };


    useEffect(() => {
        const fetchPrices = async () => {
            try {
                const response = await fetch('http://localhost:8080/prices');
                const data = await response.json();

                console.log("Prices:", JSON.stringify(data, null, 2));

                const adultPrice = data.find(price => price.type === 'Ticket' && price.category === 'Standard')?.price || 0;
                const childPrice = data.find(price => price.type === 'Ticket' && price.category === 'Child')?.price || 0;

                setAdultPrice(adultPrice);
                setChildPrice(childPrice);

                setTotalPrice(calculateTotalPrice(adults, children, adultPrice, childPrice));

                console.log(`Adult price: ${adultPrice} Child price: ${childPrice}`);
            } catch (error) {
                console.error("Error fetching prices:", error);
            }
        };

        fetchPrices();
    }, []); 

    
    useEffect(() => {
        setTotalPrice(calculateTotalPrice(adults, children, adultPrice, childPrice));
    }, [adults, children, adultPrice, childPrice]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const requestData = { email, adults, children, isGroup };
            console.log('Request Body:', requestData);

            await schema.validate(requestData, { abortEarly: false });

          

            const response = await fetch('http://localhost:8080/create-checkout-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  totalPrice: totalPrice * 100,
                    paymentType: 'ticket'
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to create checkout session');
            }

            const { sessionId } = await response.json();
            console.log('Stripe Session ID:', sessionId);

            
            localStorage.setItem('ticketData', JSON.stringify({ email, adults, children, isGroup }));
            localStorage.setItem('sessionId', sessionId);

            
            const { error } = await stripe.redirectToCheckout({ sessionId });

            if (error) {
                console.error('Error redirecting to checkout:', error);
                setMessage('An error occurred while redirecting to checkout.');
            }

        } catch (error) {
            if (error.name === 'ValidationError') {
                const validationErrors = {};
                error.inner.forEach(err => {
                    validationErrors[err.path] = err.message;
                });
                setErrors(validationErrors);
            } else {
                console.error('Error submitting form:', error);
                setMessage('An error occurred while processing your request.');
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
                    <label>Adults (Price: {adultPrice}):</label>
                    <input
                        type="number"
                        value={adults}
                        onChange={(e) => setAdults(Number(e.target.value))}
                        min="0"
                        required
                    />
                    {errors && errors.adults && <p style={{ color: 'red' }}>{errors.adults}</p>}
                </div>
                <div>
                    <label>Children (Price: {childPrice}):</label>
                    <input
                        type="number"
                        value={children}
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
                    <CardElement />
                </div>

                {/* Wyświetlanie całkowitej ceny */}
                <div>
                    <h3>Total Price: {totalPrice}</h3>
                </div>

                <button type="submit" disabled={!stripe}>Purchase</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default BuyTickets;


