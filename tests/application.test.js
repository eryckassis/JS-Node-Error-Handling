const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

// Mock the functions from index.js for testing
// Since index.js is designed to run as a script, we'll test the functions individually
const trataErros = require('../src/erros/funcoesErro');

// Extract and export functions from index.js for testing
function extraiParagrafos(texto) {
  return texto.toLowerCase().split("\n");
}

function limpaPalavras(palavra) {
  return palavra.replace(/[.,!?;:]/g, "");
}

function verificaPalavraDuplicadas(texto) {
  const listaPalavras = texto.split(" ");
  const resultado = {};
  listaPalavras.forEach((palavra) => {
    if (palavra.length >= 3) {
      const palavraLimpa = limpaPalavras(palavra);
      resultado[palavraLimpa] = (resultado[palavraLimpa] || 0) + 1;
    }
  });
  return resultado;
}

function contaPalavras(texto) {
  const paragrafos = extraiParagrafos(texto);
  const contagem = paragrafos.flatMap((paragrafo) => {
    if (!paragrafo) return [];
    return verificaPalavraDuplicadas(paragrafo);
  });
  return contagem;
}

describe('Application Functions - Error Scenarios', () => {
  describe('extraiParagrafos', () => {
    test('should handle empty text', () => {
      const result = extraiParagrafos('');
      expect(result).toEqual(['']);
    });

    test('should handle null or undefined text', () => {
      expect(() => extraiParagrafos(null)).toThrow();
      expect(() => extraiParagrafos(undefined)).toThrow();
    });

    test('should handle text with only newlines', () => {
      const result = extraiParagrafos('\n\n\n');
      expect(result).toEqual(['', '', '', '']);
    });
  });

  describe('limpaPalavras', () => {
    test('should handle empty string', () => {
      const result = limpaPalavras('');
      expect(result).toBe('');
    });

    test('should handle null or undefined', () => {
      expect(() => limpaPalavras(null)).toThrow();
      expect(() => limpaPalavras(undefined)).toThrow();
    });

    test('should handle string with only punctuation', () => {
      const result = limpaPalavras('.,!?;:');
      expect(result).toBe('');
    });

    test('should clean words with mixed punctuation', () => {
      const testCases = [
        { input: 'hello!', expected: 'hello' },
        { input: 'world.', expected: 'world' },
        { input: 'test,', expected: 'test' },
        { input: 'word?', expected: 'word' },
        { input: 'text;', expected: 'text' },
        { input: 'example:', expected: 'example' },
        { input: '!!!hello!!!', expected: 'hello' }
      ];

      testCases.forEach(({ input, expected }) => {
        expect(limpaPalavras(input)).toBe(expected);
      });
    });
  });

  describe('verificaPalavraDuplicadas', () => {
    test('should handle empty text', () => {
      const result = verificaPalavraDuplicadas('');
      expect(result).toEqual({});
    });

    test('should handle null or undefined', () => {
      expect(() => verificaPalavraDuplicadas(null)).toThrow();
      expect(() => verificaPalavraDuplicadas(undefined)).toThrow();
    });

    test('should ignore words shorter than 3 characters', () => {
      const result = verificaPalavraDuplicadas('a b c do is');
      expect(result).toEqual({});
    });

    test('should handle text with only short words', () => {
      const result = verificaPalavraDuplicadas('a b c d e f g h i j');
      expect(result).toEqual({});
    });

    test('should handle text with repeated short words', () => {
      const result = verificaPalavraDuplicadas('a a b b c c');
      expect(result).toEqual({});
    });

    test('should count words correctly with punctuation', () => {
      const result = verificaPalavraDuplicadas('hello! hello. world, world?');
      expect(result).toEqual({
        'hello': 2,
        'world': 2
      });
    });
  });

  describe('contaPalavras', () => {
    test('should handle empty text', () => {
      const result = contaPalavras('');
      expect(result).toEqual([]);
    });

    test('should handle null or undefined', () => {
      expect(() => contaPalavras(null)).toThrow();
      expect(() => contaPalavras(undefined)).toThrow();
    });

    test('should handle text with only empty paragraphs', () => {
      const result = contaPalavras('\n\n\n');
      expect(result).toEqual([]);
    });

    test('should handle mixed content with empty paragraphs', () => {
      const text = 'hello world\n\nhello again\n\n';
      const result = contaPalavras(text);
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({ 'hello': 1, 'world': 1 });
      expect(result[1]).toEqual({ 'hello': 1, 'again': 1 });
    });
  });
});

describe('File System Error Simulation', () => {
  describe('File Reading Errors', () => {
    test('should simulate ENOENT error', () => {
      // Simulate what happens when fs.readFile encounters ENOENT
      const mockError = {
        code: 'ENOENT',
        errno: -2,
        syscall: 'open',
        path: '/non/existent/file.txt',
        message: 'ENOENT: no such file or directory, open \'/non/existent/file.txt\''
      };

      const errorMessage = trataErros(mockError);
      expect(errorMessage).toBe('Arquivo nao encontrado');
    });

    test('should simulate EACCES error', () => {
      // Simulate permission denied error
      const mockError = {
        code: 'EACCES',
        errno: -13,
        syscall: 'open',
        path: '/restricted/file.txt',
        message: 'EACCES: permission denied, open \'/restricted/file.txt\''
      };

      const errorMessage = trataErros(mockError);
      expect(errorMessage).toBe('Erro na Aplicação');
    });

    test('should simulate EMFILE error', () => {
      // Simulate too many open files error
      const mockError = {
        code: 'EMFILE',
        errno: -24,
        syscall: 'open',
        path: '/some/file.txt',
        message: 'EMFILE: too many open files, open \'/some/file.txt\''
      };

      const errorMessage = trataErros(mockError);
      expect(errorMessage).toBe('Erro na Aplicação');
    });
  });

  describe('Application Error Simulation', () => {
    test('should handle TypeError in text processing', () => {
      // Simulate TypeError that could occur in text processing
      const mockError = new TypeError('Cannot read property \'split\' of null');
      const errorMessage = trataErros(mockError);
      expect(errorMessage).toBe('Erro na Aplicação');
    });

    test('should handle RangeError', () => {
      // Simulate RangeError
      const mockError = new RangeError('Maximum call stack size exceeded');
      const errorMessage = trataErros(mockError);
      expect(errorMessage).toBe('Erro na Aplicação');
    });

    test('should handle ReferenceError', () => {
      // Simulate ReferenceError
      const mockError = new ReferenceError('variable is not defined');
      const errorMessage = trataErros(mockError);
      expect(errorMessage).toBe('Erro na Aplicação');
    });
  });
});