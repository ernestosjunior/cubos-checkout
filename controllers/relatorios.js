const { lerProdutos } = require("../data/data");
const { lerPedidos } = require("../data/pedido");

async function exibirRelatorio(req, res) {
  const pedidos = lerPedidos();

  res.status(200).json(pedidos);
}

module.exports = {
  exibirRelatorio,
};
