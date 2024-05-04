const { faker } = require("@faker-js/faker/locale/es");

module.exports = {
  generateMockProducts: function (number) {
    let products = [];

    for (let i = 0; i < number; i++) {
      products.push({
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: faker.commerce.price({ min: 10, max: 57, dec: 0 }),
        code: faker.number.int({ min: 1000, max: 9999 }),
        thumbnails: [],
        stock: faker.number.int({ min: 10, max: 23 }),
        category: faker.commerce.department(),
      });
    }

    return products;
  },
};
