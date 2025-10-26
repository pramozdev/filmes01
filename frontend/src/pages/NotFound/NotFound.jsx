import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import './NotFound.css';

/**
 * Página de erro 404 - Página não encontrada
 * @component
 * @example
 * return <NotFound />
 */
const NotFound = () => {
  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <h1 className="not-found-title">404</h1>
        <h2 className="not-found-subtitle">Página não encontrada</h2>
        <p className="not-found-message">
          A página que você está procurando pode ter sido removida, ter mudado de nome ou está temporariamente indisponível.
        </p>
        <Link to="/" className="not-found-button">
          Voltar para a página inicial
        </Link>
      </div>
    </div>
  );
};

NotFound.propTypes = {
  className: PropTypes.string,
};

export default NotFound;
