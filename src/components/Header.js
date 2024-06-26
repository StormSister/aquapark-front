import React from 'react';
import { useHistory } from 'react-router-dom';

const Header = ({ isLoggedIn, onLogout }) => {
  const history = useHistory();

  const handleLogout = () => {
    // Wywołaj funkcję wylogowania (przekazaną jako props)
    onLogout();
    // Przekieruj użytkownika na stronę logowania (lub inny adres)
    history.push('/login');
  };

  return (
    <div className="header">
      <h1>Moja aplikacja</h1>
      {isLoggedIn && (
        <button onClick={handleLogout}>Wyloguj</button>
      )}
    </div>
  );
};

export default Header;