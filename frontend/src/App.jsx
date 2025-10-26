import React, { useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

// Estilos globais
import './styles/global.css';

// Componentes
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import BackToTop from './components/BackToTop/BackToTop';

// Páginas
import Home from './pages/Home';
import Favoritos from './pages/Favoritos/Favoritos';
import MovieDetail from './pages/MovieDetail/MovieDetail';
import SharedList from './pages/SharedList';
import NotFound from './pages/NotFound/NotFound';

/**
 * Componente principal da aplicação
 * @component
 * @example
 * return <App />
 */
const App = () => {
  const navigate = useNavigate();

  // Efeito para gerenciar redirecionamentos
  useEffect(() => {
    // Redireciona para a rota correta após o carregamento
    if (sessionStorage.redirect) {
      const redirect = sessionStorage.redirect;
      delete sessionStorage.redirect;
      if (redirect !== window.location.href) {
        navigate(redirect);
      }
    }
  }, [navigate]);

  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/favoritos" element={<Favoritos />} />
          <Route path="/movie/:id" element={<MovieDetail />} />
          <Route path="/shared/:listId" element={<SharedList />} />
          <Route path="/listafilmes/*" element={<Home />} />
          {/* Rota 404 - Página não encontrada */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <BackToTop />
      </main>
      <Footer />
    </div>
  );
};

App.propTypes = {
  className: PropTypes.string,
};

export default App;