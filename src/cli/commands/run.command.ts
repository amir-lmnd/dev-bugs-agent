import { Command } from "commander";
import { BaseCommand } from "./base.command";
import { BugCard } from "../types";
import { spawn } from "child_process";

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
      const prompt = RunCommand.generateInvestigationPrompt(selectedBugCard);
      // console.log(prompt);
      const result = await RunCommand.runInvestigation(prompt);
      // console.log(result);
      // await RunCommand.outputResult(output, options.output);
    } catch (error) {
      RunCommand.handleError(error, "Run");
    }
  }

  private static async runInvestigation(prompt: string): Promise<void> {
    const result = await RunCommand.callClaudeCodeExecutable(prompt);
    console.log(result);
  }

  private static async callClaudeCodeExecutable(prompt: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const claude = spawn("claude", [], {
        stdio: ["pipe", "inherit"],
        shell: true,
      });

      claude.stdin?.write(prompt);
      claude.stdin?.end();

      claude.on("close", (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`Claude process exited with code ${code}`));
        }
      });

      claude.on("error", (error) => {
        reject(error);
      });
    });
  }

  private static generateInvestigationPrompt(bugCard: BugCard): string {
    return `<instruction>
    Investigate the following bug report
    </instruction>

    <bug-report>
    ${JSON.stringify(bugCard, null, 2)}
    </bug-report>`;
  }
}
