function renderPokeyCard(currentArray, index) {
    return /*html*/ `
        <div class="pokeyCard" >
            <header>   
                <p>#${currentArray.id}</p>
                <p>${currentArray.name.toUpperCase()}</p>
            </header>         
            <img id="card-image" src=${currentArray.sprites.other.dream_world.front_default} alt=${currentArray.name} onclick="openPokeymonDialog(${index})" aria-haspopup="dialog" aria-controls="dialog">
            <div class="paddTopBottom" id="pokey_type">${renderTypes(currentArray, index)}</div>
        </div>

    `;
}

function renderPokeymonDialog(
    index,
    dialogArray,
    hpvalue,
    category,
    description,
    types,
) {
    return /*html*/ `
        <section class="alignRowClass headerSec">
            <p class="fontBold">#${dialogArray[index].id}</p>
            <p id="dialogTitle fontBold">${dialogArray[index].name.toUpperCase()}</p>
            <button class="buttonCls closeBtn" tabindex="0"> 
                <img tabindex="0" src="./assets/icons/close.svg" alt="close_button" onclick="closeDialog()"/>
            </button>
        </section>
        <div class="cardsWrapper">
            <div class="alignColClass pokemon-info-card fixHeight">
                <img src=${dialogArray[index].sprites.other.dream_world.front_default} alt=${dialogArray[index].name}>
                <p>${description} </p>
            </div>
        
            <div class="pokemon-info-card fixHeight">
                    <div class="info-row">
                        <div class="info-group">
                            <span class="info-label">Height</span>
                            <span class="info-value">${dialogArray[index].height}</span>
                        </div>
                        <div class="info-group">
                            <span class="info-label">Category</span>
                            <span class="info-value">${category}</span>
                        </div>
                    </div>
                    
                    <div class="info-row">
                        <div class="info-group">
                            <span class="info-label">Weight</span>
                            <span class="info-value">${dialogArray[index].weight}lbs</span>
                        </div>
                        <div class="info-group">
                            <span class="info-label">Abilities</span>
                            <span class="info-value">${renderAbilitiesPokeymon(dialogArray, index)}</span>
                        </div>
                    </div>
                    <div class="info-row">
                        <div class="info-group">
                                <span class="info-label">Hit Points</span>
                                <span class="info-value">${hpvalue}</span>
                        </div>
                    </div>
            </div>
        </div>
        <footer class="alignRowClass marginTop">
            <div id="backwardDiv">
                <button class="buttonCls" id="backward" onclick="gobackward(${index})"><img src="./assets/icons/backward.svg" alt=""></button>
            </div>
            <div class="dialogTypes">${renderTypes(dialogArray[index], index)}</div>
            <div id="forwardDiv">
                <button  class="buttonCls" id="forward" onclick="goForward(${index})"><img src="./assets/icons/forward.svg" alt=""></button>
            </div>
        </footer>
    `;
}
