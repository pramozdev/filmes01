import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { tmdbService } from '../../services/tmdb';
import MovieDetails from '../../components/MovieDetails/MovieDetails';
import './MovieDetail.css';

const MovieDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [videos, setVideos] = useState({ results: [] });
  const [credits, setCredits] = useState({ cast: [] });
  const [similar, setSimilar] = useState({ results: [] });
  const [reviews, setReviews] = useState({ results: [] });

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        setLoading(true);
        
        // Busca os detalhes básicos do filme
        const movieData = await tmdbService.getMovieDetails(id);
        setMovie(movieData);
        
        // Busca os vídeos (trailers)
        const videosData = await tmdbService.getMovieVideos(id);
        setVideos(videosData);
        
        // Busca o elenco e equipe
        const creditsData = await tmdbService.getMovieCredits(id);
        setCredits(creditsData);
        
        // Busca filmes similares
        const similarData = await tmdbService.getSimilarMovies(id);
        setSimilar(similarData);
        
        // Busca as avaliações
        const reviewsData = await tmdbService.getMovieReviews(id);
        setReviews(reviewsData);
        
      } catch (err) {
        console.error('Erro ao buscar detalhes do filme:', err);
        setError('Não foi possível carregar os detalhes do filme. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchMovieDetails();
    }
  }, [id]);

  const handleMovieSelect = (movieId) => {
    navigate(`/movie/${movieId}`);
    window.scrollTo(0, 0);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Carregando detalhes do filme...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Erro ao carregar o filme</h2>
        <p>{error}</p>
        <button onClick={() => window.history.back()} className="back-button">
          Voltar
        </button>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="not-found">
        <h2>Filme não encontrado</h2>
        <p>O filme que você está procurando não foi encontrado.</p>
        <button onClick={() => navigate('/')} className="back-button">
          Voltar para a página inicial
        </button>
      </div>
    );
  }

  return (
    <div className="movie-detail-page">
      <button onClick={() => navigate(-1)} className="back-button">
        &larr; Voltar
      </button>
      
      <MovieDetails 
        movie={{
          ...movie,
          release_date: movie.release_date,
          vote_average: movie.vote_average,
          overview: movie.overview,
          poster_path: movie.poster_path,
          backdrop_path: movie.backdrop_path,
          genres: movie.genres || [],
          runtime: movie.runtime,
          status: movie.status,
          tagline: movie.tagline,
          credits: credits,
          videos: videos,
          similar: similar
        }}
        onClose={() => navigate(-1)}
        onMovieSelect={handleMovieSelect}
        isFavorite={false} // Você pode implementar a lógica de favoritos aqui se necessário
      />
    </div>
  );
};

export default MovieDetail;
