/**
 * Middleware genérico para tratamento de erros em aplicações Express
 * 
 * Este middleware implementa as melhores práticas para tratamento de erros em Express:
 * - Captura todos os erros que ocorrem durante o processamento das rotas
 * - Registra erros para monitoramento e debug
 * - Retorna respostas apropriadas baseadas no tipo de erro
 * - Não expõe informações sensíveis em produção
 * 
 * @param {Error} err - Objeto de erro capturado
 * @param {Request} req - Objeto de request do Express
 * @param {Response} res - Objeto de response do Express
 * @param {Function} next - Função next do Express
 */
function errorHandler(err, req, res, next) {
  // Log do erro para monitoramento
  console.error('Erro capturado:', {
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString()
  });

  // Se headers já foram enviados, delega para o handler padrão do Express
  if (res.headersSent) {
    return next(err);
  }

  // Determina o código de status HTTP baseado no erro
  let statusCode = 500;
  let message = 'Erro interno do servidor';

  // Erros específicos com códigos de status apropriados
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Dados inválidos fornecidos';
  } else if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Formato de dados inválido';
  } else if (err.code === 'ENOENT') {
    statusCode = 404;
    message = 'Recurso não encontrado';
  } else if (err.name === 'UnauthorizedError') {
    statusCode = 401;
    message = 'Não autorizado';
  } else if (err.name === 'ForbiddenError') {
    statusCode = 403;
    message = 'Acesso negado';
  } else if (err.statusCode) {
    statusCode = err.statusCode;
    message = err.message;
  }

  // Estrutura de resposta padrão
  const errorResponse = {
    success: false,
    message,
    timestamp: new Date().toISOString(),
    path: req.originalUrl,
    method: req.method
  };

  // Em desenvolvimento, incluir detalhes do erro
  if (process.env.NODE_ENV === 'development') {
    errorResponse.error = {
      name: err.name,
      message: err.message,
      stack: err.stack
    };
  }

  // Enviar resposta de erro
  res.status(statusCode).json(errorResponse);
}

/**
 * Middleware para capturar erros assíncronos em rotas Express
 * 
 * Exemplo de uso:
 * app.get('/exemplo', asyncHandler(async (req, res) => {
 *   const dados = await operacaoAssincrona();
 *   res.json(dados);
 * }));
 * 
 * @param {Function} fn - Função assíncrona da rota
 * @returns {Function} Middleware do Express
 */
function asyncHandler(fn) {
  return function(req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

/**
 * Middleware para lidar com rotas não encontradas (404)
 * 
 * @param {Request} req - Objeto de request do Express
 * @param {Response} res - Objeto de response do Express
 * @param {Function} next - Função next do Express
 */
function notFoundHandler(req, res, next) {
  const error = new Error(`Rota não encontrada: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
}

/**
 * Classe para criar erros personalizados com códigos de status HTTP
 */
class CustomError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'CustomError';
    
    // Captura o stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

module.exports = {
  errorHandler,
  asyncHandler,
  notFoundHandler,
  CustomError
};