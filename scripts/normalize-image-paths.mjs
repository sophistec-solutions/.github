import { readdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const profileDirectory = path.join(repositoryRoot, "profile");
const assetBaseUrl =
  "https://raw.githubusercontent.com/sophistec-solutions/.github/main/assets/";

const readmeFiles = (await readdir(profileDirectory)).filter(
  (file) => file.startsWith("README") && file.endsWith(".md"),
);

let updatedFiles = 0;
let updatedPaths = 0;

for (const file of readmeFiles) {
  const filePath = path.join(profileDirectory, file);
  const source = await readFile(filePath, "utf8");
  const matches = source.match(/\.\.\/assets\//g) ?? [];

  if (matches.length === 0) continue;

  await writeFile(filePath, source.replaceAll("../assets/", assetBaseUrl), "utf8");
  updatedFiles += 1;
  updatedPaths += matches.length;
}

console.log(`Updated ${updatedPaths} image paths in ${updatedFiles} README files.`);
