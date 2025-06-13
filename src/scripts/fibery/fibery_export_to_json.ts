import { exportTickets } from "../../lib/data_providers/fibery/export";
import { FiberyBugReport } from "../../lib/data_providers/fibery/parsers/bug_report.parser";

const dataCleaner = (tickets: FiberyBugReport[]) =>
  tickets.map((ticket) => ({
    ...ticket,
    description: ticket.description,
  }));

async function main() {
  try {
    const bugs = await exportTickets({
      output: ["json"],
      dataCleaner,
    });

    console.log(bugs);
  } catch (error) {
    console.error("❌ Error in main:", error);

    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }
    process.exit(1);
  }
}

main();
