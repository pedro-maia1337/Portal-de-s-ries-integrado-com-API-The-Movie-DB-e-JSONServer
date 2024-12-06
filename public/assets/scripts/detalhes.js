// Configuração da API
const apiKey = '3aae4720d254f3a5673c432ce502684e'; // Substitua pela sua chave da API do The Movie DB
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

// Obtém o ID da série a partir da URL
function getSerieIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id'); // Obtém o valor do parâmetro "id"
}

// Busca detalhes da série
async function fetchSerieDetails(serieId) {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/tv/${serieId}?api_key=${apiKey}&language=pt-BR`);
        return await response.json();
    } catch (error) {
        console.error('Erro ao buscar detalhes da série:', error);
    }
}

// Busca elenco da série
async function fetchSerieCast(serieId) {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/tv/${serieId}/credits?api_key=${apiKey}&language=pt-BR`);
        return await response.json();
    } catch (error) {
        console.error('Erro ao buscar elenco:', error);
    }
}

// Busca episódios de uma temporada
async function fetchSeasonEpisodes(serieId, seasonNumber) {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/tv/${serieId}/season/${seasonNumber}?api_key=${apiKey}&language=pt-BR`);
        return await response.json();
    } catch (error) {
        console.error('Erro ao buscar episódios:', error);
    }
}

// Renderiza os detalhes gerais da série
async function renderSerieDetails() {
    const serieId = getSerieIdFromUrl();
    if (!serieId) {
        alert('ID da série não encontrado na URL.');
        return;
    }

    const serieData = await fetchSerieDetails(serieId);

    if (serieData) {
        document.querySelector('.title').textContent = serieData.name;
        document.querySelector('.duration').textContent = `${serieData.first_air_date.split('-')[0]} - ${serieData.last_air_date ? serieData.last_air_date.split('-')[0] : 'Atualmente'}`;
        document.querySelector('.score').textContent = serieData.vote_average.toFixed(1);
        document.querySelector('.genres').innerHTML = `
            <span>GÊNEROS</span>
            ${serieData.genres.map(genre => `<span>${genre.name}</span>`).join('')}
        `;
        document.querySelector('.sinopse span:last-child').textContent = serieData.overview || 'Sinopse indisponível.';
        // Atualize a plataforma se disponível (substitua por lógica real caso a API suporte)
        document.querySelector('.platform-info img').src = 'src/img/logo/hbo-max-logo-1.svg';
    }
}

// Renderiza o elenco da série
async function renderSerieCast() {
    const serieId = getSerieIdFromUrl();
    const castData = await fetchSerieCast(serieId);

    if (castData && castData.cast) {
        const castContainer = document.querySelector('.row.row-cols-1.row-cols-md-4.g-4');
        castContainer.innerHTML = castData.cast
            .slice(0, 4) // Limite de 4 membros no elenco principal
            .map(cast => `
                <div class="col">
                    <div class="card">
                        <img src="${cast.profile_path ? IMAGE_BASE_URL + cast.profile_path : 'src/img/placeholder.png'}" class="card-img-top" alt="${cast.name}">
                        <div class="card-body">
                            <h5 class="card-title">${cast.name}</h5>
                            <h4 class="card-title">${cast.character}</h4>
                        </div>
                    </div>
                </div>
            `).join('');
    }
}

// Renderiza a lista de episódios da temporada selecionada
async function renderSeasonEpisodes(seasonNumber = 1) {
    const serieId = getSerieIdFromUrl();
    const seasonData = await fetchSeasonEpisodes(serieId, seasonNumber);

    if (seasonData && seasonData.episodes) {
        const episodeListContainer = document.querySelector('.episode-list');
        episodeListContainer.innerHTML = seasonData.episodes
            .map(episode => `
                <div class="episode-card">
                    <img src="${episode.still_path ? IMAGE_BASE_URL + episode.still_path : 'src/img/placeholder.png'}" alt="Episódio ${episode.episode_number}">
                    <div class="episode-info">
                        <h3>${episode.episode_number}. ${episode.name}</h3>
                        <p>${new Date(episode.air_date).toLocaleDateString('pt-BR')}</p>
                    </div>
                </div>
            `).join('');
    }
}


// Evento de seleção de temporada
function setupSeasonSelection() {
    const seasonButton = document.querySelector('.season-select button');
    seasonButton.addEventListener('click', async () => {
        const seasonNumber = prompt('Digite o número da temporada:');
        if (seasonNumber) {
            await renderSeasonEpisodes(seasonNumber);
        }
    });
}

// Inicialização
async function init() {
    await renderSerieDetails();
    await renderSerieCast();
    await renderSeasonEpisodes(); // Renderiza a primeira temporada por padrão
    setupSeasonSelection();
}

window.onload = init;
