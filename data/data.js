const fs = require("fs");

let produtos;

function lerProdutos() {
  try {
    produtos = JSON.parse(fs.readFileSync("./data/data.json").toString());
  } catch (error) {
    produtos = [
      {
        id: 1,
        nome: "Pipoca para Microondas Manteiga YOKI 50g",
        preco: 169,
        estoque: 6,
        categoria: "Bazar",
      },
      {
        id: 2,
        nome: "Cerveja BADEN BADEN American Ipa Puro Malte Garrafa 600ml",
        preco: 908,
        estoque: 0,
        categoria: "Bebidas",
      },
      {
        id: 3,
        nome: "Limpador Cif Multiuso 800g Em Pó",
        preco: 999,
        estoque: 7,
        categoria: "Limpeza",
      },
      {
        id: 4,
        nome: "Desinfetante Uso Geral Herbal Omo Frasco 500ml",
        preco: 529,
        estoque: 79,
        categoria: "Limpeza",
      },
      {
        id: 5,
        nome: "Biscoito BAUDUCCO Choco Biscuit Leite 80g",
        preco: 519,
        estoque: 1,
        categoria: "Bazar",
      },
      {
        id: 6,
        nome: "Café Solúvel NESCAFÉ Gold Intenso 100g",
        preco: 2079,
        estoque: 0,
        categoria: "Bazar",
      },
      {
        id: 7,
        nome: "Macarrão Italiano Capellini N°1 BARILLA 500g",
        preco: 859,
        estoque: 0,
        categoria: "Bazar",
      },
      {
        id: 8,
        nome: "Azeite Espanhol de Oliva Extra Virgem CARBONELL Vidro 500ml",
        preco: 2699,
        estoque: 0,
        categoria: "Azeite",
      },
      {
        id: 9,
        nome: "Arroz Parboilizado Tipo 1 CAMIL Pacote 5kg",
        preco: 2749,
        estoque: 9,
        categoria: "Bazar",
      },
      {
        id: 10,
        nome: "Feijão Carioca Tipo 1 CAMIL Pacote 1kg",
        preco: 799,
        estoque: 33,
        categoria: "Bazar",
      },
      {
        id: 11,
        nome: "Oléo de Canola QUALITÁ Pet 900ml",
        preco: 1199,
        estoque: 22,
        categoria: "Oleo",
      },
      {
        id: 12,
        nome: "Azeite Português de Oliva Extra Virgem CANDEEIRO Vidro 500ml",
        preco: 3399,
        estoque: 0,
        categoria: "Azeite",
      },
    ];
  }
  return produtos;
}

function salvarProdutos() {
  const json = JSON.stringify(produtos, null, 2);
  fs.writeFileSync("./data/data.json", json.toString());
}

module.exports = {
  lerProdutos,
  salvarProdutos,
};
