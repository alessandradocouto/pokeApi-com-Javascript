const $body = document.querySelector('body');
const $mainContainer = document.querySelector('.m-container');
const $container = document.querySelector('.container');
const $boxModal = document.querySelector('.modal');
const $boxModalContent = document.querySelector('.modal__content');



// cada pokemon
// Object { abilities: (3) […], base_experience: 95, forms: (1) […], ...
async function getDataUrl(url){
   
    const res = await fetch(url)

    if(res.status < 200 || res.status > 300){
        alert(`Erro: ${res.status}, item ${res.statusText}. Ops não há detalhes desse pokemon.`);
    }
    
    const data = await res.json()

    return data;
}


 // pagina exata onde cliquei
    // Object { count: 1118, next: "https://pokeapi.co/api/v2/pokemon/?offset=40&limit=20", 
    // previous: "https://pokeapi.co/api/v2/pokemon/?offset=0&limit=20", results: (20) […] }



function urlPage(size, perPage){
    let urlPoke = `https://pokeapi.co/api/v2/pokemon/?offset=${size}&limit=${perPage}`;
    return urlPoke;
}


async function getAllPokemon(dataPage){

    // console.log(dataPage);
   
    for(let item of dataPage.results){
        // for com cada objeto {name: , url: } de cada pokemon

        const url = item.url; // cada url do pokemon
        // const res = await fetch(url) // fazendo requisicao com fetch
        const pokemon =  await getDataUrl(url);
        // trazendo a promise para ser lida com .json()
        // {name: , url:, id: , stats: , ...}

        createCard(pokemon);
    }

}


function pageDisabledEnabled(btn){
    // true
    btn.hasAttribute('disabled') 
    ? btn.style.color = '#ccc'
    : btn.style.color = '#000';     
}


// logica da paginação
function getPage(){

    let state = {
        prev: 0, current: 1, next: 0, total: 1118, 
        limit: 20, offset: 0, lastPage: 0 
    }

    let urlPoke;

    // const $footer = document.querySelector('.footer');
    const $footer = document.querySelector('.footer');
    const $btnFirst = document.querySelector('.first');
    const $btnPrev = document.querySelector('.prev');
    const $btnCurrent = document.querySelector('.current');
    const $btnNext = document.querySelector('.next');
    const $btnLast = document.querySelector('.last');

    
    $btnFirst.style.color = '#ccc'; 
    $btnPrev.style.color = '#ccc';
    $btnFirst.disabled = true; 
    $btnPrev.disabled = true; 


    $footer.addEventListener('click', async (e) =>{

        e.preventDefault();

        if(e.target.className === 'first'){
            e.preventDefault();

            state.prev = null;
            state.offset = 0;
            state.current = 1;
            $btnCurrent.textContent = state.current;

            $btnFirst.disabled = true;
            pageDisabledEnabled($btnFirst);

            $btnPrev.disabled = true;
            pageDisabledEnabled($btnPrev);

            $btnNext.disabled = false;
            pageDisabledEnabled($btnNext);

            $btnLast.disabled = false;
            pageDisabledEnabled($btnLast);


            urlPoke = `https://pokeapi.co/api/v2/pokemon/?offset=${state.offset}&limit=${state.limit}`;

        }


        if(e.target.className === 'prev'){

            e.preventDefault();

            if($btnCurrent.textContent === 1){ 

                
                $btnFirst.disabled = true;
                $btnPrev.disabled = true;
                $btnNext.disabled = false;
                pageDisabledEnabled($btnFirst);

                
                pageDisabledEnabled($btnPrev);


                
                pageDisabledEnabled($btnNext);

                state.prev = null;
                // // state.offset = 0;
                $btnCurrent.textContent = state.current++; // 1
                
            }

            
            
            if(state.current > 1){

               
                $btnPrev.disabled = false;
                $btnNext.disabled = false;
                $btnLast.disabled = false;
                pageDisabledEnabled($btnPrev);
                pageDisabledEnabled($btnNext);
                pageDisabledEnabled($btnLast);

                state.prev = 0;
                state.current--; // 1  2--  3--
                state.offset -= state.limit;
                $btnCurrent.textContent = state.current;
                state.next = 0;
            }

         
            
            urlPoke = `https://pokeapi.co/api/v2/pokemon/?offset=${state.offset}&limit=${state.limit}`;

           
            
        }


        if(e.target.className === 'next'){
            e.preventDefault();

            if(state.next !== null){

               
                $btnFirst.disabled = false; 
                
               
                $btnPrev.disabled = false;

              
                $btnNext.disabled = false;

                pageDisabledEnabled($btnFirst);
                pageDisabledEnabled($btnPrev);
                pageDisabledEnabled($btnNext);

                state.prev = 0;
                state.current++; // 3
                state.offset += state.limit;
                $btnCurrent.textContent = state.current; 
            }
    
            else{

                
                $btnNext.disabled = true;
                pageDisabledEnabled($btnNext);

                state.prev = state.offset - state.limit;
                state.current++;
               
                $btnCurrent.textContent = state.current;
            }

            if(state.current === state.lastPage){


                $btnNext.disabled = true;
                pageDisabledEnabled($btnNext);

                state.next = null;
            }
            
            urlPoke = `https://pokeapi.co/api/v2/pokemon/?offset=${state.offset}&limit=${state.limit}`;
            
          
        }


        if(e.target.className === 'last'){

            e.preventDefault();

            state.lastPage = Math.round(state.total / state.limit); // (total 1118 / limit 20)  aprox pra cima 56

            
            
            
            $btnFirst.disabled = false;
            $btnPrev.disabled = false; // false
            $btnNext.disabled = true; // true
            $btnLast.disabled = true;
            pageDisabledEnabled($btnFirst);
            pageDisabledEnabled($btnPrev);
            pageDisabledEnabled($btnNext);
            pageDisabledEnabled($btnLast);

            state.next = null;
            state.current = state.lastPage;
            state.offset = Math.floor(state.total / state.limit) * state.limit; // aprox pra baixo 55 * limit 20
            $btnCurrent.textContent = state.current;
    
            urlPoke = `https://pokeapi.co/api/v2/pokemon/?offset=${state.offset}&limit=${state.limit}`;
           
        }
        
       
        let data = await getDataUrl(urlPoke);
        
        getAllPokemon(data);

        $container.textContent = '';
      
    });

    
}


