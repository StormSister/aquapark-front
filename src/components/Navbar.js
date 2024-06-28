import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import './Navbar.css'; // Import niestandardowych stylów

const Navbar = ({ isLoggedIn, userRole, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const renderNavLinks = () => {
    const navLinks = {
      notLoggedIn: [
        { label: 'Home', path: '/' },
        { label: 'Login', path: '/login' },
        { label: 'Register', path: '/register' },
        { label: 'Book a Room', path: '/book-room' },
        { label: 'Buy Tickets', path: '/buy-tickets' },
        { label: 'Greeting', path: '/greeting' },
      ],
      client: [
        { label: 'Home', path: '/' },
        { label: 'Book a Room', path: '/book-room' },
        { label: 'Buy Tickets', path: '/buy-tickets' },
        { label: 'Your Account', path: '/your-account' },
      ],
      worker: [
        { label: 'Home', path: '/' },
        { label: 'Sell Ticket', path: '/sell-ticket' },
        { label: 'Check Ticket', path: '/check-ticket' },
        { label: 'Book a Room', path: '/book-room' },
        { label: 'Cancel Reservation', path: '/cancel-reservation' },
        { label: 'Your Account', path: '/your-account' },
      ],
      manager: [
        { label: 'Home', path: '/' },
        { label: 'Sell Ticket', path: '/sell-ticket' },
        { label: 'Check Ticket', path: '/check-ticket' },
        { label: 'Book a Room', path: '/book-room' },
        { label: 'Cancel Reservation', path: '/cancel-reservation' },
        { label: 'Change Price', path: '/change-price' },
        { label: 'Add Promotion', path: '/add-promotion' },
        { label: 'Your Account', path: '/your-account' },
        { label: 'Users', path: '/manage-users' },
      ],
    };

    const links = isLoggedIn ? navLinks[userRole] : navLinks.notLoggedIn;

    return links.map((link, index) => (
      <li key={index} className="nav-item">
        <Link className="nav-link" to={link.path}>{link.label}</Link>
      </li>
    ));
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-custom">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">Aquapark</Link>
        <div className="menu-icon" onClick={toggleMenu}>
          &#9776; {/* Ikona hamburgera */}
        </div>
        <div className={`navbar-collapse ${isMenuOpen ? 'active' : ''}`} id="navbarNav">
          <ul className="navbar-nav">
            {renderNavLinks()}
          </ul>
          {isLoggedIn && (
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <button className="btn btn-outline-danger" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            </ul>
          )}
        </div>
      </div>
    </nav>
  );
};

Navbar.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  userRole: PropTypes.string.isRequired,
  onLogout: PropTypes.func.isRequired,
};

export default Navbar;



