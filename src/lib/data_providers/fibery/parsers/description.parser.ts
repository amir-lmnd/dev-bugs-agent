interface BugReportDescription {
  content: string[];
  exampleUrl: string;
  threadUrl: string;
}

export function parseBugReportDescription(description: any) {
  const parsedDescription: BugReportDescription = {
    content: [],
    exampleUrl: "",
    threadUrl: "",
  };

  for (const node of description.content.doc.content[0].content) {
    // New line, skip
    if (node.type === "hard_break") {
      continue;
    }
    // Example blender link
    else if (node.type === "text" && node.text === "Example") {
      parsedDescription.exampleUrl = node.marks[0].attrs.href;
    }
    // Slack thread link
    else if (node.type === "text" && node.text === "Thread") {
      parsedDescription.threadUrl = node.marks[0].attrs.href;
    }
    // User text
    else if (node.type === "text") {
      parsedDescription.content.push(node.text);
    }
  }

  return parsedDescription;
}
