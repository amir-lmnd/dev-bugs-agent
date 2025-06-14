export interface BugCardComment {
  content: string;
  createdAt: string;
}

export interface BugCard {
  publicId: string;
  title: string;
  description: string;
  comments: BugCardComment[];
}

export interface TableRow {
  id: string;
  title: string;
  description: string;
}
