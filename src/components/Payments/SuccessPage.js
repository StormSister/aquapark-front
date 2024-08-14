import React, { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const SuccessPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const query = new URLSearchParams(location.search);
    const sessionId = query.get('session_id');

    const effectRan = useRef(false);

    useEffect(() => {
        if (effectRan.current) return; 

        const confirmPayment = async () => {
            try {
                const storedSessionId = localStorage.getItem('sessionId');
                const paymentType = localStorage.getItem('paymentType');
                console.log("session id: " + storedSessionId + "paymentType: " + paymentType)

                if (sessionId !== storedSessionId) {
                    throw new Error('Session ID mismatch');
                }

                let dataToSubmit;
                let endpoint;

                if (paymentType === 'ticket') {
                    const ticketData = JSON.parse(localStorage.getItem('ticketData'));
                    dataToSubmit = ticketData;
                    endpoint = 'http://localhost:8080/tickets/purchase';
                } else if (paymentType === 'reservation') {
                    const reservationData = JSON.parse(localStorage.getItem('reservationData'));
                    dataToSubmit = reservationData;
                    endpoint = 'http://localhost:8080/reservations';
                } else {
                    throw new Error('Unknown payment type');
                }

                const response = await fetch('http://localhost:8080/confirm-payment', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ sessionId }),
                });

                if (response.ok) {
        
                    await fetch(endpoint, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(dataToSubmit),
                    });

                    localStorage.removeItem('ticketData');
                    localStorage.removeItem('reservationData');
                    localStorage.removeItem('sessionId');
                    localStorage.removeItem('paymentType');

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
        effectRan.current = true; 
    }, [sessionId, navigate]);

    return <div>Processing your payment...</div>;
};

export default SuccessPage;
