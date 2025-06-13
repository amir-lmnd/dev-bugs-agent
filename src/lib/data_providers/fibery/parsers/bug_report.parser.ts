import { FiberyField } from "../common";
import { parseBugReportComment } from "./bug_report_comment.parser";
import { parseBugReportDescription } from "./description.parser";

export interface FiberyBugReport {
  title: string;
  description: string[];
  exampleUrl: string;
  threadUrl: string;
  createdAt: Date;
  publicId: string;
  subIssueType: string;
  priority: string;
  closingReason: string;
  bugArea: string;
  tags: string[];
  errorLog: string;
  countOfRelatedBugs: number;
  tasks: any[];
  comments: any[];
}

export function parseBugReport(
  bug: any,
  commentDocuments: any,
  descriptionDocument: any
): FiberyBugReport {
  const parsedDescription = parseBugReportDescription(descriptionDocument);
  return {
    publicId: bug[FiberyField.publicId],
    title: bug[FiberyField.name],
    description: parsedDescription.content,
    threadUrl: parsedDescription.threadUrl,
    exampleUrl: parsedDescription.exampleUrl,
    createdAt: new Date(bug[FiberyField.creationDate]),
    subIssueType: bug[FiberyField.subIssueType][FiberyField.enumName],
    priority: bug[FiberyField.priority][FiberyField.enumName],
    closingReason: bug[FiberyField.closingReason][FiberyField.enumName],
    bugArea: bug[FiberyField.bugArea][FiberyField.name],
    tags: bug[FiberyField.tags],
    errorLog: bug[FiberyField.errorLog],
    countOfRelatedBugs: bug[FiberyField.numberOfRelatedBugs],
    tasks: bug[FiberyField.tasks],
    comments: parseComments(bug, commentDocuments),
  };
}

function parseComments(bug: any, commentDocuments: any) {
  return bug[FiberyField.Comments].map((comment: any) =>
    parseBugReportComment(comment, commentDocuments)
  );
}
