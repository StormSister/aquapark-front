import React, { useState, useEffect } from "react";
import "./Footer.css";
const Footer = ({ showModal }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const checkScrollBottom = () => {
      const { scrollTop, scrollHeight, clientHeight } =
        document.documentElement;
      if (scrollTop + clientHeight >= scrollHeight) {
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

  if (!isVisible) {
    return null;
  }
  return (
    <footer className="nav-footer-common">
      <div className="footer-buttons">
        <button onClick={() => showModal("contact")}>Contact Us</button>
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
