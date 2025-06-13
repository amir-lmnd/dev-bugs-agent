import * as fs from "fs";
import * as path from "path";

const filePath = path.resolve(
  __dirname,
  "../../../data/fibery/home_bionics_tickets.json"
);

function extractAttachmentUrls(): void {
  const raw = fs.readFileSync(filePath, "utf-8");
  const tickets = JSON.parse(raw);

  const urls: string[] = [];

  for (const ticket of tickets) {
    if (!ticket.comments) continue;
    for (const comment of ticket.comments) {
      const attachments = comment?.content?.attachments;
      if (Array.isArray(attachments)) {
        for (const attachment of attachments) {
          if (attachment && typeof attachment.url === "string") {
            urls.push(attachment.url);
          }
        }
      }
    }
  }

  urls.forEach((url) => console.log(url));
}
