import * as fs from "fs";
import * as path from "path";
import { BugCard, formatTitle } from "../../lib/services/bug_data.service";
import { TableRow } from "../types";

export class DataLoader {
  private static readonly DATA_FILE_PATH = path.join(
    __dirname,
    "..",
    "..",
    "data",
    "bug_cards.json"
  );

  public static async loadBugCards(): Promise<BugCard[]> {
    try {
      if (!fs.existsSync(this.DATA_FILE_PATH)) {
        throw new Error(`Bug cards file not found at: ${this.DATA_FILE_PATH}`);
      }

      const fileContent = fs.readFileSync(this.DATA_FILE_PATH, "utf-8");
      const bugCards: BugCard[] = JSON.parse(fileContent);

      if (!Array.isArray(bugCards)) {
        throw new Error("Invalid data format: expected an array of bug cards");
      }

      return bugCards;
    } catch (error) {
      if (error instanceof SyntaxError) {
        throw new Error(
          `Invalid JSON format in bug cards file: ${error.message}`
        );
      }
      throw error;
    }
  }

  public static convertToTableRows(bugCards: BugCard[]): TableRow[] {
    return bugCards.map((card) => ({
      id: card.bugPublicId,
      title: this.formatTitle(card.bugTitle, 50),
      description: this.truncateText(card.bugDescription, 80),
    }));
  }

  private static truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) {
      return text;
    }
    return text.substring(0, maxLength - 3) + "...";
  }

  private static formatTitle(title: string, maxLength: number): string {
    return this.formatTitle(formatTitle(title), maxLength);
  }
}
