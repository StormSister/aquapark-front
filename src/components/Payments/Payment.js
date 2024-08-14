import React, { useEffect } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { useLocation, useNavigate } from 'react-router-dom';

const Payment = () => {
    const stripe = useStripe();
    const elements = useElements();
    const location = useLocation();
    const navigate = useNavigate();

    const paymentData = location.state || {};
    const { totalPrice, paymentType } = paymentData; 

    useEffect(() => {
        if (!paymentData || !totalPrice || !paymentType) {
            navigate('/'); // Redirect if no payment data is found
        }
    }, [paymentData, totalPrice, paymentType, navigate]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        try {
            // Step 1: Create the checkout session on the server
            const response = await fetch('http://localhost:8080/create-checkout-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    totalPrice,
                    paymentType,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to create checkout session');
            }

            const session = await response.json();

            // Step 2: Redirect to Stripe Checkout
            const result = await stripe.redirectToCheckout({
                sessionId: session.sessionId,
            });

            if (result.error) {
                console.error(result.error.message);
                // Optionally display error message to user
            } else {
                // Save session ID and other data in localStorage
                localStorage.setItem('sessionId', session.sessionId);
                localStorage.setItem('paymentData', JSON.stringify(paymentData));
            }
        } catch (error) {
            console.error('Payment failed:', error);
            // Optionally display error message to user
        }
    };

    return (
        <div>
            <h2>Payment</h2>
            <form onSubmit={handleSubmit}>
                <button type="submit" disabled={!stripe}>
                    Pay ${totalPrice}
                </button>
            </form>
        </div>
    );
};

export default Payment;
