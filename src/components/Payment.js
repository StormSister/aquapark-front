import React from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { useLocation } from 'react-router-dom';

const Payment = () => {
    const stripe = useStripe();
    const elements = useElements();
    const location = useLocation();

    const { email, adults, children, isGroup, totalPrice } = location.state || {};

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        console.log('Payment data:', { email, adults, children, isGroup, totalPrice });  

        const response = await fetch('http://localhost:8080/create-checkout-session', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email,
                adults,
                children,
                isGroup,
                totalPrice,
            }),
        });

        const session = await response.json();

        console.log('Checkout session:', session);  // Debug log

        const result = await stripe.redirectToCheckout({
            sessionId: session.id,
        });

        if (result.error) {
            console.error(result.error.message);
        }
    };

    return (
        <div>
            <h2>Payment</h2>
            <form onSubmit={handleSubmit}>
                <CardElement />
                <button type="submit" disabled={!stripe}>
                    Pay
                </button>
            </form>
        </div>
    );
};

export default Payment;