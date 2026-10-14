import { defineConfig } from "vite";
import { ViteMinifyPlugin } from "vite-plugin-minify";
import { compression } from "vite-plugin-compression2";
import { viteSingleFile } from "vite-plugin-singlefile";

// Standard plugins handle minification, precompression, and portable exports.
export default defineConfig(({ mode }) => {
  const portable = mode === "portable";
  return {
    root: "src",
    base: "./",
    publicDir: "../public",
    server: { host: "127.0.0.1", port: 5173, strictPort: true },
    preview: { host: "127.0.0.1", port: 4173, strictPort: true },
    plugins: [
      ...(portable ? [viteSingleFile({ removeViteModuleLoader: true })] : []),
      ViteMinifyPlugin({ collapseWhitespace: true, removeComments: true }),
      ...(!portable
        ? [
            compression({
              algorithms: ["gzip", "brotliCompress"],
              threshold: 0,
            }),
          ]
        : []),
    ],
    build: {
      outDir: portable ? "../portable" : "../dist",
      emptyOutDir: true,
      target: "es2020",
      modulePreload: false,
    },
  };
});
