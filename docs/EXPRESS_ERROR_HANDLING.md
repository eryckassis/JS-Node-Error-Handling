# Middleware de Tratamento de Erros para Express

Este documento descreve o middleware genérico de tratamento de erros para aplicações Express, incluindo exemplos práticos e melhores práticas.

## Índice

1. [Introdução](#introdução)
2. [Instalação e Configuração](#instalação-e-configuração)
3. [Componentes do Middleware](#componentes-do-middleware)
4. [Exemplos de Uso](#exemplos-de-uso)
5. [Melhores Práticas](#melhores-práticas)
6. [Tipos de Erro Suportados](#tipos-de-erro-suportados)
7. [Configuração para Produção](#configuração-para-produção)

## Introdução

O middleware de tratamento de erros é uma camada essencial em aplicações Express que permite capturar, processar e responder adequadamente a todos os tipos de erros que podem ocorrer durante o processamento de requisições.

### Principais Benefícios

- **Centralização**: Todos os erros são tratados em um local único
- **Consistência**: Respostas de erro padronizadas
- **Segurança**: Evita vazamento de informações sensíveis
- **Monitoramento**: Facilita logging e debugging
- **Experiência do usuário**: Mensagens de erro mais amigáveis

## Instalação e Configuração

### Dependências

```bash
npm install express
```

### Importação

```javascript
const { errorHandler, asyncHandler, notFoundHandler, CustomError } = require('./erros/expressErrorHandler');
```

### Configuração Básica

```javascript
const express = require('express');
const app = express();

// Middlewares da aplicação
app.use(express.json());

// Suas rotas aqui
app.get('/', (req, res) => {
  res.json({ message: 'API funcionando!' });
});

// Middleware para rotas não encontradas (404)
app.use(notFoundHandler);

// Middleware de tratamento de erros (DEVE ser o último)
app.use(errorHandler);
```

## Componentes do Middleware

### 1. errorHandler

Middleware principal que captura e trata todos os erros da aplicação.

```javascript
app.use(errorHandler);
```

**Funcionalidades:**
- Captura erros síncronos e assíncronos
- Gera logs detalhados para monitoramento
- Determina código de status HTTP apropriado
- Retorna resposta JSON estruturada
- Oculta detalhes em produção

### 2. asyncHandler

Wrapper para rotas assíncronas que garante que erros sejam capturados.

```javascript
app.get('/dados', asyncHandler(async (req, res) => {
  const dados = await buscarDados();
  res.json(dados);
}));
```

### 3. notFoundHandler

Middleware para tratar rotas não encontradas (404).

```javascript
app.use(notFoundHandler);
```

### 4. CustomError

Classe para criar erros personalizados com códigos de status específicos.

```javascript
throw new CustomError('Mensagem do erro', 400);
```

## Exemplos de Uso

### Erro Síncrono

```javascript
app.get('/erro-sincrono', (req, res, next) => {
  try {
    // Operação que pode falhar
    const data = JSON.parse('json-inválido');
    res.json(data);
  } catch (error) {
    next(error); // Passa para o middleware de erro
  }
});
```

### Erro Assíncrono

```javascript
app.get('/erro-assincrono', asyncHandler(async (req, res) => {
  // Operação assíncrona que pode falhar
  const dados = await operacaoAssincrona();
  res.json(dados);
}));
```

### Erro de Validação

```javascript
app.post('/usuario', (req, res, next) => {
  const { nome, email } = req.body;
  
  if (!nome || !email) {
    const error = new CustomError('Nome e email são obrigatórios', 400);
    error.name = 'ValidationError';
    return next(error);
  }
  
  // Processar dados válidos
  res.json({ message: 'Usuário criado com sucesso' });
});
```

### Erro de Autorização

```javascript
app.get('/area-restrita', (req, res, next) => {
  const token = req.headers.authorization;
  
  if (!token) {
    const error = new CustomError('Token necessário', 401);
    error.name = 'UnauthorizedError';
    return next(error);
  }
  
  // Verificar token e processar
  res.json({ message: 'Acesso autorizado' });
});
```

## Melhores Práticas

### 1. Ordem dos Middlewares

```javascript
// 1. Middlewares de parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2. Middlewares de logging
app.use(morgan('combined'));

// 3. Rotas da aplicação
app.use('/api', routes);

// 4. Middleware 404 (antes do errorHandler)
app.use(notFoundHandler);

// 5. Middleware de erro (SEMPRE por último)
app.use(errorHandler);
```

### 2. Tratamento de Erros Assíncronos

```javascript
// ❌ Incorreto - erro não será capturado
app.get('/dados', async (req, res) => {
  const dados = await buscarDados(); // Pode falhar
  res.json(dados);
});

// ✅ Correto - usando asyncHandler
app.get('/dados', asyncHandler(async (req, res) => {
  const dados = await buscarDados();
  res.json(dados);
}));

// ✅ Alternativa - try/catch manual
app.get('/dados', async (req, res, next) => {
  try {
    const dados = await buscarDados();
    res.json(dados);
  } catch (error) {
    next(error);
  }
});
```

### 3. Criação de Erros Personalizados

```javascript
// Validação
const validationError = new CustomError('Dados inválidos', 400);
validationError.name = 'ValidationError';

// Autorização
const authError = new CustomError('Não autorizado', 401);
authError.name = 'UnauthorizedError';

// Recurso não encontrado
const notFoundError = new CustomError('Usuário não encontrado', 404);
```

### 4. Logging Estruturado

```javascript
// O middleware já inclui logging, mas você pode personalizar
console.error('Erro capturado:', {
  message: err.message,
  stack: err.stack,
  url: req.originalUrl,
  method: req.method,
  ip: req.ip,
  userAgent: req.get('User-Agent'),
  timestamp: new Date().toISOString()
});
```

## Tipos de Erro Suportados

### Erros Nativos do Node.js

| Tipo | Código HTTP | Descrição |
|------|-------------|-----------|
| `ENOENT` | 404 | Arquivo não encontrado |
| `ValidationError` | 400 | Dados inválidos |
| `CastError` | 400 | Formato inválido |
| `UnauthorizedError` | 401 | Não autorizado |
| `ForbiddenError` | 403 | Acesso negado |

### Erros Personalizados

```javascript
// Erro genérico
throw new CustomError('Mensagem', 500);

// Erro de validação
const error = new CustomError('Dados inválidos', 400);
error.name = 'ValidationError';
throw error;

// Erro de autorização
const error = new CustomError('Acesso negado', 403);
error.name = 'ForbiddenError';
throw error;
```

## Configuração para Produção

### Variáveis de Ambiente

```bash
# .env
NODE_ENV=production
PORT=3000
```

### Configuração de Segurança

```javascript
// Em produção, detalhes do erro são ocultados
const errorResponse = {
  success: false,
  message: 'Erro interno do servidor', // Mensagem genérica
  timestamp: new Date().toISOString(),
  path: req.originalUrl,
  method: req.method
};

// Detalhes só em desenvolvimento
if (process.env.NODE_ENV === 'development') {
  errorResponse.error = {
    name: err.name,
    message: err.message,
    stack: err.stack
  };
}
```

### Monitoramento

Para produção, considere integrar com serviços de monitoramento:

```javascript
// Exemplo com Sentry
const Sentry = require('@sentry/node');

function errorHandler(err, req, res, next) {
  // Reportar erro para Sentry
  Sentry.captureException(err);
  
  // Resto da lógica...
}
```

## Testando o Middleware

Execute o exemplo:

```bash
node src/exemplos/expressApp.js
```

Teste as rotas:

```bash
# Rota básica
curl http://localhost:3000/

# Erro síncrono
curl http://localhost:3000/erro-sincrono

# Erro assíncrono
curl http://localhost:3000/erro-assincrono

# Erro de validação
curl -X POST http://localhost:3000/usuario \
  -H "Content-Type: application/json" \
  -d '{"nome": ""}'

# Erro de autorização
curl http://localhost:3000/area-restrita

# Erro 404
curl http://localhost:3000/rota-inexistente
```

## Estrutura de Resposta de Erro

```json
{
  "success": false,
  "message": "Mensagem do erro",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "path": "/rota-que-falhou",
  "method": "GET",
  "error": {
    "name": "ValidationError",
    "message": "Dados inválidos",
    "stack": "Error: Dados inválidos\n    at ..."
  }
}
```

**Nota**: O campo `error` só é incluído em ambiente de desenvolvimento.

## Conclusão

Este middleware oferece uma solução robusta e flexível para tratamento de erros em aplicações Express, seguindo as melhores práticas de segurança e usabilidade. A implementação é modular e pode ser facilmente adaptada para diferentes necessidades de projeto.