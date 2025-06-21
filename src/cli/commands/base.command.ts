import { Command } from "commander";
import { DataLoader } from "../data-loader";
import { BugCard } from "../types";

export abstract class BaseCommand {
  /**
   * Common error handling for all commands
   */
  protected static handleError(error: unknown, commandName: string): never {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`❌ ${commandName} Error: ${errorMessage}`);
    process.exit(1);
  }

  /**
   * Common bug card lookup with helpful error messages
   */
  protected static async findBugCard(bugId: string): Promise<BugCard> {
    const bugCards = await DataLoader.loadBugCards();
    const bugCard = bugCards.find((card) => card.bugPublicId === bugId);

    if (!bugCard) {
      console.error(`❌ Bug card with ID '${bugId}' not found`);
      console.log(`\n💡 Available bug IDs:`);
      const availableIds = bugCards
        .slice(0, 5)
        .map((card) => `  • ${card.bugPublicId}`);
      console.log(availableIds.join("\n"));
      if (bugCards.length > 5) {
        console.log(`  ... and ${bugCards.length - 5} more`);
      }
      console.log(`\n🔍 Use 'dev-bugs info' to browse all available bugs`);
      process.exit(1);
    }

    return bugCard;
  }

  /**
   * Load all bug cards with error handling
   */
  protected static async loadBugCards(): Promise<BugCard[]> {
    try {
      return await DataLoader.loadBugCards();
    } catch (error) {
      BaseCommand.handleError(error, "Data Loading");
    }
  }

  /**
   * Common success message formatting
   */
  protected static logSuccess(message: string): void {
    console.log(`✅ ${message}`);
  }

  /**
   * Common info message formatting
   */
  protected static logInfo(message: string): void {
    console.log(`ℹ️  ${message}`);
  }

  /**
   * Common warning message formatting
   */
  protected static logWarning(message: string): void {
    console.log(`⚠️  ${message}`);
  }

  /**
   * Format text for display with optional max length
   */
  protected static formatText(text: string, maxLength?: number): string {
    if (!maxLength || text.length <= maxLength) {
      return text;
    }
    return text.substring(0, maxLength - 3) + "...";
  }

  /**
   * Create a formatted divider
   */
  protected static createDivider(
    char: string = "=",
    length: number = 50
  ): string {
    return char.repeat(length);
  }

  /**
   * Write output to file or console
   */
  protected static async outputResult(
    content: string,
    outputFile?: string
  ): Promise<void> {
    if (outputFile) {
      const fs = await import("fs");
      fs.writeFileSync(outputFile, content);
      BaseCommand.logSuccess(`Output written to ${outputFile}`);
    } else {
      console.log(content);
    }
  }
}
