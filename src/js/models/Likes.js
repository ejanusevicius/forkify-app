export default class Likes {
    constructor () {
        this.likes = [];
    }
    addLike(ID, title, author, img) {
        const like = {ID, title, author, img}
        this.likes.push(like);

        //persist data in localStorage
        this.persistData();



        return like; 

    }
    deleteLike(id) {
        const index = this.likes.findIndex(el => el.ID === id);
        this.likes.splice(index , 1);

        //persist data in localStorage
        this.persistData();

    }
    isLiked(id) {
        return this.likes.findIndex(el => el.ID === id) !== -1;
    }
    getNumberOfLikes() {
        return this.likes.length;
    }
    persistData() {
        localStorage.setItem('likes', JSON.stringify(this.likes));
    }
    readStorage() {
        const storage = JSON.parse(localStorage.getItem('likes'));
        //restoring likes from localStorage
        if (storage) this.likes = storage;
    }
}