import { FiberyBugReport, parseBugReport } from "./parsers/bug_report.parser";
import { FiberyField, getCommentDocumentIdsOfBugReport } from "./common";
import { FiberyClient } from "../../clients/fibery.client";

export class FiberyProvider {
  private fibery: FiberyClient;

  constructor(client?: FiberyClient) {
    this.fibery = client || new FiberyClient();
  }

  async getHomeBionicsBugs(): Promise<FiberyBugReport[]> {
    const bugs = await this.fibery.getAllHomeBionicsBugs();

    const commentDocumentsToBulkFetch = bugs.flatMap(
      getCommentDocumentIdsOfBugReport
    );
    const descriptionDocumentsToBulkFetch = bugs.map(
      (bug: any) =>
        bug[FiberyField.description][FiberyField.descriptionDocumentSecret]
    );
    // Tasks of bug reports, will handle on a later stage
    const tasksDocumentsToBulkFetch = bugs.flatMap((bug: any) =>
      bug[FiberyField.tasks].map(
        (task: any) => task[FiberyField.taskDocumentSecret]
      )
    );

    const comments = await this.fibery.getDocuments(
      commentDocumentsToBulkFetch
    );

    const descriptions = await this.fibery.getDocuments(
      descriptionDocumentsToBulkFetch
    );

    return this.parseBugReports(bugs, comments, descriptions);
  }

  private parseBugReports(
    bugs: any,
    allCommentsOfAllBugReports: any,
    allDescriptionsOfAllBugReports: any
  ): FiberyBugReport[] {
    return bugs.map((bug: any) => {
      const commentDocumentIdsOfBug = getCommentDocumentIdsOfBugReport(bug);
      const commentsOfBug = allCommentsOfAllBugReports.filter((comment: any) =>
        commentDocumentIdsOfBug.includes(comment[FiberyField.Secret])
      );
      const descriptionOfBug = allDescriptionsOfAllBugReports.find(
        (description: any) =>
          description[FiberyField.Secret] ===
          bug[FiberyField.description][FiberyField.descriptionDocumentSecret]
      );
      return parseBugReport(bug, commentsOfBug, descriptionOfBug);
    });
  }
}
