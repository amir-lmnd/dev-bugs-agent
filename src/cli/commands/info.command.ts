import { Command } from "commander";
import { BaseCommand } from "./base.command";
import { TUIApp } from "../tui-app";
import { BugCard } from "../types";

export class InfoCommand extends BaseCommand {
  static register(program: Command): void {
    program
      .command("info")
      .alias("i")
      .description("Show bug information")
      .argument(
        "[bug-id]",
        "Bug ID to display (if not provided, shows TUI selector)"
      )
      .option("-j, --json", "Output in JSON format")
      .option("-v, --verbose", "Show detailed information")
      .action(async (bugId: string | undefined, options) => {
        await InfoCommand.execute(bugId, options);
      });
  }

  private static async execute(
    bugId: string | undefined,
    options: any
  ): Promise<void> {
    try {
      let selectedBugCard: BugCard;

      if (bugId) {
        // Direct bug lookup
        selectedBugCard = await InfoCommand.findBugCard(bugId);
      } else {
        // TUI selection
        const app = new TUIApp();
        const selectedId = await app.selectBugCard();
        selectedBugCard = await InfoCommand.findBugCard(selectedId);
      }

      // Output the bug information
      InfoCommand.displayBugInfo(selectedBugCard, options);
    } catch (error) {
      InfoCommand.handleError(error, "Info");
    }
  }

  private static displayBugInfo(bugCard: BugCard, options: any): void {
    if (options.json) {
      console.log(JSON.stringify(bugCard, null, 2));
      return;
    }

    // Human-readable format
    console.log(`\n🐛 Bug Information`);
    console.log(InfoCommand.createDivider());
    console.log(`📋 ID: ${bugCard.bugPublicId}`);
    console.log(`📝 Title: ${bugCard.bugTitle}`);
    console.log(`\n📄 Description:`);
    console.log(InfoCommand.formatDescription(bugCard.bugDescription));

    if (options.verbose) {
      console.log(`\n🔍 Additional Details:`);
      console.log(`• Raw data available in JSON format (use --json flag)`);

      // Add any additional verbose information here
      if (bugCard.bugDescription.length > 200) {
        console.log(
          `• Description length: ${bugCard.bugDescription.length} characters`
        );
      }
    }
  }

  private static formatDescription(description: string): string {
    // Format the description with proper line breaks and indentation
    const lines = description.split("\n");
    return lines.map((line) => `  ${line}`).join("\n");
  }
}
