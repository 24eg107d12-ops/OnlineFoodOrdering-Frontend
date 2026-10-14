import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    react(),
    {
      name: 'html-transform',
      transformIndexHtml(html, ctx) {
        return html
          .replace(/<link rel="stylesheet" crossorigin href="\.\/assets\/.*?\.css">/, '')
          .replace(
            /<script type="module" crossorigin src="\.\/assets\/.*?\.js"><\/script>/,
            '<script type="module" src="/src/main.jsx"></script>'
          );
      }
    }
  ],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8081',
        changeOrigin: true,
        secure: false,
        configure: (proxy) => {
          proxy.on('error', (err, req, res) => {
            // Gracefully handle when backend is not running yet without crashing or printing noisy stack traces
            if (res && !res.headersSent) {
              res.writeHead(503, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: 'Backend is offline on port 8081' }));
            }
          });
        }
      }
    }
  }
})
