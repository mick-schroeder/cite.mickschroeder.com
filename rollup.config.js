import * as path from "path";
import babel from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import filesize from "rollup-plugin-filesize";
import json from "@rollup/plugin-json";
import replace from "@rollup/plugin-replace";
import resolve from "@rollup/plugin-node-resolve";
import sizes from "rollup-plugin-sizes";
import wasm from "@rollup/plugin-wasm";
import webWorkerLoader from "rollup-plugin-web-worker-loader";
import terser from "@rollup/plugin-terser";
import alias from "@rollup/plugin-alias";
import virtual from "@rollup/plugin-virtual";
import typescript from "@rollup/plugin-typescript";
import { visualizer } from "rollup-plugin-visualizer";

const isProduction = process.env.NODE_ENV?.startsWith("prod");

const config = {
  input: "./src/js/main.js",
  external: [
    "/static/js/citeproc-rs/citeproc_rs_wasm.js",
    "cross-fetch/polyfill",
    "jsdom", // zotero-utilities/utilities.js:619 includes jsdom which is then
    // treeshaken because we replace Zotero.isNode to false. To avoid
    // bogus imports/warnings it also needs to be marked as external.
  ],
  output: {
    dir: "./build/static",
    format: "iife",
    sourcemap: !isProduction,
    compact: isProduction,
  },
  treeshake: {
    preset: "smallest",
    moduleSideEffects: (id) => {
      if (id.includes("core-js/")) {
        return true;
      }
      if (id.includes("@formatjs/intl-")) {
        return true;
      }
      if (!isProduction && id.includes("wdyr")) {
        return true;
      }
      return false;
    },
  },
  plugins: [
    webWorkerLoader({
      targetPlatform: "browser",
      skipPlugins: [
        "resolve",
        "json",
        "wasm",
        "commonjs",
        "replace",
        "babel",
        "sizes",
        "visualizer",
        "filesize",
      ],
    }),
    resolve({
      modulePaths: [path.join(process.cwd(), "modules")],
      preferBuiltins: false,
      mainFields: ["browser", "main"],
      extensions: [".js", ".jsx", ".ts", ".tsx", ".wasm"],
    }),
    json(),
    wasm(),
    commonjs(),
    replace({
      preventAssignment: true,
      "Zotero.isNode": false,
      "process.env.NODE_ENV": JSON.stringify(
        process.env.NODE_ENV ?? "development",
      ),
    }),
    typescript({
      tsconfig: "./tsconfig.json",
      compilerOptions: { jsx: "preserve" },
    }),
    babel({
      // @floating-ui targets Safari >= 12, we target Safari >= 10, so we need to
      // include @floating-ui in babel transpilation
      babelrc: false,
      extensions: [".js", ".jsx", ".ts", ".tsx"],
      include: [
        "src/js/**",
        "modules/web-common/**",
        "node_modules/@floating-ui/**",
      ],
      babelHelpers: "bundled",
    }),
    filesize({ showMinifiedSize: false, showGzippedSize: !!process.env.DEBUG }),
  ],
};

const commonAliases = [
  { find: /^core-js-pure\/(.*)/, replacement: "core-js/$1" },
];

if (process.env.DEBUG) {
  config.plugins.splice(0, 0, alias({ entries: commonAliases }));
  config.plugins.splice(-1, 0, sizes());
  config.plugins.splice(
    -1,
    0,
    visualizer({
      filename: `visualizer/${new Date().toJSON().slice(0, 10)}.html`,
    }),
  );
}

if (isProduction) {
  config.plugins.splice(
    0,
    0,
    alias({
      entries: [
        ...commonAliases,
        {
          find: "@formatjs/icu-messageformat-parser",
          replacement: "@formatjs/icu-messageformat-parser/no-parser",
        },
      ],
    }),
  );
  config.plugins.push(terser({ safari10: true }));
  config.external.push("./wdyr"); //exclude why-did-you-render from production
} else {
  config.plugins.splice(
    0,
    0,
    virtual({
      "../../lang/compiled/en-US.json": "export default {}",
    }),
  );
}

export default config;
