import { Command } from "commander";
import { CLIHelpers } from "../helpers";
import { BugCard } from "../types";

export abstract class BaseCommand {
  /**
   * Common error handling for all commands
   */
  protected static handleError(error: unknown, commandName: string): never {
    return CLIHelpers.handleError(error, commandName);
  }

  /**
   * Common bug card lookup with helpful error messages
   */
  protected static async findBugCard(bugId: string): Promise<BugCard> {
    return CLIHelpers.findBugCard(bugId);
  }

  /**
   * Load all bug cards with error handling
   */
  protected static async loadBugCards(): Promise<BugCard[]> {
    return CLIHelpers.loadBugCards();
  }

  /**
   * Common success message formatting
   */
  protected static logSuccess(message: string): void {
    CLIHelpers.logSuccess(message);
  }

  /**
   * Common info message formatting
   */
  protected static logInfo(message: string): void {
    CLIHelpers.logInfo(message);
  }

  /**
   * Common warning message formatting
   */
  protected static logWarning(message: string): void {
    CLIHelpers.logWarning(message);
  }

  /**
   * Format text for display with optional max length
   */
  protected static formatText(text: string, maxLength?: number): string {
    return CLIHelpers.formatText(text, maxLength);
  }

  /**
   * Create a formatted divider
   */
  protected static createDivider(
    char: string = "=",
    length: number = 50
  ): string {
    return CLIHelpers.createDivider(char, length);
  }

  /**
   * Write output to file or console
   */
  protected static async outputResult(
    content: string,
    outputFile?: string
  ): Promise<void> {
    return CLIHelpers.outputResult(content, outputFile);
  }
}
