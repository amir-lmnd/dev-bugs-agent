import omit from "lodash/omit.js";
import { FiberyBugReport } from "./parsers/bug_report.parser";
import { FiberyProvider } from "./fibery.provider";
import { writeFile } from "../../fs";

const FILE_NAME = "home_bionics_tickets";
const FILE_DIR = "data/fibery";

/**
 * Cleans the tickets for CSV export
 * @param tickets - The tickets to clean
 * @returns The cleaned tickets
 */
export function dataCleanerForCsv(tickets: FiberyBugReport[]) {
  return tickets.map((ticket) => {
    ticket.description = ticket.description.map((line) =>
      line.replace(/,/g, "")
    );
    ticket.title = ticket.title.replace(/,/g, "");
    return omit(ticket, ["comments", "tasks"]);
  });
}

/**
 * Default data cleaner, does not clean anything
 * @param bugs - The bugs to clean
 * @returns The cleaned bugs
 */
export const defaultDataCleaner = (bugs: FiberyBugReport[]) => bugs;

/**
 * Options for the exportTickets function
 * @param output - The output formats to export
 * @param dataCleaner - The data cleaner to use
 */
interface ExportOptions {
  output: ("json" | "csv")[];
  dataCleaner?: (tickets: FiberyBugReport[]) => FiberyBugReport[];
}

/**
 * Exports the tickets to the specified formats
 * @param options - The options for the export
 */
export async function exportTickets(
  options: ExportOptions
): Promise<FiberyBugReport[]> {
  const fibery = new FiberyProvider();
  const tickets = await fibery.getHomeBionicsBugs();

  const cleanedTickets = options.dataCleaner
    ? options.dataCleaner(tickets)
    : defaultDataCleaner(tickets);

  for (const format of options.output) {
    switch (format) {
      case "json":
        saveJson(cleanedTickets, FILE_NAME);
        break;
      case "csv":
        saveCsv(cleanedTickets, FILE_NAME);
        break;
      default:
        throw new Error(`Invalid output format: ${format}`);
    }
  }

  return tickets;
}

function saveCsv(tickets: any[], filename: string) {
  const qualifiedFilename = `${filename}.csv`;
  const headers = Object.keys(tickets[0]);
  const headerRow = headers.join(",");

  const dataRows = tickets.map((ticket) => Object.values(ticket));
  const csv = [headerRow, ...dataRows].join("\n");

  writeFile(qualifiedFilename, "data/fibery", csv);
}

function saveJson(tickets: any[], filename: string) {
  const qualifiedFilename = `${filename}.json`;
  writeFile(qualifiedFilename, FILE_DIR, JSON.stringify(tickets, null, 2));
}
