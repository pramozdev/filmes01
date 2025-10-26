import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import './Header.css';

/**
 * Componente de cabeçalho da aplicação
 * @component
 * @example
 * return <Header />
 */
const Header = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <header>
      <div className="container header-container">
        <Link to="/" className="logo">
          ListaFilmes
        </Link>
        
        <nav className="nav-links">
          <Link 
            to="/" 
            className={`nav-link ${isActive('/') ? 'active' : ''}`}
          >
            Início
          </Link>
          <Link 
            to="/favoritos" 
            className={`nav-link ${isActive('/favoritos') ? 'active' : ''}`}
          >
            Meus Favoritos
          </Link>
        </nav>
      </div>
    </header>
  );
};

Header.propTypes = {
  className: PropTypes.string,
};

export default Header;
