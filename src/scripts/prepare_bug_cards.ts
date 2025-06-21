import {
  loadRawBugData,
  transformToBugCards,
  saveBugCards,
} from "../lib/services/bug_data.service";

function main() {
  const bugs = loadRawBugData();
  console.log(bugs.length);

  const bugCards = transformToBugCards(bugs);
  const outputPath = saveBugCards(bugCards);

  console.log(`Generated ${bugCards.length} bug cards`);
  console.log(`Saved to: ${outputPath}`);
}

main();
