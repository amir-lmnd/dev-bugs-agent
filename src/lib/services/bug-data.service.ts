import { exportTickets } from "../data_providers/fibery/export";
import { FiberyBugReport } from "../data_providers/fibery/parsers/bug_report.parser";
import * as fs from "fs";
import * as path from "path";

export interface BugCard {
  bugPublicId: string;
  bugCreatedAt: string;
  claimPublicId: string | null;
  bugTitle: string;
  bugDescription: string;
}

export async function pullBugDataFromFibery(): Promise<FiberyBugReport[]> {
  const dataCleaner = (tickets: FiberyBugReport[]) =>
    tickets.map((ticket) => ({
      ...ticket,
      description: ticket.description,
    }));

  const bugs = await exportTickets({
    output: ["json"],
    dataCleaner,
  });

  return bugs;
}

export function loadRawBugData(): FiberyBugReport[] {
  const rawDataPath = path.resolve(
    __dirname,
    "../../../data/fibery/home_bionics_tickets_raw.json"
  );

  return JSON.parse(fs.readFileSync(rawDataPath, "utf8"));
}

export function transformToBugCards(bugs: FiberyBugReport[]): BugCard[] {
  return bugs.map(getBugCard);
}

export function saveBugCards(bugCards: BugCard[]): string {
  const outputPath = path.resolve(__dirname, "../../../data/bug_cards.json");
  fs.writeFileSync(outputPath, JSON.stringify(bugCards, null, 2));
  return outputPath;
}

export async function pullAndProcessBugData(): Promise<{
  bugCount: number;
  cardCount: number;
  outputPath: string;
}> {
  const bugs = await pullBugDataFromFibery();
  const bugCards = transformToBugCards(bugs);
  const outputPath = saveBugCards(bugCards);

  return {
    bugCount: bugs.length,
    cardCount: bugCards.length,
    outputPath,
  };
}

function getBugCard(bug: FiberyBugReport): BugCard {
  return {
    bugPublicId: bug.publicId,
    bugCreatedAt: bug.createdAt.toISOString(),
    claimPublicId: extractClaimPublicId(bug.exampleUrl),
    bugTitle: bug.title,
    bugDescription: bug.description.join("\n"),
  };
}

function extractClaimPublicId(exampleUrl: string | null): string | null {
  if (!exampleUrl) return null;

  const claimPublicId = exampleUrl.match(/LC\w+/);
  return claimPublicId ? claimPublicId[0] : null;
}
