import * as blessed from "blessed";
import { TableRow, BugCard } from "./types";
import { DataLoader } from "./data-loader";

export class TUIApp {
  private screen: blessed.Widgets.Screen;
  private table!: blessed.Widgets.ListTableElement;
  private statusBar!: blessed.Widgets.BoxElement;
  private bugCards: BugCard[] = [];
  private tableRows: TableRow[] = [];
  private selectedIndex: number = 0;
  private scrollOffset: number = 0;
  private visibleRows: number = 0;

  constructor() {
    this.screen = blessed.screen({
      smartCSR: true,
      title: "Bug Cards Viewer",
    });

    this.setupStatusBar();
    this.setupTable();
    this.setupKeyHandlers();
  }

  private setupStatusBar(): void {
    this.statusBar = blessed.box({
      bottom: 0,
      left: 0,
      right: 0,
      height: 3,
      content: "Loading bug cards...",
      tags: true,
      border: {
        type: "line",
      },
      style: {
        fg: "white",
        bg: "blue",
        border: {
          fg: "white",
        },
      },
    });

    this.screen.append(this.statusBar);
  }

  private setupTable(): void {
    this.table = blessed.listtable({
      top: 0,
      left: 0,
      right: 0,
      bottom: 3,
      border: {
        type: "line",
      },
      align: "left",
      tags: true,
      keys: true,
      vi: true,
      mouse: true,
      interactive: true,
      scrollable: true,
      alwaysScroll: true,
      style: {
        border: {
          fg: "cyan",
        },
        header: {
          fg: "white",
          bold: true,
        },
        selected: {
          bg: "blue",
          fg: "white",
        },
        item: {
          fg: "white",
        },
        cell: {
          selected: {
            bg: "blue",
            fg: "white",
          },
        },
      },
    });

    this.screen.append(this.table);
    this.calculateVisibleRows();
  }

  private setupKeyHandlers(): void {
    this.screen.key(["escape", "q", "C-c"], () => {
      process.exit(0);
    });

    this.table.key(["v"], () => {
      this.handleSelection();
    });

    this.table.key(["enter"], () => {
      // Reserved for future functionality
    });

    this.table.key(["up", "k"], () => {
      if (this.selectedIndex > 0) {
        this.selectedIndex--;
        this.adjustScrollForSelection();
        this.updateDisplay();
      }
    });

    this.table.key(["down", "j"], () => {
      if (this.selectedIndex < this.tableRows.length - 1) {
        this.selectedIndex++;
        this.adjustScrollForSelection();
        this.updateDisplay();
      }
    });

    this.table.on("select", (item, index) => {
      if (index > 0) {
        this.selectedIndex = this.scrollOffset + index - 1;
        this.updateStatusBar();
      }
    });
  }

  private handleSelection(): void {
    if (this.tableRows.length === 0) return;

    const selectedBugCard = this.bugCards[this.selectedIndex];
    if (selectedBugCard) {
      this.showDetailView(selectedBugCard);
    }
  }

  private showDetailView(bugCard: BugCard): void {
    const detailBox = blessed.box({
      top: "center",
      left: "center",
      width: "80%",
      height: "80%",
      border: {
        type: "line",
      },
      style: {
        border: {
          fg: "green",
        },
      },
      tags: true,
      scrollable: true,
      alwaysScroll: true,
      keys: true,
      vi: true,
      mouse: true,
    });

    const content = [
      `{bold}ID:{/bold} ${bugCard.publicId}`,
      "",
      `{bold}Title:{/bold}`,
      bugCard.title,
      "",
      `{bold}Description:{/bold}`,
      bugCard.description,
      "",
      `{bold}Comments (${bugCard.comments.length}):{/bold}`,
      ...bugCard.comments.map(
        (comment, index) =>
          `\n{bold}Comment ${index + 1}:{/bold}\n${
            comment.content
          }\n{dim}Created: ${new Date(
            comment.createdAt
          ).toLocaleString()}{/dim}`
      ),
    ].join("\n");

    detailBox.setContent(content);

    detailBox.key(["escape", "q"], () => {
      this.screen.remove(detailBox);
      this.screen.render();
      this.table.focus();
    });

    this.screen.append(detailBox);
    detailBox.focus();
    this.screen.render();
  }

  private updateStatusBar(): void {
    const total = this.tableRows.length;
    const current = this.selectedIndex + 1;
    const scrollInfo =
      this.visibleRows < total
        ? ` (${this.scrollOffset + 1}-${Math.min(
            this.scrollOffset + this.visibleRows,
            total
          )} shown)`
        : "";
    this.statusBar.setContent(
      `{center}Bug ${current}/${total}${scrollInfo} | Use ↑↓ to navigate, V to view details, ESC/Q to quit{/center}`
    );
    this.screen.render();
  }

  private updateDisplay(): void {
    this.populateTable();
    this.updateStatusBar();
  }

  private calculateVisibleRows(): void {
    const tableHeight = this.table.height as number;
    this.visibleRows = Math.max(1, tableHeight - 4);
  }

  private adjustScrollForSelection(): void {
    if (this.selectedIndex < this.scrollOffset) {
      this.scrollOffset = this.selectedIndex;
    } else if (this.selectedIndex >= this.scrollOffset + this.visibleRows) {
      this.scrollOffset = this.selectedIndex - this.visibleRows + 1;
    }
  }

  public async initialize(): Promise<void> {
    try {
      this.bugCards = await DataLoader.loadBugCards();
      this.tableRows = DataLoader.convertToTableRows(this.bugCards);

      this.calculateVisibleRows();
      this.populateTable();
      this.updateStatusBar();
      this.table.focus();
      this.screen.render();
    } catch (error) {
      this.showError(
        error instanceof Error ? error.message : "Unknown error occurred"
      );
    }
  }

  private populateTable(): void {
    const headers = ["ID", "Title", "Description"];
    const visibleRowsData = this.tableRows
      .slice(this.scrollOffset, this.scrollOffset + this.visibleRows)
      .map((row, displayIndex) => {
        const actualIndex = this.scrollOffset + displayIndex;
        const isSelected = actualIndex === this.selectedIndex;
        const prefix = isSelected ? "→ " : "  ";
        return [prefix + row.id, row.title, row.description];
      });

    const rows = [headers, ...visibleRowsData];
    this.table.setData(rows);
  }

  private showError(message: string): void {
    this.statusBar.setContent(`{red-fg}Error: ${message}{/red-fg}`);
    this.screen.render();
  }

  public run(): void {
    this.screen.render();
  }
}
