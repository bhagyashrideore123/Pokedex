const POKEY_CARD_REF = document.getElementById("card");
const SEARCH_INPUT = document.getElementById("search-input");
const NOT_FOUND = document.getElementById("not-found");
const DIALOG = document.getElementById("dialog");

const currentArray = [];
const nameArry = [];
const hpStatObj = 0;
const speciesUrl = "";
const searchResult = [];
// let searchCounter = 0;

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

async function getPokeymonsData() {
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
}

async function getIndivisualPokeymoninfo(API_POKEYMON_INFO) {
    const result = await fetch(API_POKEYMON_INFO.url);
    const resultAsJson = await result.json();
    currentArray.push(resultAsJson);
}

function renderPokeymon() {
    if (searchResult.length) {
        for (let i = 0; i < searchResult.length; i++) {
            const element = searchResult[i];
            POKEY_CARD_REF.innerHTML += renderPokeyCard(element, i);
        }
    } else {
        for (let i = 0; i < currentArray.length; i++) {
            const element = currentArray[i];
            POKEY_CARD_REF.innerHTML += renderPokeyCard(element, i);
        }
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

function searchPokeymon() {
    let keyword = SEARCH_INPUT.value;
    if (keyword.length >= 3) {
        POKEY_CARD_REF.innerText = "";
        currentArray.filter((pokey) => {
            if (pokey.name.includes(keyword)) {
                searchResult.push(pokey);
                NOT_FOUND.innerText = "";
            } else {
                NOT_FOUND.innerText = "No Match Found.";
                POKEY_CARD_REF.innerText = "";
            }
        });
        renderPokeymon();
    } else {
        POKEY_CARD_REF.innerText = "";
        NOT_FOUND.innerText ="Please enter min 3 Characters to search the Pokeymon.";
    }
}

async function loadMorePOkey() {
    // const result = await fetch(loadMorePokeymopnsAPILink);
    // const resultAsJson = await result.json();
    // nameArry = nameArry.concat(resultAsJson.results);
    // loadMorePokeymopnsAPILink = resultAsJson.next;
}

function openPokeymonDialog(index) {
    if (searchResult.length) {
        openDialog(searchResult,index);
    } else {
        openDialog(currentArray,index);
    }
}

async function openDialog(dialogArray,index) {
    const hpStatObj = dialogArray[index].stats.find(
        (item) => item.stat.name === "hp",
    );
    const hpvalue = hpStatObj ? hpStatObj.base_stat : 0;
    const speciesUrl = dialogArray[index].species.url;
    const category = await getCategory(speciesUrl);
    const description = await getDescrition(speciesUrl);
    DIALOG.innerHTML = renderPokeymonDialog(index,dialogArray,hpvalue,category,description);
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
    DIALOG.close();
}

function goForward(index) {
    if(searchResult.length)
    {
        if (index >= 0 && index < searchResult.length - 1) {
            index++;
            openPokeymonDialog(index);
        } else {
            index = 0;
            openPokeymonDialog(index);
        }
    }else{
        if (index >= 0 && index < currentArray.length - 1) {
        index++;
        openPokeymonDialog(index);
        } else {
            index = 0;
            openPokeymonDialog(index);
        }
    }
}

function gobackward(index) {
    if (index == 0) {
        index = currentArray.length - 1;
        openPokeymonDialog(index);
    } else {
        index--;
        openPokeymonDialog(index);
    }
}

DIALOG.addEventListener("click", (event) => {
    if (event.target === dialog) {
        DIALOG.close();
    }
});
