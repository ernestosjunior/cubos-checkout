const fs = require("fs");

let pedidos;

function lerPedidos() {
  try {
    pedidos = JSON.parse(fs.readFileSync("./data/pedidos.json").toString());
  } catch (error) {
    pedidos = [{}];
  }
  return pedidos;
}

function salvarPedidos() {
  const json = JSON.stringify(pedidos, null, 2);
  fs.writeFileSync("./data/pedidos.json", json.toString());
}

module.exports = {
  lerPedidos,
  salvarPedidos,
};
