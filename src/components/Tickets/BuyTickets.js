import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStripe } from '@stripe/react-stripe-js';

const BuyTickets = () => {
    const navigate = useNavigate();
    const stripe = useStripe();

    const [email, setEmail] = useState('');
    const [ticketTypes, setTicketTypes] = useState([]);
    const [ticketQuantities, setTicketQuantities] = useState({});
    const [totalPrice, setTotalPrice] = useState(0);
    const [message, setMessage] = useState('');
    const [isGroup, setIsGroup] = useState(false);

    useEffect(() => {
        const fetchTicketTypes = async () => {
            try {
                const response = await fetch('http://localhost:8080/tickets/ticket-types');
                const data = await response.json();
                console.log('Fetched ticket types:', data);
                setTicketTypes(data);
            } catch (error) {
                console.error("Error fetching ticket types:", error);
            }
        };

        fetchTicketTypes();
    }, []);

    useEffect(() => {
        console.log('Current ticket types:', ticketTypes);
        console.log('Current ticket quantities:', ticketQuantities);

        let total = 0;
        ticketTypes.forEach(ticket => {
            const quantity = ticketQuantities[`${ticket.category}-${ticket.type}`] || 0;
            total += quantity * ticket.price;
        });
        setTotalPrice(total);
        console.log('Calculated total price:', total);
    }, [ticketQuantities, ticketTypes]);

    const handleQuantityChange = (category, type, quantity) => {
        const key = `${category}-${type}`;
        const validQuantity = Math.max(Number(quantity) || 0, 0);
        setTicketQuantities(prev => {
            const updatedQuantities = { ...prev, [key]: validQuantity };
            console.log('Updated ticket quantities:', updatedQuantities);
            return updatedQuantities;
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
    
        const excursionTicket = ticketTypes.find(ticket => ticket.category === 'Excursion');
        const excursionQuantity = ticketQuantities[`${excursionTicket?.category}-${excursionTicket?.type}`] || 0;
    
        if (excursionTicket && excursionQuantity > 0 && excursionQuantity < 20) {
            setMessage('Aby wybrać bilet typu Excursion, musi być co najmniej 20 osób.');
            return;
        }
    
        try {
            const requestData = {
                email,
                ticketDetails: ticketTypes.map(ticket => ({
                    type: ticket.type,
                    category: ticket.category,
                    quantity: ticketQuantities[`${ticket.category}-${ticket.type}`] || 0
                })).filter(ticket => ticket.quantity > 0),
                isGroup
            };
    
            console.log("Sending request data:", requestData);
    
        
            const response = await fetch('http://localhost:8080/create-checkout-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    totalPrice: totalPrice * 100, 
                    paymentType: 'ticket', 
                }),
            });
    
            const { sessionId } = await response.json();
            localStorage.setItem('ticketData', JSON.stringify(requestData)); 
            localStorage.setItem('sessionId', sessionId);
            localStorage.setItem('paymentType', 'ticket'); 
            const { error } = await stripe.redirectToCheckout({ sessionId });
    
            if (error) {
                console.error('Error redirecting to checkout:', error);
                setMessage('An error occurred while redirecting to checkout.');
            }
    
        } catch (error) {
            console.error('Error submitting form:', error);
            setMessage('An error occurred while processing your request.');
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
                </div>
                {ticketTypes.map((ticket, index) => (
                    <div key={`${ticket.category}-${ticket.type}-${index}`}>
                        <label>{`${ticket.category} Ticket (Price: ${ticket.price})`}:</label>
                        <input
                            type="number"
                            value={ticketQuantities[`${ticket.category}-${ticket.type}`] || 0}
                            onChange={(e) => handleQuantityChange(ticket.category, ticket.type, e.target.value)}
                            min="0"
                        />
                    </div>
                ))}
                <div>
                    <label>
                        <input
                            type="checkbox"
                            checked={isGroup}
                            onChange={(e) => setIsGroup(e.target.checked)}
                        />
                       Put all quests on one ticket
                    </label>
                </div>
                <div>
                    <h3>Total Price: {totalPrice.toFixed(2)}</h3>
                </div>
                <button type="submit" disabled={!stripe}>Purchase</button>
            </form>
            {message && <p style={{ color: 'red' }}>{message}</p>}
        </div>
    );
};

export default BuyTickets;
