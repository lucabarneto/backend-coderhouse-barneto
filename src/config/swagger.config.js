const swaggerJsDoc = require("swagger-jsdoc");

const swaggerConfig = {
  definition: {
    openapi: "3.1.0",
    info: {
      title: "Documentación API Luca Barneto",
      summary:
        "Documentación de los módulos de producto y carrito empleando swagger",
      version: "1.0.0",
      contact: {
        name: "Luca Barneto",
        email: "luca.barneto.uiux@gmail.com",
      },
    },
  },
  apis: ["./src/docs/**/*.yaml"],
};

const swaggerSpecs = swaggerJsDoc(swaggerConfig);

module.exports = swaggerSpecs;
