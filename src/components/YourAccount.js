import React, { useState, useEffect } from 'react';
import axios from 'axios';

const YourAccount = () => {
    const [ticketPaths, setTicketPaths] = useState([]);
    const userEmail = localStorage.getItem('userEmail'); 

    useEffect(() => {
        if (!userEmail) {
            console.error('User email not found in local storage');
            return;
        }

        console.log('Fetching tickets for user:', userEmail); 

        const fetchUserTickets = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/tickets/tickets?email=${encodeURIComponent(userEmail)}`);
                console.log('Received ticket paths:', response.data);
                setTicketPaths(response.data);
            } catch (error) {
                console.error('Failed to fetch tickets:', error);
            }
        };

        fetchUserTickets();
    }, [userEmail]);

    console.log('User email in component:', userEmail); 

    return (
        <div>
            <h2>Your Tickets</h2>
            <div className="ticket-images">
                {ticketPaths.map((path, index) => (
                    <iframe
                        key={index}
                        src={`http://localhost:8080/${path}`}
                        width="600"
                        height="400"
                        title={`Ticket ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default YourAccount;
