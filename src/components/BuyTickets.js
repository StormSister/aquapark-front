import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';

const BuyTickets = () => {
    const navigate = useNavigate();

    // Definicja schematu walidacji
    
const schema = yup.object().shape({
    email: yup.string().email().required(),
    adults: yup.number().min(0).integer(),
    children: yup.number().min(0).integer(),
  }).test('sum-validation', 'Musisz wybrać co najmniej jedną osobę (dorosłego lub dziecko)', function(values) {
    const { adults, children } = values;
    return adults > 0 || children > 0;
  }).required();

    // Stan komponentu
    const [email, setEmail] = useState('');
    const [adults, setAdults] = useState(0);
    const [children, setChildren] = useState(0);
    const [isGroup, setIsGroup] = useState(false);
    const [message, setMessage] = useState('');
    const [errors, setErrors] = useState(null);

    // Obsługa wysyłania formularza
    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const requestData = { email, adults, children, isGroup };
            console.log('Request Body:', requestData);

            // Walidacja danych
            await schema.validate(requestData, { abortEarly: false });

            const response = await fetch('http://localhost:8080/api/tickets/purchase', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData),
            });

            const responseData = await response.text();
            console.log('Response Data:', responseData);

            setMessage(responseData);
            alert(responseData);
            navigate('/');

        } catch (error) {
            if (error.name === 'ValidationError') {
                // Obsługa błędów walidacji yup
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
        defaultValue={email}  // Używamy defaultValue zamiast value
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      {errors && errors.email && <p style={{ color: 'red' }}>{errors.email}</p>}
    </div>
    <div>
      <label>Adults:</label>
      <input
        type="number"
        defaultValue={adults.toString()}  // Konwertujemy na string
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
        defaultValue={children.toString()}  // Konwertujemy na string
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
    <button type="submit">Purchase</button>
  </form>
  {message && <p>{message}</p>}
</div>
    );
};

export default BuyTickets;


