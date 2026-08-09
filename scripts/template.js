function renderPokeyCard(currentArray, index) {
    return /*html*/ `
        <div class="pokeyCard" >
            <header>   
                <p>${currentArray.id}</p>
                <p>${currentArray.name.toUpperCase()}</p>
            </header>         
            <img id="card-image" src=${currentArray.sprites.other.dream_world.front_default} alt=${currentArray.name} onclick="openPokeymonDialog(${index})" aria-haspopup="dialog" aria-controls="dialog">
            <div id="pokey_type">${renderTypes(currentArray, index)}</div>
        </div>

    `;
}

function renderPokeymonDialog(index, dialogArray, hpvalue, category, description) {
    return /*html*/ `
        <section class="alignRowClass">
            <p>#${dialogArray[index].id}</p>
            <p id="dialogTitle">${dialogArray[index].name}</p>
            <button tabindex="0"> 
                <img tabindex="0" src="./assets/icons/close.svg" alt="close_button" onclick="closeDialog()"/>
            </button>
        </section>
        <section class="alignColClass">
            <img src=${dialogArray[index].sprites.other.dream_world.front_default} alt=${dialogArray[index].name}>
            <p>${description} </p>
        </section>
        <div class="marginTop">
            <div class="alignRowClass">
                <div><p>Height:${dialogArray[index].height}'</p></div>
                <div><p>Weight:${dialogArray[index].weight}lbs</p></div>
            </div>
            <div class="alignRowClass">
                <div><p>Hit Points:${hpvalue}</p></div>
                <div><p>Category:${category}</p></div>
            </div>
        </div>
        
        <section class="alignRowClass marginTop">
            <div id="backwardDiv">
                <button class="buttonCls" id="backward" onclick="gobackward(${index})">Prev</button>
            </div>
            <div id="forwardDiv">
                <button  class="buttonCls" id="forward" onclick="goForward(${index})">Next</button>
            </div>
        </section>
    `;
}
