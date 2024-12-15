// generate-swagger.js
const swaggerAutogen = require("swagger-autogen")();

const outputFile = "./swagger-output.json";
const endpointsFiles = ["./api/routes/*.js"];

swaggerAutogen(outputFile, endpointsFiles)
  .then(() => {
    console.log("Swagger documentation generated!");
  })
  .catch((error) => {
    console.error("Error generating Swagger docs:", error);
  });
