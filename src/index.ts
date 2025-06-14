#!/usr/bin/env node

import { TUIApp } from "./tui-app";

async function main(): Promise<void> {
  try {
    const app = new TUIApp();
    await app.initialize();
    app.run();
  } catch (error) {
    console.error(
      "Failed to start application:",
      error instanceof Error ? error.message : error
    );
    process.exit(1);
  }
}

main();
