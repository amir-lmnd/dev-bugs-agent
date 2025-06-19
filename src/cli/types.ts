export interface BugCardComment {
  content: string;
  createdAt: string;
}

export interface BugCard {
  bugPublicId: string;
  bugCreatedAt: string;
  claimPublicId: string | null;
  bugTitle: string;
  bugDescription: string;
  // comments: BugCardComment[];
}

export interface TableRow {
  id: string;
  title: string;
  description: string;
}
