const express = require("express");

const { router } = require("./router");

const swaggerUi = require("swagger-ui-express");

const app = express();

app.use(express.json());

app.use(router);

app.use("/docs", swaggerUi.serve, swaggerUi.setup(require("./swagger.json")));

app.listen(8000);
