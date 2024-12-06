document.addEventListener("DOMContentLoaded", () => {
    const apiKey = "3aae4720d254f3a5673c432ce502684e";
    const API_URL = 'http://localhost:3000/series_preferidas';
    const baseImageUrl = "https://image.tmdb.org/t/p/w500";
    const carouselContainer = document.querySelector('.carouselDiv');

    // Função para buscar dados da API
    const fetchSeries = async () => {
        try {
            const response = await fetch(`https://api.themoviedb.org/3/tv/top_rated?api_key=${apiKey}&language=pt-BR`);
            const data = await response.json();
            console.log(data.results)
            return data.results;
        } catch (error) {
            console.error("Erro ao buscar dados da API:", error);
        }
    };

    // Preencher o carrossel de séries populares
    const populateCarousel = async () => {
        const series = await fetchSeries("tv/popular");
        const carouselInner = document.querySelector("#carouselPopular .carousel-inner");
        const carouselIndicators = document.querySelector("#carouselPopular .carousel-indicators");

        series.forEach((serie, index) => {
            const activeClass = index === 0 ? "active" : "";

            // Adiciona um item ao carrossel
            carouselInner.innerHTML += `
                <div class="carousel-item ${activeClass}">
                    <img src="${baseImageUrl}${serie.backdrop_path}" class="d-block w-100" alt="${serie.name}">
                    <div class="carousel-caption d-none d-md-block">
                        <h5>${serie.name}</h5>
                    </div>
                </div>
            `;

            // Adiciona um indicador ao carrossel
            carouselIndicators.innerHTML += `
                <button type="button" data-bs-target="#carouselPopular" data-bs-slide-to="${index}" class="${activeClass}" aria-label="Slide ${index + 1}"></button>
            `;
        });
    };

    // Preencher os cartões de novas séries
    const populateCards = async () => {
        const series = await fetchSeries("tv/on_the_air");
        const cardsContainer = document.getElementById("newSeriesCards");

        series.forEach((serie) => {
            const {id} = serie;
            cardsContainer.innerHTML += `
                <div class="col">
                    <div class="card">  
                        <a href="./detalhes.html?id=${id}"><img src="${baseImageUrl}${serie.poster_path}" class="card-img-top" alt="${serie.name}"></a>
                        <div class="card-body">
                            <h5 class="card-title">${serie.name}</h5>
                            <p>${serie.overview || "Descrição indisponível."}</p>
                        </div>
                    </div>
                </div>
            `;
        });
    };

    async function fetchAlunoData() {
        try {
          const response = await fetch('http://localhost:3000/usuarios/1');
          const aluno = await response.json();
    
          // Atualizar o DOM com as informações do aluno
          document.getElementById('sobre').innerText = `${aluno.nome}, ${aluno.idade} anos e sou estudante de ${aluno.curso} pela PUC Minas`;
          document.getElementById('nome').innerText = aluno.nome;
          document.getElementById('curso').innerText = aluno.curso;
          document.getElementById('turno').innerText = aluno.turno;
          document.getElementById('github-link').href = aluno.github;
        } catch (error) {
          console.error('Erro ao carregar dados do aluno:', error);
        }
    }

    // Função para buscar as séries favoritas
    async function fetchFavoriteSeries() {
        try {
            const response = await fetch(API_URL);
            const data = await response.json();

            // Puxa as informações das séries com base no "serie_id" e exibe
            const seriesPromises = data.map(async item => {
                const serieData = await fetchSerieData(item.serie_id);
                return createSerieCard(serieData);
            });

            const seriesCards = await Promise.all(seriesPromises);
            seriesCards.forEach(card => carouselContainer.innerHTML += card); // Insere os cards no carousel

        } catch (error) {
            console.error('Erro ao buscar séries favoritas:', error);
        }
    }

    // Função para buscar os dados da série no The Movie DB
    async function fetchSerieData(serie_id) {
        const API_KEY = '3aae4720d254f3a5673c432ce502684e'; // Sua chave da API do The Movie DB
        const BASE_URL = 'https://api.themoviedb.org/3/tv/';
        
        try {
            const response = await fetch(`${BASE_URL}${serie_id}?api_key=${API_KEY}&language=pt-BR`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Erro ao buscar dados da série:', error);
        }
    }

    // Função para criar o HTML do card da série
    function createSerieCard(serie) {
        const { name, poster_path } = serie;
        return `
            <div class="col">
                <div class="card">
                    <img src="${poster_path ? baseImageUrl + poster_path : 'src/img/placeholder.png'}" class="card-img-top" alt="${name}">
                    <div class="card-body">
                        <h5 class="card-title">${name}</h5>
                    </div>
                </div>
            </div>
        `;
    }


    window.onload = fetchAlunoData;

    // Chamar funções de preenchimento
    populateCarousel();
    populateCards();
    fetchFavoriteSeries();
});
