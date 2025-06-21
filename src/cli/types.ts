export { BugCard } from "../lib/services/bug_data.service";

export interface BugCardComment {
  content: string;
  createdAt: string;
}

export interface TableRow {
  id: string;
  title: string;
  description: string;
}
