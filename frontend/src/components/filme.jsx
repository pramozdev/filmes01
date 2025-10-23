import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../services/api';
import Loading from '../../components/Loading';
import './filme.css';

function Filme() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [filme, setFilme] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadFilme() {
            try {
                const response = await api.get(`/movie/${id}`, {
                    params: {
                        api_key: "28fc232cc001c31e8a031f419d0a14ca",
                        language: "pt-BR",
                    }
                });
                setFilme(response.data);
                setLoading(false);
            } catch {
                navigate("/", { replace: true });
                return;
            }
        }

        loadFilme();
    }, [id, navigate]);

    function salvarFilme() {
        const minhaLista = localStorage.getItem("@primeflix") || "[]";
        const filmesSalvos = JSON.parse(minhaLista);
        
        const hasFilme = filmesSalvos.some(filmeSalvo => filmeSalvo.id === filme.id);
        
        if(hasFilme) {
            toast.warn("Este filme já está na sua lista!");
            return;
        }

        filmesSalvos.push({
            id: filme.id,
            title: filme.title,
            poster_path: filme.poster_path,
        });

        localStorage.setItem("@primeflix", JSON.stringify(filmesSalvos));
        toast.success("Filme salvo com sucesso!");
    }

    if(loading) {
        return <Loading />
    }

    return (
        <div className="filme-info">
            <h1>{filme.title}</h1>
            <img src={`https://image.tmdb.org/t/p/original/${filme.backdrop_path}`} alt={filme.title} />
            
            <h3>Sinopse</h3>
            <span>{filme.overview}</span>

            <strong>Avaliação: {filme.vote_average.toFixed(1)} / 10</strong>

            <div className="area-buttons">
                <button className="button" onClick={salvarFilme}>Salvar</button>
                <a 
                    className="button" 
                    target="blank"
                    rel="external noreferrer"
                    href={`https://youtube.com/results?search_query=${filme.title} Trailer`}
                >
                    Trailer
                </a>
            </div>
        </div>
    );
}

export default Filme;