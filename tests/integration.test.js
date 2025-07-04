const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

describe('Integration Tests - Error Scenarios', () => {
  const testFilesDir = path.join(__dirname, 'test-files');
  const indexJsPath = path.join(__dirname, '../src/index.js');

  beforeAll(() => {
    // Create test files directory
    if (!fs.existsSync(testFilesDir)) {
      fs.mkdirSync(testFilesDir, { recursive: true });
    }
  });

  afterAll(() => {
    // Clean up test files
    if (fs.existsSync(testFilesDir)) {
      fs.rmSync(testFilesDir, { recursive: true, force: true });
    }
  });

  describe('File Not Found Scenarios', () => {
    test('should handle non-existent file gracefully', () => {
      const nonExistentFile = path.join(testFilesDir, 'non-existent.txt');
      
      try {
        const output = execSync(`node ${indexJsPath} ${nonExistentFile}`, { 
          encoding: 'utf8',
          timeout: 5000 
        });
        expect(output.trim()).toBe('Arquivo nao encontrado');
      } catch (error) {
        // If execSync throws, check if it's because of our expected error handling
        if (error.status === 0) {
          expect(error.stdout.trim()).toBe('Arquivo nao encontrado');
        } else {
          throw error;
        }
      }
    });

    test('should handle file with wrong extension', () => {
      const wrongExtensionFile = path.join(testFilesDir, 'file.xyz');
      
      try {
        const output = execSync(`node ${indexJsPath} ${wrongExtensionFile}`, { 
          encoding: 'utf8',
          timeout: 5000 
        });
        expect(output.trim()).toBe('Arquivo nao encontrado');
      } catch (error) {
        if (error.status === 0) {
          expect(error.stdout.trim()).toBe('Arquivo nao encontrado');
        } else {
          throw error;
        }
      }
    });

    test('should handle invalid path characters', () => {
      const invalidPath = path.join(testFilesDir, 'invalid<>path.txt');
      
      try {
        const output = execSync(`node ${indexJsPath} "${invalidPath}"`, { 
          encoding: 'utf8',
          timeout: 5000 
        });
        expect(output.trim()).toBe('Arquivo nao encontrado');
      } catch (error) {
        if (error.status === 0) {
          expect(error.stdout.trim()).toBe('Arquivo nao encontrado');
        } else {
          throw error;
        }
      }
    });
  });

  describe('Permission and Access Errors', () => {
    test('should handle directory instead of file', () => {
      const directoryPath = testFilesDir;
      
      try {
        const output = execSync(`node ${indexJsPath} ${directoryPath}`, { 
          encoding: 'utf8',
          timeout: 5000 
        });
        // Directory access might result in different error codes
        expect(output.trim()).toMatch(/Arquivo nao encontrado|Erro na Aplicação/);
      } catch (error) {
        if (error.status === 0) {
          expect(error.stdout.trim()).toMatch(/Arquivo nao encontrado|Erro na Aplicação/);
        } else {
          throw error;
        }
      }
    });
  });

  describe('Successful File Processing', () => {
    test('should process valid text file successfully', () => {
      const validFile = path.join(testFilesDir, 'valid-text.txt');
      const testContent = 'Hello world. This is a test file for testing purposes.';
      
      // Create test file
      fs.writeFileSync(validFile, testContent);
      
      try {
        const output = execSync(`node ${indexJsPath} ${validFile}`, { 
          encoding: 'utf8',
          timeout: 5000 
        });
        
        // Should not contain error messages
        expect(output).not.toContain('Arquivo nao encontrado');
        expect(output).not.toContain('Erro na Aplicação');
        
        // Should contain word count results (case-insensitive)
        expect(output.toLowerCase()).toContain('hello');
        expect(output.toLowerCase()).toContain('world');
        expect(output.toLowerCase()).toContain('test');
      } catch (error) {
        if (error.status === 0) {
          // Success case
          expect(error.stdout).not.toContain('Arquivo nao encontrado');
          expect(error.stdout).not.toContain('Erro na Aplicação');
        } else {
          throw error;
        }
      }
    });

    test('should handle empty file', () => {
      const emptyFile = path.join(testFilesDir, 'empty.txt');
      
      // Create empty file
      fs.writeFileSync(emptyFile, '');
      
      try {
        const output = execSync(`node ${indexJsPath} ${emptyFile}`, { 
          encoding: 'utf8',
          timeout: 5000 
        });
        
        // Should not contain error messages
        expect(output).not.toContain('Arquivo nao encontrado');
        expect(output).not.toContain('Erro na Aplicação');
      } catch (error) {
        if (error.status === 0) {
          expect(error.stdout).not.toContain('Arquivo nao encontrado');
          expect(error.stdout).not.toContain('Erro na Aplicação');
        } else {
          throw error;
        }
      }
    });

    test('should handle file with special characters', () => {
      const specialFile = path.join(testFilesDir, 'special-chars.txt');
      const specialContent = 'Café, naïve, résumé, and other special characters: áéíóú àèìòù âêîôû ãõñ';
      
      // Create file with special characters
      fs.writeFileSync(specialFile, specialContent);
      
      try {
        const output = execSync(`node ${indexJsPath} ${specialFile}`, { 
          encoding: 'utf8',
          timeout: 5000 
        });
        
        // Should not contain error messages
        expect(output).not.toContain('Arquivo nao encontrado');
        expect(output).not.toContain('Erro na Aplicação');
      } catch (error) {
        if (error.status === 0) {
          expect(error.stdout).not.toContain('Arquivo nao encontrado');
          expect(error.stdout).not.toContain('Erro na Aplicação');
        } else {
          throw error;
        }
      }
    });
  });

  describe('Command Line Argument Errors', () => {
    test('should handle missing file argument', () => {
      try {
        const output = execSync(`node ${indexJsPath}`, { 
          encoding: 'utf8',
          timeout: 5000 
        });
        
        // Should handle undefined file path
        expect(output.trim()).toBe('Arquivo nao encontrado');
      } catch (error) {
        if (error.status === 0) {
          expect(error.stdout.trim()).toBe('Arquivo nao encontrado');
        } else {
          throw error;
        }
      }
    });

    test('should handle multiple file arguments', () => {
      const validFile = path.join(testFilesDir, 'multi-arg-test.txt');
      fs.writeFileSync(validFile, 'Test content for multiple arguments');
      
      try {
        // Pass multiple arguments, should only process the first one
        const output = execSync(`node ${indexJsPath} ${validFile} extra-arg`, { 
          encoding: 'utf8',
          timeout: 5000 
        });
        
        // Should process the first file successfully
        expect(output).not.toContain('Arquivo nao encontrado');
        expect(output).not.toContain('Erro na Aplicação');
      } catch (error) {
        if (error.status === 0) {
          expect(error.stdout).not.toContain('Arquivo nao encontrado');
          expect(error.stdout).not.toContain('Erro na Aplicação');
        } else {
          throw error;
        }
      }
    });
  });
});