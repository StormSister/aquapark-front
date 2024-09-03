import React, { useState, useEffect } from "react";
import "./Footer.css";
const Footer = ({ showModal }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const checkScrollBottom = () => {
      const { scrollTop, scrollHeight, clientHeight } =
        document.documentElement;
      if (scrollTop + clientHeight >= scrollHeight - 5) {
        // Check if near the bottom
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", checkScrollBottom);
    return () => {
      window.removeEventListener("scroll", checkScrollBottom);
    };
  }, []);

  return (
    <footer
      className={`nav-footer-common ${isVisible ? "footer-visible" : ""}`}
    >
      <div className="footer-contact">
        <h3>Contact Us</h3>
        <p>Carr. Huichapan - Tecozautla Km. 27.5</p>
        <p>Morelos, 42440 Tecozautla, Hgo. Mexico</p>
        <p>WhatsApp: 7711949533</p>
        <p>Hotel: 7731068780</p>
        <p>Email: ventas@arenalacuatico.com</p>
      </div>
      <div className="footer-buttons">
        <button onClick={() => showModal("map")}>Find Us Here</button>
      </div>
      <hr />
      <div className="footer-bottom">
        ©{new Date().getFullYear()} Balneario El Arenal. All rights reserved.
      </div>
    </footer>
  );
};
export default Footer;
