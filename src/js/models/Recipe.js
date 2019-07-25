// Recipe API : https://www.food2fork.com/api/get 
// CORS Link : http://cors-anywhere.herokuapp.com/
// Keys:
//35777a2ed100a2b60620b6f96296eef3
//acd035814373a7ea98a35a54fceaa62d

//importing axios
import axios from 'axios';

export default class Recipe {
    constructor(ID) {
        this.ID = ID
    }
    async getRecipe() {
        try {
            const proxy = 'http://cors-anywhere.herokuapp.com/';
            const keyOne = '35777a2ed100a2b60620b6f96296eef3';
            const keyTwo = 'acd035814373a7ea98a35a54fceaa62d'; 
            const keyThree = '7bd41097b2a1b95b28b237d514c1ddc1';
            const keyFour = '9519e28f7a128c0bd857fec3d5c440ab';
            const keyFive = 'caa671d14aa0691671cd8d03a191e991';
            const keySix = 'c0867960c0cd043396f8b248dbf113eb';
            //calling up the API
            const recipe = await axios(`${proxy}https://www.food2fork.com/api/get?key=${keyOne}&rId=${this.ID}`);
            //returning the result
            this.title = recipe.data.recipe.title;
            this.author = recipe.data.recipe.publisher;
            this.img = recipe.data.recipe.image_url;
            this.url = recipe.data.recipe.source_url;
            this.ingredients = recipe.data.recipe.ingredients;
            console.log(this);
        } catch(error) {
            alert('error');
        }
    }
    calcTime() {
        const numOfIngredients = this.ingredients.length;
        const periods = numOfIngredients / 3;
        this.time = Math.ceil(periods * 15);
    }
    calcServings() {
        this.servings = 4;
    }
    parseIngredients() {
        const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds'];
        const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];

        const newIngredients = this.ingredients.map(cur => {
            //1) uniform units
            let ingredient = cur.toLowerCase();
            unitsLong.forEach( (unit, i) => {
                ingredient = ingredient.replace(unit, unitsShort[i])
            });
            //2) remove parentheses
            ingredient = ingredient.replace(/ *\([^)]*\) */g , '');
            //3) parse unit in count, unit, ingredient
            const arr = ingredient.split(' ');
            const unitIndex = arr.findIndex( el2 => unitsShort.includes(el2));          
            
            let objIng = {};

            if (unitIndex > -1) {
                //there is a unit
                let count;
                const arrCount = arr.slice(0, unitIndex)
                if(arrCount.length === 1) {
                    count = eval(arr[0].replace('-', '+'));
                } else {
                    count = eval(arr.slice(0, unitIndex).join('+'));
                }

                objIng = {
                    count,
                    unit: arr[unitIndex],
                    ingredient: arr.slice(unitIndex + 1). join(' ')
                };

            } else if (parseInt(arr[0], 10)) {
                // there is no unit but first element is a number
                objIng = {
                    count: parseInt(arr[0], 10),
                    unit: '',
                    ingredient: arr.slice(1).join(' ')
                }
            } else if (unitIndex === -1) {
                //there is no unit and no number is 1st position
                objIng = {
                    count: 1,
                    unit: '',
                    ingredient
                }
            }

            return objIng;


        });
        this.ingredients = newIngredients;
    }
    updateServings (type) {
        //Servings
        const newServings = type === 'dec' ? this.servings - 1 : this.servings + 1;

        //Ingredients
        this.ingredients.forEach(ing => {
            ing.count *= (newServings / this.servings)
        });

        this.servings = newServings;
    }
}