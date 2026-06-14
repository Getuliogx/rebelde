const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();

function carregarLista() {
  const arquivo = path.join(__dirname, "origens.txt");

  if (!fs.existsSync(arquivo)) {
    return [];
  }

  return fs
    .readFileSync(arquivo, "utf8")
    .split(/\r?\n/)
    .map(linha => linha.trim())
    .filter(linha => linha && !linha.startsWith("#"));
}

app.get("/", (req, res) => {
  res.type("text/plain").send("API !origem online");
});

app.get("/rebelde", (req, res) => {
  const arquivo = path.join(__dirname, "rebelde.txt");

  if (!fs.existsSync(arquivo)) {
    return res
      .type("text/plain")
      .send("A lista de Rebelde não foi encontrada.");
  }

  const lista = fs
    .readFileSync(arquivo, "utf8")
    .split(/\r?\n/)
    .map(linha => linha.trim())
    .filter(linha => linha && !linha.startsWith("#"));

  if (!lista.length) {
    return res
      .type("text/plain")
      .send("A lista de Rebelde está vazia.");
  }

  const linha = lista[Math.floor(Math.random() * lista.length)];
  const partes = linha.split("|");

  const nome = partes[0]?.trim();
  const descricao = partes.slice(1).join("|").trim();

  res.set("Cache-Control", "no-store");

  if (descricao) {
    return res
      .type("text/plain")
      .send(`Você é: ${nome} — ${descricao}`);
  }

  return res
    .type("text/plain")
    .send(`Você é: ${nome}`);
});