import fs from "fs";
import { execSync } from "child_process";

export default function setupNextConfig() {
  // Modify Next.js config
  const nextConfigFiles = [
    "next.config.js",
    "next.config.ts",
    "next.config.mjs",
  ];
  const loggingConfig = "logging: { fetches: { fullUrl: true } },";
  const routesConfig = "experimental: { typedRoutes: true },";

  nextConfigFiles.forEach((nextConfigPath) => {
    if (fs.existsSync(nextConfigPath)) {
      let content = fs.readFileSync(nextConfigPath, "utf8");
      if (!content.includes(loggingConfig)) {
        // Run Prettier to normalize next.config
        execSync(`npx prettier --log-level log --write ./${nextConfigPath}`);
        // Replace the line containing "const nextConfig = {" with loggingConfig
        content = content.replace(
          /const nextConfig\s*=\s*{/,
          `const nextConfig = {\n  ${loggingConfig}`,
        );
        fs.writeFileSync(nextConfigPath, content);
        console.log(`✅ Logging configuration added to ${nextConfigPath}.`);
      } else {
        console.log(
          `❎ Logging configuration already exists in ${nextConfigPath}.`,
        );
      }
      if (!content.includes(routesConfig)) {
        // Replace the line containing "const nextConfig = {" with loggingConfig
        content = content.replace(
          /const nextConfig\s*=\s*{/,
          `const nextConfig = {\n  ${routesConfig}`,
        );
        fs.writeFileSync(nextConfigPath, content);
        console.log(
          `✅ Typed Routes configuration added to ${nextConfigPath}.`,
        );
      } else {
        console.log(
          `❎ Typed Routes configuration already exists in ${nextConfigPath}.`,
        );
      }
    }
  });
}
