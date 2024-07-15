import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";
import devtools from "solid-devtools/vite";
import tsconfig from "./tsconfig.json";

export default defineConfig((configEnv) => {
  return {
    plugins: [
      /*
    Uncomment the following line to enable solid-devtools.
    For more info see https://github.com/thetarnav/solid-devtools/tree/main/packages/extension#readme
    */
      // devtools(),
      solidPlugin({
        hot: false,
      }),
      devtools({
        /* features options - all disabled by default */
        autoname: true, // e.g. enable autoname
        // pass `true` or an object with options
        locator: {
          targetIDE: "vscode",
          componentLocation: true,
          jsxLocation: true,
        },
      }),
    ],
    server: {
      port: 3000,
    },
    build: {
      // Based on: https://github.com/vitejs/vite/discussions/11661#discussioncomment-4668446
      sourcemap: configEnv.mode === "development" ? "inline" : false,
      target: "esnext",
      outDir: "dist/website",
    },
    resolve: {
      alias: (() => {
        const result: { [key: string]: string } = {};
        for (const [key, value] of Object.entries(
          tsconfig.compilerOptions.paths,
        )) {
          result[key.replace("/*", "")] = fileURLToPath(
            new URL(value[0].replace("/*", ""), import.meta.url),
          );
        }
        return result;
      })(),
    },
  };
});
