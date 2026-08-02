import { defineConfig } from "vite";
import path from "path";

const stub = path.resolve("./src/lib/capacitor-stub.ts");

export default defineConfig({
  server: {
    host: "::",
    port: 8080,
  },

  // Vite 5 + esbuild handles .tsx/.ts natively — no plugin needed.
  // jsx:'automatic' enables React 17+ automatic JSX runtime.
  esbuild: {
    jsx: "automatic",
    jsxImportSource: "react",
  },

  resolve: {
    alias: {
      "@": path.resolve("./src"),

      // Native-only packages aliased to a web-safe stub
      "@capacitor/core":                         stub,
      "@capacitor/status-bar":                   stub,
      "@capacitor/app":                          stub,
      "@capacitor/device":                       stub,
      "@capacitor/filesystem":                   stub,
      "@capacitor/network":                      stub,
      "@capacitor/push-notifications":           stub,
      "@capacitor/share":                        stub,
      "@capacitor-community/admob":              stub,
      "@capacitor-community/firebase-analytics": stub,
      "@capacitor-community/media":              stub,
      "@capgo/capacitor-updater":                stub,
      "@vercel/analytics/react":                 stub,
    },
  },

  build: {
    rollupOptions: {
      onwarn(warning, warn) {
        if (warning.code === "MODULE_LEVEL_DIRECTIVE") return;
        warn(warning);
      },
    },
  },
});
