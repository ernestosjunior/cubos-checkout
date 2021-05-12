const fs = require("fs");
const { lerProdutos } = require("../data/data");

const produtos = lerProdutos();

async function listarProdutos(req, res) {
  const { categoria, precoInicial, precoFinal } = req.query;

  if (categoria && precoInicial && precoFinal) {
    const produtosFiltrados = produtos.filter(
      (produto) =>
        produto.categoria === categoria &&
        produto.preco >= Number(precoInicial) &&
        produto.preco <= Number(precoFinal) &&
        produto.estoque > 0
    );
    if (!produtosFiltrados.length) {
      res.status(400).json({
        sucesso: false,
        erro: "Não há produtos com esta faixa de valor na categoria informada.",
      });
      return;
    }
    res.status(200).json(produtosFiltrados);
    return;
  }

  if (categoria) {
    const produtosCategoria = produtos.filter(
      (produto) => produto.categoria === categoria && produto.estoque > 0
    );

    if (!produtosCategoria.length) {
      res.status(400).json({
        sucesso: false,
        erro: "Categoria não encontrada.",
      });
      return;
    }
    res.status(200).json(produtosCategoria);
    return;
  }

  if (precoInicial && precoFinal) {
    const produtosPreco = produtos.filter(
      (produto) =>
        produto.preco >= Number(precoInicial) &&
        produto.preco <= Number(precoFinal) &&
        produto.estoque > 0
    );
    if (!produtosPreco.length) {
      res.status(400).json({
        sucesso: false,
        erro: "Não há produtos com esta faixa de valor.",
      });
      return;
    }
    res.status(200).json(produtosPreco);
    return;
  }

  const produtosNoEstoque = produtos.filter((produto) => produto.estoque > 0);
  res.status(200).send(produtosNoEstoque);
}

module.exports = {
  listarProdutos,
};
