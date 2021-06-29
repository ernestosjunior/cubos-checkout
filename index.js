const express = require("express");

const { router } = require("./router");

const swaggerUi = require("swagger-ui-express");

const app = express();

app.use(express.json());

app.use(router);

app.use("/docs", swaggerUi.serve, swaggerUi.setup(require("./swagger.json")));

app.listen(process.env.PORT || 8000);
