#!/usr/bin/env node

/**
 * Demo script showing automated error testing scenarios
 * This script demonstrates how to simulate and test error conditions
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('='.repeat(60));
console.log('DEMONSTRAÇÃO DE TESTES AUTOMATIZADOS PARA CENÁRIOS DE ERRO');
console.log('='.repeat(60));

console.log('\n1. TESTANDO CENÁRIO DE ARQUIVO NÃO ENCONTRADO');
console.log('-'.repeat(50));

try {
  const output = execSync('node src/index.js arquivo-inexistente.txt', { encoding: 'utf8' });
  console.log('✅ Resultado:', output.trim());
} catch (error) {
  console.log('❌ Erro inesperado:', error.message);
}

console.log('\n2. TESTANDO CENÁRIO SEM ARGUMENTOS');
console.log('-'.repeat(50));

try {
  const output = execSync('node src/index.js', { encoding: 'utf8' });
  console.log('✅ Resultado:', output.trim());
} catch (error) {
  console.log('❌ Erro inesperado:', error.message);
}

console.log('\n3. TESTANDO PROCESSAMENTO BEM-SUCEDIDO');
console.log('-'.repeat(50));

try {
  const output = execSync('node src/index.js arquivos/texto-web.txt', { encoding: 'utf8' });
  console.log('✅ Processamento bem-sucedido (primeiras linhas):');
  console.log(output.split('\n').slice(0, 3).join('\n') + '...');
} catch (error) {
  console.log('❌ Erro inesperado:', error.message);
}

console.log('\n4. EXECUTANDO TESTES AUTOMATIZADOS');
console.log('-'.repeat(50));

try {
  const output = execSync('npm test', { encoding: 'utf8' });
  console.log('✅ Todos os testes passaram!');
  
  // Extract test summary
  const lines = output.split('\n');
  const summaryLine = lines.find(line => line.includes('Test Suites:'));
  if (summaryLine) {
    console.log('📊 Resumo:', summaryLine.trim());
  }
} catch (error) {
  console.log('❌ Falha nos testes:', error.message);
}

console.log('\n5. RELATÓRIO DE COBERTURA DE TESTES');
console.log('-'.repeat(50));

try {
  const output = execSync('npm run test:coverage', { encoding: 'utf8' });
  console.log('✅ Cobertura de testes calculada!');
  
  // Extract coverage summary
  const lines = output.split('\n');
  const coverageStart = lines.findIndex(line => line.includes('File'));
  const coverageEnd = lines.findIndex(line => line.includes('All files'));
  
  if (coverageStart !== -1 && coverageEnd !== -1) {
    console.log('📈 Cobertura de Testes:');
    lines.slice(coverageStart, coverageEnd + 1).forEach(line => {
      if (line.trim()) console.log(line);
    });
  }
} catch (error) {
  console.log('❌ Erro ao calcular cobertura:', error.message);
}

console.log('\n6. EXEMPLOS DE CENÁRIOS DE TESTE');
console.log('-'.repeat(50));

const trataErros = require('./src/erros/funcoesErro');

// Demonstrar diferentes tipos de erro
const errorExamples = [
  {
    name: 'Erro ENOENT (arquivo não encontrado)',
    error: { code: 'ENOENT', path: '/arquivo/inexistente.txt' },
  },
  {
    name: 'Erro EACCES (permissão negada)',
    error: { code: 'EACCES', path: '/arquivo/restrito.txt' },
  },
  {
    name: 'Erro genérico',
    error: { message: 'Erro desconhecido' },
  },
  {
    name: 'Erro nulo',
    error: null,
  },
];

errorExamples.forEach(({ name, error }) => {
  const result = trataErros(error);
  console.log(`📝 ${name}: "${result}"`);
});

console.log('\n' + '='.repeat(60));
console.log('DEMONSTRAÇÃO CONCLUÍDA');
console.log('='.repeat(60));
console.log('\nPara mais detalhes sobre os testes, consulte:');
console.log('- 📄 TESTES.md - Documentação completa dos testes');
console.log('- 📁 tests/ - Código fonte dos testes');
console.log('- 🔧 npm test - Executar todos os testes');
console.log('- 📊 npm run test:coverage - Executar com cobertura');
console.log('- 👀 npm run test:watch - Executar em modo de observação');