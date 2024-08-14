import React, { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const SuccessPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const query = new URLSearchParams(location.search);
    const sessionId = query.get('session_id');
    
    // useRef to track whether the effect has run
    const effectRan = useRef(false);

    useEffect(() => {
        if (effectRan.current) return; // Prevents the effect from running again

        const confirmPayment = async () => {
            try {
                const storedSessionId = localStorage.getItem('sessionId');
                if (sessionId !== storedSessionId) {
                    throw new Error('Session ID mismatch');
                }

                const ticketData = JSON.parse(localStorage.getItem('ticketData'));
                console.log("Dane przekazane z formularza pobrane z local storage: " + JSON.stringify(ticketData, null, 2));

                const response = await fetch('http://localhost:8080/confirm-payment', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ sessionId }),
                });

                if (response.ok) {
                    await fetch('http://localhost:8080/tickets/purchase', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(ticketData),
                    });

                    console.log(response);

                    localStorage.removeItem('ticketData');
                    localStorage.removeItem('sessionId');

                    navigate('/confirmation'); 
                } else {
                    console.error('Payment confirmation failed');
                    navigate('/payment-failed');
                }
            } catch (error) {
                console.error('Error:', error);
                navigate('/payment-failed');
            }
        };

        confirmPayment();
        effectRan.current = true; // Mark the effect as having run
    }, [sessionId, navigate]);

    return <div>Processing your payment...</div>;
};

export default SuccessPage;