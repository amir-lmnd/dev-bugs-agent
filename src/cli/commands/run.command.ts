import { Command } from "commander";
import { BaseCommand } from "./base.command";
import { BugCard } from "../types";

export class RunCommand extends BaseCommand {
  static register(program: Command): void {
    program
      .command("run")
      .alias("r")
      .description("Run investigation on a bug")
      .argument("<bug-id>", "Bug ID to run analysis on")
      .option(
        "-m, --mode <type>",
        "Running mode (interactive|background)",
        "interactive"
      )
      .option("-o, --output <file>", "Output to file instead of stdout")
      .action(async (bugId: string, options) => {
        await RunCommand.execute(bugId, options);
      });
  }

  private static async execute(bugId: string, options: any): Promise<void> {
    try {
      const selectedBugCard = await RunCommand.findBugCard(bugId);
      const output = RunCommand.generateOutput(selectedBugCard, options.format);
      await RunCommand.outputResult(output, options.output);
    } catch (error) {
      RunCommand.handleError(error, "Run");
    }
  }

  private static generateOutput(bugCard: BugCard, format: string): string {
    switch (format) {
      case "json":
        return JSON.stringify(bugCard, null, 2);

      case "summary":
        return RunCommand.generateSummary(bugCard);

      case "prompt":
      default:
        return RunCommand.generateInvestigationPrompt(bugCard);
    }
  }

  private static generateInvestigationPrompt(bugCard: BugCard): string {
    return `🔍 Investigation Prompt for Bug: ${bugCard.bugPublicId}

Please investigate this bug with the following information:

${JSON.stringify(bugCard, null, 2)}

Analysis focus areas:
1. Reproduce the issue based on the description
2. Identify the root cause
3. Assess the impact and severity  
4. Propose potential solutions
5. Consider any related bugs or patterns

Investigation checklist:
□ Environment details gathered
□ Steps to reproduce confirmed
□ Root cause identified
□ Impact assessment completed
□ Solution proposed
□ Testing strategy defined`;
  }

  private static generateSummary(bugCard: BugCard): string {
    return `📋 Bug Summary: ${bugCard.bugPublicId}

Title: ${bugCard.bugTitle}

Description Summary:
${RunCommand.formatText(bugCard.bugDescription, 200)}

Key Details:
• Bug ID: ${bugCard.bugPublicId}
• Title Length: ${bugCard.bugTitle.length} chars
• Description Length: ${bugCard.bugDescription.length} chars
• Analysis Status: Ready for investigation`;
  }
}
