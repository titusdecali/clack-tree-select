# 🌳 clack-tree-select Examples

This directory contains focused examples showing how to use clack-tree-select in real-world scenarios.

## Running Examples

1. **Install dependencies:**
   ```bash
   cd examples
   pnpm install
   ```

2. **Run the demos:**
   ```bash
   # Basic tree-select features
   pnpm tree-select
   
   # Integration with other Clack prompts
   pnpm integration

   # Searchable tree-select (type to filter; Esc to clear)
   pnpm run search
   ```

## Available Examples

### `tree-select.ts` - Core Features Demo
Showcases all tree-select functionality:
- Basic tree selection with hierarchical data
- Smart keyboard shortcuts (Shift+E, Shift+A)
- File system integration with `fileSystemTreeSelect`
- Single vs multiple selection modes
- Custom validation and help text

### `integration-demo.ts` - Real CLI Integration
Shows how to integrate tree-select with existing Clack CLIs:
- Mixed prompt types (`text`, `select`, `multiselect`, `treeSelect`)
- Proper `isCancel` handling throughout
- Real-world project setup workflow
- File system browsing alongside other prompts
- Zero breaking changes to existing code

## Features Demonstrated

- **Hierarchical Selection** - Select parents to select children
- **Smart Toggle Shortcuts** - Shift+E (expand/collapse all), Shift+A (select/deselect all)
- **Type-to-Search** - Start typing to filter items; Backspace to edit; Esc to clear
- **File System Browsing** - Browse local directories with filtering
- **Customizable Styling** - Custom icons and validation messages
- **TypeScript Integration** - Full type safety and IntelliSense

## Interactive Testing

Use the example to test:
- ↑↓ Navigation
- ←→ Expand/collapse directories
- Space to toggle selection
- Shift+E to toggle expand/collapse all
- Shift+A to toggle select/deselect all
- Enter to submit
- Ctrl+C to cancel (standard terminal shortcut)

Perfect for understanding the API and testing functionality! 🚀