const newProducts = require("../models/newProducts/newProudcts");
const products = require("../models/products/products");

class DataController {
  getNewProducts(req, res) {
    res.send(newProducts);
  }
  getProducts(req, res) {
    const reservedWords = ["trands", "colors", "offset", "limit", "search"];
    const { trands, colors, offset, limit, search } = req.query;
    const initOffset = +offset || 0;
    const initLimit = +limit || 12;
    let customed = [...products];

    if (trands) {
      customed = customed.filter((product) => product.isTrand);
    }

    if (colors) {
      let colorsArr = colors.split(",");

      customed = customed.filter((product) => {
        let isFound = false;

        colorsArr.forEach((color) => {
          if (product.colors.includes("#" + color) || !color) isFound = true;
        });

        return isFound;
      });
    }

    if (search) {
      let customedSearch = isNaN(+search) ? search.toLowerCase() : +search;

      customed = customed.filter((product) => {
        let isFound = false;
        Object.keys(product).forEach((key) => {
          const data = product[key];
          if (
            Array.isArray(data) &&
            data
              .map((elem) =>
                typeof elem === "string" ? elem.toLowerCase() : elem
              )
              .includes(customedSearch)
          )
            isFound = true;
          else if (
            typeof data === "string" &&
            data.toLowerCase().includes(customedSearch)
          )
            isFound = true;
          else if (data === customedSearch) isFound = true;
        });
        return isFound;
      });
    }

    Object.keys(req.query).forEach((param) => {
      let query = req.query[param].split(",");

      if (!reservedWords.includes(param)) {
        customed = customed.filter((product) => {
          const productData = product[param];

          if (!productData) return true;

          let isFound = false;
          Array.isArray(productData)
            ? query.forEach((prm) => {
                if (productData.includes(isNaN(+prm) ? prm : +prm) || !prm)
                  isFound = true;
              })
            : query.forEach((prm) => {
                if ((isNaN(+prm) ? prm : +prm) === productData || !prm)
                  isFound = true;
              });
          return isFound;
        });
      }
    });

    let count = customed.length;
    customed = customed.slice(initOffset, initOffset + initLimit);

    res.send({
      count,
      results: customed,
    });
  }
  getProduct(req, res) {
    const { id } = req.query;

    res.send(products.find((product) => product.id === +id));
  }
  getFilterItems(req, res) {
    let categories = [];
    products.forEach((product) =>
      product.categories.forEach(
        (category) =>
          !categories.includes(category) && categories.push(category)
      )
    );

    let brands = [];
    products.forEach(
      (product) => !brands.includes(product.brand) && brands.push(product.brand)
    );

    let dimensions = [];
    products.forEach((product) =>
      product.dimensions.forEach(
        (dimension) =>
          !dimensions.includes(dimension) && dimensions.push(dimension)
      )
    );
    dimensions = dimensions.sort((a, b) => a - b);

    let seasons = [];
    products.forEach(
      (product) =>
        !seasons.includes(product.season) && seasons.push(product.season)
    );

    let colors = [];
    products.forEach((product) =>
      product.colors.forEach(
        (color) =>
          !colors.includes(color) && colors.length <= 30 && colors.push(color)
      )
    );

    res.send({ categories, brands, dimensions, seasons, colors });
  }
}

module.exports = new DataController();
