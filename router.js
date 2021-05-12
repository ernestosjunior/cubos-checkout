const express = require("express");
const {
  exibirCarrinho,
  adicionarProdutos,
  atualizarCarrinho,
  deletarProduto,
  limparCarrinho,
} = require("./controllers/carrinho");
const { finalizarCompra } = require("./controllers/finalizar-compra");
const { listarProdutos } = require("./controllers/produtos");

const router = express();

// ROTAS PRODUTOS
router.get("/produtos", listarProdutos);

router.get("/carrinho", exibirCarrinho);

//ROTAS CARRINHO
router.post("/carrinho/produtos", adicionarProdutos);

router.patch("/carrinho/produtos/:idProduto", atualizarCarrinho);

router.delete("/carrinho/produtos/:idProduto", deletarProduto);

router.delete("/carrinho", limparCarrinho);

//ROTAS FINALIZAR COMPRA
router.post("/finalizar-compra", finalizarCompra);

module.exports = { router };
