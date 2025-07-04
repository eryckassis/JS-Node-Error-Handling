const trataErros = require('../src/erros/funcoesErro');

describe('trataErros - Error Handling Function Tests', () => {
  describe('ENOENT Error Handling', () => {
    test('should return specific message for ENOENT error', () => {
      // Arrange - Create a mock ENOENT error
      const enoentError = {
        code: 'ENOENT',
        errno: -2,
        syscall: 'open',
        path: '/path/to/non-existent-file.txt'
      };

      // Act - Call error handling function
      const result = trataErros(enoentError);

      // Assert - Check if correct message is returned
      expect(result).toBe('Arquivo nao encontrado');
    });

    test('should handle ENOENT error with different paths', () => {
      // Test with different file paths
      const testCases = [
        { path: 'arquivo-inexistente.txt' },
        { path: '/home/user/documento.txt' },
        { path: 'C:\\Users\\Documents\\file.txt' }
      ];

      testCases.forEach(({ path }) => {
        const error = {
          code: 'ENOENT',
          path: path
        };
        
        const result = trataErros(error);
        expect(result).toBe('Arquivo nao encontrado');
      });
    });
  });

  describe('Generic Error Handling', () => {
    test('should return generic message for non-ENOENT errors', () => {
      // Arrange - Create different types of errors
      const genericError = {
        code: 'EACCES',
        message: 'Permission denied'
      };

      // Act
      const result = trataErros(genericError);

      // Assert
      expect(result).toBe('Erro na Aplicação');
    });

    test('should handle various error types', () => {
      // Test different error scenarios
      const errorTypes = [
        { code: 'EACCES', message: 'Permission denied' },
        { code: 'EMFILE', message: 'Too many open files' },
        { code: 'EISDIR', message: 'Is a directory' },
        { message: 'Unknown error' },
        null,
        undefined
      ];

      errorTypes.forEach(error => {
        const result = trataErros(error);
        expect(result).toBe('Erro na Aplicação');
      });
    });
  });

  describe('Edge Cases', () => {
    test('should handle error object without code property', () => {
      const errorWithoutCode = {
        message: 'Some error message',
        stack: 'Error: Some error message\n    at ...'
      };

      const result = trataErros(errorWithoutCode);
      expect(result).toBe('Erro na Aplicação');
    });

    test('should handle empty error object', () => {
      const emptyError = {};
      const result = trataErros(emptyError);
      expect(result).toBe('Erro na Aplicação');
    });

    test('should handle null and undefined errors', () => {
      expect(trataErros(null)).toBe('Erro na Aplicação');
      expect(trataErros(undefined)).toBe('Erro na Aplicação');
    });
  });
});