import tailwindcss from "@tailwindcss/vite"
import devtools from "solid-devtools/vite"
import { defineConfig } from "vite"
import { VitePWA } from "vite-plugin-pwa"
import solidPlugin from "vite-plugin-solid"

export default defineConfig({
  plugins: [
    devtools(),
    solidPlugin(),
    tailwindcss(),
    VitePWA({
      manifest: {
        name: "Cool App",
        short_name: "Cool App",
        description: "A very cool app",
        theme_color: "#202020",
        icons: [
          {
            src: "/favicon-8x.png",
            sizes: "192x192",
            type: "image/png",
          },
        ],
      },
    }),
  ],
  server: {
    port: 4000,
  },
  build: {
    target: "esnext",
  },
})
