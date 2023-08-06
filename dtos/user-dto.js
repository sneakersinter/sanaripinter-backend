module.exports = class UserDto {
    name;
    surname;
    email;
    favouriteProducts;
    id;

    constructor(model) {
        this.name = model.name
        this.surname = model.surname
        this.email = model.email
        this.favouriteProducts = model.favouriteProducts
        this.id = model._id
    }
}