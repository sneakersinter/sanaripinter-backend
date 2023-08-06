const SERVER_HOST = process.env.API_URL;

const getImage = (id) => {
  return `${SERVER_HOST}images/new-products/product${id}.png`;
};

const newProducts = [
  {
    title: "Новые модные кроссовки",
    description: "Покупай прямо сейчас",
    image: getImage(1),
    linkId: 1,
  },
  {
    title: "Новые модные кроссовки",
    description: "Покупай прямо сейчас",
    image: getImage(2),
    linkId: 2,
  },
];

newProducts.forEach((product, key) => {
  product["id"] = key + 1;
});

module.exports = newProducts;
