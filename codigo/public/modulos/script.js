document.addEventListener('DOMContentLoaded', () => {
    const yearFilter = document.getElementById('year');
    const ratingFilter = document.getElementById('rating');
    const typeFilter = document.getElementById('type');
    const carouselContent = document.getElementById("carousel-content");
    const searchBar = document.querySelector('.search-bar input');
    const categoryCards = document.querySelectorAll('.category-card'); // Selecionar todas as categorias
    let featuredMovies = JSON.parse(localStorage.getItem('featuredMovies')) || [];
    const PAGE_SIZE = 20;
    let currentPage = 1;
    let debounceTimer;

    const API_KEY = '17343d1b0f6dfd848b5f0f802577df4f';
    const BASE_URL = 'https://api.themoviedb.org/3';
    const IMAGE_URL = 'https://image.tmdb.org/t/p/w300'; // Usando imagens menores para otimizar o carregamento

    // Função para processar os dados de filmes
    const processMovies = (movies) => {
        return movies.map(movie => ({
            id: movie.id,
            title: movie.title,
            image: movie.poster_path ? `${IMAGE_URL}${movie.poster_path}` : './imagens/placeholder.jpg',
            year: movie.release_date ? movie.release_date.split('-')[0] : 'N/A',
            rating: movie.vote_average,
            type: 'movie',
        }));
    };

    // Função para buscar filmes populares da API com paginação
    async function fetchMoviesFromAPI(page = 1) {
        // Se os filmes já estão no cache, renderiza direto
        if (featuredMovies.length === 0) {
            try {
                const response = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&language=pt-BR&page=${page}`);
                const data = await response.json();
                featuredMovies = processMovies(data.results);
                
                // Armazena os filmes no localStorage para cache
                localStorage.setItem('featuredMovies', JSON.stringify(featuredMovies));

                updateFilters();
                renderCarousel(featuredMovies);
            } catch (error) {
                console.error('Erro ao buscar filmes populares:', error);
            }
        } else {
            renderCarousel(featuredMovies);
        }
    }

    // Função para atualizar os filtros de ano e classificação
    function updateFilters() {
        const uniqueYears = [...new Set(featuredMovies.map(movie => movie.year))].sort().reverse();
        const uniqueRatings = [...new Set(featuredMovies.map(movie => Math.round(movie.rating)))].sort((a, b) => b - a);
        populateFilter(yearFilter, uniqueYears, "Todos");
        populateFilter(ratingFilter, uniqueRatings, "Todos");
    }

    // Função para popular os filtros (ano, classificação)
    function populateFilter(filterElement, data, defaultText) {
        filterElement.innerHTML = `<option value="todos">${defaultText}</option>`;
        data.forEach(item => {
            const option = document.createElement('option');
            option.value = item;
            option.textContent = item;
            filterElement.appendChild(option);
        });
    }

    // Função para renderizar o carrossel
    function renderCarousel(movies) {
        carouselContent.innerHTML = '';
        if (movies.length === 0) {
            const noResultsMessage = document.createElement("div");
            noResultsMessage.classList.add("no-results");
            noResultsMessage.textContent = "Nenhum filme encontrado para os filtros aplicados.";
            carouselContent.appendChild(noResultsMessage);
            return;
        }

        movies.forEach(movie => {
            const item = document.createElement("div");
            item.classList.add("carousel-item");

            const imageUrl = movie.image || './imagens/placeholder.jpg';
            item.innerHTML = `<img src="${imageUrl}" alt="${movie.title}" loading="lazy"><h3>${movie.title}</h3>`; // Lazy load de imagens
            item.addEventListener("click", () => {
                window.location.href = `movie-details.html?id=${movie.id}`;
            });
            carouselContent.appendChild(item);
        });

        updateCarousel();
    }

    let currentIndex = 0;
    function updateCarousel() {
        const items = document.querySelectorAll(".carousel-item");
        items.forEach((item, index) => {
            item.style.transform = `translateX(-${currentIndex * 100}%)`;
        });
    }

    function moveNext() {
        currentIndex = (currentIndex + 1) % featuredMovies.length;
        updateCarousel();
    }

    function movePrev() {
        currentIndex = (currentIndex - 1 + featuredMovies.length) % featuredMovies.length;
        updateCarousel();
    }

    document.querySelector(".prev").addEventListener("click", movePrev);
    document.querySelector(".next").addEventListener("click", moveNext);

    // Função para filtrar filmes com base nos filtros selecionados
    function filterMovies() {
        const selectedYear = yearFilter.value;
        const selectedRating = ratingFilter.value;
        const selectedType = typeFilter.value;

        const filteredMovies = featuredMovies.filter(movie => {
            const matchesYear = selectedYear === "todos" || movie.year === selectedYear;
            const matchesRating = selectedRating === "todos" || Math.round(movie.rating).toString() === selectedRating;
            const matchesType = selectedType === "todos" || movie.type === selectedType;

            return matchesYear && matchesRating && matchesType;
        });

        renderCarousel(filteredMovies);
    }

    // Função para buscar filmes baseado na pesquisa do usuário com debounce
    async function searchMovies(query) {
        if (!query.trim()) return renderCarousel(featuredMovies);

        try {
            const response = await fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&language=pt-BR&query=${query}&page=1`);
            const data = await response.json();
            const searchResults = processMovies(data.results.slice(0, 10)); // Limita a 10 resultados
            renderCarousel(searchResults);
        } catch (error) {
            console.error('Erro ao buscar filmes:', error);
        }
    }

    // Filtra filmes com base na categoria selecionada
    categoryCards.forEach(card => {
        card.addEventListener('click', () => {
            const selectedCategory = card.getAttribute('data-type');
            const filteredMovies = featuredMovies.filter(movie => movie.type === selectedCategory);
            renderCarousel(filteredMovies);
        });
    });

    // Adiciona os eventos para os filtros
    yearFilter.addEventListener('change', filterMovies);
    ratingFilter.addEventListener('change', filterMovies);
    typeFilter.addEventListener('change', filterMovies);

    searchBar.addEventListener('input', (e) => {
        const query = e.target.value;
        clearTimeout(debounceTimer); // Limpa o timer anterior
        debounceTimer = setTimeout(() => {
            searchMovies(query);
        }, 500); // Delay de 500ms após a última digitação
    });

    // Inicializa a busca e os filmes
    fetchMoviesFromAPI();
});
