import React from 'react';

// Function to handle file download or display
const handleFileFetch = (fileUrl, token) => {
    // Use a fetch call to include the token in the request headers
    fetch(fileUrl, {
        headers: {
            'Authorization': `${token}`,
            'Content-Type': 'application/json'
        },
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.blob();
    })
    .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileUrl.split('/').pop(); // Extract file name from URL
        a.click();
        window.URL.revokeObjectURL(url); // Clean up the URL object
    })
    .catch(error => {
        console.error('Failed to fetch file:', error);
    });
};

const TicketList = ({ tickets }) => {
    const basePath = "http://localhost:8080/tickets/api/file";
    const token = localStorage.getItem('accessToken');
    console.log('Access Token:', token);

    return (
        <div>
            <h3>Active Tickets</h3>
            <ul>
                {tickets.length > 0 ? (
                    tickets.map((ticketName, index) => {
                        const fileUrl = `${basePath}/${ticketName}`;
                        return (
                            <li key={index}>
                                {ticketName.endsWith('.pdf') ? (
                                    <a 
                                        href="#" 
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleFileFetch(fileUrl, token);
                                        }}
                                    >
                                        Download  {ticketName} (PDF)
                                    </a>
                                ) : (
                                    <a 
                                        href={fileUrl} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                    >
                                        View Ticket {ticketName}
                                    </a>
                                )}
                            </li>
                        );
                    })
                ) : (
                    <p>No tickets available.</p>
                )}
            </ul>
        </div>
    );
};

export default TicketList;
