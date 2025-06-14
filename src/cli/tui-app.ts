import * as blessed from "blessed";
import { TableRow, BugCard } from "./types";
import { DataLoader } from "./data-loader";

export class TUIApp {
  private screen: blessed.Widgets.Screen;
  private table!: blessed.Widgets.ListTableElement;
  private statusBar!: blessed.Widgets.BoxElement;
  private searchInput!: blessed.Widgets.TextboxElement;
  private bugCards: BugCard[] = [];
  private filteredBugCards: BugCard[] = [];
  private tableRows: TableRow[] = [];
  private selectedIndex: number = 0;
  private scrollOffset: number = 0;
  private visibleRows: number = 0;
  private selectionResolver?: (publicId: string) => void;
  private searchQuery: string = "";
  private isSearchFocused: boolean = false;

  constructor() {
    this.screen = blessed.screen({
      smartCSR: true,
      title: "Bug Cards Viewer",
    });

    this.setupSearchInput();
    this.setupStatusBar();
    this.setupTable();
    this.setupKeyHandlers();
  }

  private setupSearchInput(): void {
    this.searchInput = blessed.textbox({
      top: 0,
      left: 0,
      right: 0,
      height: 3,
      border: {
        type: "line",
      },
      style: {
        fg: "white",
        bg: "black",
        border: {
          fg: "cyan",
        },
        focus: {
          border: {
            fg: "yellow",
          },
        },
      },
      label: " Search by Public ID ",
      tags: true,
      keys: true,
      mouse: true,
      inputOnFocus: true,
    });

    this.searchInput.on("submit", () => {
      this.isSearchFocused = false;
      this.table.focus();
      this.screen.render();
    });

    this.searchInput.on("cancel", () => {
      this.isSearchFocused = false;
      this.table.focus();
      this.screen.render();
    });

    this.searchInput.key(["C-c"], () => {
      process.exit(0);
    });

    // Additional event listener for input changes
    this.searchInput.on("action", () => {
      const currentValue = this.searchInput.getValue();
      this.handleSearch(currentValue);
    });

    this.screen.append(this.searchInput);
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
      top: 3,
      left: 0,
      right: 0,
      bottom: 3,
      border: {
        type: "line",
      },
      align: "left",
      tags: true,
      keys: false,
      vi: false,
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
          bold: true,
        },
        item: {
          fg: "white",
        },
        cell: {
          selected: {
            bg: "blue",
            fg: "white",
            bold: true,
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

    // Search functionality
    this.screen.key(["/"], () => {
      this.isSearchFocused = true;
      this.searchInput.focus();
      this.screen.render();
    });

    this.screen.key(["C-f"], () => {
      this.isSearchFocused = true;
      this.searchInput.focus();
      this.screen.render();
    });

    // Clear search
    this.screen.key(["C-u"], () => {
      this.clearSearch();
    });

    this.table.key(["v"], () => {
      this.handleSelection();
    });

    this.table.key(["enter"], () => {
      this.handleEnterSelection();
    });

    this.table.on("select", (item, index) => {
      if (index > 0) {
        this.selectedIndex = this.scrollOffset + index - 1;
        this.updateStatusBar();
      }
    });

    this.screen.key(["up", "k"], () => {
      if (!this.isSearchFocused && this.selectedIndex > 0) {
        this.selectedIndex--;
        this.adjustScrollForSelection();
        this.updateDisplay();
        this.syncTableSelection();
      }
    });

    this.screen.key(["down", "j"], () => {
      if (
        !this.isSearchFocused &&
        this.selectedIndex < this.tableRows.length - 1
      ) {
        this.selectedIndex++;
        this.adjustScrollForSelection();
        this.updateDisplay();
        this.syncTableSelection();
      }
    });

    // Handle typing for search when table is focused
    this.screen.on("keypress", (ch, key) => {
      if (!this.isSearchFocused && ch && /[a-zA-Z0-9-_]/.test(ch)) {
        this.isSearchFocused = true;
        this.searchInput.clearValue();
        this.searchInput.setValue(ch);
        this.searchInput.focus();
        this.handleSearch(ch);
        this.screen.render();
      }
    });

    // Listen to search input changes
    this.searchInput.on("keypress", (ch, key) => {
      setTimeout(() => {
        const currentValue = this.searchInput.getValue();
        this.handleSearch(currentValue);
      }, 10);
    });
  }

  private handleSearch(query: string): void {
    this.searchQuery = query.toLowerCase();
    this.filterBugCards();
    this.selectedIndex = 0;
    this.scrollOffset = 0;
    this.updateDisplay();
    this.syncTableSelection();
  }

  private filterBugCards(): void {
    if (this.searchQuery.trim() === "") {
      this.filteredBugCards = [...this.bugCards];
    } else {
      this.filteredBugCards = this.bugCards.filter((card) =>
        card.publicId.toLowerCase().includes(this.searchQuery)
      );
    }
    this.tableRows = DataLoader.convertToTableRows(this.filteredBugCards);
  }

  private clearSearch(): void {
    this.searchQuery = "";
    this.searchInput.clearValue();
    this.filterBugCards();
    this.selectedIndex = 0;
    this.scrollOffset = 0;
    this.updateDisplay();
    this.syncTableSelection();
    this.table.focus();
    this.isSearchFocused = false;
    this.screen.render();
  }

  private handleSelection(): void {
    if (this.tableRows.length === 0) return;

    const selectedBugCard = this.filteredBugCards[this.selectedIndex];
    if (selectedBugCard) {
      this.showDetailView(selectedBugCard);
    }
  }

  private handleEnterSelection(): void {
    if (this.tableRows.length === 0) return;

    const selectedBugCard = this.filteredBugCards[this.selectedIndex];
    if (selectedBugCard && this.selectionResolver) {
      this.screen.destroy();
      this.selectionResolver(selectedBugCard.publicId);
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

    detailBox.key(["escape", "q", "v"], () => {
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

    const searchInfo = this.searchQuery
      ? ` | Search: "${this.searchQuery}"`
      : "";
    const totalBugCards = this.bugCards.length;
    const filteredInfo =
      this.searchQuery && total !== totalBugCards
        ? ` (${total}/${totalBugCards} filtered)`
        : "";

    this.statusBar.setContent(
      `{center}Bug ${current}/${total}${filteredInfo}${scrollInfo}${searchInfo} | Use ↑↓ to navigate, Enter to select, V to view, / to search, Ctrl+U to clear, ESC/Q to quit{/center}`
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

  private syncTableSelection(): void {
    const displayIndex = this.selectedIndex - this.scrollOffset + 1;
    if (displayIndex >= 1) {
      const maxDisplayIndex = Math.min(
        this.visibleRows,
        this.tableRows.length - this.scrollOffset
      );
      if (displayIndex <= maxDisplayIndex) {
        this.table.select(displayIndex);
        this.screen.render();
      }
    }
  }

  public async initialize(): Promise<void> {
    try {
      this.bugCards = await DataLoader.loadBugCards();
      this.filteredBugCards = [...this.bugCards];
      this.tableRows = DataLoader.convertToTableRows(this.filteredBugCards);

      this.calculateVisibleRows();
      this.populateTable();
      this.updateStatusBar();
      this.syncTableSelection();
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

  public async selectBugCard(): Promise<string> {
    await this.initialize();

    return new Promise<string>((resolve) => {
      this.selectionResolver = resolve;
      this.run();
    });
  }
}
