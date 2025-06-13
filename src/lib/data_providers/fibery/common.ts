import { FiberyClient } from "../../clients/fibery.client.js";
import fs from "fs";

export enum FiberyField {
  id = "fibery/id",
  creationDate = "fibery/creation-date",
  publicId = "fibery/public-id",
  name = "Quality/Name",
  description = "Quality/Description",
  url = "Quality/Example URL",
  priority = "Quality/Priority",
  closingReason = "Quality/Closing Reason",
  subIssueType = "Quality/Sub Issue Type",
  errorLog = "Quality/Error Log",
  bugArea = "Quality/Bug Area",
  tags = "Tags/Tags",
  isFinalState = "?is-final-state",
  numberOfRelatedBugs = "Quality/Number of Related Bugs",
  tasks = "Quality/Tasks",
  Comments = "comments/comments",
  commentDocumentSecret = "comment/document-secret",
  Secret = "secret",
  taskDocumentSecret = "task/document-secret",
  createdBy = "fibery/created-by",
  createdByName = "user/name",
  createdByEmail = "user/email",
  createdByAvatar = "avatar/avatars",
  createdByAvatarName = "fibery/name",
  createdByAvatarContentType = "fibery/content-type",
  createdByAvatarSecret = "fibery/secret",
  createdByAvatarId = "fibery/id",
  createdByAvatarRank = "fibery/rank",
  createdByAvatarIcon = "enum/icon",
  createdByAvatarColor = "enum/color",
  accessCheck = "?access/check",
  accessToIcon = "?accessToIcon",
  enumName = "enum/name",
  enumRank = "fibery/rank",
  enumId = "fibery/id",
  descriptionDocumentSecret = "Collaboration~Documents/secret",
}

export function getCommentDocumentIdsOfBugReport(bug: any) {
  return bug[FiberyField.Comments].map(
    (comment: any) => comment[FiberyField.commentDocumentSecret]
  );
}

export function printBugReportComments(bug: any) {
  for (const comment of bug.comments) {
    console.log(
      `[${comment.createdAt.toLocaleString()}]   ${comment.authorName}   >>> ${
        comment.content.text
      }`
    );
    for (const attachment of comment.content.attachments) {
      console.log(
        `       🧷 attachment: ${attachment.name}   url: ${attachment.url}`
      );
    }
  }
}
