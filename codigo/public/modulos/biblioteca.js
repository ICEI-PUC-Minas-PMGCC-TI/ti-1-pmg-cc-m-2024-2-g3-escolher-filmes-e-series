const moviesContainer = document.getElementById('moviesContainer');
const movieForm = document.getElementById('movieForm');


document.addEventListener('DOMContentLoaded', loadMovies);

movieForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const title = document.getElementById('movieTitle').value;
    const category = document.getElementById('movieCategory').value;
    addMovie(title, category);
    movieForm.reset(); 
});

function addMovie(title, category) {
    const movie = { title, category };
    saveMovie(movie);
    displayMovie(movie);
}

function saveMovie(movie) {
    const movies = JSON.parse(localStorage.getItem('movies')) || [];
    movies.push(movie);
    localStorage.setItem('movies', JSON.stringify(movies));
}

function loadMovies() {
    const movies = JSON.parse(localStorage.getItem('movies')) || [];
    movies.forEach(displayMovie);
}

function displayMovie(movie) {
    const movieElement = document.createElement('div');
    movieElement.classList.add('movie');
    movieElement.innerHTML = `
        <div class="movie-info">
            <h3>${movie.title}</h3>
            <p>Categoria: ${movie.category}</p>
            <button class="delete-button">Excluir</button>
        </div>
    `;
    
    const deleteButton = movieElement.querySelector('.delete-button');
    deleteButton.addEventListener('click', () => {
        deleteMovie(movie);
        movieElement.remove(); 
    });

    moviesContainer.appendChild(movieElement);
}

function deleteMovie(movie) {
    let movies = JSON.parse(localStorage.getItem('movies')) || [];
    movies = movies.filter(m => m.title !== movie.title || m.category !== movie.category); 
    localStorage.setItem('movies', JSON.stringify(movies));
}