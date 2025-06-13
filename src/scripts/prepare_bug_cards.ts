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
    publicId: bug.publicId,
    title: bug.title,
    description: bug.description.join("\n"),
    comments: parseBugComments(bug),
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

main();
