// בס"ד
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
// import { VitePWA } from "vite-plugin-pwa";
// const SECS_PER_MIN = 60;
// const MINS_PER_HOUR = 60;
// const HOURS_PER_DAY = 24;
// const MAX_ENTRIES = 50;
const PORT = 80;
export default defineConfig({
  server: {
    port: PORT,
    proxy: {
      "/api/v1": {
        target: "http://localhost:4590",
        changeOrigin: true,
      },
    },
  },
  plugins: [
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler"]],
      },
    }),
    tailwindcss(),
    // VitePWA({
    //   registerType: "autoUpdate",
    //   devOptions: {
    //     enabled: true,
    //   },
    //   manifest: {
    //     name: "GBScout 2026",
    //     short_name: "GBScout",
    //     description: "Scouting application for match tracking",
    //     start_url: "/",
    //     display: "standalone",
    //     background_color: "#ffffff",
    //     theme_color: "#ffffff",
    //     icons: [
    //       { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
    //       { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    //       { 
    //         src: "/icon-512.png", 
    //         sizes: "512x512", 
    //         type: "image/png",
    //         purpose: "any maskable"
    //       }
    //     ]
    //   },
    //   workbox: {
    //     globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2}"],
    //     runtimeCaching: [
    //       {
    //         urlPattern: /^https:\/\/api\./i,
    //         handler: "NetworkFirst",
    //         options: {
    //           cacheName: "api-cache",
    //           expiration: {
    //             maxEntries: MAX_ENTRIES,
    //             maxAgeSeconds: SECS_PER_MIN * MINS_PER_HOUR * HOURS_PER_DAY 
    //           }
    //         }
    //       }
    //     ]
    //   }
    // }),
  ],
});
