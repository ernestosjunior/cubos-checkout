const fs = require("fs");

let carrinho;

function lerCarrinho() {
  try {
    carrinho = JSON.parse(fs.readFileSync("./data/carrinho.json").toString());
  } catch (error) {
    carrinho = {
      subtotal: 0,
      dataDeEntrega: null,
      valorDoFrete: 0,
      totalAPagar: 0,
      produtos: [],
    };
  }
  return carrinho;
}

function limparCarrinho() {
  let carrinho = {
    subtotal: 0,
    dataDeEntrega: null,
    valorDoFrete: 0,
    totalAPagar: 0,
    produtos: [],
  };
  const json = JSON.stringify(carrinho, null, 2);
  fs.writeFileSync("./data/carrinho.json", json.toString());
}

function salvarCarrinho() {
  const json = JSON.stringify(carrinho, null, 2);
  fs.writeFileSync("./data/carrinho.json", json.toString());
}

module.exports = {
  lerCarrinho,
  salvarCarrinho,
  limparCarrinho,
};
