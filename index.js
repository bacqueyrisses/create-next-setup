#!/usr/bin/env node
import prompts from "prompts";
import setupReadme from "./functions/readme.js";
import setupCommitLinting from "./functions/linter.js";
import setupNextConfig from "./functions/config.js";

async function run() {
  let preferences = {};

  const { readme } = await prompts(
    {
      type: "toggle",
      name: "readme",
      message: `Would you like to create a README?`,
      initial: "Yes",
      active: "Yes",
      inactive: "No",
    },
    {
      /**
       * User inputs Ctrl+C or Ctrl+D to exit the prompt. We should close the
       * process and not write to the file system.
       */
      onCancel: () => {
        console.error("✖ Canceled.");
        process.exit(1);
      },
    },
  );
  preferences.readme = Boolean(readme);
  const { linter } = await prompts(
    {
      type: "toggle",
      name: "linter",
      message: `Would you like to setup Husky?`,
      initial: "Yes",
      active: "Yes",
      inactive: "No",
    },
    {
      /**
       * User inputs Ctrl+C or Ctrl+D to exit the prompt. We should close the
       * process and not write to the file system.
       */
      onCancel: () => {
        console.error("✖ Canceled.");
        process.exit(1);
      },
    },
  );
  preferences.linter = Boolean(linter);
  const { config } = await prompts(
    {
      type: "toggle",
      name: "config",
      message: `Would you like to setup next.config?`,
      initial: "Yes",
      active: "Yes",
      inactive: "No",
    },
    {
      /**
       * User inputs Ctrl+C or Ctrl+D to exit the prompt. We should close the
       * process and not write to the file system.
       */
      onCancel: () => {
        console.error("✖ Canceled.");
        process.exit(1);
      },
    },
  );
  preferences.config = Boolean(config);

  if (preferences.readme) setupReadme();
  if (preferences.linter) setupCommitLinting();
  if (preferences.config) setupNextConfig();
}

await run();
