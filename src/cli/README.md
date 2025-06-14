# Bug Agent CLI Tool 🐛

A CLI interface for browsing and selecting bugs for the agent to investigate. Choose between quick direct access or an interactive terminal interface.

## 🚀 Quick Start

```bash
# Interactive mode - browse and select
npm start

# Direct mode - specify bug ID
npm start 12345
```

### Dependencies

- **blessed**: Terminal UI framework
- **TypeScript**: Type-safe JavaScript
- **ts-node**: TypeScript execution

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
