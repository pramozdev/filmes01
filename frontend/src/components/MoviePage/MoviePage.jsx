import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import api from '../../services/api';
import Loading from '../Loading';
import './MoviePage.css';

function MoviePage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [movie, setMovie] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadMovie() {
            try {
                const response = await api.get(`/movie/${id}`, {
                    params: {
                        api_key: "28fc232cc001c31e8a031f419d0a14ca",
                        language: "pt-BR",
                    },
                });

                if (response.data.runtime === 0) {
                    navigate("/", { replace: true });
                    return;
                }

                setMovie(response.data);
                setLoading(false);
            } catch (error) {
                console.error("FILME NÃO ENCONTRADO");
                navigate("/", { replace: true });
                return;
            }
        }

        loadMovie();

        return () => {
            console.log("COMPONENTE FOI DESMONTADO");
        };
    }, [navigate, id]);

    function saveMovie() {
        const myList = localStorage.getItem("@primeflix");
        let savedMovies = myList ? JSON.parse(myList) : [];

        const hasMovie = savedMovies.some((savedMovie) => savedMovie.id === movie.id);

        if (hasMovie) {
            toast.warn("Este filme já está na sua lista!");
            return;
        }

        savedMovies.push(movie);
        localStorage.setItem("@primeflix", JSON.stringify(savedMovies));
        toast.success("Filme salvo com sucesso!");
    }

    if (loading) {
        return <Loading />;
    }

    return (
        <div className="movie-page">
            <h1>{movie.title}</h1>
            <div className="movie-container">
                <img 
                    src={`https://image.tmdb.org/t/p/original/${movie.backdrop_path}`} 
                    alt={movie.title} 
                    className="movie-backdrop"
                />
                <div className="movie-details">
                    <h3>Sinopse</h3>
                    <p>{movie.overview}</p>
                    <strong>Avaliação: {movie.vote_average.toFixed(1)}/10</strong>
                    <div className="movie-actions">
                        <button onClick={saveMovie} className="btn-save">
                            Salvar
                        </button>
                        <a 
                            href={`https://youtube.com/results?search_query=${movie.title} Trailer`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="btn-trailer"
                        >
                            Trailer
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}

MoviePage.propTypes = {
    id: PropTypes.string,
};

export default MoviePage;
