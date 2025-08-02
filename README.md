# 🌳 clack-tree-select

[![npm version](https://badge.fury.io/js/clack-tree-select.svg)](https://badge.fury.io/js/clack-tree-select)
[![npm downloads](https://img.shields.io/npm/dm/clack-tree-select.svg)](https://npmjs.com/package/clack-tree-select)
[![license](https://img.shields.io/npm/l/clack-tree-select.svg)](https://github.com/yourusername/clack-tree-select/blob/main/LICENSE)

<div align="center">
  <h3>💖 Sponsored by</h3>
  <h4>Stringer CLI</h4>
  <p><strong>"Make your React & Vue apps multilingual in minutes!"</strong></p>
  <img src="https://c81fz8ovlk.ufs.sh/f/pOylDC1T5WMxVeE77528My7Qi1znPO4WjdvHBrD6fcNtTquk" alt="Stringer CLI Logo" width="250">
  <br>
  <a href="https://stringer-cli.com">Learn more about Stringer CLI →</a>
</div>

---

Beautiful, interactive tree selection prompts for command-line applications. Built on top of [Clack](https://github.com/bombshell-dev/clack) for the best CLI experience.

## 🎬 Demo

![Tree Select Demo](demo.gif)

[**▶️ Watch Demo on Asciinema**](https://asciinema.org/a/UaV0pOtfI5BGgcc0m8xAqNfW6)

> See navigation, hierarchical selection, and smart keyboard shortcuts in action.

## ✨ Features

- 🌳 **Hierarchical Selection** - Select parent directories to select all children
- ⌨️ **Smart Keyboard Shortcuts** - Intuitive navigation with toggle expand/select all
- 🎨 **Customizable Styling** - Beautiful icons and colors that match your brand
- 🚀 **Performance Optimized** - Efficient rendering for large directory trees  
- 📱 **TypeScript Ready** - Full type safety with excellent IntelliSense
- 🔧 **File System Integration** - Built-in support for browsing local directories
- ✅ **Validation Support** - Custom validation with helpful error messages

## 📦 Installation

```bash
npm install clack-tree-select
```

```bash
yarn add clack-tree-select
```

```bash
pnpm add clack-tree-select
```

## 🚀 Quick Start

Add tree selection to your existing Clack CLI:

```typescript
import { treeSelect } from 'clack-tree-select';
import { intro, outro, text, isCancel } from '@clack/prompts';

async function main() {
  intro('🚀 Project Setup');

  // Your existing Clack prompts
  const projectName = await text({
    message: 'Project name?',
    placeholder: 'my-project'
  });

  if (isCancel(projectName)) return;

  // Add tree selection seamlessly
  const files = await treeSelect({
    message: 'Select files to process:',
    tree: [
      {
        value: 'src',
        name: 'src',
        children: [
          { value: 'src/components', name: 'components' },
          { value: 'src/pages', name: 'pages' },
          { value: 'src/utils', name: 'utils' }
        ]
      },
      { value: 'package.json', name: 'package.json' }
    ]
  });

  if (isCancel(files)) return;

  outro(`✅ ${projectName}: Selected ${files.length} files`);
}

main();
```

**Perfect integration** - works alongside all your existing Clack prompts! 🎯

## 📚 API Reference

### `treeSelect(options)`

Creates an interactive tree selection prompt.

#### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `message` | `string` | **required** | The prompt message to display |
| `tree` | `TreeItem[]` | **required** | The tree structure to display |
| `multiple` | `boolean` | `true` | Allow multiple selections |
| `initialValues` | `T[]` | `[]` | Pre-selected values |
| `required` | `boolean` | `false` | Require at least one selection |
| `maxItems` | `number` | `undefined` | Maximum visible items (scrolling) |
| `icons` | `IconOptions` | default icons | Custom icons for tree items |
| `showHelp` | `boolean` | `true` | Show keyboard shortcuts in validation |

#### TreeItem Interface

```typescript
interface TreeItem<T = any> {
  value: T;              // Unique identifier
  name?: string;         // Display name (falls back to value)
  open?: boolean;        // Initially expanded
  children?: TreeItem<T>[] | string[] | T[];  // Child items
}
```

#### Icon Options

```typescript
interface IconOptions {
  directory?: string;    // Default: '📁'
  file?: string;         // Default: '📄'  
  expanded?: string;     // Default: '▼'
  collapsed?: string;    // Default: '▶'
}
```

### `fileSystemTreeSelect(options)`

Creates a tree selection prompt from a file system directory.

```typescript
const files = await fileSystemTreeSelect({
  message: 'Select files from your project:',
  root: './src',
  includeFiles: true,
  includeHidden: false,
  maxDepth: 3,
  filter: (path) => !path.includes('node_modules')
});
```

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `↑` / `↓` | Navigate up/down |
| `←` / `→` | Collapse/expand directory |
| `Space` | Toggle selection |
| `Ctrl+E` | Toggle expand/collapse all |
| `Ctrl+A` | Toggle select/deselect all |
| `Enter` | Submit selection |
| `Ctrl+C` | Cancel prompt |

## 🎯 Advanced Examples

### Custom Icons and Styling

```typescript
const result = await treeSelect({
  message: 'Choose components to generate:',
  tree: components,
  icons: {
    directory: '📂',
    file: '⚛️',
    expanded: '📂', 
    collapsed: '📁'
  },
  multiple: true,
  required: true
});
```

### Single Selection Mode

```typescript
const configFile = await treeSelect({
  message: 'Choose a configuration file:',
  tree: [
    {
      value: 'config',
      name: 'config',
      open: true,
      children: [
        { value: 'tsconfig.json', name: 'TypeScript Config' },
        { value: 'package.json', name: 'Package Config' },
        { value: 'vite.config.js', name: 'Vite Config' }
      ]
    }
  ],
  multiple: false,
  required: true
});
```

> **Note**: In single selection mode, only leaf nodes (files without children) can be selected. Parent directories are shown but not selectable, ensuring users select actual items rather than containers.

### File System Integration

```typescript
import { fileSystemTreeSelect } from 'clack-tree-select';

const selectedFiles = await fileSystemTreeSelect({
  message: 'Select files to process:',
  root: process.cwd(),
  includeFiles: true,
  includeHidden: false,
  maxDepth: 3,
  filter: (path) => {
    // Exclude common non-source directories
    return !path.includes('node_modules') && 
           !path.includes('.git') && 
           !path.includes('dist');
  }
});
```

### Custom Validation

```typescript
const result = await treeSelect({
  message: 'Select at least 2 components:',
  tree: componentTree,
  validate: (selected) => {
    if (!selected || selected.length < 2) {
      return 'Please select at least 2 components to continue.';
    }
  }
});
```

## 🔧 Integration Examples

### With Package Managers

```typescript
// Ask user to select packages to install
const packages = await treeSelect({
  message: 'Select packages to install:',
  tree: [
    {
      value: 'react',
      name: 'React',
      children: [
        { value: 'react-dom', name: 'React DOM' },
        { value: 'react-router', name: 'React Router' }
      ]
    },
    {
      value: 'build-tools',
      name: 'Build Tools',
      children: [
        { value: 'vite', name: 'Vite' },
        { value: 'typescript', name: 'TypeScript' }
      ]
    }
  ]
});
```

### With Monorepos

```typescript
// Select packages in a monorepo
const workspaces = await fileSystemTreeSelect({
  message: 'Select workspaces to build:',
  root: './packages',
  includeFiles: false,  // Only directories
  maxDepth: 1,
  filter: (path) => {
    // Only include directories with package.json
    return fs.existsSync(`${path}/package.json`);
  }
});
```

## 🎨 Theming

The tree select automatically adapts to your terminal's color scheme and follows Clack's beautiful styling conventions:

- **Selected items**: Green checkboxes (◼)
- **Unselected items**: Gray checkboxes (◻)  
- **Active item**: Cyan highlighting
- **Directories**: Folder icons with expand/collapse indicators
- **Files**: Document icons

## 🔗 Integration with Existing Clack CLIs

This package is designed as a **drop-in addition** to your existing Clack CLI. No changes needed to your current setup!

```typescript
// Your existing CLI
import { intro, text, select, multiselect, outro } from '@clack/prompts';
// Just add this import ↓
import { treeSelect } from 'clack-tree-select';

async function myCLI() {
  intro('My Existing CLI');
  
  const name = await text({ message: 'Project name?' });
  const framework = await select({ /* ... */ });
  
  // New: Add tree selection anywhere in your flow
  const files = await treeSelect({
    message: 'Select files to process:',
    tree: myFileTree
  });
  
  const tools = await multiselect({ /* ... */ });
  outro('Done!');
}
```

**Zero breaking changes** - just add `treeSelect` where you need hierarchical selection! 

## 🧪 Examples

Check out the [`examples/`](examples/) directory for interactive demos:

```bash
cd examples
pnpm install

# Basic tree-select functionality
pnpm tree-select

# Complete integration with other Clack prompts
pnpm integration
```

The integration demo shows a real CLI workflow mixing `treeSelect` with `text`, `select`, `multiselect`, and `confirm` prompts.

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  <p>Made with ❤️ for the CLI community</p>
  <p>
    <a href="https://github.com/titusdecali/clack-tree-select">GitHub</a> •
    <a href="https://npmjs.com/package/clack-tree-select">NPM</a> •
    <a href="https://github.com/titusdecali/clack-tree-select/issues">Issues</a>
  </p>
</div>