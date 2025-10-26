import React, { useState, useEffect, useCallback } from 'react';
import { tmdbService } from '../../services/tmdb';
import { FaPlay, FaStar } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';
import './MovieCarousel.css';

const MovieCarousel = () => {
  const [movies, setMovies] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchPopularMovies = useCallback(async () => {
    try {
      setLoading(true);
      const data = await tmdbService.getPopularMovies();
      // Pegar apenas os 10 primeiros filmes para o carrossel
      if (data && data.results && Array.isArray(data.results)) {
        setMovies(data.results.slice(0, 10));
      } else {
        throw new Error('Dados de filmes inválidos recebidos da API');
      }
    } catch (error) {
      console.error('Erro ao buscar filmes populares:', error);
      throw error; // Propaga o erro para o ErrorBoundary
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPopularMovies().catch(error => {
      console.error('Erro ao carregar filmes:', error);
    });
  }, [fetchPopularMovies]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === movies.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? movies.length - 1 : prevIndex - 1
    );
  };

  if (loading) {
    return (
      <div className="carousel-loading">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (movies.length === 0) {
    return <div className="no-movies">Nenhum filme encontrado.</div>;
  }

  // Calcular índices dos filmes visíveis
  const visibleMovies = [];
  for (let i = 0; i < 5; i++) {
    const index = (currentIndex + i) % movies.length;
    visibleMovies.push(movies[index]);
  }

  return (
    <ErrorBoundary onRetry={fetchPopularMovies}>
      <div className="movie-carousel">
        <h2 className="carousel-title">Filmes em Destaque</h2>
        <div className="carousel-container">
          <button className="carousel-button prev" onClick={prevSlide} aria-label="Anterior">
            <span className="arrow">&lt;</span>
          </button>
          
          <div className="carousel-track">
            {visibleMovies.map((movie, index) => (
              <div 
                key={movie.id} 
                className={`carousel-slide ${index === 0 ? 'active' : ''}`}
                style={{
                  backgroundImage: `url(${movie.backdrop_path 
                    ? tmdbService.getImageUrl(movie.backdrop_path, 'w1280')
                    : 'https://via.placeholder.com/1280x720?text=Sem+Imagem'})`,
                  transform: `translateX(${index * 25}%)`,
                  zIndex: 5 - index,
                  opacity: 1 - (index * 0.2)
                }}
              >
                <div className="slide-overlay">
                  <div className="slide-content">
                    <h3 className="movie-title">{movie.title}</h3>
                    <div className="movie-meta">
                      <span className="movie-rating">
                        <FaStar className="rating-icon" />
                        {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}
                      </span>
                      <span className="movie-year">
                        {movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}
                      </span>
                    </div>
                    <p className="movie-overview">
                      {movie.overview && movie.overview.length > 200 
                        ? `${movie.overview.substring(0, 200)}...` 
                        : movie.overview || 'Sinopse não disponível.'}
                    </p>
                    <div className="movie-actions">
                      <Link to={`/movie/${movie.id}`} className="play-button">
                        <FaPlay /> Assistir
                      </Link>
                      <Link to={`/movie/${movie.id}`} className="details-button">
                        Mais Detalhes
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <button className="carousel-button next" onClick={nextSlide} aria-label="Próximo">
            <span className="arrow">&gt;</span>
          </button>
        </div>
        
        <div className="carousel-dots">
          {movies.slice(0, 10).map((_, index) => (
            <button
              key={index}
              className={`dot ${index === currentIndex ? 'active' : ''}`}
              onClick={() => setCurrentIndex(index)}
              aria-label={`Ir para o slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default MovieCarousel;
