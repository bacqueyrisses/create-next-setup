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
    'lint-staged --config ".lintstagedrc.js"',
  );
  fs.writeFileSync(
    ".husky/_/commit-msg",
    'npx --no-install commitlint --edit "$1"',
  );

  // Remove husky from gitignore
  fs.unlinkSync(".husky/_/.gitignore");

  // Update package.json
  const pkg = JSON.parse(fs.readFileSync("package.json"));
  pkg["lint-staged"] = { "*": "prettier --write ." };
  pkg.scripts = pkg.scripts || {};
  pkg.scripts.format = "prettier --write .";
  fs.writeFileSync("package.json", JSON.stringify(pkg, null, 2));

  // Create commitlint.config.js
  fs.writeFileSync(
    "commitlint.config.js",
    `module.exports = {
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
          "vercel"
        ]
      ]
    }
  };`,
  );

  // Create .lintstagedrc.js
  fs.writeFileSync(
    ".lintstagedrc.js",
    `const path = require("path");

  const buildEslintCommand = (filenames) =>
    \`next lint --fix --file \${filenames
      .map((f) => path.relative(process.cwd(), f))
      .join(" --file ")}\`;

  module.exports = {
    "*.{js,jsx,ts,tsx}": [buildEslintCommand]
  };`,
  );

  // Add plugins to .prettierrc
  fs.writeFileSync(
    ".prettierrc",
    '{ "plugins": ["prettier-plugin-tailwindcss"] }',
  );

  // Run prettier
  console.log("🧹 Running prettier...");
  execSync(
    "prettier --plugin prettier-plugin-tailwindcss --log-level silent --write .",
  );

  // Output success message
  console.log("🎉 Next.js configuration completed!");
}
