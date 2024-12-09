// Recupera o ID do filme da URL
const urlParams = new URLSearchParams(window.location.search);
const movieId = urlParams.get('id'); // Exemplo de URL: movie-details.html?id=123

// Se não encontrar o ID na URL, redireciona para a página principal
if (!movieId) {
    window.location.href = 'index.html'; // Ou outra página de erro
}

const API_KEY = '17343d1b0f6dfd848b5f0f802577df4f';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_URL = 'https://image.tmdb.org/t/p/w500';

async function fetchMovieDetails() {
    try {
        // Exibe mensagem de carregamento enquanto os dados não chegam
        document.getElementById('movie-info').innerHTML = '<p>Carregando...</p>';

        // Obtém detalhes do filme
        const movieResponse = await fetch(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=pt-BR`);
        const movieData = await movieResponse.json();

        // Verifica se o filme existe antes de preencher os dados
        if (!movieData || !movieData.title) {
            document.getElementById('movie-info').innerHTML = '<p>Filme não encontrado.</p>';
            return;
        }

        // Exibe as informações do filme
        const movieInfo = document.getElementById('movie-info');
        const imageUrl = movieData.poster_path ? `${IMAGE_URL}${movieData.poster_path}` : './imagens/placeholder.jpg';
        movieInfo.innerHTML = `
            <h1>${movieData.title}</h1>
            <img src="${imageUrl}" alt="${movieData.title}">
            <p>${movieData.overview}</p>
            <p><strong>Data de lançamento:</strong> ${movieData.release_date}</p>
            <p><strong>Classificação:</strong> ${movieData.vote_average}</p>
        `;

        // Obtém informações sobre onde o filme está disponível para streaming
        const streamingResponse = await fetch(`${BASE_URL}/movie/${movieId}/watch/providers?api_key=${API_KEY}`);
        const streamingData = await streamingResponse.json();
        const streamingInfo = document.getElementById('streaming-info');
        
        if (streamingData.results && streamingData.results['BR']) {
            const providers = streamingData.results['BR'].flatrate || [];
            if (providers.length > 0) {
                streamingInfo.innerHTML = '<h2>Disponível para streaming:</h2>';
                providers.forEach(provider => {
                    streamingInfo.innerHTML += `<p>${provider.provider_name}</p>`;
                });
            } else {
                streamingInfo.innerHTML = '<p>Este filme não está disponível para streaming no Brasil.</p>';
            }
        } else {
            streamingInfo.innerHTML = '<p>Não foi possível obter informações sobre os serviços de streaming.</p>';
        }
    } catch (error) {
        console.error('Erro ao buscar detalhes do filme:', error);
        document.getElementById('movie-info').innerHTML = '<p>Erro ao carregar as informações do filme.</p>';
    }
}

// Chama a função para obter os dados do filme
fetchMovieDetails();
