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
    "eslint-config-prettier@latest"
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
    'lint-staged --config ".husky/.lintstagedrc.js"',
  );
  fs.writeFileSync(
    ".husky/_/commit-msg",
    'npx --no-install commitlint --edit "$1"',
  );

  // Update package.json
  const pkg = JSON.parse(fs.readFileSync("package.json"));
  pkg["prettier"] = {
    plugins: [
      "prettier-plugin-tailwindcss"
    ],
  };
  pkg["eslintConfig"] = {
    "extends": ["next/core-web-vitals", "prettier"],
    rules: {
      "react/no-unescaped-entities": 0,
      "react-hooks/exhaustive-deps": 0,
    },
  };
  pkg["postcss"] = {
    "plugins": {
      "tailwindcss": {},
      "autoprefixer": {}
    }
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
  pkg.scripts.format = "prettier --write . --plugin=prettier-plugin-tailwindcss --plugin=prettier-plugin-organize-imports";
  fs.writeFileSync("package.json", JSON.stringify(pkg, null, 2));


  // Create .lintstagedrc.js
  fs.writeFileSync(
    ".husky/.lintstagedrc.js",
    `const path = require("path");

  const buildEslintCommand = (filenames) =>
    \`next lint --fix --file \${filenames
      .map((f) => path.relative(process.cwd(), f))
      .join(" --file ")}\`;

  module.exports = {
    "*.{js,jsx,ts,tsx}": [buildEslintCommand],
      "*": "node rws.js && prettier --write --plugin=prettier-plugin-tailwindcss --plugin=prettier-plugin-organize-imports"
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
