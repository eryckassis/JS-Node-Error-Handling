# JS-Node-Error-Handling

<p align="center">
  <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/javascript/javascript-original.svg" alt="JavaScript Logo" width="70" />
  <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/nodejs/nodejs-original.svg" alt="Node.js Logo" width="70" />
</p>

## Overview

This repository is dedicated to professional strategies and best practices for error handling in JavaScript, with a particular focus on Node.js applications. Here you will find practical examples of functions and techniques designed to make your applications more robust, reliable, and maintainable.

## Features

- Comprehensive error handling functions developed specifically for Node.js environments
- **Express middleware for centralized error handling** with logging and standardized responses
- Practical examples and use cases for managing both synchronous and asynchronous errors
- Best practices for handling exceptions, creating custom errors, and propagating errors
- Modular and reusable code for seamless integration into your own projects
- Support for different error types (validation, authorization, not found, etc.)
- Production-ready configuration with security considerations

## Why Is Error Handling Important?

Robust error handling is essential for building stable applications. By systematically managing exceptions and failures, you ensure a better user experience, facilitate debugging, and maintain more sustainable code. This repository provides clear patterns and examples to help you implement effective error handling in your JavaScript and Node.js projects.

## Technologies

- **Node.js**
- **JavaScript**

## Getting Started

Clone the repository and explore the examples:

```bash
git clone https://github.com/eryckassis/JS-Node-Error-Handling.git
cd JS-Node-Error-Handling
npm install
```

### Running Examples

```bash
# Run the original file processing example
npm start

# Run the Express error handling example
npm run dev

# Run the middleware tests
npm test
```

### Express Middleware Usage

```javascript
const express = require('express');
const { errorHandler, asyncHandler, notFoundHandler, CustomError } = require('./src/erros/expressErrorHandler');

const app = express();

// Your routes here
app.get('/exemplo', asyncHandler(async (req, res) => {
  const dados = await operacaoAssincrona();
  res.json(dados);
}));

// 404 handler (before error handler)
app.use(notFoundHandler);

// Error handling middleware (must be last)
app.use(errorHandler);

app.listen(3000);
```

For detailed documentation, see [Express Error Handling Guide](docs/EXPRESS_ERROR_HANDLING.md).

Review the code samples and adapt them to your own projects as needed.

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests to improve the examples or suggest new error handling patterns.

## License

This repository is licensed under the MIT License, which permits free use, modification, and distribution of the code for personal or commercial purposes.  
Proper credit to the original author is appreciated.  
The code provided here is intended for educational and practical use in error handling for JavaScript and Node.js projects and is provided "as is" without any warranty.

---

**Author:**  
[Eryck Assis](https://github.com/eryckassis)