// acesso a url de cada pokemon
async function getCreate(getDataUrl){

    const url = `https://pokeapi.co/api/v2/pokemon/`;
    const response = await getDataUrl(url);
    
    getAllPokemon(response);
    getPage();
}


/* 
    crio cada id, nome e foto do pokemon e 
    ao mesmo tempo crio o tipo que tá numa funcao separada
*/

function createCard(poke){

    const pokemon = poke;
    const img = pokemon.sprites.other.dream_world.front_default === null 
    ? pokemon.sprites.front_default : pokemon.sprites.other.dream_world.front_default;
    const id = pokemon.id; 
    const name = pokemon.name;
    const type = pokemon.types; // array length 2
    const pokemonType = type.map(el => 
        `<span class="container__text--active">${el.type.name}</span>`
    );
    
    const markupCardHTML = 

    `<section class="container__img__text">
        <div class="container__img">
            <img src="${img}" class="container__img__picture" alt="${name}">
        </div>
        <article class="container__text">
            <h2 class="container__text__title">${id}</h2>
            <p class="container__text__subtext">${name}</p>
            ${pokemonType.join(' ')}
            <button type="button" class="container__text__btn">
            detalhes
            </button>
        </article>
    </section>`;

    
    $container.insertAdjacentHTML('beforeend', markupCardHTML);
  
}


