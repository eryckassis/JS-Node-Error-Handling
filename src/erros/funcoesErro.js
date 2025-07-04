function trataErros(erro) {
  if (erro && erro.code === "ENOENT") {
    return "Arquivo nao encontrado";
  } else {
    return "Erro na Aplicação";
  }
}

module.exports = trataErros;
