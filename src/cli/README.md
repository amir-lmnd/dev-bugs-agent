# Dev Bugs Agent CLI

A CLI tool for investigating bug reports with an interactive terminal UI.

## Overview

This CLI allows you to:

- Select bug cards from an interactive terminal interface
- Launch investigations for specific bug IDs by passing them as arguments
- Access the tool globally from anywhere on your system

## Data Requirements

The CLI operates on bug report data processed through a specific pipeline:

1. **Data Export**: The `fibery_export_to_json.ts` script downloads all bug reports from Fibery and exports them to JSON format
2. **Data Processing**: The `prepare_bug_cards.ts` script processes the exported data and generates structured bug cards optimized for CLI presentation and prompting
3. **Data Consumption**: The CLI expects the processed data to be available at `data/bug_cards.json` and will load this file to populate the interactive interface

Ensure the data pipeline has been run and the `data/bug_cards.json` file is present before using the CLI.

## Global Installation

The CLI is set up to be globally accessible from any directory on your machine.

### How It Works

1. **Wrapper Script**: The project uses a wrapper script at `bin/dev-bugs` that:

   - Uses `ts-node` to run TypeScript files directly (no compilation needed)
   - Automatically resolves the correct project paths
   - Passes through all command-line arguments

2. **Package.json Configuration**: The `bin` field in `package.json` tells npm where to find the executable:

   ```json
   "bin": {
     "dev-bugs": "./bin/dev-bugs"
   }
   ```

3. **npm link**: Creates a global symlink so you can run `dev-bugs` from anywhere

### Installation Steps

From the project root directory:

```bash
# Make the wrapper script executable (already done)
chmod +x bin/dev-bugs

# Install globally using npm link
npm link
```

### Uninstallation

To remove the global CLI:

```bash
# From the project root
npm unlink
```

## Usage

### Interactive Mode

```bash
# Run without arguments to open the interactive selector
dev-bugs
```

### Direct Bug ID

```bash
# Pass a bug ID directly
dev-bugs BUG-123
```

### From Any Directory

```bash
# Works from anywhere on your system
cd /tmp
dev-bugs BUG-456
```

## Architecture

```
src/cli/
├── index.ts          # Main CLI entry point with shebang
├── tui-app.ts        # Terminal UI for bug selection
├── data-loader.ts    # Loads bug card data
├── types.ts          # TypeScript type definitions
└── README.md         # This file

bin/
└── dev-bugs          # Wrapper script for global access
```

## Development

### Live Updates

Since the global CLI uses `ts-node`, any changes you make to the TypeScript source files are immediately available when you run the global command - no rebuild required!

### Testing Locally

```bash
# Test the wrapper script directly
./bin/dev-bugs

# Test with ts-node
npm start

# Test a specific bug ID
npm start BUG-123
```

### Dependencies

- `ts-node`: Runs TypeScript files directly
- `blessed`: Terminal UI framework
- `dotenv`: Environment variable management

## Alternative Global Installation Methods

If `npm link` doesn't work for your setup, you can use these alternatives:

### Method 1: Add to PATH

```bash
# Add to ~/.zshrc or ~/.bash_profile
export PATH="$PATH:/path/to/dev-bugs-agent/bin"
```

### Method 2: Create symlink

```bash
ln -s /path/to/dev-bugs-agent/bin/dev-bugs /usr/local/bin/dev-bugs
```

### Method 3: Shell alias

```bash
# Add to ~/.zshrc
alias dev-bugs="cd /path/to/dev-bugs-agent && npm start"
```

## Troubleshooting

### Command not found

- Ensure `npm link` was run from the project root
- Check that `/usr/local/bin` or similar is in your PATH
- Try running `which dev-bugs` to see if it's installed

### TypeScript compilation errors

- The CLI bypasses compilation by using `ts-node`
- Large directories like `repos/` are excluded from TypeScript processing
- If you encounter memory issues, ensure the `exclude` field in `tsconfig.json` includes large directories

### Missing dependencies

- Run `npm install` in the project root
- Ensure `ts-node` is available: `npm install -g ts-node`

### Common Issues

**"Bug cards file not found"**

```bash
# Ensure data file exists
ls data/bug_cards.json

# Check file permissions
chmod 644 data/bug_cards.json
```

**"Invalid JSON format"**

```bash
# Validate JSON syntax
cat data/bug_cards.json | jq '.'
```

**Terminal display issues**

```bash
# Try different terminal
# Ensure terminal supports color and Unicode
# Resize terminal window if table appears cramped
```

**Happy bug hunting! 🐛✨**
