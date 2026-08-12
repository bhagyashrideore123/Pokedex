const POKEY_CARD_REF = document.getElementById("card");
const SEARCH_INPUT = document.getElementById("search-input");
const NOT_FOUND = document.getElementById("not-found");
const DIALOG = document.getElementById("dialog");
const LOAD_MORE_BUTTON = document.getElementById("load-more-button");
const SPINNER = document.getElementById("loadingSpinner");

let currentArray = [];
let searchResult = [];
const nameArry = [];
const hpStatObj = 0;
const speciesUrl = "";
const typeColors = {
    fire: "#F08030",
    water: "#6890F0",
    grass: "#78C850",
    electric: "#F8D030",
    ice: "#98D8D8",
    fighting: "#C03028",
    poison: "#A040A0",
    ground: "#E0C068",
    flying: "#A890F0",
    psychic: "#F85888",
    bug: "#A8B820",
    rock: "#B8A038",
    ghost: "#705898",
    dark: "#705848",
    dragon: "#7038F8",
    steel: "#B8B8D0",
    fairy: "#EE99AC",
    normal: "#A8A878",
};

function init() {
    getPokeymonsData();
}

function resetSearch()
{
    searchResult = [];
    SEARCH_INPUT.value = "";
    renderPokeymon();
}

async function getPokeymonsData() {
    showLoader();
    try {
        const offset = currentArray.length;
        const result = await fetch(
            `https://pokeapi.co/api/v2/pokemon?limit=20&offset=${offset}`,
        );
        const resultAsJson = await result.json();
        const resultNames = resultAsJson.results;
        for (const pkm of resultNames) {
            nameArry.push(pkm);
            await getIndivisualPokeymoninfo(pkm);
        }
        renderPokeymon();
    } catch (error) {}
    hideLoader();
}

async function getIndivisualPokeymoninfo(API_POKEYMON_INFO) {
    const result = await fetch(API_POKEYMON_INFO.url);
    const resultAsJson = await result.json();
    currentArray.push(resultAsJson);
}

function renderPokeymon() {
    POKEY_CARD_REF.innerHTML = "";
    let renderArray = searchResult.length ? searchResult : currentArray;
    for (let i = 0; i < renderArray.length; i++) {
        const element = renderArray[i];
        POKEY_CARD_REF.innerHTML += renderPokeyCard(element, i);
    }
}

function renderTypes(info, index) {
    let pokemonTypes = "";
    for (let type = 0; type < info.types.length; type++) {
        const typeName = info.types[type].type.name;
        pokemonTypes += `<span class="pokemon-type type_${typeName}">${typeName.toUpperCase()}</span>`;
    }
    return pokemonTypes;
}

function pokeymonTypes(index) {
    let typesPokey = [];
    let typesArray = searchResult.length ? searchResult : currentArray;
    for (const element of typesArray[index].types) {
        typesPokey.push({
            name: element.type.name,
            color: typeColors[element.type.name],
        });
    }
    return typesPokey;
}

function resetHTML()
{
    LOAD_MORE_BUTTON.style.display = "none";
    searchResult = [];
    NOT_FOUND.innerText = "";
    POKEY_CARD_REF.innerHTML = "";
}

function searchPokeymon() { 
        let keyword = SEARCH_INPUT.value;   
        resetHTML();     
        if (keyword.length === 0) {
            renderPokeymon();
            LOAD_MORE_BUTTON.style.display = "block";
        } else if (keyword.length < 3) {
            NOT_FOUND.innerText ="Please enter min 3 Characters to search the Pokeymon.";
        } else {
            searchResult = currentArray.filter((pokey) =>pokey.name.includes(keyword));
            NOT_FOUND.innerText = searchResult.length === 0 ? "No Match Found." : "";
            if (searchResult.length > 0) renderPokeymon();                           
        }
}

async function loadMorePOkey() {
    showLoader();
    try {
        getPokeymonsData();
    } catch (error) {}
    hideLoader();
}

function renderAbilitiesPokeymon(dialogArray, index) {
    let pokemonAbilities = " ";
    for (let i = 0; i < dialogArray[index].abilities.length; i++) {
        const abilities = dialogArray[index].abilities[i].ability.name;
        pokemonAbilities += `<span class="alignRowClass">${abilities} </span>`;
    }
    return pokemonAbilities;
}

function openPokeymonDialog(index) {
    let dialogArray = [];
    dialogArray = searchResult.length ? searchResult : currentArray;
    const hpStatObj = dialogArray[index].stats.find((item) => item.stat.name === "hp");
    const hpvalue = hpStatObj ? hpStatObj.base_stat : 0;
    const speciesUrl = dialogArray[index].species.url;
    const types = pokeymonTypes(index);
    openDialog(dialogArray,hpvalue,speciesUrl ,types,index);
}

async function openDialog(dialogArray,hpvalue,speciesUrl ,types,index) {    
    const category = await getCategory(speciesUrl);
    const description = await getDescrition(speciesUrl);  
    DIALOG.style.background = types.length === 2 ? `radial-gradient(circle, ${types[0].color} 10%, ${types[1].color} 100%)`:"#ffffff"
    if (types.length === 1) {
        DIALOG.style.background = `radial-gradient(circle, ${types[0].color} 0%, #ffffff 100%)`;
    }
    document.body.style.overflow = "hidden";
    DIALOG.innerHTML = renderPokeymonDialog(index,dialogArray, hpvalue,category,description,types);
    DIALOG.showModal();
}

async function getCategory(speciesUrl) {
    let category;
    const response = await fetch(speciesUrl);
    const speciesData = await response.json();
    const categoryEnglish = speciesData.genera.find(
        (category) => category.language.name === "en",
    );
    category = categoryEnglish ? categoryEnglish.genus : "Unknown";
    return category;
}

async function getDescrition(speciesUrl) {
    let description;
    const response = await fetch(speciesUrl);
    const speciesData = await response.json();
    const englishEntry = speciesData.flavor_text_entries.find(
        (entry) => entry.language.name === "en",
    );
    if (englishEntry) {
        description = englishEntry.flavor_text.replace(/[\n\f]/g, " ");
    } else {
        description = "Description not available.";
    }
    return description;
}

function closeDialog() {
    document.body.style.overflow = "auto";
    DIALOG.close();
}

function goForward(index) {
    let ArrayForward = searchResult.length ? searchResult : currentArray;
    if (index >= 0 && index < ArrayForward.length - 1) {
        index++;
        openPokeymonDialog(index);
    } else {
        index = 0;
        openPokeymonDialog(index);
    }
}

function gobackward(index) {
    let ArrayBackward = searchResult.length ? searchResult : currentArray;
    if (index == 0) {
        index = ArrayBackward.length - 1;
        openPokeymonDialog(index);
    } else {
        index--;
        openPokeymonDialog(index);
    }
}

DIALOG.addEventListener("click", (event) => {   
    if (event.target === dialog) {
        document.body.style.overflow = "auto";
        DIALOG.close();
    }
});

function showLoader() {
    SPINNER.classList.remove("hidden");
}

function hideLoader() {
    SPINNER.classList.add("hidden");
}
