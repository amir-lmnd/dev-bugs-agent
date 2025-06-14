#!/usr/bin/env node

import { TUIApp } from "./tui-app";
import { DataLoader } from "./data-loader";
import { spawn } from "child_process";

async function main(): Promise<void> {
  try {
    const args = process.argv.slice(2);
    let publicId: string;

    if (args.length > 0) {
      publicId = args[0];
    } else {
      const app = new TUIApp();
      publicId = await app.selectBugCard();
    }

    const bugCards = await DataLoader.loadBugCards();
    const selectedBugCard = bugCards.find((card) => card.publicId === publicId);

    if (!selectedBugCard) {
      console.error(`Bug card with ID '${publicId}' not found`);
      process.exit(1);
    }

    const bugCardJson = JSON.stringify(selectedBugCard, null, 2);
    const prompt = `Investigate this bug: ${bugCardJson}`;

    console.log(`Launching Claude to investigate bug ${publicId}...`);

    const claude = spawn("claude", [prompt], {
      stdio: "inherit",
      shell: true,
    });

    claude.on("close", (code) => {
      if (code !== 0) {
        console.error(`Claude process exited with code ${code}`);
        process.exit(code || 1);
      }
    });

    claude.on("error", (error) => {
      console.error("Failed to start Claude:", error.message);
      console.error("Make sure 'claude' command is available in your PATH");
      process.exit(1);
    });
  } catch (error) {
    console.error(
      "Failed to get bug card:",
      error instanceof Error ? error.message : error
    );
    process.exit(1);
  }
}

main();
