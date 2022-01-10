import { defineConfig } from 'vite'
import { imagetools } from 'vite-imagetools'

export default defineConfig({
  base: '/mario-game/',
  plugins: [imagetools()]
})
