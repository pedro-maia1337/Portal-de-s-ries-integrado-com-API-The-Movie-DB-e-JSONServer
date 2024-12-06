const API_KEY = '3aae4720d254f3a5673c432ce502684e';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
const seriesContainer = document.getElementById('series-container');
const genreSelect = document.getElementById('genre-select');
const ratingRange = document.getElementById('rating-range');
const ratingValue = document.getElementById('rating-value');
const yearSelect = document.getElementById('year-select');
const applyFiltersButton = document.getElementById('apply-filters');
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');


// Atualizar valor do input de avaliação
ratingRange.addEventListener('input', () => {
    ratingValue.textContent = ratingRange.value;
});

// Função para buscar séries populares
async function fetchPopularSeries() {
    try {
        const response = await fetch(`${BASE_URL}/tv/top_rated?api_key=${API_KEY}&language=pt-BR&page=3`);
        const data = await response.json();
        populateFilters(data.results); // Preencher filtros
        displaySeries(data.results);  // Exibir séries
    } catch (error) {
        console.error('Erro ao buscar séries populares:', error);
    }
}

// Função para preencher os filtros
function populateFilters(series) {
    // Preencher gêneros dinamicamente
    const genres = new Set(series.flatMap(serie => serie.genre_ids));
    genres.forEach(genre => {
        const option = document.createElement('option');
        option.value = genre;
        option.textContent = getGenreName(genre); // Converta ID para nome
        genreSelect.appendChild(option);
    });

    // Preencher anos de lançamento dinamicamente
    const years = new Set(series.map(serie => serie.first_air_date.split('-')[0]));
    years.forEach(year => {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearSelect.appendChild(option);
    });
}

// Converter ID do gênero para nome
function getGenreName(id) {
    const genres = {
        10759: 'Ação e Aventura',
        16: 'Animação',
        35: 'Comédia',
        80: 'Crime',
        99: 'Documentário',
        18: 'Drama',
        10751: 'Família',
        10762: 'Kids',
        9648: 'Mistério',
        10763: 'News',
        10764: 'Reality',
        10765: 'Sci-Fi & Fantasia',
        10766: 'Soap',
        10767: 'Talk',
        10768: 'War & Politics',
        37: 'Western'
    };
    return genres[id] || 'Desconhecido';
}

// Função para exibir séries no DOM
function displaySeries(series) {
    seriesContainer.innerHTML = ''; // Limpa o container
    series.forEach(serie => {
        const { id, name, overview, poster_path } = serie; // Inclua o 'id' aqui
        const card = `
            <div class="col">
                <div class="card">
                    <a href="./detalhes.html?id=${id}"><img src="${poster_path ? IMAGE_BASE_URL + poster_path : 'assets/img/placeholder.png'}" class="card-img-top" alt="${name}"></a>
                    <div class="card-body">
                        <h5 class="card-title">${name}</h5>
                        <p class="card-text">${overview || 'Descrição indisponível.'}</p>
                    </div>
                </div>
            </div>
        `;
        seriesContainer.insertAdjacentHTML('beforeend', card);
    });
}

// Função para filtrar séries
function filterSeries(series) {
    const selectedGenre = genreSelect.value;
    const minRating = parseFloat(ratingRange.value);
    const selectedYear = yearSelect.value;

    return series.filter(serie => {
        const matchesGenre = !selectedGenre || serie.genre_ids.includes(parseInt(selectedGenre));
        const matchesRating = serie.vote_average >= minRating;
        const matchesYear = !selectedYear || serie.first_air_date.startsWith(selectedYear);

        return matchesGenre && matchesRating && matchesYear;
    });
}

// Aplicar filtros ao clicar no botão
applyFiltersButton.addEventListener('click', async () => {
    try {
        const response = await fetch(`${BASE_URL}/tv/top_rated?api_key=${API_KEY}&language=pt-BR`);
        const data = await response.json();
        const filteredSeries = filterSeries(data.results);
        displaySeries(filteredSeries);
    } catch (error) {
        console.error('Erro ao aplicar filtros:', error);
    }
});



// Função para buscar séries pelo nome
async function searchSeries(query) {
    try {
        const response = await fetch(`${BASE_URL}/search/tv?api_key=${API_KEY}&language=pt-BR&query=${query}`);
        const data = await response.json();
        displaySeries(data.results); // Exibe os resultados da pesquisa
    } catch (error) {
        console.error('Erro ao buscar séries:', error);
    }
}

// Adiciona evento de clique ao botão de pesquisa
searchBtn.addEventListener('click', (event) => {
    event.preventDefault();
    const query = searchInput.value.trim();
    if (query) {
        searchSeries(query);
    } else {
        fetchPopularSeries(); // Recarrega as séries populares se o campo de pesquisa estiver vazio
    }
});

// Alternativa: pesquisa enquanto digita
searchInput.addEventListener('input', () => {
    const query = searchInput.value.trim();
    if (query) {
        searchSeries(query);
    } else {
        fetchPopularSeries();
    }
});


ratingRange.addEventListener('input', () => {
    ratingValue.textContent = ratingRange.value;
});


// Busca inicial ao carregar a página
fetchPopularSeries();
