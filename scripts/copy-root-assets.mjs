import fs from "fs-extra";
import path from "path";

const projectRoot = path.join(path.dirname(new URL(import.meta.url).pathname), "..");
const srcStaticDir = path.join(projectRoot, "src", "static");
const buildDir = path.join(projectRoot, "build");

// Add any additional root-level assets here in the future
const rootAssets = ["ads.txt"];

async function copyRootAssets() {
  await fs.ensureDir(buildDir);
  const results = await Promise.all(
    rootAssets.map(async (fname) => {
      const src = path.join(srcStaticDir, fname);
      const dst = path.join(buildDir, fname);
      const exists = await fs.pathExists(src);
      if (!exists) {
        console.warn(`[copy-root-assets] Skipping missing file: ${fname}`);
        return { fname, copied: false };
      }
      await fs.copy(src, dst);
      return { fname, copied: true };
    }),
  );
  const copied = results.filter((r) => r.copied).map((r) => r.fname);
  if (copied.length) {
    console.log(`[copy-root-assets] Copied to build/: ${copied.join(", ")}`);
  }
}

copyRootAssets().catch((err) => {
  console.error("[copy-root-assets] Error:", err);
  // Do not fail the build due to optional copies
  process.exit(0);
});