function openPokeDetail(data, detail){

    const type = data.types.map(el => 
        `<span class="content__detail__header--active">${el.type.name}</span>`
    ).join(' ');

    const stat = data.stats.map(el => 
        `<article class="s__content__stat">
            <p class="s__content__text">${el.stat.name}</p>
            <div class="stat-container">
                <p class="skills__stat">${el.base_stat}%</p>
            </div>
            <p class="s__content__text">effort</p>
            <div class="stat-container">
                <p class="skills__stat">${el.effort}</p>
            </div>
        </article>`
    ).join(' ');

    const abilities = data.abilities.map(el => 
        `<p class="a__content__group__text">${el.ability.name}</p>`
    ).join(' ');

    const groups = detail.egg_groups.map(el => 
        `<p class="a__content__group__text">${el.name}</p>`
    ).join(' ');

    const specie = detail.evolves_from_species === null 
        ? 'originária' : detail.evolves_from_species.name;
    
    
    const markupModalHTML = 

    `
    <section class="all__content">
    
        <section class="h__content">
            <div class="h__content__img">
                <img class="h__content__img__picture" src="${data.sprites.other.dream_world.front_default === null ? data.sprites.front_default : data.sprites.other.dream_world.front_default}" alt="${data.name}">
            </div>
            <div class="h__content__detail">
                <article class="content__detail__header">
                    <h1 class="content__detail__header__title">${data.name}</h1>
                    <p class="content__detail__header__text">${data.id}</p>
                    ${type}
                </article>
                <article class="content__detail__body">
                    <h2 class="content__detail__body__title">Peso</h2>
                    <p class="content__detail__body__text">${data.weight}</p>
                    <h2 class="content__detail__body__title">Altura</h2>
                    <p class="content__detail__body__text">${data.height}</p>
                </article>
                <article class="content__detail__footer">
                    <h2 class="content__detail__footer__title">${detail.flavor_text_entries['6'].flavor_text}</h2>
                </article>
            </div>
        </section>

        <section class="s__content">
            <h2 class="a__content__group__title">Estatistica</h2>
            ${stat}
        </section>

        <section class="a__content">
            <article class="a__content__group">
                <h2 class="a__content__group__title">Habilidades</h2>
                ${abilities}
            </article>
            <div class="a__content__group--active"></div>
            <article class="a__content__group">
                <h2 class="a__content__group__title">Grupos</h2>
                ${groups}
            </article>
        </section>
        
        <section class="a__content">
            <article class="a__content__group">
                <h2 class="a__content__group__title">Habitat</h2>
                <p class="a__content__group__text">${detail.habitat.name}</p>
            </article>
            <div class="a__content__group--active"></div>
            <article class="a__content__group">
                <h2 class="a__content__group__title">Evolução</h2>
                <p class="a__content__group__text">espécie: ${specie}</p>
            </article>
        </section>
    </section>`;

    $boxModalContent.insertAdjacentHTML("beforeend",markupModalHTML);
    


    function statSkillColor(){

        const skillStat =  document.querySelectorAll('.skills__stat');
        const contentGroupTitle = document.querySelectorAll('.a__content__group__title');

        const color = {
            green: '#26b490', blue: '#7b96ea', yellow: '#fcdd2d', 
            gray: '#838b8b', white: '#ffffff', red: '#eb523e', 
            brown: '#7e6161', purple:'#9b69a0', pink: '#d37dac'
        };
    
        const {green,blue,yellow,gray,white,red,brown,purple,pink} = color;

        skillStat.forEach(el => {

            if(el.textContent < 1){
                el.classList.add('skillDetailEffort');
            }

            else {
                
                el.style.maxWidth = `${el.textContent}`;

                if(`${detail.color.name}` === 'green'){
                        
                    el.style.backgroundColor = green;

                    contentGroupTitle.forEach(item => { 
                        item.style.borderColor = green;
                    });
                   
                }

                if(`${detail.color.name}` === 'gray'){
                        
                    el.style.backgroundColor = gray;

                    contentGroupTitle.forEach(item => { 
                        item.style.borderColor = gray;
                    });
                }

                if(`${detail.color.name}` === 'red'){
                    el.style.backgroundColor = red;

                    contentGroupTitle.forEach(item => { 
                        item.style.borderColor = red;
                    });
                   
                }

                if(`${detail.color.name}` === 'blue'){
                    el.style.backgroundColor = blue;

                    contentGroupTitle.forEach(item => { 
                        item.style.borderColor = blue;
                    });
                }

                if(`${detail.color.name}` === 'white'){
                    el.style.backgroundColor = white;
                    el.style.color = '#000';

                    contentGroupTitle.forEach(item => { 
                        item.style.borderColor = '#000';
                    });
                }

                if(`${detail.color.name}` === 'yellow'){
                    el.style.backgroundColor = yellow;
                    el.style.color = '#000';

                    contentGroupTitle.forEach(item => { 
                        item.style.borderColor = yellow;
                    });
                }

                if(`${detail.color.name}` === 'brown'){
                    el.style.backgroundColor = brown;

                    contentGroupTitle.forEach(item => { 
                        item.style.borderColor = brown;
                    });
                }

                if(`${detail.color.name}` === 'purple'){
                    el.style.backgroundColor = purple;

                    contentGroupTitle.forEach(item => { 
                        item.style.borderColor = purple;
                    });
                }

                if(`${detail.color.name}` === 'pink'){
                    el.style.backgroundColor = pink;

                    contentGroupTitle.forEach(item => { 
                        item.style.borderColor = pink;
                    });
                }

                if(`${detail.color.name}` === 'blue'){
                    el.style.backgroundColor = blue;

                    contentGroupTitle.forEach(item => { 
                        item.style.borderColor = blue;
                    });
                }
            }      
        });
    }

    statSkillColor();
   
}


function selectPoke(){
   

    $mainContainer.addEventListener('click', openModal);

    $mainContainer.addEventListener('click', closeModal);

    $mainContainer.addEventListener('keyup', closeModal);
   
    

    async function openModal(e){

        e.preventDefault();
    
        // se clicar o mouse na classe do button de abrir acontece tudo isso
        if(e.target.className === 'container__text__btn'){
 
            
            // id  = atraves do pai do buton que cliquei,
            // esse pai tem um texto
            // no primeiro elemento filho
            // transformo essa string em inteiro
            const id = parseInt(e.target.parentElement.firstElementChild.textContent);
           
            const urlPokeData = `https://pokeapi.co/api/v2/pokemon/${id}/`;
            const urlPokeSpecies = `https://pokeapi.co/api/v2/pokemon-species/${id}/`;
            // passo as urls com ids especificas dos pokemons
            // Ex: 25, id do Pikachu
            const pokemonData = await getDataUrl(urlPokeData);
            const pokemonDetail = await getDataUrl(urlPokeSpecies);

            // faço requisições pra construir os detalhes do modal
            
            openPokeDetail(pokemonData, pokemonDetail);  
            
           

            $boxModal.style.display = 'flex';
            $body.style.overflow = 'hidden';
           
        } 
    }
    
    
    function closeModal(e){
        e.preventDefault();

        if(e.target.className === 'modal__close' || e.keyCode === 27){

          

            $boxModal.style.display = 'none';
            // altero o display do modal pai pra none, fora da tela

            $body.style.overflow = 'auto';
            // pra quando fechar o scroll do body voltar
            
            // limpo o conteúdo do modal ao fechar
            $boxModalContent.textContent = '';
        }
        
    }
}



(function(){

    getCreate(getDataUrl);
    selectPoke();


})();


