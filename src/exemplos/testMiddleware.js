/**
 * Testes simples para verificar o funcionamento do middleware de tratamento de erros
 */

const express = require('express');
const request = require('http').request;
const { errorHandler, asyncHandler, notFoundHandler, CustomError } = require('../erros/expressErrorHandler');

// Criar app de teste
const app = express();
app.use(express.json());

// Rota de teste que sempre funciona
app.get('/sucesso', (req, res) => {
  res.json({ success: true });
});

// Rota que gera erro personalizado
app.get('/erro-personalizado', (req, res, next) => {
  next(new CustomError('Erro de teste', 400));
});

// Rota assíncrona que falha
app.get('/erro-assincrono', asyncHandler(async (req, res) => {
  throw new Error('Erro assíncrono');
}));

// Middleware de tratamento de erros
app.use(notFoundHandler);
app.use(errorHandler);

// Iniciar servidor de teste
const server = app.listen(3001, () => {
  console.log('Servidor de teste iniciado na porta 3001');
  runTests();
});

function runTests() {
  console.log('\n=== Executando testes do middleware de tratamento de erros ===\n');

  // Teste 1: Rota que funciona
  testRequest('GET', '/sucesso', null, (response) => {
    console.log('✓ Teste 1: Rota funcionando corretamente');
    console.log('  Status:', response.statusCode);
    console.log('  Response:', response.body);
  });

  // Teste 2: Erro personalizado
  setTimeout(() => {
    testRequest('GET', '/erro-personalizado', null, (response) => {
      console.log('\n✓ Teste 2: Erro personalizado');
      console.log('  Status:', response.statusCode);
      console.log('  Response:', response.body);
    });
  }, 100);

  // Teste 3: Erro assíncrono
  setTimeout(() => {
    testRequest('GET', '/erro-assincrono', null, (response) => {
      console.log('\n✓ Teste 3: Erro assíncrono');
      console.log('  Status:', response.statusCode);
      console.log('  Response:', response.body);
    });
  }, 200);

  // Teste 4: Rota não encontrada (404)
  setTimeout(() => {
    testRequest('GET', '/rota-inexistente', null, (response) => {
      console.log('\n✓ Teste 4: Rota não encontrada (404)');
      console.log('  Status:', response.statusCode);
      console.log('  Response:', response.body);
      
      // Finalizar testes
      setTimeout(() => {
        console.log('\n=== Testes concluídos ===');
        server.close();
      }, 100);
    });
  }, 300);
}

function testRequest(method, path, body, callback) {
  const options = {
    hostname: 'localhost',
    port: 3001,
    path: path,
    method: method,
    headers: {
      'Content-Type': 'application/json',
    }
  };

  const req = request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    res.on('end', () => {
      callback({
        statusCode: res.statusCode,
        body: data
      });
    });
  });

  req.on('error', (error) => {
    console.error('Erro na requisição:', error);
  });

  if (body) {
    req.write(JSON.stringify(body));
  }

  req.end();
}

// Tratamento de erro para o processo
process.on('uncaughtException', (error) => {
  console.error('Erro não capturado:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Promise rejeitada:', reason);
  process.exit(1);
});