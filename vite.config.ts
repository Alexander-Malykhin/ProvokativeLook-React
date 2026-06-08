// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

export default defineConfig({
  plugins: [react()],

  base: '/',

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@routes': path.resolve(__dirname, './src/routes'),
      '@scss': path.resolve(__dirname, './src/scss'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@components': path.resolve(__dirname, './src/components'),
      '@layouts': path.resolve(__dirname, './src/layouts'),
      '@store': path.resolve(__dirname, './src/store'),
      '@UI': path.resolve(__dirname, './src/UI'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@helpers': path.resolve(__dirname, './src/helpers'),
      '@api': path.resolve(__dirname, './src/api'),
    },
  },

  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @use "@scss/settings/fonts" as *;
          @use "@scss/settings/colors" as *;
          @use "@scss/settings/functions" as *;
          @use "@scss/settings/mixins" as *;
          @use "@scss/settings/containers" as *;
        `,
      },
    },
  },

  build: {
    outDir: '../site/local/react-app',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        entryFileNames: 'assets/app.js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name][extname]',
      },
    },
  },

  server: {
    proxy: {
      '/local/api': {
        target: 'https://24.provokativelook.ru',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})