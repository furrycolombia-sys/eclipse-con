import { resolve } from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

/**
 * Font files the first screen needs: the Latin subsets of the two self-hosted
 * faces. Matched against emitted asset names, which keep the source basename.
 */
const PRELOAD_FONTS = [
  "bricolage-grotesque-latin-opsz-normal",
  "space-grotesk-latin-wght-normal",
];

/**
 * Adds `<link rel="preload">` for {@link PRELOAD_FONTS}, so the browser fetches
 * them alongside the CSS instead of discovering them only once it has parsed
 * it. Skipped in single-file mode, where the fonts are inlined anyway.
 */
function preloadFonts(): Plugin {
  return {
    name: "sunfest-preload-fonts",
    apply: "build",
    transformIndexHtml(_html, context) {
      const files = Object.keys(context.bundle ?? {}).filter((file) =>
        PRELOAD_FONTS.some((font) => file.includes(font))
      );
      return files.map((file) => ({
        tag: "link",
        attrs: {
          rel: "preload",
          href: `/${file}`,
          as: "font",
          type: "font/woff2",
          crossorigin: "",
        },
        injectTo: "head",
      }));
    },
  };
}

/**
 * Vite config for the sunfest teaser: React + Tailwind v4.
 *
 * The deployed build emits ordinary separate assets. Inlining everything into
 * one HTML costs ~33% in base64 overhead and, worse, makes the browser download
 * every below-the-fold photo before it can paint anything. Cloudflare serves the
 * separate files from Static Assets, so they cache individually and the showcase
 * photos can load lazily.
 *
 * `--mode singlefile` (see the `build:static` script) still produces the
 * one-file artifact for the network share, where portability is the point.
 */
export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    tailwindcss(),
    ...(mode === "singlefile" ? [viteSingleFile()] : [preloadFonts()]),
  ],
  resolve: { alias: { "@": resolve(import.meta.dirname, "src") } },
}));
