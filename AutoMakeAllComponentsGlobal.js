// vite-plugin-components-dts.js
import { readFileSync, writeFileSync } from "fs";
import { resolve, dirname, relative, basename } from "path";
import { watch } from "chokidar";
import glob from "fast-glob";

export default function AutoMakeAllComponentsGlobal() {
  const componentsDTSPath = resolve(process.cwd(), "./src/components.d.ts");
  const mainTSPath = resolve(process.cwd(), "./src/main.ts");

  return {
    name: "vite-plugin-components-dts",
    async buildStart() {
      const vueFiles = await glob("**/*.vue", { ignore: "node_modules/**" });
      updateComponentsDTS(vueFiles);

      watch("**/*.vue", {
        ignored: "node_modules/**",
        ignoreInitial: true,
      })
        .on("add", (path) => {
          updateFiles([...vueFiles, path]);
        })
        .on("unlink", (path) => {
          const updatedVueFiles = vueFiles.filter((file) => file !== path);
          updateFiles(updatedVueFiles);
        });
    },
  };

  function updateFiles(vueFiles) {
    updateComponentsDTS(vueFiles);
    updateMainTS(vueFiles);
  }

  function updateComponentsDTS(vueFiles) {
    const imports = vueFiles
      .map((file) => {
        const componentName = getComponentName(file);
        const relativePath = relative(dirname(componentsDTSPath), file);
        const importPath = relativePath.startsWith(".")
          ? relativePath
          : `./${relativePath}`;
        return `import ${componentName} from "${importPath.replace(
          /\\/g,
          "/",
        )}";`;
      })
      .join("\n");

    const globalComponents = vueFiles
      .map((file) => {
        const componentName = getComponentName(file);
        return `${componentName}: typeof ${componentName};`;
      })
      .join("\n");

    const content = `
${imports}

declare module "@vue/runtime-core" {
  export interface GlobalComponents {
    ${globalComponents}
  }
}`;

    writeFileSync(componentsDTSPath, content, "utf8");
  }

  function updateMainTS(vueFiles) {
    const mainTSContent = readFileSync(mainTSPath, "utf8");
    const imports = vueFiles
      .map((file) => {
        const componentName = getComponentName(file);
        const relativePath = relative(dirname(mainTSPath), file);
        const importPath = relativePath.startsWith(".")
          ? relativePath
          : `./${relativePath}`;
        return `import ${componentName} from "${importPath.replace(
          /\\/g,
          "/",
        )}";`;
      })
      .join("\n");

    const components = vueFiles
      .map((file) => {
        const componentName = getComponentName(file);
        return `vueApp.component("${componentName}", ${componentName});`;
      })
      .join("\n");

    const updatedMainTS = mainTSContent
      .replace(
        /\/\/ Begin Generated Imports[\s\S]*?\/\/ End Generated Imports/,
        `// Begin Generated Imports\n${imports}\n// End Generated Imports`,
      )
      .replace(
        /\/\/ Begin Generated Components[\s\S]*?\/\/ End Generated Components/,
        `// Begin Generated Components\n${components}\n// End Generated Components`,
      );
    console.log(updatedMainTS);
    writeFileSync(mainTSPath, updatedMainTS, "utf8");
  }

  function getComponentName(path) {
    let fileBaseName = basename(path, ".vue");
    fileBaseName = fileBaseName.split(".")[0];
    return pascalCase(fileBaseName);
  }

  function pascalCase(str) {
    return str.replace(/(?:^|-)(\w)/g, (_, c) => c.toUpperCase());
  }
}
