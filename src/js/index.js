// api key 35777a2ed100a2b60620b6f96296eef3 
// api link for search : https://www.food2fork.com/api/search

import {elements, renderLoader, clearLoader} from './views/base';
//importing Search model
import Search from './models/Search';
//importing Recipe Model
import Recipe from './models/Recipe';
//importing Shopping List model
import List from './models/ShoppingList';
//importing Likes model
import Likes from './models/Likes';
//importing search view
import * as searchView from './views/searchView';
//importing recipe view
import * as recipeView from './views/recipeView';
//importing Shopping List view
import * as shoppingListView from './views/shoppingListView';
//importing Likes view
import * as likesView from './views/likesView';



/* Global state of the app 
 - Search object
 - Current recipe object
 - Shopping list object
 - Liked recipes 
*/

const state = {};

const controlSearch = async () => {
    // 1) Get query from the view
    const query = searchView.getInput();
    if (query) {
        // 2) Create a new search object
        state.search = new Search(query);
        // 3) Prepare UI for results
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);
        try {
            // 4) Search for recipes
            await state.search.getResults();
            // 6) Render results on UI
            searchView.renderResults(state.search.result);
            clearLoader();
        } catch(error) {
            alert('Something went wrong with the search!');
            console.log(error);
            clearLoader();
        }
    }
}

const controlRecipe = async () => {
    // 1) Take the ID from the hash (do later);
    const id = window.location.hash.slice(1); // or window.location.hash.replace('#', '');
    if (id) {
        // 2) Prepare UI for changes (render the loader spinner)
        renderLoader(elements.recipeForm);
        // 3) Create a 'Recipe' object
        state.recipe = new Recipe(id);
        try {
            // 4) Return the Recipe from the object
            await state.recipe.getRecipe();
            // 5) Calculate time and servings
            state.recipe.calcTime();
            state.recipe.calcServings();
            state.recipe.parseIngredients();
            // 6) Render the recipe on the website

            clearLoader();
            recipeView.clearRecipe();
            recipeView.renderRecipe(
                state.recipe,
                state.likes.isLiked(id)
                );

            // 7) Highlight selected recipe
            if (state.search) searchView.highlightSelected(id); 
        } catch(error) {
            alert('Error has been incurred at the controlRecipe')
            alert(error);
            console.log(error);
        }
    }
}

const controlList = () => {
    //create a new list IF there is none
    if (!state.List) state.List = new List();

    // add each ingredient to the list
    state.recipe.ingredients.forEach(cur => {
        const item = state.List.addNewItem(cur.count, cur.unit, cur.ingredient);
        shoppingListView.renderItem(item);
    });
};

const controlLikes = () => {
    if (!state.likes) state.likes = new Likes();

    const currentID = state.recipe.ID;

    if (!state.likes.isLiked(currentID)) {
        //User hasn't liked the current recipe
        
        //Add like to the data
        const newLike = state.likes.addLike(currentID, 
                                            state.recipe.title, 
                                            state.recipe.author, 
                                            state.recipe.img);
        
        //Toggle the like button
        likesView.toggleButton(true);


        //Add like to the UI list
        likesView.renderLike(newLike);

    } else if (state.likes.isLiked(currentID)) {
        //User has liked the current recipe
        
        //Remove like from the state
        state.likes.deleteLike(currentID);
        //Toggle the like button
        likesView.toggleButton(false);
        //Remove like from the UI list
        likesView.deleteLikeFromMenu(currentID);

    }
    likesView.renderLoveButton(state.likes.getNumberOfLikes());
};



//event listener for search button
elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
})

//event listener for buttons
elements.searchResPages.addEventListener('click', (event) => {
    const btn = event.target.closest('.btn-inline');
    if (btn) {
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage);
    }
});

//event listeners for loading and hashchanging
window.addEventListener('hashchange', controlRecipe);
//['hashchange', 'load'].forEach(cur => window.addEventListener(cur, controlRecipe));
window.addEventListener('load', () => {
    //create a new Likes object
    state.likes = new Likes();
    //restore data from the localStorage
    state.likes.readStorage();
    //render the button based on number of likes
    likesView.renderLoveButton(state.likes.getNumberOfLikes());
    //render the likes
    state.likes.likes.forEach(like => likesView.renderLike(like));
})


//event listener for recipe buttons
elements.recipeForm.addEventListener('click', event => {
    if (event.target.matches('.btn-decrease, .btn-decrease *')) {
        // Decrease button is clicked
        if (state.recipe.servings > 1) {
            state.recipe.updateServings('dec');
            recipeView.updateRecipeIngredients(state.recipe);
        }
    } else if (event.target.matches('.btn-increase, .btn-increase *')) {
        // Increase button is clicked
        state.recipe.updateServings('inc');
        recipeView.updateRecipeIngredients(state.recipe);
    } else if (event.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
        //add ingredients to the shopping list
        controlList();
    } else if (event.target.matches('.recipe__love, .recipe__love *')) {
        controlLikes();
    }
})

//event lisener for delete buttons of the shopping list

elements.shoppingList.addEventListener('click', event => {
    const ID = event.target.closest('.shopping__item').dataset.itemid;

    if (event.target.matches('.shopping__delete, .shopping__delete *')) {
        state.List.deleteItem(ID);
        shoppingListView.deleteItem(ID); 
    } else if (event.target.matches('.shopping__count-value')) {
        const val = parseFloat(event.target.value, 10);
        state.List.updateCount(ID, val)
    }
})

