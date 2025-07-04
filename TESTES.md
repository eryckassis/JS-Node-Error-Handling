# Documentação de Testes Automatizados para Cenários de Erro

Este documento descreve os testes automatizados implementados para validar cenários de erro no sistema de tratamento de erros em JavaScript/Node.js.

## Estrutura dos Testes

### 1. Testes de Unidade (`tests/funcoesErro.test.js`)

Testa a função `trataErros` que é responsável por tratar diferentes tipos de erros:

#### Cenários de Erro ENOENT (Arquivo não encontrado)
- **Teste:** Retorna mensagem específica para erro ENOENT
- **Objetivo:** Verificar se arquivos inexistentes são tratados corretamente
- **Exemplo:** `{ code: 'ENOENT', path: '/arquivo/inexistente.txt' }`

#### Cenários de Erro Genéricos
- **Teste:** Retorna mensagem genérica para outros tipos de erro
- **Tipos testados:** EACCES, EMFILE, EISDIR, e erros sem código
- **Objetivo:** Garantir que todos os erros não-ENOENT sejam tratados uniformemente

#### Casos Extremos
- **Teste:** Trata objetos de erro vazios, nulos ou indefinidos
- **Objetivo:** Garantir robustez da função de tratamento de erros

### 2. Testes de Funções da Aplicação (`tests/application.test.js`)

Testa as funções individuais do sistema de contagem de palavras:

#### Função `extraiParagrafos`
- **Cenários testados:**
  - Texto vazio
  - Valores nulos/indefinidos
  - Texto apenas com quebras de linha
- **Objetivo:** Verificar extração correta de parágrafos

#### Função `limpaPalavras`
- **Cenários testados:**
  - Strings vazias
  - Valores nulos/indefinidos
  - Strings apenas com pontuação
  - Palavras com pontuação mista
- **Objetivo:** Garantir limpeza adequada de pontuação

#### Função `verificaPalavraDuplicadas`
- **Cenários testados:**
  - Texto vazio
  - Valores nulos/indefinidos
  - Palavras com menos de 3 caracteres
  - Contagem com pontuação
- **Objetivo:** Verificar contagem correta de palavras

#### Simulação de Erros do Sistema de Arquivos
- **Tipos simulados:**
  - ENOENT (arquivo não encontrado)
  - EACCES (permissão negada)
  - EMFILE (muitos arquivos abertos)
  - TypeError, RangeError, ReferenceError
- **Objetivo:** Testar tratamento de diferentes tipos de erro

### 3. Testes de Integração (`tests/integration.test.js`)

Testa o sistema completo através da execução da aplicação:

#### Cenários de Arquivo Não Encontrado
- **Testes:**
  - Arquivos inexistentes
  - Extensões incorretas
  - Caminhos com caracteres inválidos
- **Resultado esperado:** "Arquivo nao encontrado"

#### Cenários de Permissão e Acesso
- **Testes:**
  - Tentativa de ler diretório como arquivo
  - Arquivos com permissões restritivas
- **Resultado esperado:** Mensagem de erro apropriada

#### Processamento Bem-sucedido
- **Testes:**
  - Arquivos de texto válidos
  - Arquivos vazios
  - Arquivos com caracteres especiais
- **Objetivo:** Verificar processamento correto

#### Erros de Argumentos de Linha de Comando
- **Testes:**
  - Ausência de argumentos
  - Múltiplos argumentos
- **Objetivo:** Garantir tratamento robusto de entrada

## Como Executar os Testes

### Executar Todos os Testes
```bash
npm test
```

### Executar Testes em Modo de Observação
```bash
npm run test:watch
```

### Executar Testes com Cobertura
```bash
npm run test:coverage
```

### Executar Testes Específicos
```bash
# Apenas testes de unidade
npm test -- tests/funcoesErro.test.js

# Apenas testes de aplicação
npm test -- tests/application.test.js

# Apenas testes de integração
npm test -- tests/integration.test.js
```

## Estratégias de Teste de Erro

### 1. Simulação de Erros
Os testes simulam erros reais que podem ocorrer no sistema:

```javascript
// Exemplo de simulação de erro ENOENT
const mockError = {
  code: 'ENOENT',
  errno: -2,
  syscall: 'open',
  path: '/arquivo/inexistente.txt'
};
```

### 2. Teste de Casos Extremos
Testam situações limite que podem quebrar o sistema:

```javascript
// Teste com valores nulos/indefinidos
expect(() => funcao(null)).toThrow();
expect(() => funcao(undefined)).toThrow();
```

### 3. Teste de Integração Completa
Testam o sistema como um todo através da execução real:

```javascript
// Execução da aplicação com arquivo inexistente
const output = execSync(`node src/index.js arquivo-inexistente.txt`);
expect(output.trim()).toBe('Arquivo nao encontrado');
```

## Cobertura de Testes

Os testes cobrem:
- ✅ Funções de tratamento de erro
- ✅ Funções de processamento de texto
- ✅ Cenários de erro do sistema de arquivos
- ✅ Casos extremos e valores inválidos
- ✅ Integração completa da aplicação

## Exemplos de Cenários de Teste

### Cenário 1: Arquivo Não Encontrado
```bash
# Comando
node src/index.js arquivo-que-nao-existe.txt

# Resultado esperado
Arquivo nao encontrado
```

### Cenário 2: Arquivo Válido
```bash
# Comando
node src/index.js arquivos/texto-web.txt

# Resultado esperado
[Array com contagem de palavras]
```

### Cenário 3: Sem Argumentos
```bash
# Comando
node src/index.js

# Resultado esperado
Arquivo nao encontrado
```

## Melhores Práticas Implementadas

1. **Separação de Responsabilidades:** Testes unitários, de integração e de aplicação
2. **Casos Extremos:** Teste com valores nulos, indefinidos e vazios
3. **Simulação Realista:** Erros simulados baseados em cenários reais
4. **Cobertura Abrangente:** Todos os caminhos de erro são testados
5. **Documentação Clara:** Cada teste tem objetivo e resultado esperado definidos

## Conclusão

Os testes automatizados garantem que:
- Erros sejam tratados corretamente
- O sistema seja robusto contra entradas inválidas
- Diferentes tipos de erro sejam identificados apropriadamente
- O sistema mantenha estabilidade mesmo em cenários de falha

Esta implementação demonstra como criar testes abrangentes para cenários de erro, garantindo a qualidade e confiabilidade do sistema de tratamento de erros.