const express = require("express");
const { listarTodosProdutos } = require("./controllers/produtos");

const router = express();

router.get("/produtos", listarTodosProdutos);

module.exports = { router };
