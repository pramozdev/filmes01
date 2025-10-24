import React, { useState, useEffect } from 'react';
import { FaGithub, FaLinkedin, FaTwitter, FaHeart, FaArrowUp } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);
  return (
    <footer className="footer-container">
      <div className="footer-content">
        <div className="footer-top">
          <div className="footer-logo-container">
            <Link to="/" className="footer-logo">🎬 MovieFav</Link>
            <p className="footer-tagline">Encontre, salve e compartilhe seus filmes favoritos em um só lugar.</p>
          </div>
          
          <div className="social-links">
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="social-link"
              aria-label="GitHub"
            >
              <FaGithub />
            </a>
            <a 
              href="https://linkedin.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="social-link"
              aria-label="LinkedIn"
            >
              <FaLinkedin />
            </a>
            <a 
              href="https://twitter.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="social-link"
              aria-label="Twitter"
            >
              <FaTwitter />
            </a>
          </div>
        </div>
        
        <div className="footer-divider"></div>
        
        <div className="footer-bottom">
          <p className="copyright">
            © {new Date().getFullYear()} MovieFav. Feito com <FaHeart className="heart-icon" /> por você.
          </p>
          <span className="tmdb-credit">
            Dados fornecidos por TMDB - The Movie Database
          </span>
        </div>
      </div>
      {isVisible && (
        <button 
          onClick={scrollToTop}
          className="back-to-top"
          aria-label="Voltar ao topo"
        >
          <FaArrowUp />
        </button>
      )}
    </footer>
  );
};

export default Footer;
