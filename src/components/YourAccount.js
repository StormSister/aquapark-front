import React, { useState, useEffect } from 'react';
import axios from 'axios';

const YourAccount = () => {
    const [ticketUrls, setTicketUrls] = useState([]);
    const userEmail = localStorage.getItem('userEmail'); // assuming userEmail is stored in local storage

    useEffect(() => {
        const fetchUserTickets = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/tickets/user/tickets?email=${userEmail}`);
                console.log('Received ticket URLs:', response.data);
                setTicketUrls(response.data);
            } catch (error) {
                console.error('Failed to fetch ticket URLs:', error);
            }
        };

        if (userEmail) {
            fetchUserTickets();
        }
    }, [userEmail]);

    return (
        <div>
            <h2>Your Tickets</h2>
            {/* <div className="ticket-images">
                {ticketUrls.map((url, index) => (
                    // <iframe key={index} src={url} title={`Ticket ${index + 1}`} width="600" height="400"></iframe>
                ))}
            </div> */}
        </div>
    );
};

export default YourAccount;


