import { execSync } from "child_process";
import fs from "fs";

export default function setupCommitLinting() {
  console.log("🐶 Setting up commit linter...");

  // Install dependencies
  const dependencies = [
    "husky",
    "lint-staged",
    "@commitlint/config-conventional",
    "@commitlint/cli",
    "prettier@latest",
    "prettier-plugin-tailwindcss@latest",
    "tailwindcss@latest",
    "prettier-plugin-organize-imports@latest",
    "eslint-config-prettier@latest",
    "prettier-plugin-embed",
    "prettier-plugin-sql",
  ];
  dependencies.forEach((dep) => {
    console.log(`✨ Installing ${dep}...`);
    execSync(`npm install --save-dev ${dep}`);
  });

  // Initialize husky
  execSync("npx husky init");

  // Configure husky hooks
  fs.writeFileSync(
    ".husky/pre-commit",
    `#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

# lint and format staged files
npx lint-staged --config ".husky/.lintstagedrc.js"

# verify typescript staged files
npx tsc --build .`,
  );

  fs.writeFileSync(
    ".husky/_/commit-msg",
    `#!/usr/bin/env sh

# check commit message format using commitlint
npx --no-install commitlint --edit "\$1"`,
  );

  // Update package.json
  const pkg = JSON.parse(fs.readFileSync("package.json"));
  pkg["prettier"] = {
    plugins: [
      "prettier-plugin-tailwindcss",
      "prettier-plugin-embed",
      "prettier-plugin-sql",
    ],
    embeddedSqlIdentifiers: ["sql"],
    language: "postgresql",
    keywordCase: "upper",
  };
  pkg["eslintConfig"] = {
    extends: ["next/core-web-vitals", "prettier"],
    rules: {
      "react/no-unescaped-entities": 0,
      "react-hooks/exhaustive-deps": 0,
    },
  };
  pkg["postcss"] = {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  };
  pkg["commitlint"] = {
    extends: ["@commitlint/config-conventional"],
    rules: {
      "type-enum": [
        2,
        "always",
        [
          "feat",
          "fix",
          "docs",
          "chore",
          "style",
          "refactor",
          "ci",
          "test",
          "revert",
          "perf",
          "vercel",
        ],
      ],
    },
  };
  pkg.scripts = pkg.scripts || {};
  pkg.scripts.format =
    "prettier --write . --plugin=prettier-plugin-tailwindcss --plugin=prettier-plugin-organize-imports --plugin=prettier-plugin-embed --plugin=prettier-plugin-sql";
  fs.writeFileSync("package.json", JSON.stringify(pkg, null, 2));

  // Create rws.js (removes classnames whitespaces)
  fs.writeFileSync(
    "rws.js",
    `const fs = require("fs");
const path = require("path");

const directoriesToIgnore = ["node_modules", ".git", ".next"];
const acceptedFileExtensions = [".js", ".jsx", ".ts", ".tsx"];
const defaultRootDirectory = "./";

function removeWhiteSpaceFromJSX(jsxString) {
  const regex = /\\s+/g;
  return jsxString.replace(regex, " ").trim();
}

function shouldIgnoreDirectory(directoryName) {
  return directoriesToIgnore.includes(directoryName);
}

function processDirectory(directoryPath) {
  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      console.error("Error reading directory:", err);
      return;
    }

    files.forEach((file) => {
      const filePath = path.join(directoryPath, file);

      fs.stat(filePath, (err, stats) => {
        if (err) {
          console.error("Error getting file stats:", err);
          return;
        }

        if (stats.isDirectory()) {
          if (!shouldIgnoreDirectory(file)) {
            processDirectory(filePath);
          }
        } else if (acceptedFileExtensions.includes(path.extname(file))) {
          fs.readFile(filePath, "utf8", (err, data) => {
            if (err) {
              console.error("Error reading file:", err);
              return;
            }

            const modifiedContent = data.replace(
              /className="(.*?)"/g,
              (match, className) => {
                const compactedClassName = removeWhiteSpaceFromJSX(className);
                return \`className="\${compactedClassName}"\`;
              },
            );

            fs.writeFile(filePath, modifiedContent, "utf8", (err) => {
              if (err) {
                console.error("Error writing file:", err);
              } else {
                console.log(\`Modified and saved: \${file}\`);
              }
            });
          });
        }
      });
    });
  });
}

const rootDirectory = process.argv[2] || defaultRootDirectory;

processDirectory(rootDirectory);
`,
  );

  // Create .lintstagedrc.js
  fs.writeFileSync(
    ".husky/.lintstagedrc.js",
    `const path = require("path");

  const buildEslintCommand = (filenames) =>
    \`next lint --fix --file \${filenames
      .map((f) => path.relative(process.cwd(), f))
      .join(" --file ")}\`;

  module.exports = {
  "*.{js,jsx,ts,tsx}": [
    "node rws.js",
    "prettier --write --plugin=prettier-plugin-tailwindcss --plugin=prettier-plugin-organize-imports --plugin=prettier-plugin-embed --plugin=prettier-plugin-sql",
    buildEslintCommand,
  ],
  };`,
  );

  // Remove .eslintrc.json as the config is now in the package.json
  fs.unlinkSync(".eslintrc.json");

  // Remove postcss.config.js as the config is now in the package.json
  fs.unlinkSync("postcss.config.js");

  console.log("");
  // Run prettier
  console.log("🧹 Running Prettier...");
  execSync(
    "npx prettier --log-level silent --write .husky/.lintstagedrc.js package.json",
  );

  // Output success message
  console.log("🎉 Next.js configuration completed!");
}
