import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/krishi-book/',

  plugins: [
    react(),
    tailwindcss(),

    VitePWA({
      registerType: 'autoUpdate',

      manifest: {
        name: 'Krishi Book',
        short_name: 'Krishi Book',

        description:
          'Simple farm income and expense ledger',

        start_url: '/krishi-book/',
        scope: '/krishi-book/',

        display: 'standalone',

        background_color: '#F7F5EF',
        theme_color: '#F7F5EF',

        icons: [
          {
            src: 'krishi-book-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'krishi-book-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
})