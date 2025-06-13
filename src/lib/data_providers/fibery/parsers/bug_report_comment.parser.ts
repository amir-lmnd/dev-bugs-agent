import { FiberyField } from "../common";

interface FiberyCommentAttachment {
  url: string;
  name: string;
}

interface FiberyCommentContent {
  text: string[];
  attachments: FiberyCommentAttachment[];
}

interface FiberyBugReportComment {
  authorName: string;
  content: FiberyCommentContent;
  createdAt: Date;
}

export function parseBugReportComment(
  comment: any,
  commentDocuments: any
): FiberyBugReportComment {
  const commentDocument = commentDocuments.find(
    (document: any) =>
      document[FiberyField.Secret] ===
      comment[FiberyField.commentDocumentSecret]
  );

  return {
    authorName: comment[FiberyField.createdBy][FiberyField.createdByName],
    content: parseCommentContent(commentDocument),
    createdAt: new Date(comment[FiberyField.creationDate]),
  };
}

function parseCommentContent(commentDocument: any): FiberyCommentContent {
  const commentTexts = [];
  const commentAttachments = [];

  const content = commentDocument.content.doc.content[0].content;
  const textNodes = content.filter((item: any) => item.type != "hard_break");

  for (const node of textNodes) {
    commentTexts.push(node.text);
    // is node.marks defined
    if (node.marks) {
      commentAttachments.push(...parseCommentAttachment(node.marks));
    }
  }

  return {
    text: commentTexts,
    attachments: commentAttachments,
  };

  function parseCommentAttachment(marks: any): FiberyCommentAttachment[] {
    const attachments = [];

    for (const mark of marks) {
      if (mark.type === "strong") continue;
      if (mark.type === "link") {
        attachments.push({
          url: mark.attrs.href,
          name: mark.attrs.title,
        });
      }
    }

    return attachments;
  }
}
