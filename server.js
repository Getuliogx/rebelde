const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();

function carregarLista() {
  const arquivo = path.join(__dirname, "rebelde.txt");

  if (!fs.existsSync(arquivo)) {
    console.error("Arquivo rebelde.txt não encontrado.");
    return [];
  }

  return fs
    .readFileSync(arquivo, "utf8")
    .split(/\r?\n/)
    .map(linha => linha.trim())
    .filter(linha => linha && !linha.startsWith("#"));
}

function sortearRebelde() {
  const lista = carregarLista();

  if (!lista.length) {
    return "A lista de Rebelde está vazia ou o arquivo rebelde.txt não foi encontrado.";
  }

  const linha = lista[Math.floor(Math.random() * lista.length)];
  const partes = linha.split("|");

  const nome = (partes[0] || "").trim();
  const descricao = partes.slice(1).join("|").trim();

  if (!nome) {
    return "Erro: personagem sem nome na lista.";
  }

  if (descricao) {
    return `Voce é: ${nome} — ${descricao}`;
  }

  return `Você é: ${nome}`;
}

app.get("/", (req, res) => {
  res.set("Cache-Control", "no-store");
  res.type("text/plain").send(sortearRebelde());
});

app.get("/rebelde", (req, res) => {
  res.set("Cache-Control", "no-store");
  res.type("text/plain").send(sortearRebelde());
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor Rebelde online na porta ${PORT}`);
});
