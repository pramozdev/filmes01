// URL base da API do YouTube
const YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3';

// Função para obter a chave da API de forma segura
const getApiKey = () => {
  const key = import.meta.env.VITE_YOUTUBE_API_KEY;
  if (!key) {
    console.warn('Chave da API do YouTube não encontrada. Verifique suas variáveis de ambiente.');
    return null;
  }
  return key;
};

// Cache simples para evitar chamadas repetidas
const trailerCache = new Map();

// Função para buscar vídeos do YouTube
export const youtubeService = {
  searchTrailer: async (movieTitle, year) => {
    const cacheKey = `${movieTitle}-${year}`;
    
    // Verifica se já temos no cache
    const cached = trailerCache.get(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      const apiKey = getApiKey();
      if (!apiKey) {
        throw new Error('Chave da API do YouTube não configurada');
      }

      const query = `${movieTitle} ${year} official trailer`;
      const params = new URLSearchParams({
        part: 'snippet',
        maxResults: 1,
        q: query,
        type: 'video',
        key: apiKey,
        videoEmbeddable: 'true',
        videoDefinition: 'high',
        relevanceLanguage: 'pt',
        regionCode: 'BR'
      });
      
      const url = `${YOUTUBE_API_URL}/search?${params.toString()}`;
      
      console.log('Buscando trailer no YouTube:', { movieTitle, year, query });
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Erro na resposta da API do YouTube:', errorData);
        return null;
      }
      
      const data = await response.json();
      
      if (data.items && data.items.length > 0) {
        const video = data.items[0];
        console.log('Trailer encontrado:', video);
        return {
          id: video.id.videoId,
          name: video.snippet.title,
          key: video.id.videoId,
          site: 'YouTube',
          type: 'Trailer',
          thumbnail: video.snippet.thumbnails?.high?.url || ''
        };
      }
      
      return null;
    } catch (error) {
      console.error('Erro ao buscar trailer no YouTube:', error);
      return null;
    }
  }
};
