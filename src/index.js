const fs = require("fs");
const trataErros = require("./erros/funcoesErro");

const caminhoArquivo = process.argv;
const link = caminhoArquivo[2];

fs.readFile(link, "utf8", (erro, texto) => {
  if (erro) throw erro;
  try {
    contaPalavras(texto);
  } catch (erro) {
    console.log(trataErros(erro));
  }
});

function contaPalavras(texto) {
  const paragrafos = extraiParagrafos(texto);
  const contagem = paragrafos.flatMap((paragrafo) => {
    if (!paragrafo) return [];
    return verificaPalavraDuplicadas(paragrafo);
  });

  console.log(contagem);
}

function extraiParagrafos(texto) {
  return texto.toLowerCase().split("\n");
}

function limpaPalavras(palavra) {
  return palavra.replace(/[.,!?;:]/g, "");
}

function verificaPalavraDuplicadas(texto) {
  const listaPalavras = texto.split(" ");
  const resultado = {};
  // objeto[propiedade] = valor;
  listaPalavras.forEach((palavra) => {
    if (palavra.length >= 3) {
      const palavraLimpa = limpaPalavras(palavra);
      resultado[palavraLimpa] = (resultado[palavraLimpa] || 0) + 1;
    }
  });
  return resultado;
}
