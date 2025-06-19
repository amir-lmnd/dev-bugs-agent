import * as fs from "fs";
import * as path from "path";

function loadRawBugs() {
  return JSON.parse(
    fs.readFileSync(
      path.resolve(
        __dirname,
        "../../data/fibery/home_bionics_tickets_raw.json"
      ),
      "utf8"
    )
  );
}

function getBugCard(bug: any) {
  return {
    bugPublicId: bug.publicId,
    bugCreatedAt: bug.createdAt,
    claimPublicId: extractClaimPublicId(bug.exampleUrl),
    bugTitle: bug.title,
    bugDescription: bug.description.join("\n"),
    // comments: parseBugComments(bug), disabled for now as it add noise to the initial building steps
  };
}

function main() {
  const bugs = loadRawBugs();
  console.log(bugs.length);
  const bugCards = bugs.map(getBugCard);

  fs.writeFileSync(
    path.resolve(__dirname, "../../data/bug_cards.json"),
    JSON.stringify(bugCards, null, 2)
  );
}

function parseBugComments(bug: any) {
  const comments = bug.comments.map((comment: any) => {
    return {
      author: comment.author,
      content: comment.content.text.join("\n"),
      createdAt: comment.createdAt,
    };
  });
  return comments;
}

function extractClaimPublicId(exampleUrl: string | null) {
  if (!exampleUrl) return null;

  // Example exampleUrls:
  // https://blender.lemonade.com/backoffice/home/claims/LC7120BECC4/workflows#LTASK293-1010-705
  // https://blender.lemonade.com/backoffice/home/claims/LC7120BECC4/
  // https://blender.lemonade.com/backoffice/home/claims/LC7120BECC4
  const claimPublicId = exampleUrl.match(/LC\w+/);
  return claimPublicId ? claimPublicId[0] : null;
}

main();
