// בס"ד
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";


// https://vite.dev/config/
export default defineConfig({
  server: { port: 80, proxy: {
    '/api/v1': {
      target: "http://localhost:4590",
      changeOrigin: true,
    }
  } },
  plugins: [
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler"]],
      },
    }),
    tailwindcss(),
  ],
});
