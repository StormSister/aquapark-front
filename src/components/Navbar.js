import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import "./Navbar.css";

const Navbar = ({ isLoggedIn, userRole, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate("/");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  const renderNavLinks = () => {
    const navLinks = {
      notLoggedIn: [
        // { label: 'Home', path: '/' },
        { label: "Login", path: "/login" },
        { label: "Register", path: "/register" },
        { label: "Rooms", path: "/book-room" },
        { label: "Tickets", path: "/buy-tickets" },
        // { label: 'Greeting', path: '/greeting' },
      ],
      client: [
        // { label: 'Home', path: '/' },
        { label: "Rooms", path: "/book-room" },
        { label: "Tickets", path: "/buy-tickets" },
        { label: "My Account", path: "/your-account" },
      ],
      worker: [
        // { label: 'Home', path: '/' },
        { label: "Sell Tickets", path: "/sell-ticket" },
        { label: "Check Ticket", path: "/check-ticket" },
        { label: "Reservations", path: "/book-room" },
        { label: "Cancel Reservation", path: "/cancel-reservation" },
        { label: "My account", path: "/your-account" },
      ],
      manager: [
        // { label: 'Home', path: '/' },
        { label: "Sell Tickets", path: "/sell-ticket" },
        { label: "Check Ticket", path: "/check-ticket" },
        { label: "Rooms", path: "/book-room" },
        { label: "Reservations", path: "/cancel-reservation" },
        { label: "Prices", path: "/change-price" },
        { label: "Promotions", path: "/add-promotion" },
        { label: "Users", path: "/manage-users" },
        { label: "My Account", path: "/your-account" },
      ],
    };

    const links = isLoggedIn ? navLinks[userRole] : navLinks.notLoggedIn;

    return links.map((link, index) => (
      <li key={index} className="nav-item">
        <Link className="nav-link" to={link.path}>
          {link.label}
        </Link>
      </li>
    ));
  };

  return (
    <nav
      className={`navbar navbar-expand-lg navbar-custom ${
        isVisible ? "visible" : "hidden"
      }`}
    >
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          <img
            src={"../assets/images/logo/ElArenal.svg"}
            alt="Aquapark"
            className="logo"
          />
        </Link>
        <div className="menu-icon" onClick={toggleMenu}>
          &#9776; {/* Ikona hamburgera */}
        </div>
        <div
          className={`navbar-collapse ${isMenuOpen ? "active" : ""}`}
          id="navbarNav"
        >
          <ul className="navbar-nav">{renderNavLinks()}</ul>
          {isLoggedIn && (
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <button
                  className="btn-outline-danger"
                  onClick={handleLogout}
                >
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



