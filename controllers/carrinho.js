const { addBusinessDays } = require("date-fns");
const fs = require("fs");
const { salvarCarrinho, lerCarrinho } = require("../data/carrinho");
const { lerProdutos } = require("../data/data");

const produtos = lerProdutos();

async function exibirCarrinho(req, res) {
  res.status(200).json(lerCarrinho());
}

async function adicionarProdutos(req, res) {
  const { id, quantidade } = req.body;

  const carrinho = lerCarrinho();

  const produto = produtos.find((produto) => produto.id === id);

  const produtoNoCarrinho = carrinho.produtos.find(
    (produto) => produto.id === id
  );

  if (!produto) {
    res.status(400).json({
      sucesso: false,
      error: "Produto não encontrado.",
    });
    return;
  }

  if (!produtoNoCarrinho) {
    const estoqueDoProduto = produto.estoque;
    if (quantidade > estoqueDoProduto) {
      res.status(400).json({
        sucesso: false,
        mensagem: "O estoque do produto é insuficiente.",
      });
      return;
    }

    carrinho.produtos.push({
      id: produto.id,
      quantidade: quantidade,
      nome: produto.nome,
      preco: produto.preco,
      categoria: produto.categoria,
    });

    let subtotais = 0;
    for (let item of carrinho.produtos) {
      subtotais += item.quantidade * item.preco;
    }
    carrinho.subtotal = subtotais;
    carrinho.dataDeEntrega = addBusinessDays(Date.now(), 15);
    carrinho.valorDoFrete = carrinho.subtotal <= 20000 ? 5000 : 0;
    carrinho.totalAPagar = carrinho.subtotal + carrinho.valorDoFrete;

    salvarCarrinho();

    res.status(200).json(carrinho);
  } else {
    const indice = carrinho.produtos.indexOf(produtoNoCarrinho);

    const quantidadeProdNecessaria =
      carrinho.produtos[indice].quantidade + quantidade;
    if (quantidadeProdNecessaria > produto.estoque) {
      res.status(400).json({
        sucesso: false,
        mensagem: "O estoque do produto é insuficiente.",
      });
      return;
    }

    carrinho.produtos[indice].quantidade += quantidade;
    let subtotais = 0;
    for (let item of carrinho.produtos) {
      subtotais += item.quantidade * item.preco;
    }
    carrinho.subtotal = subtotais;
    carrinho.valorDoFrete = carrinho.subtotal <= 20000 ? 5000 : 0;
    carrinho.totalAPagar = carrinho.subtotal + carrinho.valorDoFrete;

    salvarCarrinho();
    res.status(200).json(carrinho);
  }
}
// correcoes necessarias
// quando recece positivo e negativo
async function atualizarCarrinho(req, res) {
  const { idProduto } = req.params;
  const { quantidade } = req.body;

  const carrinho = lerCarrinho();

  const produto = produtos.find((produto) => produto.id === Number(idProduto));

  console.log();
  const produtoNoCarrinho = carrinho.produtos.find(
    (produto) => produto.id === Number(idProduto)
  );

  if (!produtoNoCarrinho) {
    res.status(400).json({
      sucesso: false,
      error: "O produto informado não está no carrinho.",
    });
    return;
  }

  if (quantidade > 0) {
    const indice = carrinho.produtos.indexOf(produtoNoCarrinho);
    const quantidadeProdNecessaria =
      carrinho.produtos[indice].quantidade + quantidade;

    if (quantidadeProdNecessaria > produto.estoque) {
      res.status(400).json({
        sucesso: false,
        mensagem: "O estoque do produto é insuficiente.",
      });
      return;
    }

    carrinho.produtos[indice].quantidade += quantidade;

    let subtotais = 0;
    for (let item of carrinho.produtos) {
      subtotais += item.quantidade * item.preco;
    }
    carrinho.subtotal = subtotais;
    carrinho.dataDeEntrega = addBusinessDays(Date.now(), 15);
    carrinho.valorDoFrete = carrinho.subtotal <= 20000 ? 5000 : 0;
    carrinho.totalAPagar = carrinho.subtotal + carrinho.valorDoFrete;

    salvarCarrinho();
    res.status(200).json(carrinho);
    return;
  }

  if (quantidade < 0) {
    const indice = carrinho.produtos.indexOf(produtoNoCarrinho);
    const quantidadeProd = carrinho.produtos[indice].quantidade + quantidade;
    console.log(quantidadeProd);
    if (quantidadeProd <= 0) {
      res.status(400).json({
        sucesso: false,
        mensagem:
          "A quantidade do produto não pode ser negativa. Se desejar, poderá remover o item.",
      });
      return;
    }
    carrinho.produtos[indice].quantidade = quantidadeProd;

    let subtotais = 0;
    for (let item of carrinho.produtos) {
      subtotais += item.quantidade * item.preco;
    }
    carrinho.subtotal = subtotais;
    carrinho.dataDeEntrega = addBusinessDays(Date.now(), 15);
    carrinho.valorDoFrete = carrinho.subtotal <= 20000 ? 5000 : 0;
    carrinho.totalAPagar = carrinho.subtotal + carrinho.valorDoFrete;

    salvarCarrinho();

    res.status(200).json(carrinho);
    return;
  }
}

async function deletarProduto(req, res) {
  const idProduto = Number(req.params.idProduto);

  const carrinho = lerCarrinho();

  const produtoNoCarrinho = carrinho.produtos.find(
    (produto) => produto.id === idProduto
  );

  if (!produtoNoCarrinho) {
    res.status(400).json({
      sucesso: false,
      mensagem: "Produto não está no carrinho.",
    });
    return;
  }

  const indice = carrinho.produtos.indexOf(produtoNoCarrinho);
  carrinho.produtos.splice(indice, 1);

  let subtotais = 0;
  for (let item of carrinho.produtos) {
    subtotais += item.quantidade * item.preco;
  }

  carrinho.subtotal = subtotais;
  carrinho.dataDeEntrega =
    carrinho.produtos !== [] ? null : carrinho.dataDeEntrega;
  carrinho.valorDoFrete =
    carrinho.produtos !== [] ? 0 : carrinho.subtotal <= 20000 ? 5000 : 0;
  carrinho.totalAPagar = carrinho.subtotal + carrinho.valorDoFrete;

  salvarCarrinho();
  res.status(200).json(carrinho);
}

async function limparCarrinho(req, res) {
  const carrinho = lerCarrinho();

  carrinho.subtotal = 0;
  carrinho.dataDeEntrega = null;
  carrinho.valorDoFrete = 0;
  carrinho.totalAPagar = 0;
  carrinho.produtos = [];

  salvarCarrinho();
  res.status(200).json({
    sucesso: true,
    mensagem: "Todos os produtos foram removidos do carrinho.",
  });
}

module.exports = {
  exibirCarrinho,
  adicionarProdutos,
  atualizarCarrinho,
  deletarProduto,
  limparCarrinho,
};
