const express = require("express");
const { listarProdutos } = require("./controllers/produtos");

const router = express();

router.get("/produtos", listarProdutos);

module.exports = { router };
