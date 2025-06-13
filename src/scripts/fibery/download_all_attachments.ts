import * as fs from "fs";
import * as path from "path";
import axios from "axios";

const filePath = path.resolve(
  __dirname,
  "../../../data/fibery/home_bionics_tickets.json"
);

type Attachment = {
  ticketId: string;
  url: string;
};

function isDownloadableUrl(url: string) {
  return (
    url.endsWith(".pdf") ||
    url.endsWith(".jpg") ||
    url.endsWith(".jpeg") ||
    url.endsWith(".png") ||
    url.endsWith(".gif") ||
    url.endsWith(".bmp") ||
    url.endsWith(".tiff") ||
    url.endsWith(".ico") ||
    url.endsWith(".webp") ||
    url.endsWith(".svg") ||
    url.endsWith(".mp4") ||
    url.endsWith(".mp3") ||
    url.endsWith(".wav") ||
    url.endsWith(".ogg") ||
    url.endsWith(".webm") ||
    url.endsWith(".mov") ||
    url.endsWith(".avi") ||
    url.endsWith(".wmv") ||
    url.endsWith(".flv") ||
    url.endsWith(".mkv") ||
    url.endsWith(".m4v") ||
    url.endsWith(".m4a") ||
    url.endsWith(".m4b") ||
    url.endsWith(".m4p") ||
    url.endsWith(".m4v") ||
    url.endsWith(".m4a") ||
    url.endsWith(".m4b") ||
    url.endsWith(".m4p") ||
    url.endsWith(".m4v") ||
    url.endsWith(".m4a") ||
    url.endsWith(".m4b") ||
    url.endsWith(".m4p")
  );
}

function extractAttachments(): Attachment[] {
  const raw = fs.readFileSync(filePath, "utf-8");
  const tickets = JSON.parse(raw);

  const urls: Attachment[] = [];

  for (const ticket of tickets) {
    if (!ticket.comments) continue;
    for (const comment of ticket.comments) {
      const attachments = comment?.content?.attachments;
      if (Array.isArray(attachments)) {
        for (const attachment of attachments) {
          const isUrl = typeof attachment.url === "string";
          const fileExtension = isDownloadableUrl(attachment.url);
          if (attachment && isUrl && fileExtension) {
            urls.push({
              ticketId: ticket.publicId,
              url: attachment.url,
            });
          }
        }
      }
    }
  }

  return urls;
}

async function downloadAndSaveAttachments(
  attachments: Attachment[]
): Promise<string[]> {
  console.log(`🗂️ 🟢 Downloading ${attachments.length} attachments`);
  const saveDir = path.resolve(__dirname, "../../../data/attachments");
  fs.mkdirSync(saveDir, { recursive: true });
  const savedFiles: string[] = [];

  for (const attachment of attachments) {
    try {
      const urlParts = attachment.url.split("/");
      const filePrefix = `${attachment.ticketId}_`;
      const fileName = urlParts[urlParts.length - 1];
      const filePath = path.join(saveDir, filePrefix + fileName);
      console.log(`🗂️ Downloading ${fileName} to ${filePath}`);

      if (fs.existsSync(filePath)) {
        savedFiles.push(filePath);
        console.log(`🗂️ ⚠️ ${fileName} already exists`);
        continue;
      }

      const response = await axios.get(attachment.url, {
        responseType: "arraybuffer",
      });
      fs.writeFileSync(filePath, response.data);
      savedFiles.push(filePath);
    } catch (err) {
      console.error(
        `🗂️ ❌ Failed to download attachment from ${attachment.url}:`,
        err
      );
    }
  }
  return savedFiles;
}

if (require.main === module) {
  const urls = extractAttachments();
  downloadAndSaveAttachments(urls.slice(0, 10));
}
