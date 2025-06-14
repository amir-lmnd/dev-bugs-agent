#!/usr/bin/env node

import { TUIApp } from "./tui-app";

async function main(): Promise<void> {
  try {
    const args = process.argv.slice(2);
    let publicId: string;

    if (args.length > 0) {
      publicId = args[0];
      console.log(publicId);
    } else {
      const app = new TUIApp();
      publicId = await app.selectBugCard();
      console.log(publicId);
    }
  } catch (error) {
    console.error(
      "Failed to get bug card:",
      error instanceof Error ? error.message : error
    );
    process.exit(1);
  }
}

main();
