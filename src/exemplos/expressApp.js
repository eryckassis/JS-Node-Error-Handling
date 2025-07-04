/**
 * Exemplo prático de aplicação Express com middleware de tratamento de erros
 * 
 * Este exemplo demonstra como usar o middleware de tratamento de erros
 * em uma aplicação Express real com diferentes tipos de erros.
 */

const express = require('express');
const { errorHandler, asyncHandler, notFoundHandler, CustomError } = require('../erros/expressErrorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para parsing de JSON
app.use(express.json());

// Middleware de logging simples
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
  next();
});

// Rota básica que funciona corretamente
app.get('/', (req, res) => {
  res.json({ 
    message: 'API funcionando corretamente!',
    timestamp: new Date().toISOString()
  });
});

// Exemplo de rota com erro síncrono
app.get('/erro-sincrono', (req, res, next) => {
  try {
    // Simula um erro síncrono
    const data = JSON.parse('{"invalid": json}');
    res.json(data);
  } catch (error) {
    next(error); // Passa o erro para o middleware de tratamento
  }
});

// Exemplo de rota com erro assíncrono usando asyncHandler
app.get('/erro-assincrono', asyncHandler(async (req, res) => {
  // Simula operação assíncrona que falha
  await new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error('Operação assíncrona falhou'));
    }, 100);
  });
  
  res.json({ success: true });
}));

// Exemplo de rota com erro personalizado
app.get('/erro-personalizado', (req, res, next) => {
  const error = new CustomError('Este é um erro personalizado', 400);
  next(error);
});

// Exemplo de rota com erro de validação
app.post('/usuario', (req, res, next) => {
  const { nome, email } = req.body;
  
  // Validação simples
  if (!nome || !email) {
    const error = new CustomError('Nome e email são obrigatórios', 400);
    error.name = 'ValidationError';
    return next(error);
  }
  
  if (!email.includes('@')) {
    const error = new CustomError('Email deve ter formato válido', 400);
    error.name = 'ValidationError';
    return next(error);
  }
  
  res.json({ 
    message: 'Usuário criado com sucesso',
    usuario: { nome, email }
  });
});

// Exemplo de rota com erro de autorização
app.get('/area-restrita', (req, res, next) => {
  const token = req.headers.authorization;
  
  if (!token) {
    const error = new CustomError('Token de autorização necessário', 401);
    error.name = 'UnauthorizedError';
    return next(error);
  }
  
  // Simula validação de token
  if (token !== 'Bearer token-valido') {
    const error = new CustomError('Token inválido', 401);
    error.name = 'UnauthorizedError';
    return next(error);
  }
  
  res.json({ message: 'Acesso autorizado à área restrita' });
});

// Exemplo de rota com erro de recurso não encontrado
app.get('/usuario/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  // Simula busca no banco de dados
  const usuario = await buscarUsuario(id);
  
  if (!usuario) {
    throw new CustomError(`Usuário com ID ${id} não encontrado`, 404);
  }
  
  res.json(usuario);
}));

// Função simulada de busca de usuário
async function buscarUsuario(id) {
  // Simula busca no banco
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simula que usuário só existe para ID 1
      resolve(id === '1' ? { id: 1, nome: 'João', email: 'joao@email.com' } : null);
    }, 100);
  });
}

// Exemplo de rota que simula diferentes tipos de erro baseado em parâmetro
app.get('/simular-erro/:tipo', (req, res, next) => {
  const { tipo } = req.params;
  
  switch (tipo) {
    case 'validation':
      const validationError = new Error('Dados inválidos');
      validationError.name = 'ValidationError';
      return next(validationError);
      
    case 'cast':
      const castError = new Error('Formato inválido');
      castError.name = 'CastError';
      return next(castError);
      
    case 'file':
      const fileError = new Error('Arquivo não encontrado');
      fileError.code = 'ENOENT';
      return next(fileError);
      
    case 'forbidden':
      const forbiddenError = new CustomError('Acesso negado', 403);
      forbiddenError.name = 'ForbiddenError';
      return next(forbiddenError);
      
    default:
      return next(new Error('Erro genérico do servidor'));
  }
});

// Middleware para rotas não encontradas (deve vir antes do errorHandler)
app.use(notFoundHandler);

// Middleware de tratamento de erros (deve ser o último)
app.use(errorHandler);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`Acesse http://localhost:${PORT} para testar`);
  console.log('\nRotas disponíveis para teste:');
  console.log('GET  / - Rota básica');
  console.log('GET  /erro-sincrono - Teste erro síncrono');
  console.log('GET  /erro-assincrono - Teste erro assíncrono');
  console.log('GET  /erro-personalizado - Teste erro personalizado');
  console.log('POST /usuario - Teste validação (envie JSON com nome e email)');
  console.log('GET  /area-restrita - Teste autorização (use header Authorization)');
  console.log('GET  /usuario/:id - Teste recurso não encontrado');
  console.log('GET  /simular-erro/:tipo - Teste diferentes tipos de erro');
  console.log('GET  /rota-inexistente - Teste 404');
});

module.exports = app;