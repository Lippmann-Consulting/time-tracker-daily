import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: "./", // Wichtig für Electron: Relative Pfade
  server: {
    host: "::",
    port: 8080,
    strictPort: true, // Port muss verfügbar sein
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
    // Wichtig für Electron: Keine Code-Splitting-Optimierungen die Probleme verursachen
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
}));
