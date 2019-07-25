//Imports
import axios from 'axios';

//Data object
export default class Search {
    constructor(query) {
        this.query = query;
    }
    async getResults() {
        try {
            const proxy = 'http://cors-anywhere.herokuapp.com/';
            const keyOne = '35777a2ed100a2b60620b6f96296eef3';
            const keyTwo = 'acd035814373a7ea98a35a54fceaa62d';
            const keyThree = '7bd41097b2a1b95b28b237d514c1ddc1';
            const keyFour = '9519e28f7a128c0bd857fec3d5c440ab';
            const keyFive = 'caa671d14aa0691671cd8d03a191e991';
            const keySix = 'c0867960c0cd043396f8b248dbf113eb';
            const searchResults = await axios(`${proxy}https://www.food2fork.com/api/search?key=${keyOne}&q=${this.query}`);
            this.result = searchResults.data.recipes;
        } catch(error) {
            console.log('An error has been incured!')
            alert(error);
        }
    }
}


