import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        // The one script every visitor needs. Named so the service worker can
        // keep exactly this one: every other script is part of the admin panel
        // (loaded on demand, see src/routes/lazyAdmin.tsx), which always needs
        // the network and is never kept on visitors' phones.
        entryFileNames: "assets/app-[hash].js",
      },
    },
  },
  plugins: [
    react(),
    VitePWA({
      strategies: "injectManifest",
      srcDir: "src/sw",
      filename: "sw.ts",
      // Registered by hand (src/pwa) so the page can offer "update available".
      injectRegister: false,
      registerType: "prompt",
      manifest: {
        id: "/",
        name: "Eurocompass | Autobuski prevoz Kruševac – Beograd",
        short_name: "Eurocompass",
        description:
          "Polasci, cene i online rezervacija karata za autobuski prevoz Kruševac – Beograd.",
        lang: "sr-Latn",
        start_url: "/",
        scope: "/",
        display: "standalone",
        background_color: "#f9fafb",
        theme_color: "#f9fafb",
        categories: ["travel", "transportation"],
        icons: [
          { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
          {
            src: "/icons/icon-maskable-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
        shortcuts: [
          {
            name: "Rezervacija karte",
            url: "/rezervacije",
            icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }],
          },
          {
            name: "Polasci i cene",
            url: "/informacije",
            icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }],
          },
        ],
      },
      injectManifest: {
        // Only the public site's own files. Photos and map data are cached
        // when first viewed instead (see sw.ts); the admin panel never.
        globPatterns: [
          "index.html",
          "offline.html",
          "assets/app-*.js",
          "assets/*.css",
          "fonts/*.ttf",
          "icons/*.png",
        ],
      },
    }),
  ],
});
