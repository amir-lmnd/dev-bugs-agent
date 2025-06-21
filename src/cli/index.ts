#!/usr/bin/env node

import { Command } from "commander";
import { InfoCommand } from "./commands/info.command";
import { RunCommand } from "./commands/run.command";
import { PullCommand } from "./commands/pull.command";

const program = new Command();

program
  .name("dev-bugs")
  .description("CLI tool for managing development bugs")
  .version("1.0.0");

// Register commands
InfoCommand.register(program);
RunCommand.register(program);
PullCommand.register(program);

// Parse command line arguments
program.parse(process.argv);

// Show help if no arguments provided
if (!process.argv.slice(2).length) {
  program.outputHelp();
}
