import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import VueDevTools from 'vite-plugin-vue-devtools'
import ViteYaml from '@modyfi/vite-plugin-yaml'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), ViteYaml(), VueDevTools()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
