import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import istanbul from 'vite-plugin-istanbul';

export default defineConfig({
  plugins: [
    vue(),
    istanbul({
      include: 'src/*',
      exclude: ['node_modules', 'test/', 'cypress/'],
      extension: [ '.js', '.ts', '.vue' ],
      requireEnv: true,
      cypress: true
    }),
  ]
})
