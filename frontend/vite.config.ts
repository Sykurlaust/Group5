import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"

export default defineConfig({
  base: "/",
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes("node_modules")) {
            if (id.includes("apexcharts") || id.includes("react-apexcharts")) return "charts"
            if (id.includes("firebase")) return "firebase"
            if (id.includes("react-router")) return "router"
            if (
              id.includes("react") ||
              id.includes("scheduler") ||
              id.includes("react-dom")
            ) {
              return "react-vendor"
            }
            return "vendor"
          }
          return undefined
        },
      },
    },
  },
})
