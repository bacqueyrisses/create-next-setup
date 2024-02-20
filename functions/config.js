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
      const content = fs.readFileSync(nextConfigPath, "utf8");
      if (content.includes(loggingConfig)) {
        console.log(
          `✅ Logging configuration already exists in ${nextConfigPath}.`,
        );
      } else {
        fs.appendFileSync(nextConfigPath, `\n  ${loggingConfig}`);
        console.log(`✅ Logging configuration added to ${nextConfigPath}.`);
      }
    }
  });
}
