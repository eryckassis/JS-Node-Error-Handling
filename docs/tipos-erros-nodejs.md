# Tipos de Erros Padrões do Node.js

Este documento explica os principais tipos de erros padrões lançados pelo Node.js, incluindo exemplos práticos de quando cada um é utilizado.

## Índice

1. [Error - Erro Base](#error---erro-base)
2. [TypeError - Erro de Tipo](#typeerror---erro-de-tipo)
3. [RangeError - Erro de Intervalo](#rangeerror---erro-de-intervalo)
4. [ReferenceError - Erro de Referência](#referenceerror---erro-de-referência)
5. [SyntaxError - Erro de Sintaxe](#syntaxerror---erro-de-sintaxe)
6. [URIError - Erro de URI](#urierror---erro-de-uri)
7. [EvalError - Erro de Eval](#evalerror---erro-de-eval)
8. [Erros de Sistema](#erros-de-sistema)

---

## Error - Erro Base

O `Error` é a classe base para todos os erros em JavaScript/Node.js. Todos os outros tipos de erro herdam desta classe.

### Características:
- **Propriedade `name`**: Nome do erro ("Error")
- **Propriedade `message`**: Mensagem descritiva do erro
- **Propriedade `stack`**: Stack trace do erro

### Exemplo básico:

```javascript
// Criando um erro personalizado
const erro = new Error("Algo deu errado!");
console.log(erro.name);    // "Error"
console.log(erro.message); // "Algo deu errado!"

// Lançando um erro
function operacaoRiscos() {
  throw new Error("Operação falhou devido a condições inesperadas");
}

try {
  operacaoRiscos();
} catch (erro) {
  console.log(`Erro capturado: ${erro.message}`);
}
```

### Quando usar:
- Erros genéricos em aplicações
- Criação de erros personalizados
- Quando nenhum outro tipo de erro específico se aplica

---

## TypeError - Erro de Tipo

O `TypeError` é lançado quando uma operação não pode ser realizada devido a um tipo de dados incorreto.

### Exemplos comuns:

```javascript
// Tentando chamar uma função em um valor que não é uma função
const numero = 42;
try {
  numero(); // TypeError: numero is not a function
} catch (erro) {
  console.log(erro.name); // "TypeError"
}

// Tentando acessar propriedades de null ou undefined
const obj = null;
try {
  obj.propriedade; // TypeError: Cannot read properties of null
} catch (erro) {
  console.log(erro.message);
}

// Tentando usar métodos em tipos incorretos
const str = "123";
try {
  str.push("4"); // TypeError: str.push is not a function
} catch (erro) {
  console.log(erro.name); // "TypeError"
}
```

### Quando ocorre:
- Chamada de função em valores não-função
- Acesso a propriedades de `null` ou `undefined`
- Uso de métodos em tipos incorretos
- Operações matemáticas com tipos incompatíveis

---

## RangeError - Erro de Intervalo

O `RangeError` é lançado quando um valor numérico está fora do intervalo permitido.

### Exemplos:

```javascript
// Array com tamanho inválido
try {
  const arr = new Array(-1); // RangeError: Invalid array length
} catch (erro) {
  console.log(erro.name); // "RangeError"
}

// Número com precisão inválida
try {
  const num = 123.456;
  num.toFixed(-1); // RangeError: toFixed() digits argument must be between 0 and 100
} catch (erro) {
  console.log(erro.message);
}

// Recursão infinita (estouro de pilha)
function recursaoInfinita() {
  return recursaoInfinita(); // RangeError: Maximum call stack size exceeded
}

try {
  recursaoInfinita();
} catch (erro) {
  console.log(erro.name); // "RangeError"
}
```

### Quando ocorre:
- Valores numéricos fora do intervalo permitido
- Tamanhos de array inválidos
- Parâmetros de métodos fora do intervalo esperado
- Estouro de pilha (stack overflow)

---

## ReferenceError - Erro de Referência

O `ReferenceError` é lançado quando se tenta acessar uma variável que não foi declarada.

### Exemplos:

```javascript
// Variável não declarada
try {
  console.log(variravelNaoDeclarada); // ReferenceError: variravelNaoDeclarada is not defined
} catch (erro) {
  console.log(erro.name); // "ReferenceError"
}

// Tentando atribuir a uma variável const já declarada
try {
  const CONSTANTE = 10;
  CONSTANTE = 20; // TypeError na verdade, mas relacionado a referências
} catch (erro) {
  console.log(erro.name);
}

// Usando 'this' em contexto inadequado (modo estrito)
function exemploThis() {
  'use strict';
  console.log(this.propriedade); // ReferenceError em modo estrito
}
```

### Quando ocorre:
- Acesso a variáveis não declaradas
- Uso de variáveis antes da declaração (hoisting)
- Problemas com escopo de variáveis
- Referências inválidas em modo estrito

---

## SyntaxError - Erro de Sintaxe

O `SyntaxError` é lançado quando há um erro na sintaxe do código JavaScript.

### Exemplos:

```javascript
// JSON malformado
try {
  JSON.parse('{"nome": "João", "idade": 30,}'); // SyntaxError: Unexpected token }
} catch (erro) {
  console.log(erro.name); // "SyntaxError"
}

// Código JavaScript com sintaxe inválida
try {
  eval('const x = ;'); // SyntaxError: Unexpected token ';'
} catch (erro) {
  console.log(erro.message);
}

// Parênteses não fechados
try {
  eval('function teste() { console.log("oi"'); // SyntaxError: Unexpected end of input
} catch (erro) {
  console.log(erro.name); // "SyntaxError"
}
```

### Quando ocorre:
- Código com sintaxe JavaScript inválida
- JSON malformado
- Uso de `eval()` com código inválido
- Problemas de parsing em arquivos JavaScript

---

## URIError - Erro de URI

O `URIError` é lançado quando as funções globais de manipulação de URI são usadas de forma incorreta.

### Exemplos:

```javascript
// URI malformada
try {
  decodeURI('%E0%A4%A'); // URIError: URI malformed
} catch (erro) {
  console.log(erro.name); // "URIError"
}

// Sequência de escape inválida
try {
  decodeURIComponent('%E0%A4%A'); // URIError: URI malformed
} catch (erro) {
  console.log(erro.message);
}

// Exemplo de uso correto
const uriCorreta = encodeURI('https://exemplo.com/busca?q=node.js');
console.log(uriCorreta); // https://exemplo.com/busca?q=node.js
```

### Quando ocorre:
- Uso de `decodeURI()` ou `decodeURIComponent()` com strings malformadas
- Sequências de escape inválidas em URIs
- Problemas com codificação/decodificação de URLs

---

## EvalError - Erro de Eval

O `EvalError` era usado para erros relacionados ao `eval()`, mas está **depreciado** e raramente é usado nas versões modernas do JavaScript.

### Nota histórica:

```javascript
// EvalError não é mais lançado nativamente
// Mantido apenas para compatibilidade
const erro = new EvalError("Erro relacionado ao eval");
console.log(erro.name); // "EvalError"
```

### Status atual:
- **Depreciado**: Não é mais usado nas versões modernas
- **Compatibilidade**: Mantido apenas para código legado
- **Alternativa**: Use `Error` ou `SyntaxError` conforme apropriado

---

## Erros de Sistema

Os erros de sistema são específicos do Node.js e representam erros do sistema operacional.

### Códigos de erro comuns:

#### ENOENT - Arquivo ou diretório não encontrado

```javascript
const fs = require('fs');

fs.readFile('arquivo-inexistente.txt', 'utf8', (erro, dados) => {
  if (erro) {
    console.log(erro.code);    // 'ENOENT'
    console.log(erro.errno);   // -2
    console.log(erro.syscall); // 'open'
    console.log(erro.path);    // 'arquivo-inexistente.txt'
  }
});
```

#### EACCES - Permissão negada

```javascript
const fs = require('fs');

// Tentando acessar arquivo sem permissão
fs.readFile('/root/arquivo-protegido.txt', 'utf8', (erro, dados) => {
  if (erro && erro.code === 'EACCES') {
    console.log('Permissão negada para acessar o arquivo');
  }
});
```

#### EADDRINUSE - Endereço já em uso

```javascript
const http = require('http');

const servidor1 = http.createServer().listen(3000);
const servidor2 = http.createServer();

servidor2.listen(3000, (erro) => {
  if (erro && erro.code === 'EADDRINUSE') {
    console.log('Porta 3000 já está em uso');
  }
});
```

#### ECONNREFUSED - Conexão recusada

```javascript
const http = require('http');

const req = http.request('http://localhost:9999', (res) => {
  console.log('Conexão bem-sucedida');
});

req.on('error', (erro) => {
  if (erro.code === 'ECONNREFUSED') {
    console.log('Conexão recusada pelo servidor');
  }
});

req.end();
```

### Tratamento de erros de sistema:

```javascript
const fs = require('fs');

function lerArquivo(caminho) {
  return new Promise((resolve, reject) => {
    fs.readFile(caminho, 'utf8', (erro, dados) => {
      if (erro) {
        switch (erro.code) {
          case 'ENOENT':
            reject(new Error(`Arquivo não encontrado: ${caminho}`));
            break;
          case 'EACCES':
            reject(new Error(`Permissão negada para: ${caminho}`));
            break;
          case 'EISDIR':
            reject(new Error(`Caminho é um diretório: ${caminho}`));
            break;
          default:
            reject(new Error(`Erro desconhecido: ${erro.message}`));
        }
      } else {
        resolve(dados);
      }
    });
  });
}

// Uso da função
lerArquivo('exemplo.txt')
  .then(conteudo => console.log(conteudo))
  .catch(erro => console.error(erro.message));
```

### Códigos de erro de sistema mais comuns:

| Código | Significado | Descrição |
|--------|-------------|-----------|
| `ENOENT` | No such file or directory | Arquivo ou diretório não encontrado |
| `EACCES` | Permission denied | Permissão negada |
| `EADDRINUSE` | Address already in use | Endereço/porta já em uso |
| `ECONNREFUSED` | Connection refused | Conexão recusada |
| `ENOTDIR` | Not a directory | Não é um diretório |
| `EISDIR` | Is a directory | É um diretório |
| `EMFILE` | Too many open files | Muitos arquivos abertos |
| `ENOSPC` | No space left on device | Sem espaço no dispositivo |

---

## Boas Práticas

### 1. Tratamento específico de erros

```javascript
function processarDados(dados) {
  try {
    // Código que pode falhar
    return JSON.parse(dados);
  } catch (erro) {
    if (erro instanceof SyntaxError) {
      throw new Error('Dados JSON inválidos');
    } else if (erro instanceof TypeError) {
      throw new Error('Tipo de dados incorreto');
    } else {
      throw erro; // Re-lança outros erros
    }
  }
}
```

### 2. Verificação de tipo de erro

```javascript
function tratarErro(erro) {
  if (erro instanceof TypeError) {
    console.log('Erro de tipo:', erro.message);
  } else if (erro instanceof RangeError) {
    console.log('Erro de intervalo:', erro.message);
  } else if (erro instanceof ReferenceError) {
    console.log('Erro de referência:', erro.message);
  } else {
    console.log('Erro genérico:', erro.message);
  }
}
```

### 3. Criação de erros personalizados

```javascript
class ErroPersonalizado extends Error {
  constructor(message, codigo) {
    super(message);
    this.name = 'ErroPersonalizado';
    this.codigo = codigo;
  }
}

// Uso
function operacaoEspecial() {
  throw new ErroPersonalizado('Operação especial falhou', 'OP001');
}

try {
  operacaoEspecial();
} catch (erro) {
  if (erro instanceof ErroPersonalizado) {
    console.log(`Erro personalizado: ${erro.message} (${erro.codigo})`);
  }
}
```

---

## Conclusão

Compreender os diferentes tipos de erros em Node.js é fundamental para:

- **Debugging eficaz**: Identificar rapidamente a causa do problema
- **Tratamento adequado**: Aplicar a estratégia correta para cada tipo de erro
- **Experiência do usuário**: Fornecer mensagens de erro úteis
- **Robustez da aplicação**: Construir aplicações mais resilientes

Lembre-se sempre de:
- Tratar erros de forma específica quando possível
- Fornecer mensagens de erro claras e úteis
- Loggar informações suficientes para debugging
- Não ignorar erros silenciosamente
- Usar try/catch adequadamente para código síncrono
- Usar Promise.catch() ou async/await com try/catch para código assíncrono

Este conhecimento ajudará você a construir aplicações Node.js mais robustas e confiáveis.