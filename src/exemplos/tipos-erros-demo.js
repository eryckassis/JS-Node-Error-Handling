/**
 * Exemplos práticos dos tipos de erros padrões do Node.js
 * Este arquivo demonstra como cada tipo de erro é lançado e capturado
 */

const fs = require('fs');

console.log('=== Demonstração de Tipos de Erros Node.js ===\n');

// 1. Error - Erro genérico
console.log('1. Error - Erro genérico:');
try {
  throw new Error('Este é um erro genérico');
} catch (erro) {
  console.log(`   ${erro.name}: ${erro.message}\n`);
}

// 2. TypeError - Erro de tipo
console.log('2. TypeError - Erro de tipo:');
try {
  const numero = 42;
  numero(); // Tentando chamar um número como função
} catch (erro) {
  console.log(`   ${erro.name}: ${erro.message}\n`);
}

// 3. RangeError - Erro de intervalo
console.log('3. RangeError - Erro de intervalo:');
try {
  const arr = new Array(-5); // Tamanho inválido
} catch (erro) {
  console.log(`   ${erro.name}: ${erro.message}\n`);
}

// 4. ReferenceError - Erro de referência
console.log('4. ReferenceError - Erro de referência:');
try {
  console.log(variravelInexistente); // Variável não declarada
} catch (erro) {
  console.log(`   ${erro.name}: ${erro.message}\n`);
}

// 5. SyntaxError - Erro de sintaxe
console.log('5. SyntaxError - Erro de sintaxe:');
try {
  JSON.parse('{"nome": "João", "idade": 30,}'); // JSON malformado
} catch (erro) {
  console.log(`   ${erro.name}: ${erro.message}\n`);
}

// 6. URIError - Erro de URI
console.log('6. URIError - Erro de URI:');
try {
  decodeURI('%E0%A4%A'); // URI malformada
} catch (erro) {
  console.log(`   ${erro.name}: ${erro.message}\n`);
}

// 7. Erro de sistema - ENOENT
console.log('7. Erro de sistema - ENOENT:');
fs.readFile('arquivo-inexistente.txt', 'utf8', (erro, dados) => {
  if (erro) {
    console.log(`   Código: ${erro.code}`);
    console.log(`   Mensagem: ${erro.message}`);
    console.log(`   Caminho: ${erro.path}\n`);
  }
});

// 8. Exemplo de tratamento robusto
console.log('8. Exemplo de tratamento robusto:');
function exemploTratamento() {
  try {
    // Simula diferentes tipos de erros
    const tipoErro = Math.floor(Math.random() * 3);
    
    switch (tipoErro) {
      case 0:
        throw new TypeError('Tipo incorreto');
      case 1:
        throw new RangeError('Valor fora do intervalo');
      default:
        throw new Error('Erro genérico');
    }
  } catch (erro) {
    if (erro instanceof TypeError) {
      console.log(`   Tratamento especial para TypeError: ${erro.message}`);
    } else if (erro instanceof RangeError) {
      console.log(`   Tratamento especial para RangeError: ${erro.message}`);
    } else {
      console.log(`   Tratamento genérico: ${erro.message}`);
    }
  }
}

exemploTratamento();

console.log('\n=== Demonstração concluída ===');
console.log('Veja docs/tipos-erros-nodejs.md para documentação completa');