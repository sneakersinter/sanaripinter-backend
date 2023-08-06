const SERVER_HOST = process.env.API_URL;

const getImage = (id) => {
  return `${SERVER_HOST}images/new-products/product${id}.png`;
};

const newProducts = [
  {
    title: "Подарки для неё и для него",
    description: "Покупай прямо сейчас",
    image: getImage(1),
  },
  {
    title: "Подарки для неё и для него",
    description: "Покупай прямо сейчас",
    image: getImage(1),
  },
];

newProducts.forEach((product, key) => {
  product["id"] = key + 1;
});

module.exports = newProducts;
