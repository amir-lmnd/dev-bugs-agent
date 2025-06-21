import { Command } from "commander";
import { BaseCommand } from "./base.command";
import { CLIHelpers } from "../helpers";
import { pullAndProcessBugData } from "../../lib/services/bug-data.service";

export class PullCommand extends BaseCommand {
  static register(program: Command): void {
    program
      .command("pull")
      .alias("p")
      .description("Pull latest bug data from remote sources")
      .option(
        "-s, --source <source>",
        "Data source to pull from (fibery|all)",
        "all"
      )
      .action(async (options) => {
        await PullCommand.execute(options);
      });
  }

  private static async execute(options: any): Promise<void> {
    try {
      CLIHelpers.logInfo("Starting pull operation...");
      CLIHelpers.logInfo(`Source: ${options.source}`);
      console.log("");

      if (options.source === "fibery" || options.source === "all") {
        await this.pullFromFibery();
      }

      CLIHelpers.logSuccess("Pull operation completed successfully!");
    } catch (error) {
      PullCommand.handleError(error, "Pull");
    }
  }

  private static async pullFromFibery(): Promise<void> {
    CLIHelpers.logInfo("Fetching bug data from Fibery...");

    const result = await pullAndProcessBugData();

    CLIHelpers.logInfo(`Retrieved ${result.bugCount} bug reports from Fibery`);
    CLIHelpers.logInfo(`Generated ${result.cardCount} bug cards`);
    CLIHelpers.logInfo(`Saved to: ${result.outputPath}`);
  }
}
