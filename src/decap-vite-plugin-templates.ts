import { Plugin } from 'vite';
import { readFileSync } from 'fs';
import * as path from 'path';

export function injectTemplatePlugin(templatePath: string): Plugin {
  return {
    name: 'vite-plugin-decap-cms-template',

    configureServer(server) {
      // Adding middleware to serve the template script
      server.middlewares.use((req, res, next) => {
        if (req.url === '/decap-script.js') {
          try {
            // Prepend the relative path prefix to the user-provided path
            const fullPath = path.join('../../..', templatePath);
            const resolvedPath = path.resolve(fullPath);
            const content = readFileSync(resolvedPath, 'utf8');
            res.setHeader('Content-Type', 'application/javascript');
            res.end(content);
          } catch (error) {
            // Handle errors (e.g., file not found)
            console.error(error);
            res.statusCode = 500;
            res.end('Internal Server Error');
          }
        } else {
          next();
        }
      });
    },
  };
}
