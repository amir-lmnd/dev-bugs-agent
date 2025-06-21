import { DataLoader } from "./data-loader";
import { BugCard } from "./types";

export class CLIHelpers {
  static handleError(error: unknown, commandName: string): never {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`❌ ${commandName} Error: ${errorMessage}`);
    process.exit(1);
  }

  static async findBugCard(bugId: string): Promise<BugCard> {
    const bugCards = await DataLoader.loadBugCards();
    const bugCard = bugCards.find((card) => card.bugPublicId === bugId);

    if (!bugCard) {
      console.error(`❌ Bug card with ID '${bugId}' not found`);
      console.log(`\n🔍 Use 'dev-bugs info' to browse all available bugs`);
      console.log(`\n🔍 Use 'dev-bugs pull' to pull bugs from fibery`);
      process.exit(1);
    }

    return bugCard;
  }

  static async loadBugCards(): Promise<BugCard[]> {
    try {
      return await DataLoader.loadBugCards();
    } catch (error) {
      CLIHelpers.handleError(error, "Data Loading");
    }
  }

  static logSuccess(message: string): void {
    console.log(`✅ ${message}`);
  }

  static logInfo(message: string): void {
    console.log(`ℹ️  ${message}`);
  }

  static logWarning(message: string): void {
    console.log(`⚠️  ${message}`);
  }

  static formatText(text: string, maxLength?: number): string {
    if (!maxLength || text.length <= maxLength) {
      return text;
    }
    return text.substring(0, maxLength - 3) + "...";
  }

  static createDivider(char: string = "=", length: number = 50): string {
    return char.repeat(length);
  }

  static async outputResult(
    content: string,
    outputFile?: string
  ): Promise<void> {
    if (outputFile) {
      const fs = await import("fs");
      fs.writeFileSync(outputFile, content);
      CLIHelpers.logSuccess(`Output written to ${outputFile}`);
    } else {
      console.log(content);
    }
  }

  static formatDescription(description: string): string {
    const lines = description.split("\n");
    return lines.map((line) => `  ${line}`).join("\n");
  }
}
