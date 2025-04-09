import { defineConfig } from '@tanstack/react-start/config'
import tsConfigPaths from 'vite-tsconfig-paths'
import type { InlineConfig } from 'vite'

const vite: InlineConfig = {
  server: {
    allowedHosts: ['fawn-one-nominally.ngrok-free.app'],
  },
  plugins: [
    tsConfigPaths({
      projects: ['./tsconfig.json'],
    }),
  ],
}

export default defineConfig({
  vite,
})
