import { defineConfig } from "vite";
import path from "path";
import { execSync } from "child_process";

// ── Fix esbuild binary permissions before Vite processes anything ──────────
// OnSpace's pre-check fork/exec's node_modules/.bin/esbuild.
// bun installs the binary without the execute bit set.
// Running chmod here ensures the bit is set by the time it's needed.
try {
  execSync(
    "chmod +x node_modules/.bin/esbuild " +
    "node_modules/esbuild/bin/esbuild " +
    "node_modules/@esbuild/linux-x64/bin/esbuild 2>/dev/null || true",
    { stdio: "ignore" }
  );
} catch (_) {}

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
