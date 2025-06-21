# Dev Bugs CLI

A command-line interface for managing development bug data from Fibery.

## Installation & Usage

The CLI is available through the npm script or directly via the binary:

```bash
# Using npm script
npm run cli -- <command> [options]

# Using binary directly
./bin/dev-bugs <command> [options]

# Global help
dev-bugs --help
```

## Commands

### `info [bug-id]` - Show Bug Information

Display detailed information about bugs. If no bug ID is provided, opens an interactive TUI selector.

```bash
# Interactive bug selection
dev-bugs info

# Direct bug lookup
dev-bugs info ABCD-1234

# JSON output
dev-bugs info ABCD-1234 --json

# Verbose details
dev-bugs info ABCD-1234 --verbose
```

**Options:**

- `-j, --json` - Output in JSON format
- `-v, --verbose` - Show detailed information
- `-h, --help` - Display help for command

**Aliases:** `i`

### `run <bug-id>` - Run Investigation Analysis

Generate investigation prompts and analysis for a specific bug.

```bash
# Generate investigation prompt
dev-bugs run ABCD-1234

# Output as JSON
dev-bugs run ABCD-1234 --format json

# Generate summary
dev-bugs run ABCD-1234 --format summary

# Save to file
dev-bugs run ABCD-1234 --output investigation.txt
```

**Options:**

- `-f, --format <type>` - Output format: `prompt` (default), `json`, or `summary`
- `-o, --output <file>` - Save output to file instead of stdout
- `-h, --help` - Display help for command

**Aliases:** `r`

### `pull` - Pull Latest Bug Data

Fetch the latest bug data from remote sources (Fibery). **Note: This command is not yet implemented.**

```bash
# Pull all data
dev-bugs pull

# Dry run to see what would be pulled
dev-bugs pull --dry-run

# Force refresh
dev-bugs pull --force

# Pull from specific source
dev-bugs pull --source fibery
```

**Options:**

- `-s, --source <source>` - Data source: `fibery` or `all` (default: `all`)
- `-f, --force` - Force refresh even if data is recent
- `--dry-run` - Show what would be pulled without actually pulling
- `-h, --help` - Display help for command

**Aliases:** `p`

## Interactive TUI (Text User Interface)

When using `dev-bugs info` without a bug ID, you'll enter an interactive mode:

### Navigation

- **↑/↓** or **j/k** - Navigate through bugs
- **Enter** - Select a bug and exit
- **v** - View bug details in overlay
- **/** or **Ctrl+F** - Search by bug ID
- **Ctrl+U** - Clear search
- **ESC** or **q** - Quit

### Search

- Type any alphanumeric character to start searching
- Search is case-insensitive and matches bug IDs
- Clear search with **Ctrl+U**

## Examples

```bash
# Browse all bugs interactively
dev-bugs info

# Get bug details in JSON format for scripting
dev-bugs info ABCD-1234 --json | jq '.bugDescription'

# Generate investigation prompt and save to file
dev-bugs run ABCD-1234 --output investigation-ABCD-1234.txt

# Get a quick summary of a bug
dev-bugs run ABCD-1234 --format summary

# Check what data would be pulled (when implemented)
dev-bugs pull --dry-run
```

## Data Location

Bug data is loaded from: `data/bug_cards.json`

## Development

The CLI is built with:

- **TypeScript** for type safety
- **Commander.js** for command parsing and help generation
- **Blessed** for the interactive TUI
- **Node.js best practices** for CLI tools

### Architecture

```
src/cli/
├── index.ts              # Main CLI entry point
├── commands/             # Command implementations
│   ├── base.command.ts   # Base class with common utilities
│   ├── info.command.ts   # Info command
│   ├── run.command.ts    # Run command
│   └── pull.command.ts   # Pull command (placeholder)
├── tui-app.ts           # Interactive TUI implementation
├── data-loader.ts       # Bug data loading utilities
└── types.ts             # TypeScript type definitions
```

### Adding New Commands

1. Create a new command file in `src/cli/commands/`
2. Extend `BaseCommand` for common utilities
3. Implement the `register()` static method
4. Import and register in `src/cli/index.ts`

Example:

```typescript
import { Command } from "commander";
import { BaseCommand } from "./base.command";

export class NewCommand extends BaseCommand {
  static register(program: Command): void {
    program
      .command("new")
      .description("Description of new command")
      .action(async (options) => {
        await NewCommand.execute(options);
      });
  }

  private static async execute(options: any): Promise<void> {
    try {
      // Command implementation
    } catch (error) {
      NewCommand.handleError(error, "New");
    }
  }
}
```

## Error Handling

The CLI provides helpful error messages with suggestions:

- **Bug not found**: Shows available bug IDs and suggests using the TUI
- **Data loading errors**: Clear error messages with file paths
- **Command errors**: Consistent error formatting with emojis for readability

## Future Enhancements

- [ ] Implement `pull` command for fetching data from Fibery
- [ ] Add configuration file support
- [ ] Add logging capabilities
- [ ] Add tests for CLI commands
- [ ] Add bug filtering and search capabilities
- [ ] Add export capabilities (CSV, Excel, etc.)
- [ ] Add bug assignment and status update features
