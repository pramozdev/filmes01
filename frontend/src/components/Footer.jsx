import React, { useState, useEffect } from 'react';
import { FaGithub, FaLinkedin, FaTwitter, FaHeart, FaArrowUp } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const [isAtBottom, setIsAtBottom] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const toggleVisibility = () => {
    // Verifica se está no final da página
    const isBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 100;
    setIsAtBottom(isBottom);
    
    // Verifica se a página foi rolada
    setIsScrolled(window.scrollY > 10);
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
            <Link to="/" className="footer-logo">Cine TV App</Link>
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
            © {new Date().getFullYear()} Cine TV App. Desenvolvido por <a href="https://pramoz.dev" target="_blank" rel="noopener noreferrer" className="dev-link">[P]Ramoz.dev</a>
          </p>
          <span className="tmdb-credit">
            Dados fornecidos por TMDB - The Movie Database
          </span>
        </div>
      </div>
      <button 
        onClick={scrollToTop}
        className={`back-to-top ${isScrolled ? 'visible' : ''} ${isAtBottom ? 'at-bottom' : ''}`}
        aria-label="Voltar ao topo"
        style={{
          opacity: isScrolled ? 1 : 0,
          transform: isScrolled ? 'translateY(0)' : 'translateY(20px)',
          position: isAtBottom ? 'absolute' : 'fixed',
          bottom: isAtBottom ? '20px' : '30px',
          pointerEvents: isScrolled ? 'auto' : 'none',
          transition: 'opacity 0.3s ease, transform 0.3s ease'
        }}
      >
        <FaArrowUp />
      </button>
    </footer>
  );
};

export default Footer;
