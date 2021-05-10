const carrinho = [];

async function exibirCarrinho(req, res) {
  const subtotal = carrinho.reduce((total, item) => total + item);
  res.status(200).json({
    produtos: carrinho,
    subtotal: subtotal,
    dataDeEntrega: 
  });
}
