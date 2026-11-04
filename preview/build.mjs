// Genera una versión estática de la tienda en preview/dist (para publicarla como artefacto).
import { build } from "esbuild";
import { execSync } from "node:child_process";
import { cpSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "..");
const out = resolve(here, "dist");
rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });

await build({
  entryPoints: [resolve(here, "main.tsx")],
  bundle: true,
  minify: true,
  format: "iife",
  target: "es2020",
  jsx: "automatic",
  outfile: resolve(out, "app.js"),
  define: { "process.env.NODE_ENV": '"production"' },
  alias: {
    "next/link": resolve(here, "shims/link.tsx"),
    "next/image": resolve(here, "shims/image.tsx"),
    "next/navigation": resolve(here, "shims/navigation.ts"),
    "next/dynamic": resolve(here, "shims/dynamic.tsx"),
  },
  tsconfig: resolve(root, "tsconfig.json"),
  logLevel: "warning",
  logOverride: { "unsupported-directive": "silent" },
});

execSync(`npx @tailwindcss/cli -i ${resolve(here, "preview.css")} -o ${resolve(out, "app.css")} --minify`, { cwd: root, stdio: "inherit" });
cpSync(resolve(root, "public/decor"), resolve(out, "decor"), { recursive: true });
cpSync(resolve(root, "public/brand"), resolve(out, "brand"), { recursive: true });
cpSync(resolve(here, "index.html"), resolve(out, "index.html"));
console.log("preview/dist listo");
