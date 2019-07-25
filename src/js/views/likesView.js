import { elements } from './base';
import { limitRecipeTitle} from './searchView';

export const toggleButton = isLiked => {
    const iconString = isLiked ? 'icon-heart' : 'icon-heart-outlined';
    document.querySelector('.recipe__love use').setAttribute('href', `img/icons.svg#${iconString}`);
    // img/icons.svg#icon-heart-outlined
}


export const renderLoveButton = (likesLength) => {
    if (likesLength === 0) {
        //do not render love button
        elements.likesMenu.style.visibility = 'hidden';
        console.log(`changing to hidden`);
    } else if (likesLength > 0) {
        // render love button
        elements.likesMenu.style.visibility = 'visible';
        console.log(`changing to visible`);
    }
}


export const renderLike = (like) => {
    const markup = `
        <li>
        <a class="likes__link" href="#${like.ID}">
            <figure class="likes__fig">
                <img src="${like.img}" alt="Test">
                </figure>
                 <div class="likes__data">
                    <h4 class="likes__name">${limitRecipeTitle(like.title)}</h4>
                    <p class="likes__author">${like.author}</p>
                </div>
            </a>
        </li>`;
    elements.likesList.insertAdjacentHTML('beforeend', markup);
};

export const deleteLikeFromMenu = id => {
    console.log(`deleteLike has been called`);
    const el = document.querySelector(`.likes__link[href*="${id}"]`);
    console.log(el);
    if (el) el.parentElement.removeChild(el);
}