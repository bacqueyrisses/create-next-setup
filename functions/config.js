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
      // Run Prettier to normalize next.config
      execSync(`npx prettier --log-level log --write ./${nextConfigPath}`);
      if (!content.includes(loggingConfig)) {
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

      if (!content.includes("experimental:")) {
        // If experimental block doesn't exist, add it with typedRoutes
        content = content.replace(
          /const nextConfig\s*=\s*{/,
          `const nextConfig = {\n  ${routesConfig}`,
        );
      } else if (!content.includes("typedRoutes")) {
        // If experimental block exists but typedRoutes doesn't, add it
        content = content.replace(
          /experimental\s*:\s*{/,
          `experimental: {\n    typedRoutes: true,`,
        );
      }
      fs.writeFileSync(nextConfigPath, content);
      // Run Prettier to normalize next.config
      execSync(`npx prettier --log-level log --write ./${nextConfigPath}`);
      console.log(`✅ Typed Routes configuration added to ${nextConfigPath}.`);
    }
  });
}
