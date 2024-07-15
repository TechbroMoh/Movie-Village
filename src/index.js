const API_KEY = 'api_key=9aa067e22bb29d08d71f68079d8fddad';
const BASE_URL ='https://api.themoviedb.org/3';
const API_URL = BASE_URL + '/discover/movie?sort_by=popularity.desc&' + API_KEY;
const IMG_URL = 'https://image.tmdb.org/t/p/w500';
const searchURL = BASE_URL + '/search/movie?' + API_KEY;

const main = document.getElementById("main");
const form = document.getElementById("form");
const search = document.getElementById("search");
const addMovieButton = document.getElementById("addMovieButton");

let localMovies = JSON.parse(localStorage.getItem('localMovies')) || [];

function getMovies(url) {
    fetch(url)
        .then(res => res.json())
        .then(data => {
            showMovies([...localMovies, ...data.results]);
        });
}

function showMovies(data) {
    main.innerHTML = '';

    data.forEach(movie => {
        const { id, title, poster_path, vote_average, overview } = movie;
        const movieEl = document.createElement('div');
        movieEl.classList.add('movie');
        movieEl.innerHTML = `
            <img src="${poster_path ? IMG_URL + poster_path : 'default_image.jpg'}" alt="${title}">
            <div class="movie-info">
                <h3>${title}</h3>
                <span class="${getColor(vote_average)}">${vote_average}</span>
                <button class="deleteMovieButton" data-id="${id}">Delete</button>
            </div>
            <div class="overview">
                <h3>Preview</h3>
                ${overview}
            </div>
        `;
        main.appendChild(movieEl);
    });

    attachDeleteEvents();
}

function getColor(vote) {
    if (vote >= 8) {
        return 'green';
    } else if (vote >= 5) {
        return 'orange';
    } else {
        return 'red';
    }
}

function addMovie() {
    const newMovie = {
        id: Date.now(), // Unique ID for the movie
        title: 'New Movie Title',
        poster_path: '', // Add a default poster path or prompt the user to enter a URL
        vote_average: 0, // Default rating
        overview: 'New movie overview' // Default overview
    };
    localMovies.push(newMovie);
    localStorage.setItem('localMovies', JSON.stringify(localMovies));
    getMovies(API_URL);
}

function deleteMovie(id) {
    localMovies = localMovies.filter(movie => movie.id !== id);
    localStorage.setItem('localMovies', JSON.stringify(localMovies));
    getMovies(API_URL);
}

function attachDeleteEvents() {
    const deleteButtons = document.querySelectorAll('.deleteMovieButton');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const movieId = parseInt(this.getAttribute('data-id'));
            deleteMovie(movieId);
        });
    });
}

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const searchTerm = search.value;

    if (searchTerm) {
        getMovies(searchURL + '&query=' + searchTerm);
    } else {
        getMovies(API_URL);
    }
});

addMovieButton.addEventListener('click', addMovie);

getMovies(API_URL);
