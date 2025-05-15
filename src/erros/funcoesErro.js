function trataErros(erro) {
  if (erro.code === "ENOENT") {
    return "Arquivo nao encontrado";
  } else {
    return "Erro na Aplicação";
  }
}

module.exports = trataErros;
