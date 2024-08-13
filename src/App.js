import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode'; 
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import BuyTickets from './components/BuyTickets';
import Bookroom from './components/Reservation/Bookroom'; 
import ManagerDashboard from './components/ManagerDashboard';
import Navbar from './components/Navbar';
import YourAccount from './components/YourAccount'; 
import Users from './components/Users';
import CheckTicket from './components/CheckTicket';
import ReservationTable from './components/Reservation/ReservationTable';
import ManagePrices from './components/Prices/ManagePrices';
import PromotionManager from './components/Promotions/PromotionManager';
import LoginSuccess from './components/LoginSuccess';
import Payment from './Payment'; 

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('notLoggedIn');
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const storedEmail = localStorage.getItem('userEmail');
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
      localStorage.setItem('accessToken', token);
      localStorage.setItem('userEmail', decoded.username || ''); 
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
          <Route path="/manager-dashboard" element={<ManagerDashboard />} />
          <Route path="/your-account" element={<YourAccount />} /> 
          <Route path="/manage-users" element={<Users />} />
          <Route path="/check-ticket" element={<CheckTicket />} />
          <Route path="/cancel-reservation" element={<ReservationTable />} />
          <Route path="/change-price" element={<ManagePrices />} />
          <Route path="/add-promotion" element={<PromotionManager />} />
          <Route path="/payment" element={<Payment />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
