const fs = require("fs");

const produtos = JSON.parse(fs.readFileSync("./data/data.json").toString());

async function listarTodosProdutos(req, res) {
  res.status(200).json(produtos);
}

module.exports = {
  listarTodosProdutos,
};
