import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const Navbar = ({  isLoggedIn = false, userRole = 'notLoggedIn', onLogout }) => {
  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userRole');
    onLogout();
  };

  const renderNavLinks = () => {
    const navLinks = {
      notLoggedIn: [
        { label: 'Home', path: '/' },
        { label: 'Login', path: '/login' },
        { label: 'Register', path: '/register' },
        { label: 'Book a Room', path: '/book-room' },
        { label: 'Buy Tickets', path: '/buy-tickets' },
        { label: 'Greeting', path: '/greeting' }

      ],
      client: [
        { label: 'Home', path: '/' },
        { label: 'Book a Room', path: '/book-room' },
        { label: 'Buy Tickets', path: '/buy-tickets' },
        { label: 'Your Account', path: '/your-account' }
      ],
      worker: [
        { label: 'Home', path: '/' },
        { label: 'Sell Ticket', path: '/sell-ticket' },
        { label: 'Check Ticket', path: '/check-ticket' },
        { label: 'Book a Room', path: '/book-room' },
        { label: 'Cancel Reservation', path: '/cancel-reservation' },
        { label: 'Your Account', path: '/your-account' }
      ],
      manager: [
        { label: 'Home', path: '/' },
        { label: 'Sell Ticket', path: '/sell-ticket' },
        { label: 'Check Ticket', path: '/check-ticket' },
        { label: 'Book a Room', path: '/book-room' },
        { label: 'Cancel Reservation', path: '/cancel-reservation' },
        { label: 'Change Price', path: '/change-price' },
        { label: 'Add Promotion', path: '/add-promotion' },
        { label: 'Your Account', path: '/your-account' }
      ]
    };

    const links = isLoggedIn ? navLinks[userRole] : navLinks.notLoggedIn;

    return links.map((link, index) => (
      <li key={index} className="nav-item">
        <Link className="nav-link" to={link.path}>{link.label}</Link>
      </li>
    ));
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">Aquapark</Link>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            {renderNavLinks()}
          </ul>
          <ul className="navbar-nav ms-auto">
            {isLoggedIn && (
              <li className="nav-item">
                <button className="btn btn-outline-danger" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );

}
Navbar.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  userRole: PropTypes.string.isRequired,
  onLogout: PropTypes.func.isRequired,
};

export default Navbar;





