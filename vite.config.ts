import { fileURLToPath, URL } from 'node:url'
import path from 'node:path'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'AllyComponents',
      formats: ['es'],
      fileName: (format) => `ally-components.${format}.js`,
    },
    rollupOptions: {
      external: ['vue', 'vue-router', 'bootstrap', 'jquery'],
      output: {
        globals: {
          vue: 'Vue',
          'vue-router': 'VueRouter',
          bootstrap: 'bootstrap',
          jquery: '$'
        },
        assetFileNames: 'style.css'
      },
    },
    sourcemap: true,
    emptyOutDir: true,
  }
})
