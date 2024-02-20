import fs from "fs";

export default function setupNextConfig() {
  // Modify Next.js config
  const nextConfigFiles = [
    "next.config.js",
    "next.config.ts",
    "next.config.mjs",
  ];
  const loggingConfig = "logging: { fetches: { fullUrl: true } },";

  nextConfigFiles.forEach((nextConfigPath) => {
    if (fs.existsSync(nextConfigPath)) {
      let content = fs.readFileSync(nextConfigPath, "utf8");
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
          `✅ Logging configuration already exists in ${nextConfigPath}.`,
        );
      }
    }
  });
}
