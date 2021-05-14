const { lerCarrinho, limparCarrinho } = require("../data/carrinho");
const { lerProdutos, salvarProdutos } = require("../data/data");

const instanciaAxios = require("../servicos/pagarme");

const { format, addBusinessDays } = require("date-fns");
const ptBR = require("date-fns/locale/pt-BR");
const { salvarPedidos, lerPedidos } = require("../data/pedido");

async function finalizarCompra(req, res) {
  const { body } = req;

  const produtos = lerProdutos();
  const carrinho = lerCarrinho();

  if (!carrinho.produtos.length) {
    res.status(400).json({
      sucesso: false,
      error: "O carrinho está vazio.",
    });
    return;
  }

  let faltaEstoque = false;
  faltaEstoque = carrinho.produtos.some(
    (produto) => produto.quantidade > produtos.estoque
  );

  if (faltaEstoque) {
    res.status(400).json({
      sucesso: false,
      error: "O carrinho contém produtos sem estoque.",
    });
    return;
  }

  if (body.customer.type !== "individual" || !body.customer.type) {
    res.status(400).json({
      sucesso: false,
      mensagem: "No momento realizamos vendas apenas para pessoas físicas.",
    });
    return;
  }

  if (body.customer.country.length > 2 || !body.customer.country) {
    res.status(400).json({
      sucesso: false,
      mensagem: "Country deve possuir apenas dois caracteres.",
    });
    return;
  }

  if (!body.customer.name.trim().includes(" ") || !body.customer.name) {
    res.status(400).json({
      sucesso: false,
      mensagem: "Você deve informar ao menos nome e sobrenome.",
    });
    return;
  }

  if (
    body.customer.documents[0].number.length > 11 ||
    isNaN(body.customer.documents[0].number)
  ) {
    res.status(400).json({
      sucesso: false,
      mensagem:
        "O CPF não pode ser menor que 11 digitos e deve possuir apenas números.",
    });
    return;
  }
  const date = new Date();
  const dataExpiracao = addBusinessDays(date, 3);
  const dExpiracaoFormato = format(dataExpiracao, "yyyy-MM-dd", {
    locale: ptBR,
  });

  const corpoDaTransação = {
    amount: carrinho.totalAPagar,
    payment_method: "boleto",
    boleto_expiration_date: dExpiracaoFormato,
    customer: {
      type: body.customer.type,
      country: body.customer.country,
      name: body.customer.name,
      documents: [
        {
          type: body.customer.documents[0].type,
          number: body.customer.documents[0].number,
        },
      ],
    },
  };

  try {
    const pagamento = await instanciaAxios.post(
      "transactions",
      corpoDaTransação
    );
    const produtos = lerProdutos();
    for (let item of carrinho.produtos) {
      const produtoDoEstoque = produtos.find(
        (produto) => produto.id === item.id
      );
      const indice = produtos.indexOf(produtoDoEstoque);
      produtos[indice].estoque = produtoDoEstoque.estoque - item.quantidade;
      salvarProdutos();
    }

    const pedidos = lerPedidos();
    pedidos.push({
      id: pagamento.data.id,
      dataDaVenda: date,
      produtos: carrinho.produtos,
      valorDaVenda: carrinho.totalAPagar,
      boleto: pagamento.data.boleto_url,
    });
    salvarPedidos();

    const dadosTransação = {
      sucesso: true,
      mensagem:
        "Compra finalizada. Seguem os dados da transação e o link para pagamento do boleto.",
      itens: carrinho.produtos,
      subtotal: carrinho.subtotal,
      frete: carrinho.valorDoFrete,
      dataDeEntrega: addBusinessDays(date, 15),
      totalAPagar: carrinho.totalAPagar,
      boleto: pagamento.data.boleto_url,
    };

    limparCarrinho();

    res.status(200).json(dadosTransação);
  } catch (error) {
    res.status(400).json({
      sucesso: false,
      mensagem: "Erro ao processar pagamento.",
      error: error,
    });
  }
}

module.exports = {
  finalizarCompra,
};
