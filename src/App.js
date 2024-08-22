import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode'; 
import Home from './components/Home/Home';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import BuyTickets from './components/Tickets/BuyTickets';
import Bookroom from './components/Reservation/Bookroom'; 
import Navbar from './components/Navbar/Navbar';
import YourAccount from './components/Users/YourAccount'; 
import Users from './components/Users/Users';
import CheckTicket from './components/Tickets/CheckTicket';
import ReservationTable from './components/Reservation/ReservationTable';
import ManagePrices from './components/Prices/ManagePrices';
import PromotionManager from './components/Promotions/PromotionManager';
import LoginSuccess from './components/Auth/LoginSuccess';
import Payment from './components/Payments/Payment'; 
import SuccessPage from './components/Payments/SuccessPage';
import Confirmation from './components/Payments/Confirmation';
import SellTickets from './components/Tickets/SellTickets';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('notLoggedIn');
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const storedEmail = localStorage.getItem('userEmail');
    const storedRole = localStorage.getItem('userRole'); // Dodaj to dla pełności
  
    console.log('Stored Token:', token);
    console.log('Stored Email:', storedEmail);
    console.log('Stored Role:', storedRole); // Dodaj to dla pełności
  
    if (token) {
      try {
        console.log('Odczytany token:', token);
        const decoded = jwtDecode(token);
        console.log('Dekodowany token:', decoded);
        setIsLoggedIn(true);
        setUserRole(decoded.authorities || 'notLoggedIn');
        setUserEmail(storedEmail || decoded.username || ''); 
      } catch (e) {
        console.error('Token decoding failed:', e);
      }
    } else {
      setUserEmail(storedEmail || ''); 
    }
  }, []);
  const handleLogin = (token) => {
    try {
      const decoded = jwtDecode(token);
      console.log('Received Token:', token);
      console.log('Decoded Token:', decoded);
  
      localStorage.setItem('accessToken', token);
      localStorage.setItem('userEmail', decoded.username || '');
      localStorage.setItem('userRole', decoded.authorities || 'notLoggedIn'); // Dodaj to dla pełności
  
    
      console.log('LocalStorage after login - Token:', localStorage.getItem('accessToken'));
      console.log('LocalStorage after login - Email:', localStorage.getItem('userEmail'));
      console.log('LocalStorage after login - Role:', localStorage.getItem('userRole'));
  
      setIsLoggedIn(true);
      setUserRole(decoded.authorities || 'notLoggedIn');
      setUserEmail(decoded.username || '');
    } catch (e) {
      console.error('Token decoding failed:', e);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userEmail');
    setIsLoggedIn(false);
    setUserRole('notLoggedIn');
    setUserEmail('');

    fetch('http://localhost:8080/api/logout', {
      method: 'POST',
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Logout failed');
      }
      console.log('User logged out successfully.');
    })
    .catch(error => {
      console.error('Logout error:', error);
    });
  };

  return (
    <Router>
      <div className="App">
        <Navbar isLoggedIn={isLoggedIn} userRole={userRole} onLogout={handleLogout} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/login-success" element={<LoginSuccess onLogin={handleLogin} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/buy-tickets" element={<BuyTickets />} />
          <Route path="/book-room" element={<Bookroom />} />
          <Route path="/your-account" element={<YourAccount />} /> 
          <Route path="/manage-users" element={<Users />} />
          <Route path="/check-ticket" element={<CheckTicket />} />
          <Route path="/cancel-reservation" element={<ReservationTable />} />
          <Route path="/change-price" element={<ManagePrices />} />
          <Route path="/add-promotion" element={<PromotionManager />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/success" element={<SuccessPage />} />
          <Route path="/sell-tickets" element={<SellTickets />} />
        <Route path="/confirmation" element={<Confirmation />} />

        </Routes>
      </div>
    </Router>
  );
};

export default App;
