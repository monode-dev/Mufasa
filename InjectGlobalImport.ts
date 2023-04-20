import { createFilter } from "@rollup/pluginutils";
import type { Plugin } from "vite";

export default function InjectGlobalImport(): Plugin {
  const filter = createFilter(/\.vue$/, /\.vue\?vue&type=script/);

  return {
    name: "vite-plugin-inject-global-import",
    enforce: "pre",
    transform(code, id) {
      if (!filter(id)) return;

      const importStatement =
        'import { Axis2 } from "@/miwi-md/BoxUtils.ts";\n';
      const injectAxisGlobal = "app.config.globalProperties.Axis = Axis;\n";

      // Handle Vue 3 <script setup> syntax
      const scriptSetupMatch = code.match(/<script setup.*>/);

      if (scriptSetupMatch) {
        const scriptSetupIndex =
          scriptSetupMatch.index + scriptSetupMatch[0].length;
        code =
          code.slice(0, scriptSetupIndex) +
          "\n" +
          importStatement +
          code.slice(scriptSetupIndex);
      } else {
        const scriptMatch = code.match(/<script.*>/);
        if (scriptMatch) {
          const scriptIndex = scriptMatch.index + scriptMatch[0].length;
          code =
            code.slice(0, scriptIndex) +
            "\n" +
            importStatement +
            code.slice(scriptIndex);
        }

        // Inject Axis as global property
        const exportDefaultMatch = code.match(/export\s+default\s+\{/);
        if (exportDefaultMatch) {
          const exportDefaultIndex =
            exportDefaultMatch.index + exportDefaultMatch[0].length;
          code =
            code.slice(0, exportDefaultIndex) +
            "\n" +
            injectAxisGlobal +
            code.slice(exportDefaultIndex);
        }
      }

      return {
        code,
        map: null,
      };
    },
  };
}
