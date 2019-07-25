//importing DOM elements from base.js
import { elements } from './base'

//function to get the input from the search bar.
export const getInput = () => elements.searchInput.value;

//function to clear the search field after the button has been clicked
export const clearInput = () => { 
    elements.searchInput.value = ``
};

//function to create and insert the HTML that will display the search result
export const renderRecipe = recipe => {
    const markup = 
    `<li>
    <a class="results__link" href="#${recipe.recipe_id}">
        <figure class="results__fig">
            <img src="${recipe.image_url}" alt="Test">
        </figure>
        <div class="results__data">
            <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
            <p class="results__author">${recipe.publisher}</p>
        </div>
    </a>
</li>`;
elements.searchResList.insertAdjacentHTML('afterbegin', markup);
};

export const limitRecipeTitle = (title, limit = 17) => {
    const newTitle = [];
    if (title.length > limit) {
        title.split(' ').reduce((acc, cur) => {
            if ((acc + cur.length) <= limit) {
                newTitle.push(cur);
            }
            return acc + cur.length;
        }, 0);
        return `${newTitle.join(' ')} ...`;
    }    
    return title;
};

export const clearResults = () => {
    elements.searchResList.innerHTML = '';
    elements.searchResPages.innerHTML = '';
};

const createButton = (page, type) => `
    <button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page - 1 : page + 1}>
        <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
            <svg class="search__icon">
                 <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
            </svg>
        
    </button>`;

const renderButtons = (page, numResults, resPerRage) => {
    const pages = Math.ceil(numResults / resPerRage);
    let button;

    if (page === 1 && pages > 1) {
        //we only want 1 button (next page)
        button = createButton(page, 'next');
    } else if (page === pages && pages > 1) {
        // we only want 1 button (prev page)
        button = createButton(page, 'prev');
    } else if (page < pages) {
        //we want two buttons with (page + 1) and (page - 1)
        button = `
        ${createButton(page, 'prev')}
        ${createButton(page, 'next')}`;
    }

    elements.searchResPages.insertAdjacentHTML('afterbegin', button);
}


//function that goes through all of the results and renders them out (calls up renderRecipe function above)
export const renderResults = (recipes, page = 1, resPerPage = 10) => {
    //render recipes
    const start = (page - 1) * resPerPage;
    const end = page * resPerPage;
    recipes.slice(start, end).forEach(renderRecipe);
    //render page buttons
    renderButtons(page, recipes.length, resPerPage);
}



///CONTINUE HERE 20/07/2019
export const highlightSelected = (id) => {

    const resultsArray = Array.from(document.querySelectorAll('.results__link'));

    resultsArray.forEach(cur => cur.classList.remove('results__link--active'));

    document.querySelector(`a[href="#${id}"]`).classList.add('results__link--active');
};