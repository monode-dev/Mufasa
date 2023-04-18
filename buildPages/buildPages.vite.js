import * as fs from "fs";
import * as path from "path";

const navTemplate = fs.readFileSync("./buildPages/Nav.template.ts");
const navFileOutput = "./src/Nav.ts";
const importsTag = `// INSERT PAGE IMPORTS HERE`;
const objectsTag = `// INSERT PAGE OBJECTS HERE`;

const pageTag = ".page";
const validExtensions = [".vue", ".js", ".ts", ".jsx", ".tsx"];
function findAllPages(dir) {
  if (dir === undefined) dir = "./src";
  const validPaths = [];

  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const pathFromSrc = `${dir}/${file}`;
    const fileStat = fs.statSync(pathFromSrc);

    if (fileStat.isDirectory()) {
      const subValidPaths = findAllPages(pathFromSrc);
      subValidPaths.forEach((subValidPath) => {
        validPaths.push(subValidPath);
      });
    } else if (fileStat.isFile()) {
      const hasValidExtension = validExtensions.some((ext) =>
        pathFromSrc.endsWith(`${pageTag}${ext}`),
      );
      if (hasValidExtension) {
        validPaths.push(pathFromSrc);
      }
    }
  });

  return validPaths;
}

export default () => {
  return {
    name: "my-vite-plugin",
    configResolved(config) {
      // Use this hook to access the resolved Vite configuration
    },
    buildStart() {
      let newNavFile = navTemplate.toString();
      let imports = "";
      let objects = "";

      const allPagePaths = findAllPages();
      for (const pagePath of allPagePaths) {
        const pageName = path.basename(pagePath).split(".")[0];
        const componentName = `${pageName}Vue`;
        const importPath = pagePath.replace("./src", "@");
        imports += `import ${componentName} from "${importPath}";\nimport * as ${pageName} from "${importPath}";\n`;
        objects += `  ${pageName} : {
          component: ${componentName},
          transitions: (${pageName} as any)?.transitions ?? pageTransitions.none,
        },\n`;
      }
      newNavFile = newNavFile.replace(importsTag, imports);
      newNavFile = newNavFile.replace(objectsTag, objects);
      fs.writeFileSync(navFileOutput, newNavFile);
      //console.log("Plugin is running before build/update");
      // Add your logic here to run before each build/update
    },
  };
};
