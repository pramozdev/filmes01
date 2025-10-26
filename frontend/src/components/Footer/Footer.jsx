import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { FaGithub, FaInstagram, FaFacebook } from 'react-icons/fa';
import './Footer.css';

/**
 * Componente de rodapé da aplicação
 * @component
 * @example
 * return <Footer />
 */
const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h3 className="footer-title">ListaFilmes</h3>
            <p className="footer-description">
              Encontre e salve seus filmes favoritos em um só lugar.
            </p>
          </div>
          
          <div className="footer-section">
            <h4 className="footer-subtitle">Links Rápidos</h4>
            <ul className="footer-links">
              <li><Link to="/" className="footer-link">Início</Link></li>
              <li><Link to="/favoritos" className="footer-link">Favoritos</Link></li>
              <li><a href="#" className="footer-link">Sobre</a></li>
              <li><a href="#" className="footer-link">Contato</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4 className="footer-subtitle">Redes Sociais</h4>
            <div className="social-links">
              <a 
                href="https://github.com" 
                className="social-link" 
                aria-label="GitHub" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <FaGithub className="social-icon" />
              </a>
              <a 
                href="https://instagram.com" 
                className="social-link" 
                aria-label="Instagram" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <FaInstagram className="social-icon" />
              </a>
              <a 
                href="https://facebook.com" 
                className="social-link" 
                aria-label="Facebook" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <FaFacebook className="social-icon" />
              </a>
            </div>
            <p className="social-description">Siga-nos para mais atualizações</p>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p className="copyright">
            &copy; {currentYear} ListaFilmes. Todos os direitos reservados.
            <br />
            <span style={{ fontSize: '0.9em', opacity: 0.8 }}>Desenvolvido por [P]Ramos.Dev</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

Footer.propTypes = {
  className: PropTypes.string,
};

export default Footer;
