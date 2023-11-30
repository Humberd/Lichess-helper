const fs = require("fs");
const path = require("path");
const shx = require("shelljs");

async function main() {
  const header = fs.readFileSync(
    path.resolve(__dirname, "../src/userscript-header.js"),
    "utf8"
  );
  const main = fs.readFileSync(
    path.resolve(__dirname, "../build/static/js/main.js"),
    "utf8"
  );
  const mainWrappedScript = main.trim();
  const buffer = header + mainWrappedScript;
  shx.mkdir("-p", "../dist");
  fs.writeFileSync(path.resolve(__dirname, "../dist/index.user.js"), buffer);
}

main();
